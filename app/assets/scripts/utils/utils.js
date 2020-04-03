'use strict';
import get from 'lodash.get';

/**
 * Gets the given path from the state or return the default:
 * {
 *   fetched: false,
 *   fetching: false,
 *   data: {},
 *   error: null
 * }
 *
 * @see lodash.get
 *
 * @param {object} state The redux state
 * @param {array | string} path The path to get. Passed to lodash.get
 *
 * @returns {object} State or default
 */
export function getFromState (state, path) {
  return get(state, path, {
    fetched: false,
    fetching: false,
    data: {},
    error: null
  });
}

/**
 * Wraps the api result with helpful functions.
 * To be used in the state selector.
 *
 * @param {object} stateData Object as returned from an api request. Expected to
 *                           be in the following format:
 *                           {
 *                             fetched: bool,
 *                             fetching: bool,
 *                             data: object,
 *                             error: null | error
 *                           }
 *
 * @returns {object}
 * {
 *   raw(): returns the data as is.
 *   isReady(): Whether or not the fetching finished and was fetched.
 *   hasError(): Whether the request finished with an error.
 *   getData(): Returns the data. If the data has a results list will return that
 *   getMeta(): If there's a meta object it will be returned
 *
 * As backward compatibility all data properties are accessible directly.
 * }
 */
export function wrapApiResult (stateData) {
  const { fetched, fetching, data, error } = stateData;
  const ready = fetched && !fetching;
  return {
    raw: () => stateData,
    isReady: () => ready,
    hasError: () => ready && !!error,
    getData: (def = {}) => (ready ? data.results || data : def),
    getMeta: (def = {}) => (ready ? data.meta : def),

    // As backward compatibility
    ...stateData
  };
}

/**
 * Created a validator function that ensures a number is within the given range.
 *
 * @param {number} min Range lower bound (inclusive)
 * @param {number} max Range upper bound (inclusive)
 *
 * @returns {function} Validator function.
 */
export function validateRangeNum (min, max) {
  return (raw) => {
    const value = Number(raw);
    return !isNaN(value) && raw !== '' && value >= min && value <= max;
  };
}

/**
 * Compares two values using JSON stringification.
 *
 * @param {mixed} a Data to compare
 * @param {mixed} b Data to compare
 */
export function isEqualObj (a, b) {
  // Exist early if they're the same.
  if (a === b) return true;
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Rounds a number to a specified amount of decimals.
 *
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to keep. Default to 2
 */
export function round (value, decimals = 2) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Adds a separator every 3 digits and rounds the number.
 *
 * @param {number} num The number to format.
 * @param {number} decimals Amount of decimals to keep. (Default 2)
 * @param {string} separator Separator to use. (Default ,)
 * @param {boolean} forceDecimals Force the existence of decimal. (Default false)
 *                  Eg: Using 2 decimals and force `true` would result:
 *                  formatThousands(1 /2, 2, true) => 0.50
 *
 * @example
 * formatThousands(1)               1
 * formatThousands(1000)            1,000
 * formatThousands(10000000)        10,000,000
 * formatThousands(1/3)             0.33
 * formatThousands(100000/3)        33,333.33
 * formatThousands()                --
 * formatThousands('asdasdas')      --
 * formatThousands(1/2, 0)          1
 * formatThousands(1/2, 0, true)    1
 * formatThousands(1/2, 5)          0.5
 * formatThousands(1/2, 5, true)    0.50000
 *
 */
export function formatThousands (
  num,
  decimals = 2,
  separator = ',',
  forceDecimals = false
) {
  // isNaN(null) === true
  if (isNaN(num) || (!num && num !== 0)) {
    return '--';
  }

  const repeat = (char, length) => {
    let str = '';
    for (let i = 0; i < length; i++) str += char + '';
    return str;
  };

  let [int, dec] = Number(round(num, decimals))
    .toString()
    .split('.');
  // Space the integer part of the number.
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  // Round the decimals.
  dec = (dec || '').substr(0, decimals);
  // Add decimals if forced.
  dec = forceDecimals ? `${dec}${repeat(0, decimals - dec.length)}` : dec;

  return dec !== '' ? `${int}.${dec}` : int;
}

/*
 * Get the marker name for this geojson
 * Based on whether it's unsurveyed, plastic-free, or not.
 * @param {object} geojson The geojson feature
 */
export function getMarker (geojson) {
  if (geojson.properties.observations.total === 0) {
    return 'markerQuestion';
  }

  const isPlasticFree = geojson.properties.observations.totalTrue > geojson.properties.observations.totalFalse;

  if (isPlasticFree) {
    return 'markerTick';
  } else {
    return 'markerX';
  }
}
