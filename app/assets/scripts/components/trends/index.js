import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/trends';
import { fetchCampaigns } from '../../redux/actions/campaigns';

import App from '../common/app';

import UhOh from '../uhoh';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { LinearGradient } from '@vx/gradient';
import { StyledLink } from '../common/link';
import withMobileState from '../common/with-mobile-state';
import { InnerPanel, Panel, PanelStats, PanelStat } from '../../styles/panel';
import Button from '../../styles/button/button';
import { themeVal } from '../../styles/utils/general';
import DataTable, { ScrollWrap } from '../../styles/table';
import { round, formatThousands } from '../../utils/utils';
import media from '../../styles/utils/media-queries';
import { Modal, ModalHeader, ModalBody } from '../common/modal';

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

function Trends(props) {
  const { campaigns, topSurveyors, stats, isMobile } = props;
  const {
    params: { campaignSlug }
  } = props.match;

  const [showCampaignSelector, setShowCampaignSelector] = useState(false);
  const topSurveyorsRef = React.createRef();
  const cityTrendsRef = React.createRef();
  useEffect(() => {
    props.fetchStats();
    props.fetchTopSurveyors();
    props.fetchCampaigns();
  }, []);

  function scroll(ref) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  function renderTopSurveyors () {
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
        <InnerPanel ref={cityTrendsRef}>
          <PlaceTrends>
            <h2>All cities</h2>
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
            onClick={() => handleMapClick()}
          >
            Show me the map
          </Button>
          <Modal
            id='introExpanded'
            revealed={showCampaignSelector}
            onCloseClick={() => setShowCampaignSelector(false)}
            headerComponent={<ModalHeader>Select a city</ModalHeader>}
            bodyComponent={<ModalBody>{renderCampaigns()}</ModalBody>}
          />
          {isMobile && (
            <Button
              useIcon={['chevron-down--small', 'after']}
              variation='primary-raised-light'
              onClick={() => {
                scroll(topSurveyorsRef);
              }}
            >
              Surveyor Trends
            </Button>
          )}
        </InnerPanel>
        <InnerPanel ref={topSurveyorsRef}>
          {renderTopSurveyors()}
          {isMobile && (
            <Button
              useIcon={['chevron-up--small', 'after']}
              variation='primary-raised-light'
              onClick={() => {
                scroll(cityTrendsRef);
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

if (environment !== 'production') {
  Trends.propTypes = {
    stats: T.object,
    topSurveyors: T.object,
    fetchStats: T.func,
    fetchTopSurveyors: T.func,
    isMobile: T.bool,
    campaigns: T.object,
    fetchCampaigns: T.func,
    match: T.object
  };
}

function mapStateToProps (state) {
  return {
    stats: wrapApiResult(getFromState(state, `trends.stats`)),
    topSurveyors: wrapApiResult(getFromState(state, `trends.topSurveyors`)),
    campaigns: wrapApiResult(state.campaigns)
  };
}

function dispatcher (dispatch) {
  return {
    fetchStats: (...args) => dispatch(actions.fetchStats(...args)),
    fetchTopSurveyors: (...args) =>
      dispatch(actions.fetchTopSurveyors(...args)),
    fetchCampaigns: (...args) => dispatch(fetchCampaigns(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Trends));
