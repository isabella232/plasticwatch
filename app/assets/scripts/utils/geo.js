'use strict';
import turfBbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import tileCover from '@mapbox/tile-cover';
import _flatten from 'lodash.flatten';

const tileLimits = {
  min_zoom: 16,
  max_zoom: 16
};

export function geojsonBbox (geojson) {
  const bbox = turfBbox(geojson);
  return bbox;
}

export function bboxToTiles (bbox) {
  const polygon = bboxPolygon(_flatten(bbox));
  const tiles = tileCover.indexes(polygon.geometry, tileLimits);
  return tiles;
}
