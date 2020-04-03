/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import media from '../../styles/utils/media-queries';

import App from '../common/app';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';

const SidebarWrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 100vw;
  grid-template-rows: repeat(4, 1fr);
  margin-bottom: 3rem;
  > * {
    grid-column: 1;
  }
  > *:nth-of-type(2) {
    grid-row: 1/5;
  }
  ${media.mediumUp`
    grid-template-columns: 24rem 1fr;
    grid-template-rows: 1fr;
    margin: 0;
    > * {
      grid-row: 1;
      grid-column: initial;
    }
  `}
  ${media.largeUp`
    grid-template-columns: 36rem 1fr;
  `}
`;

export default class Explore extends React.Component {
  render () {
    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Route exact path='/explore' component={PlacesIndex} />
          <Route exact path='/explore/:type/:id' component={PlacesView} />
          <Route exact path='/explore/:type/:id/survey' component={PlaceSurvey} />
          <Map />
        </SidebarWrapper>
      </App>
    );
  }
}
