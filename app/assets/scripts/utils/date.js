/**
 * Format date as extended text.
 *
 * @param {string} date Date as ISO string
 */
export function getUTCDateTime (date) {
  return utcDate(date).toLocaleString();
}

/**
 * Get UTC date string from ISO Date string.
 *
 * @param {string} date Date as ISO string
 */
export function getUTCDate (isoDateStr) {
  return utcDate(isoDateStr).toLocaleDateString();
}

/**
 * Create a date which matches the input date offsetting the timezone to match
 * the user's.
 * If the user is in UTC-5 time and the date string is in UTC the date will be
 * constructed disregarding the input date's timezone.
 * Ex:
 * input: 2019-01-01T00:00:00Z
 * normal output: 2018-12-31T19:00:00 -05:00
 * utcDate output: 2019-01-01T00:00:00 -05:00
 *
 * Basically the real date gets changed by the timezone offset.
 *
 * Times I had timezone related bugs: 3
 *
 * @param {string} str Date String
 *
 * @returns Date
 */
export function utcDate (str) {
  const date = new Date(str);
  // If the date is not valid, return it and be done.
  if (isNaN(date.getTime())) return date;
  const offset = date.getTimezoneOffset();
  date.setTime(date.getTime() + offset * 60 * 1000);
  return date;
}
