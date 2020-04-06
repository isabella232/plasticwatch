/* eslint-disable react/no-access-state-in-setstate */
import React from 'react';
import { Route } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import QsState from '../../utils/qs-state';
import { environment } from '../../config';
import { connect } from 'react-redux';

import * as actions from '../../redux/actions/places';

import App from '../common/app';
import { SidebarWrapper } from '../common/view-wrappers';
import Map from '../common/map';
import PlacesIndex from './places';
import PlacesView from './places/view';
import PlaceSurvey from './places/survey';

class Explore extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};

    // Setup the qsState for url state management.
    this.qsState = new QsState({
      placeType: {
        accessor: 'filterValues.placeType'
      }
    });

    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this);
  }

  async componentDidMount () {
    await this.fetchData();
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      await this.fetchData();
    }
  }

  async fetchData () {
    // Get query params from state
    const { filterValues } = this.qsState.getState(
      this.props.location.search.substr(1)
    );

    await this.props.fetchPlaces(filterValues);
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
        filterValues: {
          ...filterValues,
          placeType: newValue
        }
      },
      this.handleFilterChangeSubmit
    );
  }

  render () {
    return (
      <App pageTitle='About' hideFooter>
        <SidebarWrapper>
          <Route
            exact
            path='/explore'
            render={(routeProps) => (
              <PlacesIndex
                {...routeProps}
                handleFilterTypeChange={this.handleFilterTypeChange}
                filterValues={this.state.filterValues}
              />
            )}
          />
          <Route exact path='/explore/:type/:id' component={PlacesView} />
          <Route
            exact
            path='/explore/:type/:id/survey'
            component={PlaceSurvey}
          />
          <Map />
        </SidebarWrapper>
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    history: T.object,
    fetchPlaces: T.func,
    location: T.object
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args))
  };
}

export default connect(null, dispatcher)(Explore);
