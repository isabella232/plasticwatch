/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Introduction from './introduction';
import Map from '../common/map';

export default class Home extends React.Component {
  render () {
    return (
      <App pageTitle='Welcome' hideFooter>
        <SidebarWrapper>
          <Introduction />
          <Map />
        </SidebarWrapper>
      </App>
    );
  }
}
