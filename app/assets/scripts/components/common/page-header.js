import React from 'react';
import { PropTypes as T } from 'prop-types';

// Routing
import { Link, NavLink, withRouter } from 'react-router-dom';

// Config
import { environment, apiUrl, appPathname } from '../../config';

// State management
import { connect } from 'react-redux';
import { wrapApiResult } from '../../redux/utils';
import * as authActions from '../../redux/actions/auth';
import withMobileState from './with-mobile-state';

// Styles
import { rgba } from 'polished';
import styled, { css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { visuallyHidden } from '../../styles/helpers';
import { multiply } from '../../styles/utils/math';
import { stackSkin } from '../../styles/skins';
import { filterComponentProps } from '../../utils';
import media from '../../styles/utils/media-queries';

// Components
import Button from '../../styles/button/button';
import { StyledLink } from '../common/link';
import { showAboutModal } from './about-modal';
import { showGlobalLoading, hideGlobalLoading } from '../common/global-loading';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/dropdown';

const _rgba = stylizeFunction(rgba);

const PageHead = styled.header`
  ${stackSkin()}
  position: sticky;
  top: 0;
  z-index: 1004;
  display: flex;
  background: linear-gradient(
    160deg,
    ${themeVal('color.secondary')},
    ${themeVal('color.base')} 70%
  );
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
  padding: 0 1rem;
  margin: -1rem 0;
  font-weight: ${themeVal('type.heading.black')};
  img {
    max-width: 5.5rem;
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
    padding: 1rem 2rem 1rem 0rem;
    min-height: 4rem;
    min-width: 12rem;
    background: linear-gradient(160deg, ${themeVal(
    'color.secondary'
  )}, ${themeVal('color.base')} 70%);
    a {
      padding: 0 2rem 0.5rem;
    }
  `}
`;

const PageNav = styled.nav`
  display: flex;
  ${media.mediumUp`
    margin: 0 ${multiply(themeVal('layout.space'), 2)} 0 auto;
  `}
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
        font-size: 1.5rem;
      }
    }
  `}
`;
const transitions = {
  left: {
    start: () => css`
      transform: translate(100vw, 0);
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

const GlobalMenuLink = styled(Button).attrs({
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

const CampaignMenuItem = styled(DropMenuItem)`
  font-weight: ${themeVal('type.base.weight')};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  text-decoration: none;
`;

class PageHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobileMenuOpened: false
    };

    this.renderCampaignNav = this.renderCampaignNav.bind(this);
    this.dropdownRef = React.createRef();
  }

  async componentDidMount() {
    // Expose function in window object. This will be called from the popup
    // in order to pass the access token at the final OAuth step.
    window.authenticate = async (accessToken) => {
      showGlobalLoading();
      await this.props.authenticate(accessToken);
      hideGlobalLoading();
    };
  }

  componentWillUnmount() {
    // Remove exposed authenticated function when page is unmounted
    delete window.authenticate;
  }

  async login() {
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

  renderCampaignNav() {
    // Get campaign slug
    const {
      campaigns,
      match: {
        params: { campaignSlug }
      }
    } = this.props;

    // Do not render until campaigns are available
    if (!campaigns.isReady() || campaigns.hasError()) return <></>;

    // Get data
    const allCampaigns = campaigns.getData();
    const campaign = allCampaigns[campaignSlug];

    // Do not render if campaign is not available
    if (!campaign) return <></>;

    return (
      <Dropdown
        ref={this.dropdownRef}
        alignment='center'
        direction='down'
        triggerElement={(props) => (
          <GlobalMenuLink
            useIcon={['chevron-down--small', 'after']}
            title='Open dropdown'
            {...props}
          >
            {campaign ? campaign.name : 'Explore'}
          </GlobalMenuLink>
        )}
      >
        <React.Fragment>
          <DropTitle>Select City</DropTitle>
          <DropMenu>
            {Object.keys(allCampaigns).map((cSlug) => {
              const c = allCampaigns[cSlug];
              if (cSlug !== campaignSlug) {
                return (
                  <CampaignMenuItem
                    key={cSlug}
                    as={StyledLink}
                    to={`/explore/${c.slug}`}
                    data-tip={`Go to ${c.name} campaign`}
                    onClick={() => this.dropdownRef.current.close()}
                  >
                    {c.name}
                  </CampaignMenuItem>
                );
              }
            })}
          </DropMenu>
        </React.Fragment>
      </Dropdown>
    );
  }

  renderNav() {
    const { isMobile, location } = this.props;
    return (
      <GlobalMenu>
        {isMobile ? (
          <li>
            <GlobalMenuLink
              as='a'
              useIcon={
                !this.state.isMobileMenuOpened ? 'hamburger-menu' : 'xmark'
              }
              title='View menu'
              onClick={() =>
                this.setState((prevState) => {
                  return { isMobileMenuOpened: !prevState.isMobileMenuOpened };
                })}
            />
          </li>
        ) : (
          <>
            {this.renderCampaignNav()}
            <li>
              <GlobalMenuLink
                as={NavLinkFilter}
                exact
                to='/explore'
                useIcon='map'
                isActive={(match, { pathname, search }) =>
                  pathname && pathname.indexOf('/explore') === 0}
                title='Go to the explore view'
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
              location.pathname !== '/' && (
                <li>
                  <GlobalMenuLink
                    useIcon='login'
                    onClick={() => this.login()}
                  >
                    Login
                  </GlobalMenuLink>
                </li>
              )
            )}
          </>
        )}
      </GlobalMenu>
    );
  }

  renderMobileNav() {
    return (
      <MobileMenu>
        <li>
          <GlobalMenuLink
            onClick={showAboutModal}
            useIcon='circle-information'
            title='View about page'
          >
            <span>About</span>
          </GlobalMenuLink>
        </li>
        {this.props.isLoggedIn ? (
          <>
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
              onClick={() => this.login()}
            >
              Login
            </GlobalMenuLink>
          </li>
        )}
      </MobileMenu>
    );
  }

  render() {
    const { isMobileMenuOpened } = this.state;
    return (
      <PageHead>
        <PageHeadInner>
          <PageTitle>
            <Link to='/' title='Go to homepage'>
              <img src='../../../assets/graphics/content/Oceana_White.svg' />
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
    campaigns: T.object,
    location: T.object,
    match: T.object,
    isLoggedIn: T.bool,
    isAdmin: T.bool,
    isMobile: T.bool
  };
}

function mapStateToProps(state, props) {
  const { isReady, hasError, getData } = wrapApiResult(state.authenticatedUser);
  let isLoggedIn = false;
  let isAdmin = false;

  if (isReady() && !hasError()) {
    isLoggedIn = true;
    isAdmin = getData().isAdmin;
  }

  return {
    isLoggedIn,
    isAdmin,
    campaigns: wrapApiResult(state.campaigns)
  };
}

function dispatcher(dispatch) {
  return {
    authenticate: (...args) => dispatch(authActions.authenticate(...args))
  };
}

export default withMobileState(
  withRouter(connect(mapStateToProps, dispatcher)(PageHeader))
);
