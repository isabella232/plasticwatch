import { fetchDispatchFactory, postItem } from '../utils';
import { apiUrl } from '../../config';

/*
 * Fetch survey metadata.
 *
 * The Observe API has support to multiple surveys, but in Wikiplastic context
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
    statePath: ['surveyMeta'],
    url: `${apiUrl}/surveys`,
    requestFn: requestSurvey.bind(this),
    receiveFn: receiveSurvey.bind(this)
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
