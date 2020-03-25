import React, { Component } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/places';
import { PropTypes as T } from 'prop-types';
import { Redirect } from 'react-router-dom';

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
      geojson: {}
    };
  }

  componentDidMount () {
    const { mapLoaded } = this.state;

    // Bypass if map is already loaded
    if (mapLoaded) return;
    // Mount the map on the net tick to prevent the right side gap.
    setTimeout(() => this.initMap(), 1);
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

    const self = this;
    this.map.on('load', () => {
      const { getData } = this.props.places;

      self.setState({ mapLoaded: true });

      const geojson = {
        'type': 'FeatureCollection',
        'features': getData()
      };

      self.setState({ geojson });

      // add the geojson as a source to the map
      this.map.addSource('placesSource', {
        'type': 'geojson',
        'data': geojson
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
          self.setState({
            selectedFeatureId: feature.properties.id
          });
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

    if (this.state.selectedFeatureId) {
      return (
        <Redirect to={`/explore/${this.state.selectedFeatureId}`} />
      );
    }
    return (
      <>
        <MapContainer ref={this.mapContainer}>
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
  fetchPlaces: T.func
};

function mapStateToProps (state) {
  return {
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(Map);
