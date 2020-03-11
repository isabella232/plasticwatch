/* eslint-disable no-console */
// This script uses an Overpass Query to fetch all data as geojson and upload them to the Observe API database.

// Run: node prepare-osm-data.js --query <query-file>
// Results are stored in /tmp/data.geojson

const queryOverpass = require('query-overpass');
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const argv = require('yargs').argv;
const cover = require('@mapbox/tile-cover');
const centroid = require('@turf/centroid').default;

if (!argv.query) {
  // eslint-disable-next-line no-console
  console.log('Use --query to supply an Overpass query file');
  process.exit(0);
}

const query = readFileSync(argv.query, { 'encoding': 'UTF-8' });
console.log('Querying Overpass...');

queryOverpass(query, (error, data) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Fetched data from Overpass.');
    data.features.forEach(feature => {
      let quadkey;
      if (feature.geometry.type !== 'Point') {
        // find centroid
        const point = centroid(feature.geometry);
        quadkey = getQuadkey(point.geometry);
      } else {
        quadkey = getQuadkey(feature.geometry);
      }

      feature.quadkey = quadkey;
    });
    writeFileSync('/tmp/data.geojson', JSON.stringify(data));
  }
}, { flatProperties: true });

function getQuadkey (feature) {
  const limits = {
    min_zoom: 16,
    max_zoom: 16
  };

  const quadkeys = cover.indexes(feature, limits);
  return quadkeys[0];
}
