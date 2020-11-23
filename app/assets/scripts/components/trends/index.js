import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';
import get from 'lodash.get';

import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/trends';
import { fetchCampaigns } from '../../redux/actions/campaigns';
import { NavLink } from 'react-router-dom';
import { filterComponentProps } from '../../utils';

import App from '../common/app';

import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { LinearGradient } from '@vx/gradient';
import { StyledLink } from '../common/link';
import Dropdown, {
  DropMenu,
  DropMenuItem
} from '../common/dropdown';
import withMobileState from '../common/with-mobile-state';
import { headingAlt } from '../../styles/type/heading';
import { InnerPanel, Panel, PanelStats, PanelStat } from '../../styles/panel';
import Button from '../../styles/button/button';
import ButtonCaret from '../../styles/button/button-caret';
import { themeVal } from '../../styles/utils/general';
import { multiply } from '../../styles/utils/math';
import DataTable, { ScrollWrap } from '../../styles/table';
import { round, formatThousands } from '../../utils/utils';
import media from '../../styles/utils/media-queries';

const glSp = themeVal('layout.space');

const PlaceTrends = styled.div`
  p {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  & ~ svg {
    align-self: center;
    margin: 1rem 0;
    text {
      fill: ${themeVal('color.base')};
      font-weight: ${themeVal('type.base.bold')};
      font-size: 2rem;
    }
  }
`;

const TwoPanelLayout = styled(Panel)`
  ${InnerPanel} {
    h2 {
      margin-bottom: 1rem;
    }
    margin: 0;
    &:not(:last-of-type) {
      margin-bottom: 2rem;
    }
  }
  ${media.mediumUp`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 2rem;
    height: 100vh;
    overflow: hidden;
    ${InnerPanel} {
      &:not(:last-of-type) {
        margin-bottom: 0;
      }
    }
  `};
`;

const TrendsTitle = styled.h1`
  margin: 0 -${glSp} ${multiply(glSp, 2)} -${glSp};
`;

const TrendsButton = styled(ButtonCaret)`
  max-width: 100%;
  align-self: baseline;
  font-family: ${themeVal('type.base.family')};
  font-size: 1.5rem;
  line-height: 2.5rem;
  text-align: left;
  text-transform: none;
  letter-spacing: none;
`;

const TrendsButtonLabel = styled.small`
  ${headingAlt()}
  align-self: baseline;
  color: ${themeVal('color.baseMed')};
  line-height: 0.875rem;
`;

const TrendMenuItem = styled(DropMenuItem)`
  text-decoration: none;
`;

const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const NavLinkFilter = filterComponentProps(NavLink, propsToFilter);

class Trends extends React.Component {
  constructor () {
    super();
    this.topSurveyors = React.createRef();
    this.cityTrends = React.createRef();
    this.renderCampaignSelect = this.renderCampaignSelect.bind(this);
    this.dropdownRef = React.createRef();
  }

  componentDidMount() {
    this.props.fetchCampaigns();

    // In case campaigns were already loaded ib another page,
    // update stats
    if (this.props.campaigns.isReady()) {
      this.updateStats();
    }
  }

  componentDidUpdate(prevProps) {
    const campaignSlug = get(this.props, 'match.params.campaignSlug');
    const prevCampaignSlug = get(prevProps, 'match.params.campaignSlug');
    const { campaigns } = this.props;

    // When campaigns are loaded or campaign slug has changed, update stats
    if (
      (!prevProps.campaigns.isReady() && campaigns.isReady()) ||
      (campaigns.isReady() && prevCampaignSlug !== campaignSlug)
    ) {
      this.updateStats();
    }
  }

  updateStats() {
    // Get data
    const {
      campaigns,
      match: {
        params: { campaignSlug }
      }
    } = this.props;

    if (campaignSlug) {
      const allCampaigns = campaigns.getData();
      const campaign = allCampaigns[campaignSlug];
      this.props.fetchStats(campaign.id);
      this.props.fetchTopSurveyors(campaign.id);
    } else {
      this.props.fetchStats();
      this.props.fetchTopSurveyors();
    }
  }

  scroll (ref) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  renderTopSurveyors () {
    const { topSurveyors } = this.props;

    if (!topSurveyors.isReady()) return null;
    if (topSurveyors.hasError()) {
      return <div>There was an error loading top surveyors.</div>;
    }

    const data = topSurveyors.getData();

    return (
      <>
        <h2>Top Surveyors</h2>
        <ScrollWrap>
          <DataTable fixedHeader>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Surveyor</th>
                <th>Surveys</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={s.osmId}>
                  <td>{i + 1}</td>
                  <td>
                    <StyledLink to={`/users/${s.id}`}>
                      {s.displayName}
                    </StyledLink>
                  </td>
                  <td>{s.observations}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </ScrollWrap>
      </>
    );
  }

  renderCampaignSelect() {
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
    // if (!campaign) return <></>;

    return (
      <React.Fragment>
        <TrendsButtonLabel>Select City</TrendsButtonLabel>
        <TrendsTitle>
          <Dropdown
            ref={this.dropdownRef}
            alignment='right'
            direction='down'
            triggerElement={(props) => (
              <TrendsButton
                element='a'
                title='Open dropdown'
                {...props}
              >
                {campaign ? campaign.name : 'All PlasticWatch Cities'}
              </TrendsButton>
            )}
          >
            <DropMenu>
              {Object.keys(allCampaigns).map((cSlug) => {
                const c = allCampaigns[cSlug];
                if (cSlug !== campaignSlug) {
                  return (
                    <TrendMenuItem
                      as={NavLinkFilter}
                      key={cSlug}
                      to={`/trends/${c.slug}`}
                      data-tip={`View ${c.name} trends`}
                      onClick={() => this.dropdownRef.current.close()}
                    >
                      {c.name}
                    </TrendMenuItem>
                  );
                }
              })}
            </DropMenu>
          </Dropdown>
        </TrendsTitle>
      </React.Fragment>
    );
  }

  render () {
    const { stats, isMobile } = this.props;

    if (!stats.isReady()) return <div />;

    const {
      placesCount,
      nonPlasticPlacesCount,
      surveyedPlacesCount,
      surveyorsCount
    } = stats.getData();

    const percentSurveyed =
      surveyedPlacesCount > 0
        ? round((surveyedPlacesCount / placesCount) * 100, 1)
        : 0;
    const percentNonPlastic =
      surveyedPlacesCount > 0
        ? round((nonPlasticPlacesCount / surveyedPlacesCount) * 100, 1)
        : 0;

    const barHeight = 20;
    const pieSize = 200;
    const piePadding = 10;
    const pieData = [
      {
        label: 'plastic',
        color: '#EDEDED',
        value: 100 - percentNonPlastic
      },
      {
        label: 'non-plastic',
        color: "url('#gradient')",
        value: percentNonPlastic
      }
    ];
    const radius = (pieSize - 2 * piePadding) / 2;
    const thickness = 25;

    return (
      <App pageTitle='Trends'>
        <TwoPanelLayout>
          <InnerPanel ref={this.cityTrends}>
            <PlaceTrends>
              {this.renderCampaignSelect()}
              <p>
                <strong>{formatThousands(surveyedPlacesCount)}</strong>&nbsp;
                restaurants surveyed
              </p>
              <svg width='100%' height={barHeight}>
                <rect
                  x={0}
                  y={0}
                  width='100%'
                  height={barHeight}
                  fill='#D8D8D8'
                  rx={2}
                />
                <rect
                  x={0}
                  y={0}
                  width={`${percentSurveyed}%`}
                  height={barHeight}
                  fill='#00A3DA'
                  rx={2}
                />
              </svg>
              <p>
                {percentSurveyed}% of &nbsp;
                {formatThousands(placesCount)} restaurants imported from
                OpenStreetMap
              </p>
            </PlaceTrends>
            <svg width={pieSize} height={pieSize}>
              <LinearGradient id='gradient' from='#01A1D7' to='#104271' />;
              <Group top={pieSize / 2} left={pieSize / 2}>
                <text textAnchor='middle' y='0.5em'>
                  {round(percentNonPlastic)}%
                </text>
                <Pie
                  data={pieData}
                  pieValue={(d) => d.value}
                  cornerRadius={3}
                  padAngle={0}
                  fillOpacity={0.8}
                  outerRadius={radius}
                  innerRadius={radius - thickness}
                >
                  {(pie) => {
                    return pie.arcs.map((arc, i) => {
                      return (
                        <g key={`letters-${arc.data.label}`}>
                          <path
                            className='slice'
                            d={pie.path(arc)}
                            fill={arc.data.color}
                          />
                        </g>
                      );
                    });
                  }}
                </Pie>
              </Group>
            </svg>
            <p>
              {formatThousands(nonPlasticPlacesCount)} of&nbsp;
              {formatThousands(surveyedPlacesCount)}
              &nbsp; surveyed restaurants offer plastic-free
              options.
            </p>
            <PanelStats>
              <PanelStat>
                {formatThousands(surveyedPlacesCount)}
                <span>
                  Restaurants
                  <br />
                  Surveyed
                </span>
              </PanelStat>
              <PanelStat>
                {formatThousands(surveyorsCount)}
                <span>Surveyors</span>
              </PanelStat>
              <PanelStat>
                {formatThousands(placesCount - surveyedPlacesCount)}
                <span>
                  Restaurants to
                  <br />
                  Survey
                </span>
              </PanelStat>
            </PanelStats>
            <Button
              useIcon='map'
              variation='base-raised-dark'
              as={StyledLink}
              to='/explore'
            >
              Show me the map
            </Button>
            {isMobile && (
              <Button
                useIcon={['chevron-down--small', 'after']}
                variation='primary-raised-light'
                onClick={() => {
                  this.scroll(this.topSurveyors);
                }}
              >
                Surveyor Trends
              </Button>
            )}
          </InnerPanel>
          <InnerPanel ref={this.topSurveyors}>
            {this.renderTopSurveyors()}
            {isMobile && (
              <Button
                useIcon={['chevron-up--small', 'after']}
                variation='primary-raised-light'
                onClick={() => {
                  this.scroll(this.cityTrends);
                }}
              >
                City Trends
              </Button>
            )}
          </InnerPanel>
        </TwoPanelLayout>
      </App>
    );
  }
}

if (environment !== 'production') {
  Trends.propTypes = {
    stats: T.object,
    topSurveyors: T.object,
    fetchCampaigns: T.func,
    fetchStats: T.func,
    fetchTopSurveyors: T.func,
    isMobile: T.bool,
    campaigns: T.object,
    match: T.object
  };
}

function mapStateToProps (state) {
  return {
    stats: wrapApiResult(getFromState(state, `trends.stats`)),
    topSurveyors: wrapApiResult(getFromState(state, `trends.topSurveyors`)),
    campaigns: wrapApiResult(getFromState(state, 'campaigns'))
  };
}

function dispatcher (dispatch) {
  return {
    fetchCampaigns: (...args) => dispatch(fetchCampaigns(...args)),
    fetchStats: (...args) => dispatch(actions.fetchStats(...args)),
    fetchTopSurveyors: (...args) =>
      dispatch(actions.fetchTopSurveyors(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Trends));
