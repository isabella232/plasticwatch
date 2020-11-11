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
import centroid from '@turf/centroid';

import { Wrapper, MapContainer } from '../common/view-wrappers';

import * as exploreActions from '../../redux/actions/explore';
import isEqual from 'lodash.isequal';

import Button from '../../styles/button/button';
import Spinner from '../../styles/spinner/index';
import { showConfirmationPrompt } from '../common/confirmation-prompt';

const minZoomToLoadPlaces = 12;

// Mapbox access token
mapboxgl.accessToken = mapConfig.mapboxAccessToken;

const ZoomButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  &.active,
  &:active {
    transform: translate(-50%, -50%);
  }
`;

const MissingPlaceButton = styled(Button)`
  margin-top: 1rem;
  position: absolute;
  bottom: 5%;
  left: 3%;
  transform-origin: 50% 50%;
  z-index: 1000;
`;

const markerQuestion = new Image(45, 60);
markerQuestion.src = './assets/graphics/map/marker-question.png';

const markerTick = new Image(45, 60);
markerTick.src = './assets/graphics/map/marker-tick.png';

const markerX = new Image(45, 60);
markerX.src = './assets/graphics/map/marker-xmark.png';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
      isSourceLoaded: false
    };
  }

  componentDidMount() {
    const { mapLoaded } = this.state;
    // Bypass if map is already loaded
    if (mapLoaded) {
      return;
    }

    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 0);
  }

  componentDidUpdate(prevProps, prevState) {
    const { places, geojson, campaignSlug } = this.props;

    // Do not perform changes if map is not loaded
    if (!this.state.mapLoaded) return;

    if (prevProps.campaignSlug !== campaignSlug) {
      this.props.updateMapViewport({});
      this.map.setCenter(this.getCampaignCentroid());
    }

    // Add geojson to the map when map is loaded
    if (prevState.isSourceLoaded !== this.state.isSourceLoaded) {
      this.map.getSource('placesSource').setData(geojson);
    }

    // If new places were received, update map
    if (places.isReady() && prevProps.places.receivedAt !== places.receivedAt) {
      this.map.getSource('placesSource').setData(geojson);
    }

    if (!isEqual(prevProps.featureCenter, this.props.featureCenter)) {
      this.map.setCenter(this.props.featureCenter);
      this.updateFilter();
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.props.updateMapViewport({});
      this.map.remove();
    }
  }

  updateFilter() {
    this.map.setFilter('selectedPlacesLayer', this.props.filters[1]);
    this.map.setFilter('placesLayer', this.props.filters[0]);
  }

  getCampaignCentroid() {
    const { campaign } = this.props;
    const {
      geometry: { coordinates }
    } = centroid(JSON.parse(campaign.aoi));
    return {
      lng: coordinates[0],
      lat: coordinates[1]
    };
  }

  initMap() {
    const { campaign } = this.props;
    const { zoom, lng, lat } = this.props.mapViewport;

    const mapOptions = {
      container: this.mapContainer,
      style: mapConfig.style,
      zoom: zoom || mapConfig.zoom,
      attributionControl: false,
      fitBoundsOptions: mapConfig.fitBoundsOptions
    };

    if (typeof lng !== 'undefined' && typeof lat !== 'undefined') {
      mapOptions.center = {
        lng,
        lat
      };
    } else if (campaign && campaign.aoi) {
      mapOptions.center = this.getCampaignCentroid();
    }

    this.map = new mapboxgl.Map(mapOptions);

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

    function updateStateMapViewport() {
      const center = self.map.getCenter();
      const zoom = self.map.getZoom();

      // Do not update state's map viewport if zoom is too high
      if (zoom < minZoomToLoadPlaces) return;

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
    this.map.on('zoomend', () => {
      this.setState({
        mapZoom: self.map.getZoom()
      });
    });

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

      this.setState({
        mapZoom: self.map.getZoom()
      });

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
          this.props.history.push(
            `/explore/${this.props.campaignSlug}/${feature.properties.id}`
          );
        }
      });
    });
  }

  render() {
    const { hasError } = this.props.places;

    if (hasError()) {
      // handle errors
      return <></>;
    }

    function ShowSpinner(props) {
      if (props.fetching) {
        return <Spinner />;
      } else {
        return <></>;
      }
    }

    const { mapZoom } = this.state;

    return (
      <Wrapper>
        <ShowSpinner fetching={this.props.places.fetching} />
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
        {mapZoom && mapZoom < minZoomToLoadPlaces && (
          <ZoomButton
            variation='primary-raised-light'
            size='large'
            onClick={() => {
              this.map.zoomTo(minZoomToLoadPlaces);
              this.setState({ mapZoom: minZoomToLoadPlaces });
            }}
          >
            Zoom in to load places
          </ZoomButton>
        )}
        <MissingPlaceButton
          variation='base-raised-light'
          size='small'
          tabIndex={-1}
          useIcon='crosshair'
          onClick={async () => {
            const res = await showConfirmationPrompt({
              title: 'Add a missing place to the map',
              content:
                'PlasticWatch relies on OpenStreetMap data for restaurant, cafe and bar locations. Don’t see the establishment you’re looking for? Click "Confirm" to add a location to OpenStreetMap. Adding a place to OpenStreetMap requires creating an account and following OSM policies. Continue to view OpenStreetMap at your currently selected location, and follow the OSM walkthrough to learn how to edit the global map. Please note, as changes to OSM must be verified by the external OSM community, new places added to OSM will not immediately be captured by PlasticWatch'
            });
            if (res.result) {
              const center = this.map.getCenter();
              const lat = center.lat;
              const lon = center.lng;
              const zoom = this.map.getZoom();
              window.open(
                `https://openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lon}&zoom=${zoom}`
              );
            }
          }}
        >
          {this.props.isMobile ? 'Add a missing place' : 'Add a missing place to OpenStreetMap' }
        </MissingPlaceButton>
      </Wrapper>
    );
  }
}

Map.propTypes = {
  campaignSlug: T.string,
  campaign: T.object,
  filters: T.array,
  featureCenter: T.array,
  geojson: T.object,
  history: T.object,
  mapViewport: T.object,
  places: T.object,
  updateMapViewport: T.func,
  isMobile: T.bool
};

function mapStateToProps(state, props) {
  const places = wrapApiResult(getFromState(state, `places.list`));
  const {
    params: { campaignSlug, type, id }
  } = matchPath(props.location.pathname, {
    path: [
      '/explore/:campaignSlug',
      '/explore/:campaignSlug/:type/:id',
      '/explore/:campaignSlug/:type/:id/survey'
    ],
    exact: true
  });

  let placeId = null;
  let place = null;
  if (type && id) {
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
  if (placeId && place.isReady()) {
    filters[0] = ['==', 'id', placeId];
    filters[1] = ['!=', 'id', placeId];
    const feature = place.getData();
    selectedFeature = feature;
    featureCenter = geojsonCentroid(feature).geometry.coordinates;
  }

  const campaigns = wrapApiResult(state.campaigns);
  const campaign = campaigns.getData()[campaignSlug];

  return {
    featureCenter,
    filters,
    geojson,
    mapViewport: getFromState(state, `explore.mapViewport`),
    campaignSlug,
    campaign,
    place: place,
    placeId: placeId,
    places: wrapApiResult(getFromState(state, `places.list`)),
    selectedFeature
  };
}

function dispatcher(dispatch) {
  return {
    updateMapViewport: (...args) =>
      dispatch(exploreActions.updateMapViewport(...args))
  };
}

export default withRouter(connect(mapStateToProps, dispatcher)(Map));
