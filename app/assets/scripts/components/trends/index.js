import React from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../config';

import { connect } from 'react-redux';
import { wrapApiResult, getFromState } from '../../redux/utils';
import * as actions from '../../redux/actions/places';

import App from '../common/app';
import { InnerPanel, Panel } from '../../styles/panel';
import Button from '../../styles/button/button';
import { themeVal } from '../../styles/utils/general';
import DataTable from '../../styles/table';
import { round } from '../../utils/utils';
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
  `};
`;

class Trends extends React.Component {
  componentDidMount () {
    this.props.fetchPlacesStats();
  }

  render () {
    const { stats } = this.props;

    if (!stats.isReady()) return null;

    const {
      placesCount,
      surveyedPlacesCount,
      surveyorsCount
    } = stats.getData();

    const percentSurveyed = round((surveyedPlacesCount / placesCount) * 100, 1);

    return (
      <App pageTitle='Trends'>
        <TwoPanelLayout>
          <InnerPanel>
            <h2>Washington DC</h2>
            <p>{percentSurveyed}% restaurants surveyed</p>
            <p>
              {surveyedPlacesCount} of {placesCount} restaurants on
              OpenStreetMap
            </p>
            <h3>XX%</h3>
            <p>
              XXXX Surveyed Washington DC Restaurants offer plastic-free
              options
            </p>
            <PanelStats>
              <PanelStat>
                {surveyedPlacesCount}
                <span>
                  Restaurants
                  <br />
                  Surveyed
                </span>
              </PanelStat>
              <PanelStat>
                {surveyorsCount}
                <span>Surveyors</span>
              </PanelStat>
              <PanelStat>
                {placesCount - surveyedPlacesCount}
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
          <InnerPanel>
            <h2>Top Surveyors</h2>
            <DataTable>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Surveyor</th>
                  <th>Surveys</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Bob Smith</td>
                  <td>24</td>
                  <td>
                    <Button
                      size='small'
                      variation='base-plain'
                      useIcon='trash-bin'
                      hideText
                      title='Remove user'
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jane Good</td>
                  <td>19</td>
                  <td>
                    <Button
                      size='small'
                      variation='base-plain'
                      useIcon='trash-bin'
                      hideText
                      title='Remove user'
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Matt Park</td>
                  <td>12</td>
                  <td>
                    <Button
                      size='small'
                      variation='base-plain'
                      useIcon='trash-bin'
                      hideText
                      title='Remove user'
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              </tbody>
            </DataTable>
          </InnerPanel>
        </TwoPanelLayout>
      </App>
    );
  }
}

if (environment !== 'production') {
  Trends.propTypes = {
    stats: T.object,
    fetchPlacesStats: T.func
  };
}

function mapStateToProps (state) {
  return {
    stats: wrapApiResult(getFromState(state, `places.stats`))
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlacesStats: (...args) => dispatch(actions.fetchPlacesStats(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(Trends);
