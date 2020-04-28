import React, { Component } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { withRouter, matchPath } from 'react-router-dom';
import _throttle from 'lodash.throttle';
import { mapConfig } from '../../config';
import { wrapApiResult, getFromState } from '../../redux/utils';
import { geojsonCentroid } from '../../utils/geo';
import { getMarker } from '../../utils/utils';

import * as actions from '../../redux/actions/places';
import * as exploreActions from '../../redux/actions/explore';

// Mapbox access token
mapboxgl.accessToken = mapConfig.mapboxAccessToken;

const Wrapper = styled.div`
  height: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const markerQuestion = new Image(45, 60);
markerQuestion.src = './assets/graphics/map/marker-question.png';

const markerTick = new Image(45, 60);
markerTick.src = './assets/graphics/map/marker-tick.png';

const markerX = new Image(45, 60);
markerX.src = './assets/graphics/map/marker-xmark.png';

class Map extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mapLoaded: false,
      isSourceLoaded: false
    };
  }

  componentDidMount () {
    const { mapLoaded } = this.state;
    // Bypass if map is already loaded
    if (mapLoaded) {
      return;
    }

    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 0);
  }

  componentDidUpdate (prevProps, prevState) {
    const { places, geojson } = this.props;

    // Do not perform changes if map is not loaded
    if (!this.state.mapLoaded) return;

    // Add geojson to the map when map is loaded
    if (prevState.isSourceLoaded !== this.state.isSourceLoaded) {
      this.map.getSource('placesSource').setData(geojson);
    }

    // If new places were received, update map
    if (places.isReady() && prevProps.places.receivedAt !== places.receivedAt) {
      this.map.getSource('placesSource').setData(geojson);
    }
  }

  componentWillUnmount () {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap () {
    const { zoom, lng, lat } = this.props.mapViewport;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: mapConfig.style,
      zoom: zoom || mapConfig.zoom,
      center: {
        lng: lng || mapConfig.center.lng,
        lat: lat || mapConfig.center.lat
      },
      attributionControl: false,
      fitBoundsOptions: mapConfig.fitBoundsOptions
    });

    const self = this;

    // Add attribution.
    this.map.addControl(
      new mapboxgl.AttributionControl({
        compact: false
      })
    );

    // Disable map rotation using touch rotation gesture.
    this.map.touchZoomRotate.disableRotation();

    // Add zoom controls.
    this.map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: false
      }),
      'bottom-right'
    );

    // Add Geolocation control
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showAccuracyCircle: true
      })
    );

    function updateStateMapViewport () {
      const center = self.map.getCenter();
      const zoom = self.map.getZoom();

      // Do not update state's map viewport if zoom is too high
      if (zoom < 15) return;

      self.props.updateMapViewport({
        bounds: self.map.getBounds().toArray(),
        zoom,
        lng: center.lng,
        lat: center.lat
      });
    }

    const onMoveEnd = _throttle(updateStateMapViewport, 100, {
      leading: true
    });

    this.map.on('moveend', onMoveEnd);

    // ensure the source is added
    this.map.on('sourcedata', (e) => {
      if (e.sourceId === 'placesSource' && !this.state.isSourceLoaded) {
        this.setState({
          isSourceLoaded: true
        });
      }
    });

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });

      updateStateMapViewport();

      // add the geojson from state as a source to the map
      this.map.addSource('placesSource', {
        type: 'geojson',
        data: null
      });

      this.map.addImage('markerQuestion', markerQuestion);
      this.map.addImage('markerTick', markerTick);
      this.map.addImage('markerX', markerX);

      this.map.addLayer({
        id: 'placesLayer',
        type: 'symbol',
        source: 'placesSource',
        layout: {
          'icon-image': '{icon}',
          'icon-allow-overlap': true,
          'icon-size': 0.4
        },
        filter: ['!=', 'id', '']
      });

      this.map.addLayer({
        id: 'selectedPlacesLayer',
        type: 'symbol',
        source: 'placesSource',
        layout: {
          'icon-image': '{icon}',
          'icon-size': 0.4
        },
        paint: {
          'icon-opacity': 0.5
        },
        filter: ['==', 'id', '']
      });

      // bind an event to select the symbol
      this.map.on('click', (e) => {
        // add a small buffer so clicks are registered properly
        const width = 10;
        const height = 10;

        const feature = this.map.queryRenderedFeatures(
          [
            [e.point.x - width / 2, e.point.y - height / 2],
            [e.point.x + width / 2, e.point.y + height / 2]
          ],
          { layers: ['placesLayer'] }
        )[0];

        if (feature && !this.state.selectedFeature) {
          this.props.history.push(`/explore/${feature.properties.id}`);
        }
      });
    });
  }

  render () {
    const { hasError } = this.props.places;

    if (hasError()) {
      // handle errors
      return <></>;
    }

    return (
      <Wrapper>
        {mapboxgl.supported() ? (
          <MapContainer
            ref={(r) => {
              this.mapContainer = r;
            }}
          />
        ) : (
          <div className='mapbox-no-webgl'>
            <p>WebGL is not supported or disabled.</p>
          </div>
        )}
      </Wrapper>
    );
  }
}

Map.propTypes = {
  places: T.object,
  mapViewport: T.object,
  history: T.object,
  geojson: T.object
};

function mapStateToProps (state, props) {
  const places = wrapApiResult(getFromState(state, `places.list`));
  const match = matchPath(props.location.pathname, {
    path: '/explore/:type/:id',
    exact: true
  });

  let placeId = null;
  let place = null;
  if (match) {
    const { type, id } = match.params;
    placeId = `${type}/${id}`;
    place = wrapApiResult(getFromState(state, `places.individual.${placeId}`));
  }

  let geojson = {
    type: 'FeatureCollection',
    features: []
  };
  if (places.isReady()) {
    geojson = {
      type: 'FeatureCollection',
      features: places.getData()
    };

    geojson.features.forEach((feature) => {
      feature.properties.icon = getMarker(feature);
    });
  }

  let filters = [
    ['!=', 'id', ''],
    ['==', 'id', '']
  ];
  let selectedFeature;
  let featureCenter;
  if (match && place.isReady()) {
    filters[0] = ['==', 'id', placeId];
    filters[1] = ['!=', 'id', placeId];
    const feature = place.getData();
    selectedFeature = feature;
    featureCenter = geojsonCentroid(feature).geometry.coordinates;
  }

  return {
    featureCenter,
    filters,
    geojson,
    mapViewport: getFromState(state, `explore.mapViewport`),
    match: match,
    place: place,
    placeId: placeId,
    places: wrapApiResult(getFromState(state, `places.list`)),
    selectedFeature
  };
}

function dispatcher (dispatch) {
  return {
    fetchTiles: (...args) => dispatch(actions.fetchTiles(...args)),
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args)),
    fetchPlace: (...args) => dispatch(actions.fetchPlace(...args)),
    updatePlacesList: (...args) => dispatch(actions.updatePlacesList(...args)),
    updateMapViewport: (...args) =>
      dispatch(exploreActions.updateMapViewport(...args))
  };
}

export default withRouter(connect(mapStateToProps, dispatcher)(Map));
