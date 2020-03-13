import React from 'react';
import styled, { css } from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { rgba } from 'polished';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
  background: linear-gradient(175deg, ${themeVal('color.secondary')}, ${themeVal('color.base')});
  ${media.mediumUp`
    overflow: hidden;
    background: ${themeVal('color.surface')};
  `}
  a {
    text-decoration: none;
  }
`;

const PageHeadInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  min-width: 100%;
`;

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-family: ${themeVal('type.base.family')};
  line-height: 2rem;
  text-transform: uppercase;
  color: white;
  padding: 0 2rem;
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
    padding: 1rem 2rem;
    background: linear-gradient(175deg, ${themeVal('color.secondary')}, ${themeVal('color.base')});
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
  ${({ isHidden }) =>
    isHidden &&
    css`
      ${visuallyHidden()}
    `}
  /* Make hamburger menu white*/
  ${media.smallDown`
    a:first-of-type {
      &::before {
        color: white;
      }
    }
  `}
`;
const transitions = {
  left: {
    start: () => css`
      transform: translate(100vw , 0);
    `,
    end: () => css`
      transform: translate(0, 0);
    `
  }
};

const MobileMenu = styled.ul`
  position: absolute;
  right: 0;
  top: 4em;
  background: white;
  padding: 2.25rem;
  z-index: 30;
  height: 90vh;
  width: 75vw;
  box-shadow: -16px 0 48px -16px ${themeVal('color.shadow')};
  transition: all 0.24s ease;
  
  a {
    text-align: right;
    &.active {
      color: ${themeVal('color.primary')};
    }
  }
  &::before {
    content: '';
    position: fixed;
    top: 4rem;
    bottom: 0;
    left: 0;
    right: 75vw;
    background: ${themeVal('color.smoke')};
    opacity: 1;
    z-index: -1;
    transition: all 0.24s ease 0s;
  }
  & > li:last-of-type {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${themeVal('color.smoke')};
  }

  &.mobile-menu-enter {
    ${transitions.left.start}
  }

  &.mobile-menu-enter-active {
    ${transitions.left.end}
  }

  &.mobile-menu-exit {
    ${transitions.left.end}
  }

  &.mobile-menu-exit-active {
    ${transitions.left.start}
  }
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
  font-weight: ${themeVal('type.base.weight')};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  justify-content: flex-end;
  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    margin-right: 0.5rem;
    position: relative;
    color: inherit;
  }
  &,
  &:visited {
    color: inherit;
  }
  &:hover {
    color: ${themeVal('color.link')};
    opacity: 1;
    ${media.mediumUp`
      background: ${_rgba(themeVal('color.link'), 0.08)};
    `}
  }
  &.active {
    color: ${themeVal('color.link')};
    ${media.mediumUp`
      background: ${_rgba(themeVal('color.link'), 0.08)};
    `}
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
  constructor (props) {
    super(props);

    this.state = {
      isMobileMenuOpened: false
    };
  }

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

  renderNav () {
    const { isMobile } = this.props;
    return (
      <GlobalMenu>
        {isMobile ? (
          <li>
            <GlobalMenuLink
              useIcon={!this.state.isMobileMenuOpened ? 'hamburger-menu' : 'xmark'}
              title='View menu'
              onClick={() =>
                this.setState(prevState => {
                  return { isMobileMenuOpened: !prevState.isMobileMenuOpened };
                })}
            />
          </li>
        ) : (
          <>
            <li>
              <GlobalMenuLink
                as={NavLinkFilter}
                exact
                to='/sandbox'
                useIcon='map'
                title='Sandbox'
              >
                <span>Sandbox</span>
              </GlobalMenuLink>
            </li>
            <li>
              <GlobalMenuLink
                as={NavLinkFilter}
                exact
                to='/about'
                useIcon='circle-information'
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
                to='/trends'
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
                {this.props.isAdmin && (
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
                )}
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
          </>
        )}
      </GlobalMenu>
    );
  }

  renderMobileNav () {
    return (
      <MobileMenu>
        <li>
          <GlobalMenuLink
            as={NavLinkFilter}
            exact
            to='/about'
            useIcon='circle-information'
            title='View about page'
          >
            <span>About</span>
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
            {this.props.isAdmin && (
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
            )}
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
      </MobileMenu>
    );
  }

  render () {
    const { isMobileMenuOpened } = this.state;
    return (
      <PageHead>
        <PageHeadInner>
          <PageTitle>
            <Link to='/' title='Go to homepage'>
              OCEANA
              <span>
                Plastic<strong>Watch</strong>
              </span>
            </Link>
          </PageTitle>
          <PageNav>{this.renderNav()}</PageNav>
        </PageHeadInner>
        <TransitionGroup component={null}>
          {isMobileMenuOpened && (
            <CSSTransition
              in={this.state.isMobileMenuOpened}
              unmountOnExit={true}
              classNames='mobile-menu'
              timeout={300}
            >
              {this.renderMobileNav()}
            </CSSTransition>
          )}
        </TransitionGroup>
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
