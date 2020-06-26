import styled from 'styled-components';
import { cardSkin } from '../../styles/skins';
import { themeVal } from '../../styles/utils/general';
import media from '../../styles/utils/media-queries';
import { Panel, InnerPanel } from '../../styles/panel';

export const Wrapper = styled.div`
  height: 100%;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const SidebarWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-flow: column nowrap;
  > div:first-child{
    z-index: 10;
  }
  > div:last-child {
    order: -1;
    flex: 1;
    position: sticky;
    top: 0;
  }
  ${media.mediumUp`
    display: grid;
    height: 100%;
    grid-template-columns: 24rem 1fr;
    grid-template-rows: 1fr;
    margin: 0;
    > * {
      grid-row: 1;
      grid-column: initial;
    }
    > div:last-child {
      height: initial;
      order: initial;      
    }
  `}
  ${media.largeUp`
    grid-template-columns: 36rem 1fr;
  `}
  >${Panel}:not(:only-child) {
    max-height: 50%;
    position: sticky;
    top: 0;
    ~ ${Wrapper} {
      margin-top: -2.75rem;
    }
    >${InnerPanel} {
      max-height: calc(100vh - 16rem);
    }
    ${media.mediumUp`
      margin-top: 0;
      max-height: none;
    `}
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  > * {
    flex: 1;
  }
`;

export const Infobox = styled.div`
  ${cardSkin()}
  margin-left: 4rem;
  padding: 2rem;

  form {
    grid-gap: 0;

    label {
      color: ${themeVal('color.primary')};
      letter-spacing: 0.4;
      font-size: 0.875rem;
      &:not(:first-child) {
        margin-top: 0.5rem;
      }
    }
    ul, li {
      list-style: none;
      margin: 0;
    }
  }
`;

export const ActionButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.67rem;
  > *:not(:last-child) {
    margin-right: 2rem;
  }
`;
