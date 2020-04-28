export const UPDATE_FILTERS = 'UPDATE_FILTERS';

export function updateFilters (filters = {}) {
  return {
    type: UPDATE_FILTERS,
    filters
  };
}

export const UPDATE_MAP_VIEWPORT = 'UPDATE_MAP_VIEWPORT';
export function updateMapViewport (mapViewport) {
  return {
    type: UPDATE_MAP_VIEWPORT,
    mapViewport
  };
}

export const UPDATE_FILTERS_AND_MAP_VIEWPORT =
  'UPDATE_FILTERS_AND_MAP_VIEWPORT';
export function updateFiltersAndMapViewport ({ mapViewport, filters }) {
  return {
    type: UPDATE_FILTERS_AND_MAP_VIEWPORT,
    mapViewport,
    filters
  };
}

export const UPDATE_MOBILE_TAB = 'UPDATE_MOBILE_TAB';
export function updateMobileTab (tabId) {
  return {
    type: UPDATE_MOBILE_TAB,
    tabId
  };
}
