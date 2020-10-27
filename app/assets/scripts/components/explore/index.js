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

class Explore extends React.Component {
  componentDidMount () {
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
    const { isMobile, activeMobileTab } = this.props;

    let displayMap = true;
    if (isMobile && activeMobileTab !== 'map') displayMap = false;

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
    activeMobileTab: T.string,
    history: T.object,
    isMobile: T.bool,
    location: T.object,
    mapViewport: T.object,
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
    activeMobileTab: getFromState(state, `explore.activeMobileTab`),
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
