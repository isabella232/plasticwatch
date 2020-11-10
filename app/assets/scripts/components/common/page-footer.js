import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import * as exploreActions from '../../redux/actions/explore';
import { getFromState, wrapApiResult } from '../../redux/utils';

import UhOh from '../uhoh';
import { visuallyHidden } from '../../styles/helpers';
import { fetchCampaigns } from '../../redux/actions/campaigns';
import { themeVal } from '../../styles/utils/general';
import collecticon from '../../styles/collecticons';
import { filterComponentProps } from '../../utils';
import { Modal, ModalHeader, ModalBody } from '../common/modal';
import { StyledLink } from '../common/link';
import Button from '../../styles/button/button';

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
    margin-top: 0.25rem;
    font-weight: ${themeVal('type.base.light')};
    text-transform: uppercase;
  }
  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: 1.25rem;
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
    span {
      font-weight: ${themeVal('type.base.medium')};
    }
    &::after {
      opacity: 1;
    }
  }
`;

const CampaignList = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-around;
  ${Button} {
    text-decoration: none;
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const NavLinkFilter = filterComponentProps(NavLink, propsToFilter);

function PageFooter(props) {
  const { activeMobileTab, campaigns } = props;
  const {
    params: { campaignSlug }
  } = props.match;

  const [showCampaignSelector, setShowCampaignSelector] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    props.fetchCampaigns();
  }, []);

  // Helper function to handle clicks on nav tabs
  function handleTabClick(tab) {
    // Show Campaign Selector
    if (!campaignSlug) {
      setShowCampaignSelector(true);
    }

    // Update active tab
    props.updateActiveMobileTab(tab);
  }

  // Helper function to list campaigns in Modal
  function renderCampaigns() {
    if (!campaigns.isReady()) {
      return <div>Loading campaigns...</div>;
    }

    if (campaigns.hasError()) {
      return <UhOh />;
    }

    const allCampaigns = campaigns.getData();

    if (allCampaigns.length === 0) {
      return <div>No campaigns are available.</div>;
    }

    return (
      <CampaignList>
        {Object.keys(allCampaigns).map((cSlug) => {
          const c = allCampaigns[cSlug];
          return (
            <li key={cSlug}>
              <Button
                as={StyledLink}
                variation='primary-raised-light'
                to={`/explore/${c.slug}`}
                data-tip={`Go to ${c.name} campaign`}
              >
                {c.name}
              </Button>
            </li>
          );
        })}
      </CampaignList>
    );
  }

  return (
    <PageFoot>
      <Modal
        id='introExpanded'
        revealed={showCampaignSelector}
        onCloseClick={() => setShowCampaignSelector(false)}
        headerComponent={<ModalHeader>Select a city</ModalHeader>}
        bodyComponent={<ModalBody>{renderCampaigns()}</ModalBody>}
      />
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
                onClick={() => handleTabClick('list')}
                useIcon='list'
                isActive={activeMobileTab === 'list'}
                title='Go to the list'
              >
                <span>List</span>
              </FooterMenuLink>
            </li>
            <li>
              <FooterMenuLink
                useIcon='map'
                isActive={activeMobileTab === 'map'}
                onClick={() => handleTabClick('map')}
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

if (environment !== 'production') {
  PageFooter.propTypes = {
    activeMobileTab: T.string,
    campaigns: T.object,
    fetchCampaigns: T.func,
    updateActiveMobileTab: T.func,
    match: T.object
  };
}

function mapStateToProps(state) {
  return {
    activeMobileTab: getFromState(state, `explore.activeMobileTab`),
    campaigns: wrapApiResult(state.campaigns)
  };
}

function dispatcher(dispatch) {
  return {
    fetchCampaigns: (...args) => dispatch(fetchCampaigns(...args)),
    updateActiveMobileTab: (...args) =>
      dispatch(exploreActions.updateActiveMobileTab(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withRouter(PageFooter));
