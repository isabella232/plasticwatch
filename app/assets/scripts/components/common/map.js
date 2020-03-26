import React, { Component } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/places';
import { PropTypes as T } from 'prop-types';
import { Redirect, withRouter, matchPath } from 'react-router-dom';

import { mapConfig } from '../../config';

// Mapbox access token
mapboxgl.accessToken = mapConfig.mapboxAccessToken;

const MapContainer = styled.div`
  height: 100%;
`;

class Map extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mapLoaded: false,
      isSourceLoaded: false,
      geojson: {
        'type': 'FeatureCollection',
        'features': []
      }
    };
  }

  static getDerivedStateFromProps (props) {
    const { place, places, match } = props;
    const geojson = {
      'type': 'FeatureCollection',
      'features': []
    };

    if (match) {
      const placeData = place.getData();
      geojson.features.push(placeData);
    } else {
      geojson.features = places.getData();
    }

    return {
      geojson
    };
  }

  componentDidMount () {
    const { mapLoaded } = this.state;

    // Bypass if map is already loaded
    if (mapLoaded) return;

    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 1);
  }

  componentDidUpdate () {
    if (this.state.isSourceLoaded) {
      this.updateData();
    }
  }

  componentWillUnmount () {
    if (this.map) {
      this.map.remove();
    }
  }

  updateData () {
    this.map.getSource('placesSource').setData(this.state.geojson);
  }

  initMap () {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: mapConfig.style,
      bounds: mapConfig.bounds,
      attributionControl: false,
      fitBoundsOptions: mapConfig.fitBoundsOptions
    });

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

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      if (zoom > 12) {
        // fetch data?
      }
    });

    // ensure the source is added
    this.map.on('sourcedata', (e) => {
      if (e.sourceId === 'placesSource') {
        this.setState({
          isSourceLoaded: true
        });
      }
    });

    this.map.on('load', () => {
      this.setState({ mapLoaded: true });

      // add the geojson from state as a source to the map
      this.map.addSource('placesSource', {
        'type': 'geojson',
        'data': null
      });

      this.map.addLayer({
        'id': 'placesLayer',
        'type': 'symbol',
        'source': 'placesSource',
        'layout': {
          'icon-image': 'restaurant-15'
        }
      });

      // bind an event to select the symbol
      this.map.on('click', 'placesLayer', (e) => {
        // add a small buffer so clicks are registered properly
        const width = 10;
        const height = 10;

        const feature = this.map.queryRenderedFeatures([
          [e.point.x - width / 2, e.point.y - height / 2],
          [e.point.x + width / 2, e.point.y + height / 2]
        ], { layers: ['placesLayer'] })[0];

        if (feature) {
          this.props.history.push(`/explore/${feature.properties.id}`);
        }
      });
    });
  }

  renderMap () {
    const { isReady, hasError } = this.props.places;

    if (!isReady()) {
      // add a loading indicator on the map
    }

    if (hasError()) {
      // handle errors
      return (<></>);
    }

    return (
      <>
        <MapContainer>
          {mapboxgl.supported() ? (
            <div
              ref={r => {
                this.mapContainer = r;
              }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className='mapbox-no-webgl'>
              <p>WebGL is not supported or disabled.</p>
            </div>
          )}
        </MapContainer>
      </>
    );
  }

  render () {
    return <div>{this.renderMap()}</div>;
  }
}

Map.propTypes = {
  places: T.object,
  place: T.object,
  match: T.object,
  history: T.object
};

function mapStateToProps (state, props) {
  const match = matchPath(props.location.pathname, {
    path: '/explore/:type/:id',
    exact: true
  });

  let place = null;
  if (match) {
    const { type, id } = match.params;
    const placeId = `${type}/${id}`;
    place = wrapApiResult(getFromState(state, `places.individual.${placeId}`));
  }
  return {
    places: wrapApiResult(getFromState(state, `places.list`)),
    match: match,
    place: place
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args)),
    fetchPlace: (...args) => dispatch(actions.fetchPlace(...args))
  };
}

export default withRouter(connect(mapStateToProps, dispatcher)(Map));
