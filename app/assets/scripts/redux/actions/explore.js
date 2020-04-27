export const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';

export function updateQueryParams (queryParams = {}) {
  return {
    type: UPDATE_QUERY_PARAMS,
    queryParams
  };
}

export const UPDATE_MAP_VIEWPORT = 'UPDATE_MAP_VIEWPORT';
export function updateMapViewport (mapViewport) {
  return {
    type: UPDATE_MAP_VIEWPORT,
    mapViewport
  };
}

export const UPDATE_MOBILE_TAB = 'UPDATE_MOBILE_TAB';
export function updateMobileTab (tabId) {
  return {
    type: UPDATE_MOBILE_TAB,
    tabId
  };
}
