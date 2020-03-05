/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import App from '../common/app';
import SidePanel from './SidePanel';
import Map from './Map';

const Wrapper = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr;
  grid-auto-columns: 60rem;

  > * {
    grid-row: 1;
  }
`;

class Home extends React.Component {
  render () {
    return (
      <App pageTitle='Explore' hideFooter>
        <Wrapper>
          <SidePanel />
          <Map />
        </Wrapper>
      </App>
    );
  }
}

function mapStateToProps (state, props) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

export default connect(mapStateToProps, dispatcher)(Home);
