import React from 'react';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { environment } from '../../config';

import { visuallyHidden } from '../../styles/helpers';
import PropTypes from 'prop-types';
import { themeVal, stylizeFunction } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';
import { filterComponentProps } from '../../utils';

const _rgba = stylizeFunction(rgba);

const PageFoot = styled.footer`
  position: sticky;
  bottom: 0;
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 -4px 6px ${themeVal('color.shadow')};
  font-size: 0.875rem;
  line-height: 1rem;
  z-index: 10002;

  /* Visually hidden */
  ${({ isHidden }) =>
    isHidden &&
    css`
      ${visuallyHidden()}
    `}
`;

const PageFootInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: stretch;
  height: 100%;
`;

const PageNav = styled.nav`
  display: flex;
  flex: 1;
`;

const FooterMenu = styled.ul`
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: space-around;
  margin: 0;
  list-style: none;

  > li {
    width: 4rem;
  }
`;

const FooterMenuLink = styled.a.attrs({
  'data-place': 'right'
})`
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  text-align: center;
  transition: all 0.24s ease 0s;
  text-decoration: none;
  span {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    font-weight: ${themeVal('type.base.light')};
    text-transform: uppercase;
  }
  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: 1.5rem;
  }
  &,
  &:visited {
    color: inherit;
  }
  &:hover {
    color: ${themeVal('color.link')};
    opacity: 1;
  }
  &.active {
    color: ${themeVal('color.link')};
    font-weight: ${themeVal('type.base.medium')};
    background: ${_rgba(themeVal('color.link'), 0.08)};
    border-radius: ${themeVal('shape.ellipsoid')};
    &::after {
      opacity: 1;
    }
  }
`;

const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const NavLinkFilter = filterComponentProps(NavLink, propsToFilter);

class PageFooter extends React.Component {
  render () {
    const { isMobile } = this.props;
    return (
      <PageFoot isHidden={isMobile}>
        <PageFootInner>
          <PageNav>
            <FooterMenu>
              <li>
                <FooterMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/trends'
                  useIcon='chart-pie'
                  title='View trends page'
                >
                  <span>Trends</span>
                </FooterMenuLink>
              </li>
              <li>
                <FooterMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/places'
                  useIcon='list'
                  title='Go to the list'
                >
                  <span>List</span>
                </FooterMenuLink>
              </li>
              <li>
                <FooterMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/map'
                  useIcon='map'
                  title='Go to the map'
                >
                  <span>Map</span>
                </FooterMenuLink>
              </li>
            </FooterMenu>
          </PageNav>
        </PageFootInner>
      </PageFoot>
    );
  }
}

if (environment !== 'production') {
  PageFooter.propTypes = {
    isMobile: PropTypes.bool
  };
}

function mapStateToProps (state) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

export default connect(mapStateToProps, dispatcher)(PageFooter);
