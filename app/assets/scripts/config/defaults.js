'use strict';

module.exports = {
  appTitle: 'Oceana Plastic Watch',
  appShortTitle: 'Plastic Watch',
  appDescription: 'A collaborative map of plastic usage by businesses.',
  baseUrl: 'http://localhost:9000',
  appPathname: '',
  apiUrl: 'http://localhost:3000',
  osmUrl: 'https://master.apis.dev.openstreetmap.org',
  pageLimit: 15,
  refreshProfileInterval: 5 * 60 * 1000, // 5 min
  mapConfig: {
    mapboxAccessToken: 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjazdhZjA3aXQwMmZ5M3FtcjZlb3RoeTY5In0.1e90Coahqa6RSlMqfR_Xow',
    style: 'mapbox://styles/devseed/ck4d052l20gfj1cljht7rvhsw',
    defaultInitialBounds: [
      [-77.0444, 38.8923],
      [-77.0293, 38.9072]
    ],
    fitBoundsOptions: {
      padding: 20
    }
  }
};
