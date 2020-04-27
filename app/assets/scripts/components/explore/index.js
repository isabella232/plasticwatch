/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { Route } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import QsState from '../../utils/qs-state';
import { environment } from '../../config';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import * as placesActions from '../../redux/actions/places';
import * as exploreActions from '../../redux/actions/explore';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';
import withMobileState from '../common/with-mobile-state';
import { wrapApiResult, getFromState } from '../../redux/utils';

const qsState = new QsState({
  viewAs: {
    accessor: 'viewAs'
  },
  placeType: {
    accessor: 'filterValues.placeType'
  },
  search: {
    accessor: 'filterValues.search'
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

class Explore extends React.Component {
  async componentDidUpdate (prevProps) {
    const { queryParams, mapViewport, places } = this.props;

    // Start a new data fetch if viewport or query params changed
    if (
      mapViewport &&
      mapViewport.bounds &&
      !places.fetching &&
      (!isEqual(prevProps.mapViewport, mapViewport) ||
        !isEqual(prevProps.queryParams, queryParams))
    ) {
      await this.props.updatePlacesList();

      // Then update querystring
      const qString = qsState.getQs({
        ...mapViewport,
        ...queryParams
      });
      this.props.history.push({ search: qString });
    }
  }

  handleFilterChangeSubmit () {
    const qString = qsState.getQs(this.state);
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
    const { location, isMobile, match } = this.props;

    // Always display map on desktop. On mobile, display map only when param
    // 'viewAs=list' is not set and route is '/explore'.
    let displayMap = false;
    if (!isMobile) {
      displayMap = true;
    } else if (
      match.path === '/explore' &&
      location.search.indexOf('viewAs=list') === -1
    ) {
      displayMap = true;
    }

    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Route exact path='/explore'>
            <PlacesIndex handleFilterChange={this.handleFilterChange} />
          </Route>
          <Route exact path='/explore/:type/:id' component={PlacesView} />
          <Route
            exact
            path='/explore/:type/:id/survey'
            component={PlaceSurvey}
          />
          {displayMap && <Map />}
        </SidebarWrapper>
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    history: T.object,
    isMobile: T.bool,
    location: T.object,
    mapViewport: T.object,
    match: T.object,
    places: T.object,
    queryParams: T.object,
    updatePlacesList: T.func
  };
}

function mapStateToProps (state, props) {
  return {
    queryParams: getFromState(state, `explore.queryParams`),
    mapViewport: getFromState(state, `explore.mapViewport`),
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

function dispatcher (dispatch) {
  return {
    updatePlacesList: (...args) =>
      dispatch(placesActions.updatePlacesList(...args)),
    fetchPlacesTile: (...args) =>
      dispatch(placesActions.fetchPlacesTile(...args)),
    updateQueryParams: (...args) =>
      dispatch(exploreActions.updateQueryParams(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Explore));
