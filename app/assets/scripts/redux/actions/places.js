import {
  fetchDispatchFactory,
  fetchDispatchCacheFactory,
  wrapApiResult,
  getFromState
} from '../utils';
import { apiUrl } from '../../config';
import qs from 'qs';
import { bboxToTiles, featuresInBounds } from '../../utils/geo';

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

export function fetchPlaces ({ placeType }) {
  // Translate placeType filter to Observe API query param
  let observations;
  switch (placeType) {
    case 'plasticFree':
      observations = 'true';
      break;
    case 'plastic':
      observations = 'false';
      break;
    case 'unsurveyed':
      observations = 'no';
      break;

    default:
      break;
  }

  const searchParams = qs.stringify({ observations });
  return fetchDispatchFactory({
    statePath: ['places', 'list'],
    url: `${apiUrl}/osmobjects?limit=100&${searchParams}`,
    requestFn: requestPlaces,
    receiveFn: receivePlaces
  });
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

export function fetchPlacesTile (quadkey) {
  return fetchDispatchCacheFactory({
    statePath: ['places', 'tiles', quadkey],
    url: `${apiUrl}/osmobjects?limit=100&quadkey=${quadkey}`,
    requestFn: requestPlacesTile.bind(this, quadkey),
    receiveFn: receivePlacesTile.bind(this, quadkey)
  });
}

/*
 * Fetch place tile (by quadkey)
 */

export const SET_PLACES_LIST = 'SET_PLACES_LIST';

export function updatePlacesList (bounds, filters = {}) {
  return async (dispatch, getState) => {
    // Fetch visible tiles
    const visibleTiles = bboxToTiles(bounds);
    await Promise.all(visibleTiles.map((id) => dispatch(fetchPlacesTile(id))));

    const state = getState();

    // Helper function to get tile from state
    const getTile = (id) =>
      wrapApiResult(getFromState(state, `places.tiles.${id}`));

    function applyFilters (features) {
      return features.filter((f) => {
        const {
          properties: { observations }
        } = f;
        const { placeType } = filters;

        if (placeType === 'plasticFree') {
          return (
            observations.total > 0 &&
            observations.totalTrue > observations.totalFalse
          );
        } else if (placeType === 'plastic') {
          return (
            observations.total > 0 &&
            observations.totalTrue <= observations.totalFalse
          );
        } else if (placeType === 'unsurveyed') {
          return observations.total === 0;
        }

        return true;
      });
    }

    // Get all features on visible tiles
    let features = [];
    for (let i = 0; i < visibleTiles.length; i++) {
      const { isReady, hasError, getData } = getTile(visibleTiles[i]);
      if (isReady() && !hasError()) {
        features = features.concat(applyFilters(getData()));
      }
    }

    features = featuresInBounds(features, bounds);

    dispatch(receivePlaces(features));
  };
}
