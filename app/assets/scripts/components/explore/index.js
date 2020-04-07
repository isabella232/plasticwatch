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
      bounds: {
        accessor: 'bounds',
        default: mapConfig.defaultInitialBounds
      }
    });

    this.state = this.qsState.getState(this.props.location.search.substr(1));

    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this);
    this.handleMapMove = this.handleMapMove.bind(this);
  }

  async componentDidMount () {
    // This would load all tiles in the view port
    this.props.updatePlacesList(mapConfig.defaultInitialBounds);
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const newState = this.qsState.getState(
        this.props.location.search.substr(1)
      );
      this.setState(newState, () => {
        const { bounds, filterValues } = newState;
        this.props.updatePlacesList(bounds, filterValues);
      });
    }
  }

  async fetchData () {
    // Get query params from state
    const { filterValues } = this.qsState.getState(
      this.props.location.search.substr(1)
    );

    await this.props.fetchPlaces(filterValues);
  }

  async handleMapMove (bounds) {
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

  handleFilterTypeChange (placeType) {
    const { filterValues } = this.state;
    let newValue;

    if (!filterValues || filterValues.placeType !== placeType) {
      newValue = placeType;
    } else {
      newValue = null;
    }

    // Set new filter type, if type is already set, disable it
    this.setState(
      {
        ...this.state,
        filterValues: {
          ...filterValues,
          placeType: newValue
        }
      },
      this.handleFilterChangeSubmit
    );
  }

  render () {
    const { location, isMobile } = this.props;

    const displayMap =
      !isMobile || (location && location.search.indexOf('viewAs=list') === -1);
    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Route exact path='/explore'>
            <PlacesIndex
              handleFilterTypeChange={this.handleFilterTypeChange}
              filterValues={this.state.filterValues}
            />
          </Route>
          <Route exact path='/explore/:type/:id' component={PlacesView} />
          <Route
            exact
            path='/explore/:type/:id/survey'
            component={PlaceSurvey}
          />
          {displayMap && <Map handleMapMove={this.handleMapMove} />}
        </SidebarWrapper>
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    history: T.object,
    updatePlacesList: T.func,
    fetchPlaces: T.func,
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
    fetchPlacesTile: (...args) => dispatch(actions.fetchPlacesTile(...args)),
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(withMobileState(Explore));
