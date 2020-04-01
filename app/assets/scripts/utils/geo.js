'use strict';
import turfBbox from '@turf/bbox';

export function geojsonBbox (geojson) {
  const bbox = turfBbox(geojson);
  return bbox;
}
