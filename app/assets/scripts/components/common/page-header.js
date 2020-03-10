import React from 'react';
import styled, { css } from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { rgba } from 'polished';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { wrapApiResult } from '../../redux/utils';
import { visuallyHidden } from '../../styles/helpers';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import { stackSkin } from '../../styles/skins';
import collecticon from '../../styles/collecticons';
import { filterComponentProps } from '../../utils';

import media from '../../styles/utils/media-queries';

import * as authActions from '../../redux/actions/auth';

import { environment, apiUrl, appPathname } from '../../config';

import { showGlobalLoading, hideGlobalLoading } from '../common/global-loading';

const _rgba = stylizeFunction(rgba);

const PageHead = styled.header`
  ${stackSkin()}
  position: sticky;
  top: 0;
  z-index: 1004;
  display: flex;
  overflow: hidden;
  background-color: ${themeVal('color.primary')};
  ${media.mediumUp`
    background-color: ${themeVal('color.surface')};
  `}
`;

const PageHeadInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  min-width: 100%;
  a {
    text-decoration: none;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-family: ${themeVal('type.base.family')};
  line-height: 2rem;
  text-transform: uppercase;
  color: white;
  background-color: ${themeVal('color.primary')};
  padding: 1rem 2rem;
  margin: -1rem 0;
  font-weight: ${themeVal('type.heading.black')};
  svg {
    margin-right: 0.5rem;
  }
  a {
    color: inherit;
    display: flex;
    padding: 0 0 0.5rem;
    &:active {
      transform: none;
    }
  }
  span {
    font-size: 0.575rem;
    font-weight: ${themeVal('type.heading.light')};
    position: absolute;
    letter-spacing: 0.1rem;
    bottom: 0.125rem;
  }
  ${media.mediumUp`
    a {
      padding: 0 2rem 0.5rem;
    }
  `}
`;

const PageNav = styled.nav`
  display: flex;
  margin: 0 ${multiply(themeVal('layout.space'), 2)} 0 auto;
`;

const GlobalMenu = styled.ul`
  display: flex;
  ${media.mediumUp`
    flex-flow: row nowrap;
    justify-content: center;
    margin: 0;
    list-style: none;

    > * {
      margin: 0 0 0 ${multiply(themeVal('layout.space'), 2)};
    }
  `}
  /* Add visually hidden if mobile */
  ${({ isHidden }) => isHidden &&
   css`
      ${visuallyHidden()}
    `}
`;

const GlobalMenuLink = styled.a.attrs({
  'data-place': 'right'
})`
  position: relative;
  display: flex;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  text-align: center;
  transition: all 0.24s ease 0s;
  font-weight: ${themeVal('type.base.light')};
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    margin-right: 0.5rem;
    position: relative;
    top: -1px;
  }
  &,
  &:visited {
    color: inherit;
  }
  &:hover {
    color: ${themeVal('color.link')};
    opacity: 1;
    background: ${_rgba(themeVal('color.link'), 0.08)};
  }
  &.active {
    color: ${themeVal('color.link')};
    background: ${_rgba(themeVal('color.link'), 0.08)};
    &::after {
      opacity: 1;
    }
  }
`;
// Special components to prevent styled-components error when properties are
// passed to the DOM element.
// https://github.com/styled-components/styled-components/issues/2131
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const NavLinkFilter = filterComponentProps(NavLink, propsToFilter);

class PageHeader extends React.Component {
  async componentDidMount () {
    // Expose function in window object. This will be called from the popup
    // in order to pass the access token at the final OAuth step.
    window.authenticate = async accessToken => {
      showGlobalLoading();
      await this.props.authenticate(accessToken);
      hideGlobalLoading();
    };
  }

  componentWillUnmount () {
    // Remove exposed authenticated function when page is unmounted
    delete window.authenticate;
  }

  async login () {
    // Setting for popup window, parsed into DOMString
    const w = 600;
    const h = 550;
    const settings = [
      ['width', w],
      ['height', h],
      ['left', screen.width / 2 - w / 2],
      ['top', screen.height / 2 - h / 2]
    ]
      .map(function (x) {
        return x.join('=');
      })
      .join(',');

    // Open API login route in popup window to start OAuth
    window.open(
      `${apiUrl}/login?redirect=${window.location.origin}${appPathname}/login/redirect`,
      'oauth_window',
      settings
    );
  }

  render () {
    return (
      <PageHead>
        <PageHeadInner>
          <PageTitle>
            <Link to='/' title='Go to homepage'>
              OCEANA
              <span>Plastic<strong>Watch</strong></span>
            </Link>
          </PageTitle>
          <PageNav>
            <GlobalMenu isHidden={this.props.isMobile}>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/about'
                  useIcon='chart-pie'
                  title='View about page'
                >
                  <span>About</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/map'
                  useIcon='map'
                  title='Go to the map'
                >
                  <span>Explore</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/places'
                  useIcon='chart-pie'
                  title='View trends page'
                >
                  <span>Trends</span>
                </GlobalMenuLink>
              </li>
              {this.props.isLoggedIn ? (
                <>
                  <li>
                    <GlobalMenuLink
                      as={NavLinkFilter}
                      exact
                      to='/surveys'
                      useIcon='page-tick'
                      title='View surveys page'
                    >
                      <span>Surveys</span>
                    </GlobalMenuLink>
                  </li>
                  {
                    this.props.isAdmin &&
                  <li>
                    <GlobalMenuLink
                      as={NavLinkFilter}
                      exact
                      to='/users'
                      useIcon='user-group'
                      title='View users page'
                    >
                      <span>Users</span>
                    </GlobalMenuLink>
                  </li>
                  }
                  <li>
                    <GlobalMenuLink
                      as={NavLinkFilter}
                      exact
                      useIcon='logout'
                      to='/logout'
                      title='Proceed to logout'
                    >
                      <span>Logout</span>
                    </GlobalMenuLink>
                  </li>
                </>
              ) : (
                <li>
                  <GlobalMenuLink
                    useIcon='login'
                    size='xlarge'
                    variation='primary-raised-dark'
                    onClick={() => this.login()}
                  >
                    Login
                  </GlobalMenuLink>
                </li>
              )}
            </GlobalMenu>
          </PageNav>
        </PageHeadInner>
      </PageHead>
    );
  }
}

if (environment !== 'production') {
  PageHeader.propTypes = {
    authenticate: T.func,
    isLoggedIn: T.bool,
    isAdmin: T.bool,
    isMobile: T.bool
  };
}

function mapStateToProps (state) {
  const { isReady, hasError, getData } = wrapApiResult(state.authenticatedUser);
  let isLoggedIn = false;
  let isAdmin = false;

  if (isReady() && !hasError()) {
    isLoggedIn = true;
    isAdmin = getData().isAdmin;
  }

  return {
    isLoggedIn,
    isAdmin
  };
}

function dispatcher (dispatch) {
  return {
    authenticate: (...args) => dispatch(authActions.authenticate(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(PageHeader);
