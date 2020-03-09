import React, { Component } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';

import { mapConfig } from '../../config';

// Mapbox access token
mapboxgl.accessToken = mapConfig.mapboxAccessToken;

const MapContainer = styled.div`
  height: 100%;
`;

export default class Map extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mapLoaded: false
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

    const self = this;
    this.map.on('load', () => {
      self.setState({ mapLoaded: true });
    });
  }

  renderMap () {
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
