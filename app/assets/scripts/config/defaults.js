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
    bounds: [[-77.192687, 38.776034], [-76.889190, 39.010647]],
    fitBoundsOptions: {
      padding: 20
    }
  }
};
