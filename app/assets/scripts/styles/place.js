import styled from 'styled-components';
import { themeVal, stylizeFunction } from './utils/general';
import media from './utils/media-queries';
import { visuallyHidden } from './helpers/index';
import collecticon from './collecticons';
import { rgba } from 'polished';

const _rgba = stylizeFunction(rgba);

export const Place = styled.article`
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 6px 1px ${themeVal('color.shadow')};
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  margin: 0.5rem;
  ${media.mediumUp`
    padding: 1.5rem;
    margin: 1rem 0;
  `}
`;

export const PlaceHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  align-items: flex-start;
`;

export const PlaceTitle = styled.h2`
  margin: 0;
`;

export const PlaceType = styled.p`
  color: ${themeVal('color.baseMed')};
  line-height: 1;
`;

export const PlaceRating = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-left: auto;
  padding-left: ${themeVal('layout.space')};
  text-align: center;
  color: ${themeVal('color.baseMed')};
`;

export const RatingType = styled.p`
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.8rem;
  line-height: 1;
  &::before {
    display: block;
    ${({ useIcon }) => collecticon(useIcon)}
    color: ${({ nonplastic }) =>
    nonplastic ? themeVal('color.primary') : themeVal('color.danger')};
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

export const PlaceSurveys = styled.p``;

export const PlaceSelect = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  margin: 0 !important;
  transition: all 0.24s ease 0s;
  flex: none;
  &:hover {
    opacity: 1;
    background: ${_rgba(themeVal('color.primary'), 0.05)};
  }
  span {
    ${visuallyHidden()}
  }
`;

export const PlaceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const PlaceDetails = styled.div`
  margin-bottom: 2rem;
`;

export const PlaceComment = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0.75rem 0;
  
  img {
    max-width: 100%;
    margin-right: 0.5rem;
  }
  span {
    display: block;
    text-align: right;
    font-size: 0.875rem;
  }
`;
