import { fetchDispatchFactory } from '../utils';
import { apiUrl } from '../../config';
import qs from 'qs';

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

export function fetchPlaces (params) {
  const searchParams = qs.stringify(params);
  return fetchDispatchFactory({
    statePath: 'places',
    url: `${apiUrl}/osmobjects?${searchParams}`,
    requestFn: requestPlaces,
    receiveFn: receivePlaces
  });
}
