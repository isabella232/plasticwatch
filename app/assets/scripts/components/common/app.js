import React, { Component } from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import c from 'classnames';
import { connect } from 'react-redux';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

import GlobalLoading from '../common/global-loading';

import { appTitle, appDescription } from '../../config';
import media from '../../styles/utils/media-queries';
import { mediaRanges } from '../../styles/theme/theme';

const Page = styled.div`
  display: grid;
  height: 100vh;
  max-height: 100vh;
  grid-template-rows: 4rem 1fr 4rem;

  ${media.mediumUp`
    grid-template-rows: 4rem 1fr;
  `}
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;
`;

class App extends Component {
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
    const { pageTitle, className, children } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <Page className={c('page', className)}>
        <GlobalLoading />
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />
        <PageHeader pageTitle='Plastic Watch' isMobile={this.state.isMobile} />
        <PageBody role='main'>{children}</PageBody>
        {this.state.isMobile && (
          <PageFooter credits='Made with 🧡 by Development Seed' />
        )}
      </Page>
    );
  }
}

App.propTypes = {
  className: PropTypes.string,
  pageTitle: PropTypes.string,
  children: PropTypes.node
};

function mapStateToProps (state, props) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

export default connect(mapStateToProps, dispatcher)(App);
