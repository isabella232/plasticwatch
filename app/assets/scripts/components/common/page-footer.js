import React from 'react';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { NavLink } from 'react-router-dom';

import { visuallyHidden } from '../../styles/helpers';
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
  z-index: 9002;

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
    margin: 0.25rem 0;
  }
`;

const FooterMenuLink = styled.a.attrs({
  'data-place': 'right'
})`
  position: relative;
  height: 100%;
  display: flex;
  padding-top: 0.25rem;
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
    return (
      <PageFoot>
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
                  to='/explore?viewAs=list'
                  useIcon='list'
                  isActive={(match, { pathname, search }) =>
                    match &&
                    pathname === '/explore' &&
                    search.indexOf('viewAs=list') > -1}
                  title='Go to the list'
                >
                  <span>List</span>
                </FooterMenuLink>
              </li>
              <li>
                <FooterMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/explore'
                  useIcon='map'
                  isActive={(match, { pathname, search }) =>
                    match &&
                    pathname === '/explore' &&
                    search.indexOf('viewAs=list') === -1}
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

export default PageFooter;
