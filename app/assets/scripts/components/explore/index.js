/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import QsState from '../../utils/qs-state';
import { environment } from '../../config';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import * as placesActions from '../../redux/actions/places';
import * as exploreActions from '../../redux/actions/explore';
import { fetchCampaigns } from '../../redux/actions/campaigns';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Dropdown, {
  DropTitle,
  DropMenu,
  DropMenuItem
} from '../common/dropdown';
import Button from '../../styles/button/button';
import { StyledLink } from '../common/link';
import UhOh from '../uhoh';

import Map from './map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';
import withMobileState from '../common/with-mobile-state';
import { wrapApiResult, getFromState } from '../../redux/utils';

export const qsState = new QsState({
  viewAs: {
    accessor: 'viewAs'
  },
  placeType: {
    accessor: 'placeType'
  },
  searchString: {
    accessor: 'searchString'
  },
  zoom: {
    accessor: 'zoom'
  },
  lng: {
    accessor: 'lng'
  },
  lat: {
    accessor: 'lat'
  }
});

const CampaignToolbar = styled.div`
  display: flex;
  align-items: baseline;
  padding-top: 1rem;
  padding-left: 1rem;
  font-size: 0.875rem;
  background: #edf6fb;
  ${({ displayMap }) => displayMap &&
    `position: absolute;
    padding: 0.75rem 0.5rem 0.5rem;
    width: 75%
    background: linear-gradient(90deg, white 30%, transparent);
    `
}
`;

const CampaignMenuItem = styled(DropMenuItem)`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  text-decoration: none;
`;

class Explore extends React.Component {
  constructor() {
    super();
    this.dropdownRef = React.createRef();
  }

  async componentDidMount() {
    await this.props.fetchCampaigns();

    const { hasError } = this.props.campaigns;
    if (hasError()) return;

    const qs = this.props.location.search.substr(1);
    if (!qs) {
      // If no query string is provided, build one from app state
      this.updateQuerystring();
    } else {
      // Or update the state with the query string passed
      const { searchString, placeType, zoom, lng, lat } = qsState.getState(
        this.props.location.search.substr(1)
      );
      this.props.updateFiltersAndMapViewport({
        filters: {
          searchString,
          placeType
        },
        mapViewport: {
          zoom,
          lng,
          lat
        }
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { mapViewport, filters, places } = this.props;

    // Start a new data fetch if viewport or filters have changed
    if (
      !places.fetching &&
      (!isEqual(prevProps.mapViewport, mapViewport) ||
        !isEqual(prevProps.filters, filters))
    ) {
      // Do not query tiles if mapViewport bounds isn't available.
      if (mapViewport.bounds) {
        await this.props.updatePlacesList();
      }

      this.updateQuerystring();
    }
  }

  updateQuerystring() {
    const { mapViewport, filters } = this.props;

    // Then update querystring
    const qString = qsState.getQs({
      ...mapViewport,
      ...filters
    });
    this.props.history.push({ search: qString });
  }

  renderCampaignSelector(displayMap) {
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
      <CampaignToolbar displayMap={displayMap}>
        <p>CITY:</p>
        <Dropdown
          ref={this.dropdownRef}
          alignment='left'
          direction='down'
          triggerElement={(props) => (
            <Button
              variation='primary-plain'
              size='small'
              useIcon={['chevron-down--small', 'after']}
              title='Open dropdown'
              {...props}
            >
              {campaign.name}
            </Button>
          )}
        >
          <React.Fragment>
            <DropTitle>Select city</DropTitle>
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
      </CampaignToolbar>
    );
  }

  render() {
    const { isMobile, activeMobileTab, campaigns } = this.props;

    const {
      params: { campaignSlug }
    } = this.props.match;

    if (!campaigns.isReady()) {
      return <></>;
    }

    if (
      campaigns.hasError() ||
      !campaignSlug ||
      typeof campaigns.getData()[campaignSlug] === 'undefined'
    ) {
      return <UhOh />;
    }

    let displayMap = true;
    if (isMobile && activeMobileTab !== 'map') displayMap = false;

    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          {isMobile && this.renderCampaignSelector(displayMap)}
          <Route exact path='/explore/:campaignSlug' component={PlacesIndex} />
          <Route
            exact
            path='/explore/:campaignSlug/:type/:id'
            component={PlacesView}
          />
          <Route
            exact
            path='/explore/:campaignSlug/:type/:id/survey'
            component={PlaceSurvey}
          />
          {displayMap && <Map isMobile={isMobile} />}
        </SidebarWrapper>
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    activeMobileTab: T.string,
    campaigns: T.object,
    fetchCampaigns: T.func,
    history: T.object,
    isMobile: T.bool,
    location: T.object,
    mapViewport: T.object,
    match: T.object,
    places: T.object,
    filters: T.object,
    updatePlacesList: T.func,
    updateFiltersAndMapViewport: T.func
  };
}

function mapStateToProps(state, props) {
  return {
    filters: getFromState(state, `explore.filters`),
    mapViewport: getFromState(state, `explore.mapViewport`),
    activeMobileTab: getFromState(state, `explore.activeMobileTab`),
    places: wrapApiResult(getFromState(state, `places.list`)),
    campaigns: wrapApiResult(state.campaigns)
  };
}

function dispatcher(dispatch) {
  return {
    fetchCampaigns: (...args) => dispatch(fetchCampaigns(...args)),
    updatePlacesList: (...args) =>
      dispatch(placesActions.updatePlacesList(...args)),
    updateFiltersAndMapViewport: (...args) =>
      dispatch(exploreActions.updateFiltersAndMapViewport(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Explore));
