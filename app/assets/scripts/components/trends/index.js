import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/trends';

import App from '../common/app';

import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { LinearGradient } from '@vx/gradient';
import { StyledLink } from '../common/link';
import withMobileState from '../common/with-mobile-state';
import { InnerPanel, Panel } from '../../styles/panel';
import Button from '../../styles/button/button';
import { themeVal } from '../../styles/utils/general';
import DataTable, { ScrollWrap } from '../../styles/table';
import { round, formatThousands } from '../../utils/utils';
import media from '../../styles/utils/media-queries';

const PanelStats = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 2rem auto;
`;

const PanelStat = styled.h2`
  display: flex;
  flex-flow: column wrap;
  &:not(:last-child) {
    border-right: 1px solid ${themeVal('color.shadow')};
    margin-right: ${themeVal('layout.space')};
    padding-right: ${themeVal('layout.space')};
  }
  span {
    color: ${themeVal('color.baseLight')};
    font-size: 0.75rem;
    text-transform: uppercase;
  }
`;

const PlaceTrends = styled.div`
  p {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  & ~ svg {
    align-self: center;

    text {
      fill: ${themeVal('color.base')};
      font-weight: ${themeVal('type.base.bold')};
      font-size: 2rem;
    }
  }
`;

const TwoPanelLayout = styled(Panel)`
  ${InnerPanel} {
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

class Trends extends React.Component {
  constructor () {
    super();
    this.topSurveyors = React.createRef();
    this.cityTrends = React.createRef();
  }

  componentDidMount () {
    this.props.fetchStats();
    this.props.fetchTopSurveyors();
  }

  scroll (ref) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  renderTopSurveyors () {
    const { topSurveyors } = this.props;

    if (!topSurveyors.isReady()) return <div>Loading...</div>;
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
                  <td>{s.osmDisplayName}</td>
                  <td>{s.observations}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </ScrollWrap>
      </>
    );
  }

  render () {
    const { stats, isMobile } = this.props;

    if (!stats.isReady()) return null;

    const {
      placesCount,
      nonPlasticPlacesCount,
      surveyedPlacesCount,
      surveyorsCount
    } = stats.getData();

    const percentSurveyed = round((surveyedPlacesCount / placesCount) * 100, 1);
    const percentNonPlastic = round(
      (nonPlasticPlacesCount / surveyedPlacesCount) * 100,
      1
    );

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
              <h2>Washington DC</h2>
              <p>
                <strong>{formatThousands(surveyedPlacesCount)}</strong> restaurants surveyed
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
                <strong>{percentSurveyed}%</strong> of {formatThousands(placesCount)} Washington DC restaurants on
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
                  pieValue={d => d.value}
                  cornerRadius={3}
                  padAngle={0}
                  fillOpacity={0.8}
                  outerRadius={radius}
                  innerRadius={radius - thickness}
                >
                  {pie => {
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
              <strong>
                {round(percentNonPlastic)}% (
                {formatThousands(nonPlasticPlacesCount)} of ß{formatThousands(surveyedPlacesCount)})
              </strong> of surveyed Washington DC restaurants offer plastic-free options
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
    fetchStats: T.func,
    fetchTopSurveyors: T.func,
    isMobile: T.bool
  };
}

function mapStateToProps (state) {
  return {
    stats: wrapApiResult(getFromState(state, `trends.stats`)),
    topSurveyors: wrapApiResult(getFromState(state, `trends.topSurveyors`))
  };
}

function dispatcher (dispatch) {
  return {
    fetchStats: (...args) => dispatch(actions.fetchStats(...args)),
    fetchTopSurveyors: (...args) => dispatch(actions.fetchTopSurveyors(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Trends));
