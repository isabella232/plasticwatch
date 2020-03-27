import React, { Component } from 'react';
import styled from 'styled-components';
import { PropTypes } from 'prop-types';
import c from 'classnames';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

import GlobalLoading from '../common/global-loading';
import withMobileState from '../common/with-mobile-state';

import { appTitle, appDescription, environment } from '../../config';
import media from '../../styles/utils/media-queries';
import { hideScrollbars } from '../../styles/skins';

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
  overflow: scroll;
  ${hideScrollbars()};
`;

class App extends Component {
  render () {
    const { pageTitle, className, children } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <Page className={c('page', className)}>
        <GlobalLoading />
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />
        <PageHeader pageTitle='Plastic Watch' />
        <PageBody role='main'>{children}</PageBody>
        {this.props.isMobile && (
          <PageFooter credits='Made with 🧡 by Development Seed' />
        )}
      </Page>
    );
  }
}

if (environment !== 'production') {
  App.propTypes = {
    className: PropTypes.string,
    pageTitle: PropTypes.string,
    children: PropTypes.node,
    isMobile: PropTypes.bool
  };
}

export default withMobileState(App);
