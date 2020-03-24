import { combineReducers } from 'redux';
import { baseAPIReducer } from './utils';

/**
 * AUTHENTICATED USER reducer
 */
const authenticatedUserReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {
    loggedIn: false
  }
};

const authenticatedUserReducer = baseAPIReducer(
  'AUTHENTICATED_USER',
  authenticatedUserReducerInitialState
);

/**
 * USERS reducer
 */
const usersReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};

const usersReducer = baseAPIReducer('USERS', usersReducerInitialState);

/**
 * PLACES reducer
 */
const placesReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};

const placesReducer = baseAPIReducer('PLACES', placesReducerInitialState);

/**
 * PLACE reducer
 */
const placeReducerInitialState = {
  // fetching: false,
  // fetched: false,
  // error: null,
  // data: []
};

const placeReducer = baseAPIReducer('PLACE', placeReducerInitialState);

/**
 * SURVEY_META reducer
 */
const surveyMetaReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: null
};
const surveyMetaReducer = baseAPIReducer('SURVEY_META', surveyMetaReducerInitialState);

/**
 * Export combined reducers
 */
export default combineReducers({
  authenticatedUser: authenticatedUserReducer,
  users: usersReducer,
  surveyMeta: surveyMetaReducer,
  places: combineReducers({
    list: placesReducer,
    individual: placeReducer
  })
});
