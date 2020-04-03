/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';

import media from '../../styles/utils/media-queries';

import App from '../common/app';
import Introduction from './introduction';
import Map from '../common/map';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: calc(100vh - 8.5rem);
  /* grid-template-columns: 100vw;
  grid-template-rows: repeat(4, 1fr); */
  > * {
    grid-column: 1;
  }
  > div:last-child {
    order: -1;
    height: 40vh;
    grid-row: 1/5;
    z-index: 2;
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
`;

export default class Home extends React.Component {
  render () {
    return (
      <App pageTitle='Welcome' hideFooter>
        <Wrapper>
          <Introduction />
          <Map />
        </Wrapper>
      </App>
    );
  }
}
