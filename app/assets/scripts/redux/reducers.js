import { combineReducers } from 'redux';
import { baseAPIReducer } from './utils';
import { mapConfig } from '../config';

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
 * PLACES_TILES reducer
 */
const placesTilesReducerInitialState = {
  // fetching: false,
  // fetched: false,
  // error: null,
  // data: []
};

const placesTilesReducer = baseAPIReducer(
  'PLACES_TILE',
  placesTilesReducerInitialState
);

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
const surveyMetaReducer = baseAPIReducer(
  'SURVEY_META',
  surveyMetaReducerInitialState
);

/**
 * SURVEY_ANSWERS reducer
 */
const surveyAnswersReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: null
};
const surveyAnswersReducer = baseAPIReducer(
  'SURVEY_ANSWERS',
  surveyAnswersReducerInitialState
);

/**
 * STATS reducer
 */
const statsReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};

const statsReducer = baseAPIReducer('STATS', statsReducerInitialState);

/**
 * TOP_SURVEYORS reducer
 */
const topSurveyorsReducerInitialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: []
};

const topSurveyorsReducer = baseAPIReducer(
  'TOP_SURVEYORS',
  topSurveyorsReducerInitialState
);

/**
 * MAP reducer
 */
const mapInitialState = {
  bounds: mapConfig.defaultInitialBounds
};

const mapReducer = (state = mapInitialState, action) => {
  switch (action.type) {
    case 'SET_MAP_BOUNDS':
      return {
        ...state,
        bounds: action.bounds
      };
  }
  return state;
};

/**
 * EXPLORE VIEW reducer
 */
const exploreInitialState = {
  mobileView: 'list',
  mapViewport: {},
  filters: null
};

const exploreReducer = (state = exploreInitialState, action) => {
  switch (action.type) {
    case 'UPDATE_ALL':
      return {
        ...state,
        mapViewport: action.mapViewport,
        filters: action.filters
      };
    case 'UPDATE_MAP_VIEWPORT':
      return {
        ...state,
        mapViewport: action.mapViewport
      };
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: action.filters
      };
  }
  return state;
};

/**
 * Export combined reducers
 */
export default combineReducers({
  authenticatedUser: authenticatedUserReducer,
  users: usersReducer,
  activeSurvey: combineReducers({
    meta: surveyMetaReducer,
    answers: surveyAnswersReducer
  }),
  places: combineReducers({
    tiles: placesTilesReducer,
    list: placesReducer,
    individual: placeReducer
  }),
  trends: combineReducers({
    stats: statsReducer,
    topSurveyors: topSurveyorsReducer
  }),
  explore: exploreReducer
});
