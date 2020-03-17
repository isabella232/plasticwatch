import { rgba, tint } from 'polished';

let color = {
  base: '#142B58',
  primary: '#0686E5',
  secondary: '#0A66A5'
};

color = {
  ...color,
  background: rgba(tint(0.8, color.primary), 0.2),
  surface: '#FFFFFF',
  baseMed: tint(0.3, color.base),
  baseLight: tint(0.7, color.base),
  mist: rgba(color.base, 0.04),
  shadow: rgba(color.base, 0.12),
  smoke: rgba(color.base, 0.16),
  link: color.primary,
  danger: '#C0392B',
  success: '#4CB5AE',
  warning: '#F39C12',
  info: '#2980B9'
};

color = {
  ...color,
  silk: `radial-gradient(farthest-side, ${color.surface}, ${rgba(color.surface, 0.64)})`
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: tint(0.16, color.base),
    family: '"Lato", sans-serif',
    style: 'normal',
    weight: 400,
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
    black: 900
  },
  heading: {
    family: '"Roboto Condensed", sans-serif',
    style: 'normal',
    weight: 700,
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
    black: 900
  }
};

const shape = {
  rounded: '0.25rem',
  ellipsoid: '320rem'
};

const layout = {
  space: '1rem',
  border: '1px',
  min: '960px',
  max: '1280px'
};

const boxShadow = {
  inset: 'inset 0px 0px 3px 0px rgba(0,0,0,0.2);',
  input: '0 -1px 1px 0 rgba(0,0,0,0.08), 0 2px 6px 0 rgba(0,0,0,0.16);'
};

export default {
  main: {
    layout,
    color,
    type,
    shape,
    boxShadow
  }
};

/**
 * Media query ranges used by the media utility.
 * They're not exported with the main theme because the utility does not
 * build the media functions in runtime, needing the values beforehand.
 */
export const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1200, null]
};
