import { fetchDispatchFactory, postItem } from '../utils';
import { apiUrl } from '../../config';
import qs from 'qs';

/*
 * Fetch survey metadata.
 *
 * The Observe API has support to multiple surveys, but in PlasticWatch context
 * only one survey is allowed. So the client will fetch data from /surveys endpoint
 * and use the first result, if available.
 */

export const REQUEST_SURVEY_META = 'REQUEST_SURVEY_META';
export const RECEIVE_SURVEY_META = 'RECEIVE_SURVEY_META';
export const INVALIDATE_SURVEY_META = 'INVALIDATE_SURVEY_META';

export function invalidateSurvey () {
  return { type: INVALIDATE_SURVEY_META };
}

export function requestSurvey () {
  return { type: REQUEST_SURVEY_META };
}

export function receiveSurvey (data, error = null) {
  return {
    type: RECEIVE_SURVEY_META,
    fetched: true,
    data: data && data.length > 0 && data[0],
    error,
    receivedAt: Date.now()
  };
}

export function fetchSurveyMeta () {
  return fetchDispatchFactory({
    statePath: ['activeSurvey', 'meta'],
    url: `${apiUrl}/surveys`,
    requestFn: requestSurvey.bind(this),
    receiveFn: receiveSurvey.bind(this)
  });
}

/*
 * Fetch survey answers sent by user to a place.
 */

export const REQUEST_SURVEY_ANSWERS = 'REQUEST_SURVEY_ANSWERS';
export const RECEIVE_SURVEY_ANSWERS = 'RECEIVE_SURVEY_ANSWERS';
export const INVALIDATE_SURVEY_ANSWERS = 'INVALIDATE_SURVEY_ANSWERS';

export function invalidateSurveyAnswers () {
  return { type: INVALIDATE_SURVEY_ANSWERS };
}

export function requestSurveyAnswers () {
  return { type: REQUEST_SURVEY_ANSWERS };
}

export function receiveSurveyAnswers (data, error = null) {
  return {
    type: RECEIVE_SURVEY_ANSWERS,
    fetched: true,
    data: data && data.length > 0 && data[0].answers,
    error,
    receivedAt: Date.now()
  };
}

export function fetchSurveyAnswers (params) {
  const searchParams = qs.stringify(params);
  return fetchDispatchFactory({
    statePath: ['activeSurvey', 'answers'],
    url: `${apiUrl}/observations?${searchParams}`,
    requestFn: requestSurveyAnswers.bind(this),
    receiveFn: receiveSurveyAnswers.bind(this)
  });
}

/*
 * Post a new survey
 */
export function postSurvey (data) {
  return async (dispatch, getState) => {
    const state = getState();
    await postItem(state, 'observations', data);
  };
}
