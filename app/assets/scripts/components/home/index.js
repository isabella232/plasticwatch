/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';

import App from '../common/app';
import styled from 'styled-components';
import { appPathname } from '../../config';

import { SidebarWrapper } from '../common/view-wrappers';
import Introduction from './introduction';
import { StyledLink } from '../common/link';

const FakeMap = styled.div`
  background: url(${appPathname}/assets/graphics/content/dc-map.png);
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.1);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
`;

export default class Home extends React.Component {
  render () {
    return (
      <App pageTitle='Welcome' hideFooter>
        <SidebarWrapper>
          <Introduction />
          <FakeMap as={StyledLink} to='/explore' />
        </SidebarWrapper>
      </App>
    );
  }
}
