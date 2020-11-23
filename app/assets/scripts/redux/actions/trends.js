import { fetchDispatchFactory } from '../utils';
import { apiUrl } from '../../config';

/*
 * Fetch places stats
 */

export const REQUEST_STATS = 'REQUEST_STATS';
export const RECEIVE_STATS = 'RECEIVE_STATS';
export const INVALIDATE_STATS = 'INVALIDATE_STATS';

export function invalidatePlacesStats () {
  return { type: INVALIDATE_STATS };
}

export function requestPlacesStats () {
  return { type: REQUEST_STATS };
}

export function receivePlacesStats (data, error = null) {
  return {
    type: RECEIVE_STATS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchStats (campaignId) {
  let query = '';
  if (campaignId) {
    query = `?campaignId=${campaignId}`;
  }

  return fetchDispatchFactory({
    statePath: ['trends', 'stats'],
    url: `${apiUrl}/osmobjects/stats${query}`,
    requestFn: requestPlacesStats.bind(this),
    receiveFn: receivePlacesStats.bind(this)
  });
}

/*
 * Fetch top surveyors
 */

export const REQUEST_TOP_SURVEYORS = 'REQUEST_TOP_SURVEYORS';
export const RECEIVE_TOP_SURVEYORS = 'RECEIVE_TOP_SURVEYORS';
export const INVALIDATE_TOP_SURVEYORS = 'INVALIDATE_TOP_SURVEYORS';

export function invalidateTopSurveyors () {
  return { type: INVALIDATE_TOP_SURVEYORS };
}

export function requestTopSurveyors () {
  return { type: REQUEST_TOP_SURVEYORS };
}

export function receiveTopSurveyors (data, error = null) {
  return {
    type: RECEIVE_TOP_SURVEYORS,
    data,
    error,
    receivedAt: Date.now()
  };
}

export function fetchTopSurveyors (campaignId) {
  let query = '';

  if (campaignId) {
    query = `&campaignId=${campaignId}`;
  }
  return fetchDispatchFactory({
    statePath: ['trends', 'topSurveyors'],
    url: `${apiUrl}/top-surveyors?limit=10${query}`,
    requestFn: requestTopSurveyors.bind(this),
    receiveFn: receiveTopSurveyors.bind(this)
  });
}
