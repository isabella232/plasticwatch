import styled, { css } from 'styled-components';
import { themeVal } from './utils/general';

export const stackSkin = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 4px 16px 2px ${themeVal('color.shadow')};
`;

export const cardSkin = () => css`
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 32px 2px ${themeVal('color.mist')}, 0 16px 48px -16px ${themeVal('color.shadow')};
`;

export const hideScrollbars = () => css`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  &::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
  }
`;

export const PartnerCards = styled.ul`
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0 ${themeVal('layout.space')};
  list-style: none;
  padding: 0;
  margin: 0;

  dt {
    text-transform: uppercase;
    font-size: 0.875rem;
    grid-column: 1 / span 4;

    &:not(:first-child) {
      margin-top: $global-spacing;
    }
  }
`;

export const PartnerCard = styled.a`
  grid-column: auto / span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 6rem;
  position: relative;
  z-index: 1;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.smoke')};
  transition: all .16s ease 0s;

  img {
    display: inline-flex;
    width: auto;
    max-width: 100%;
    max-height: 4rem;
  }
`;
