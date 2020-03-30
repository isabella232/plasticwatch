import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/trends';

import App from '../common/app';

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
  }
`;

const TwoPanelLayout = styled(Panel)`
  ${InnerPanel} {
    margin: 0;
    justify-content: flex-start;
    height: calc(100vh - 8rem);
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
  componentDidMount () {
    this.props.fetchStats();
    this.props.fetchTopSurveyors();
  }

  renderTopSurveyors () {
    const { topSurveyors } = this.props;

    if (!topSurveyors.isReady()) return <div>Loading...</div>;
    if (topSurveyors.hasError()) { return <div>There was an error loading top surveyors.</div>; }

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
    const { stats } = this.props;

    if (!stats.isReady()) return null;

    const {
      placesCount,
      nonPlasticPlacesCount,
      surveyedPlacesCount,
      surveyorsCount
    } = stats.getData();

    const percentSurveyed = round((surveyedPlacesCount / placesCount) * 100, 1);
    const percentNonPlastic = round((nonPlasticPlacesCount / surveyedPlacesCount) * 100, 1);

    const barHeight = 20;

    return (
      <App pageTitle='Trends'>
        <TwoPanelLayout>
          <InnerPanel>
            <PlaceTrends>
              <h2>Washington DC</h2>
              <p>{formatThousands(surveyedPlacesCount)} restaurants surveyed</p>
              <svg width='100%' height={barHeight}>
                <rect x={0} y={0} width='100%' height={barHeight} fill='#D8D8D8' rx={2} />
                <rect x={0} y={0} width={`${percentSurveyed}%`} height={barHeight} fill='#00A3DA' rx={2} />
              </svg>
              <p>
                {percentSurveyed}% of {formatThousands(placesCount)} restaurants on
                OpenStreetMap
              </p>
            </PlaceTrends>
            <h3>{percentNonPlastic}%</h3>
            <p>
              {formatThousands(nonPlasticPlacesCount)} Surveyed Washington DC Restaurants offer plastic-free options
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
            <Button useIcon='map' variation='base-raised-dark'>
              Show me the map
            </Button>
          </InnerPanel>
          <InnerPanel>{this.renderTopSurveyors()}</InnerPanel>
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
    fetchTopSurveyors: T.func
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

export default connect(mapStateToProps, dispatcher)(Trends);
