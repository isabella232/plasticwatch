import {
  fetchDispatchFactory,
  fetchDispatchCacheFactory,
  wrapApiResult,
  getFromState
} from '../utils';
import { apiUrl, mapConfig } from '../../config';
import { bboxToTiles, featuresInBounds } from '../../utils/geo';
import _uniqBy from 'lodash.uniqby';

/*
 * List of places
 */

export const REQUEST_PLACES = 'REQUEST_PLACES';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const INVALIDATE_PLACES = 'INVALIDATE_PLACES';

export function invalidatePlaces () {
  return { type: INVALIDATE_PLACES };
}

export function requestPlaces () {
  return { type: REQUEST_PLACES };
}

export function receivePlaces (data, error = null) {
  return {
    type: RECEIVE_PLACES,
    data,
    error,
    receivedAt: Date.now()
  };
}

/*
 * Fetch individual place
 */

export const REQUEST_PLACE = 'REQUEST_PLACE';
export const RECEIVE_PLACE = 'RECEIVE_PLACE';
export const INVALIDATE_PLACE = 'INVALIDATE_PLACE';

export function invalidatePlace (id) {
  return { type: INVALIDATE_PLACE, id };
}

export function requestPlace (id) {
  return { type: REQUEST_PLACE, id };
}

export function receivePlace (id, data, error = null) {
  return {
    type: RECEIVE_PLACE,
    id,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchPlace (id) {
  return fetchDispatchFactory({
    statePath: ['places', 'individual', id],
    url: `${apiUrl}/osmobjects/${id}`,
    requestFn: requestPlace.bind(this, id),
    receiveFn: receivePlace.bind(this, id)
  });
}

/*
 * Fetch place tile (by quadkey)
 */

export const REQUEST_PLACES_TILE = 'REQUEST_PLACES_TILE';
export const RECEIVE_PLACES_TILE = 'RECEIVE_PLACES_TILE';
export const INVALIDATE_PLACES_TILE = 'INVALIDATE_PLACES_TILE';

export function invalidatePlacesTile (id) {
  return { type: INVALIDATE_PLACES_TILE, id };
}

export function requestPlacesTile (id) {
  return { type: REQUEST_PLACES_TILE, id };
}

export function receivePlacesTile (id, data, error = null) {
  return {
    type: RECEIVE_PLACES_TILE,
    id,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchPlacesTile (quadkey, q) {
  return fetchDispatchCacheFactory({
    statePath: ['places', 'tiles', quadkey, q],
    url: q ? `${apiUrl}/osmobjects?limit=100&quadkey=${quadkey}&q=${q}` : `${apiUrl}/osmobjects?limit=100&quadkey=${quadkey}`,
    requestFn: requestPlacesTile.bind(this, quadkey),
    receiveFn: receivePlacesTile.bind(this, quadkey),
    paginate: true
  });
}

/*
 * Fetch place tile (by quadkey)
 */

export const SET_PLACES_LIST = 'SET_PLACES_LIST';

export function updatePlacesList () {
  return async (dispatch, getState) => {
    dispatch(requestPlaces());

    // Fetch visible tiles
    const state = getState();
    const bounds = state.explore.mapViewport.bounds;
    const zoom = state.explore.mapViewport.zoom || mapConfig.zoom;
    const filters = state.explore.filters;
    const visibleTiles = bboxToTiles(bounds, zoom);

    const searchString = filters.searchString ? filters.searchString : null;
    // Helper function to get tile from state
    const getTile = (id) =>
      wrapApiResult(getFromState(getState(), `places.tiles.${id}`));

    function applyFilters (features) {
      return features.filter((f) => {
        const {
          properties: { observations }
        } = f;
        const { placeType } = filters;

        // Discard place is type is not met
        if (placeType === 'unsurveyed' && observations.total > 0) {
          return false;
        }
        if (
          placeType === 'plasticFree' &&
          (observations.total === 0 ||
            observations.totalTrue <= observations.totalFalse)
        ) {
          return false;
        }
        if (
          placeType === 'plastic' &&
          (observations.total === 0 ||
            observations.totalTrue > observations.totalFalse)
        ) {
          return false;
        }

        return true;
      });
    }

    try {
      // Fetch all visible tiles
      await Promise.all(
        visibleTiles.map((id) => dispatch(fetchPlacesTile(id, searchString)))
      );

      // Get all features on visible tiles
      let features = [];
      for (let i = 0; i < visibleTiles.length; i++) {
        const { isReady, hasError, getData } = getTile(visibleTiles[i]);
        if (isReady() && !hasError()) {
          features = features.concat(applyFilters(getData()));
          features = _uniqBy(features, 'properties.id');
        }
      }

      features = featuresInBounds(features, bounds);
      dispatch(receivePlaces(features));
    } catch (error) {
      dispatch(invalidatePlaces());
    }
  };
}
