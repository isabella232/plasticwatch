/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import media from '../../styles/utils/media-queries';
import { mediaRanges } from '../../styles/theme/theme';

import App from '../common/app';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import submitSurvey from './places/submit-survey';
import { Panel } from '../../styles/panel';

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
  constructor (props) {
    super(props);

    this.state = {
      isMobile: window.innerWidth < mediaRanges.medium[0]
    };

    this.onDocResize = this.onDocResize.bind(this);
  }
  async componentDidMount () {
    window.addEventListener('resize', this.onDocResize);
  }

  onDocResize (e) {
    const isMobile = window.innerWidth < mediaRanges.medium[0];
    if (this.state.isMobile !== isMobile) {
      this.setState({ isMobile });
    }
  }
  render () {
    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Panel>
            <Route exact path='/explore' render={() => <PlacesIndex isMobile={this.state.isMobile} />} />
            <Route exact path='/explore/:type/:id' component={PlacesView} isMobile={this.state.isMobile} />
            <Route exact path='/explore/:type/:id/submit-survey' component={submitSurvey} isMobile={this.state.isMobile} />
          </Panel>
          <Map />
        </SidebarWrapper>
      </App>
    );
  }
}
