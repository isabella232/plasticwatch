/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { Route } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import QsState from '../../utils/qs-state';
import { environment, mapConfig } from '../../config';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/places';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';
import withMobileState from '../common/with-mobile-state';
import { wrapApiResult, getFromState } from '../../redux/utils';

class Explore extends React.Component {
  constructor (props) {
    super(props);

    // Setup the qsState for url state management.
    this.qsState = new QsState({
      viewAs: {
        accessor: 'viewAs'
      },
      placeType: {
        accessor: 'filterValues.placeType'
      },
      search: {
        accessor: 'filterValues.search'
      },
      bounds: {
        accessor: 'bounds'
      }
    });

    this.state = this.qsState.getState(this.props.location.search.substr(1));

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.updateBoundsQuerystring = this.updateBoundsQuerystring.bind(this);
  }

  async componentDidMount () {
    // If bounds querystring is not already set, apply defaults
    if (!this.state.bounds) {
      this.updateQuerystring(mapConfig.defaultInitialBounds);
    } else {
      this.fetchData();
    }
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      await this.fetchData();
    }
  }

  async fetchData () {
    // Get query params from state
    const { filterValues, bounds } = this.qsState.getState(
      this.props.location.search.substr(1)
    );

    await this.props.updatePlacesList(bounds, filterValues);
  }

  async updateBoundsQuerystring (bounds) {
    const qString = this.qsState.getQs({
      ...this.state,
      bounds
    });
    this.props.history.push({ search: qString });
  }

  handleFilterChangeSubmit () {
    const qString = this.qsState.getQs(this.state);
    this.props.history.push({ search: qString });
  }

  handleFilterChange (filter, value) {
    const { filterValues } = this.state;
    let newValue;

    // As "placeType" filter is boolean, this will set it as null if value
    // passed is the same, which means the user has clicked an active button
    if (!filterValues || filterValues.placeType !== value) {
      newValue = value;
    } else {
      newValue = null;
    }

    // Set new filter value
    this.setState(
      {
        ...this.state,
        filterValues: {
          ...filterValues,
          [filter]: newValue
        }
      },
      this.handleFilterChangeSubmit
    );
  }

  render () {
    const { location, isMobile } = this.props;
    const { bounds } = this.state;

    const displayMap =
      !isMobile || (location && location.search.indexOf('viewAs=list') === -1);
    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Route exact path='/explore'>
            <PlacesIndex
              handleFilterChange={this.handleFilterChange}
              filterValues={this.state.filterValues}
            />
          </Route>
          <Route exact path='/explore/:type/:id' component={PlacesView} />
          <Route
            exact
            path='/explore/:type/:id/survey'
            component={PlaceSurvey}
          />
          {displayMap && (
            <Map
              handleMapMove={this.updateBoundsQuerystring}
              initialBounds={bounds}
            />
          )}
        </SidebarWrapper>
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    history: T.object,
    updatePlacesList: T.func,
    location: T.object,
    isMobile: T.bool
  };
}

function mapStateToProps (state, props) {
  return {
    getTile: (id) => wrapApiResult(getFromState(state, `places.tiles.${id}`))
  };
}

function dispatcher (dispatch) {
  return {
    updatePlacesList: (...args) => dispatch(actions.updatePlacesList(...args)),
    fetchPlacesTile: (...args) => dispatch(actions.fetchPlacesTile(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Explore));
