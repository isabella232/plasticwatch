import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';

import { visuallyHidden } from '../../styles/helpers';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import { stackSkin } from '../../styles/skins';
import { headingAlt } from '../../styles/type/heading';
import Constrainer from '../../styles/constrainer';
import collecticon from '../../styles/collecticons';
import media from '../../styles/utils/media-queries';

const _rgba = stylizeFunction(rgba);

export const Inpage = styled.article`
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr;
`;

export const InpageHeader = styled.header`
  ${stackSkin()}
  clip-path: polygon(0 0, 100% 0, 100% 200%, 0% 200%);
  position: relative;
  z-index: 10;

  /* Visually hidden */
  ${({ isHidden }) => isHidden &&
   css`
      ${visuallyHidden()}
    `}
`;

export const InpageHeaderInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  padding: ${themeVal('layout.space')} ${multiply(themeVal('layout.space'), 2)};
  margin: 0 auto;
`;

export const InpageHeadline = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 0;
`;

export const InpageBackLink = styled(Link)`
  display:flex;
  position: relative;
  text-decoration: none;
  margin-top: 1rem;
  padding: 0.25rem 0;
  background: linear-gradient(90deg, white, rgba(255,255,255,0));
  &:before{
    ${collecticon('chevron-left--small')};
  }
  & + * {
    margin-top: 0.2rem;;
  }
  ${media.mediumUp`
    margin: 0;
    background: none;
  `};
`;

export const InpageTitle = styled.h1`
  line-height: 2rem;
  font-size: 2.5rem;
`;

export const InpageTagline = styled.p`
  ${headingAlt()}
  order: -1;
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${_rgba('#FFFFFF', 0.64)};
`;

export const InpageBody = styled.div`
  background: transparent;
`;

export const InpageBodyInner = styled(Constrainer)`
  padding-top: ${multiply(themeVal('layout.space'), 4)};
  padding-bottom: ${multiply(themeVal('layout.space'), 4)};
`;

export const InpageBodyFluid = styled.div`
  padding: 0;
  margin: 0 auto;
  max-width: none;
  ${media.mediumUp`
    max-width: ${themeVal('layout.max')};
    padding: ${multiply(themeVal('layout.space'), 4)} ${multiply(themeVal('layout.space'), 2)};
  `};
`;
