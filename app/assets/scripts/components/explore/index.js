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
import Map from './map';
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
    accessor: 'placeType'
  },
  placeName: {
    accessor: 'placeName'
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
  componentDidMount () {
    const qs = this.props.location.search.substr(1);
    if (!qs) {
      // If no query string is provided, build one from app state
      this.updateQuerystring();
    } else {
      // Or update the state with the query string passed
      const { placeName, placeType, zoom, lng, lat } = qsState.getState(
        this.props.location.search.substr(1)
      );
      this.props.updateFiltersAndMapViewport({
        filters: {
          placeName,
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

  async componentDidUpdate (prevProps) {
    const { mapViewport, filters, places } = this.props;

    // Start a new data fetch if viewport or filters have changed
    if (
      mapViewport &&
      mapViewport.bounds &&
      !places.fetching &&
      (!isEqual(prevProps.mapViewport, mapViewport) ||
        !isEqual(prevProps.filters, filters))
    ) {
      await this.props.updatePlacesList();

      this.updateQuerystring();
    }
  }

  updateQuerystring () {
    const { mapViewport, filters } = this.props;

    // Then update querystring
    const qString = qsState.getQs({
      ...mapViewport,
      ...filters
    });
    this.props.history.push({ search: qString });
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
          <Route exact path='/explore' component={PlacesIndex} />
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
    filters: T.object,
    updatePlacesList: T.func,
    updateFiltersAndMapViewport: T.func
  };
}

function mapStateToProps (state, props) {
  return {
    filters: getFromState(state, `explore.filters`),
    mapViewport: getFromState(state, `explore.mapViewport`),
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

function dispatcher (dispatch) {
  return {
    updatePlacesList: (...args) =>
      dispatch(placesActions.updatePlacesList(...args)),
    updateFiltersAndMapViewport: (...args) =>
      dispatch(exploreActions.updateFiltersAndMapViewport(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Explore));
