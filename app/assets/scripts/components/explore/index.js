/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { Route } from 'react-router-dom';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';

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
