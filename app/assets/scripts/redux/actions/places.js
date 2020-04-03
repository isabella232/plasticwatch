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
