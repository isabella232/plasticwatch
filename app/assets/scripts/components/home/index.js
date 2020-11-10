/* eslint-disable react/no-access-state-in-setstate */
import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import App from '../common/app';
import styled from 'styled-components';
import { environment, appPathname } from '../../config';
import media from '../../styles/utils/media-queries';

import * as exploreActions from '../../redux/actions/explore';
import { wrapApiResult } from '../../redux/utils';
import { fetchCampaigns } from '../../redux/actions/campaigns';

import UhOh from '../uhoh';
import { SidebarWrapper } from '../common/view-wrappers';
import Introduction from './introduction';
import { StyledLink } from '../common/link';
import { Modal, ModalHeader, ModalBody } from '../common/modal';
import Button from '../../styles/button/button';

const HomeWrapper = styled(SidebarWrapper)`
  height: inherit;
`;

const FakeMap = styled.div`
  background: url(${appPathname}/assets/graphics/content/dc-map.png);
  box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.1);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  height: 20rem;
  ${media.mediumUp`
    height: 100%;
  `};

  h4 {
    text-transform: uppercase;
    background: rgba(240,240,240, 0.85);
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    font-weight: normal;
    letter-spacing: 0.5px;
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

function Home(props) {
  const { campaigns } = props;
  const {
    params: { campaignSlug }
  } = props.match;

  const [showCampaignSelector, setShowCampaignSelector] = useState(false);

  // Load campaigns on mount
  useEffect(() => {
    props.fetchCampaigns();
  }, []);

  // Helper function to handle clicks on nav tabs
  function handleMapClick() {
    // Show Campaign Selector
    if (!campaignSlug) {
      setShowCampaignSelector(true);
    }
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
    <App pageTitle='Welcome' hideFooter>
      <HomeWrapper>
        <Introduction />
        <Modal
          id='introExpanded'
          revealed={showCampaignSelector}
          onCloseClick={() => setShowCampaignSelector(false)}
          headerComponent={<ModalHeader>Select a city</ModalHeader>}
          bodyComponent={<ModalBody>{renderCampaigns()}</ModalBody>}
        />
        <FakeMap as={StyledLink} onClick={() => handleMapClick()}>
          <h4>Click the map to start exploring</h4>
        </FakeMap>
      </HomeWrapper>
    </App>
  );
}

if (environment !== 'production') {
  Home.propTypes = {
    campaigns: T.object,
    fetchCampaigns: T.func,
    match: T.object
  };
}

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, dispatcher)(withRouter(Home));
