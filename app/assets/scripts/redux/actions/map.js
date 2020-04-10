export const SET_MAP_BOUNDS = 'SET_MAP_BOUNDS';

export function setMapBounds (bounds) {
  return {
    type: SET_MAP_BOUNDS,
    bounds
  };
}
