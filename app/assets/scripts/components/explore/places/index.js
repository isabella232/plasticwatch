import React, { Component } from 'react';
import styled from 'styled-components';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { wrapApiResult, getFromState } from '../../../redux/utils';
import * as exploreActions from '../../../redux/actions/explore';

import withMobileState from '../../common/with-mobile-state';
import { StyledLink } from '../../common/link';
import { showConfirmationPrompt } from '../../common/confirmation-prompt';

import { themeVal } from '../../../styles/utils/general';
import { listReset } from '../../../styles/helpers/index';
import Button from '../../../styles/button/button';
import {
  Filters,
  FilterToolbar,
  InputWrapper,
  InputWithIcon,
  InputIcon,
  FilterLabel,
  FilterButton,
  FilterButtons
} from '../../../styles/form/filters';
import {
  Place,
  PlaceHeader,
  PlaceTitle,
  PlaceType
} from '../../../styles/place';
import { hideScrollbars } from '../../../styles/skins';
import Rating from './rating';
import { Panel } from '../../../styles/panel';
import { withRouter } from 'react-router-dom';

const Results = styled.ul`
  ${listReset()};
  ${hideScrollbars()};
  overflow-y: scroll;
  margin-top: 1rem;
`;

const ResultsItem = styled.li`
  margin-bottom: ${themeVal('layout.space')};
  text-decoration: none;
  &:first-child {
    margin-bottom: 0;
    margin-left: 0.5rem;
    font-size: 0.875rem;
  }
  h4,
  ${Button} {
    margin-bottom: 1rem;
  }
`;

class PlacesIndex extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filtersOpened: false,
      searchString: ''
    };
    this.toggleFilters = this.toggleFilters.bind(this);
    this.handleNameSearchChange = this.handleNameSearchChange.bind(this);
  }

  toggleFilters () {
    const { filtersOpened } = this.state;
    this.setState({
      filtersOpened: !filtersOpened
    });
  }

  renderPlacesCount (places) {
    const count = places.length;
    const { lat, lng, zoom } = this.props.mapViewport;
    const link = `https://openstreetmap.org/edit?editor=id&lat=${lat}&lon=${lng}&zoom=${zoom}`;
    if (count === 0) {
      return (
        <>
          <h4>No results found.</h4>
          <Button
            variation='base-raised-light'
            tabIndex={-1}
            useIcon='crosshair'
            onClick={async () => {
              const res = await showConfirmationPrompt({
                'title': 'Add a missing place to the map',
                'content': 'PlasticWatch relies on OpenStreetMap data for restaurant, cafe and bar locations. Don’t see the establishment you’re looking for? Click "Confirm" to add a location to OpenStreetMap. Adding a place to OpenStreetMap requires creating an account and following OSM policies. Continue to view OpenStreetMap at your currently selected location, and follow the OSM walkthrough to learn how to edit the global map. Please note, as changes to OSM must be verified by the external OSM community, new places added to OSM will not immediately be captured by PlasticWatch'
              });
              if (res.result) {
                window.open(link);
              }
            }}
          >
          Add a missing place to OpenStreetMap
          </Button>
        </>
      );
    } else if (count.length === 1) return <div>1 place found in the area.</div>;
    else return <div>{count} places found in the area.</div>;
  }

  handleNameSearchChange (e) {
    // Get id/value pair from event
    const { value } = e.target;

    const currentValue = this.state.searchString;

    // Filter values haven't changed, return
    if (currentValue === value) return;

    // Update value in state
    this.setState({
      searchString: value
    });
  }

  handlePlaceTypeChange (placeType) {
    this.props.updateFilters({
      placeType: this.props.filters.placeType !== placeType ? placeType : null
    });
  }

  handleSearchStringChange (searchString) {
    this.props.updateFilters({
      searchString
    });
  }

  handleSearchReset () {
    let searchString = '';
    this.setState({
      searchString: searchString
    });
    this.props.updateFilters({
      searchString
    });
  }

  render () {
    const { filtersOpened } = this.state;
    const { isMobile, filters, activeMobileTab } = this.props;
    const { isReady, getData, hasError } = this.props.places;
    const { campaignSlug } = this.props.match.params;

    if (isMobile && activeMobileTab !== 'list') {
      return null;
    }

    let data;
    if (isReady() && !hasError()) {
      data = getData();
    }

    return (
      <Panel>
        <Filters>
          <FilterToolbar>
            <InputWrapper>
              <FilterLabel htmlFor='placeSearch'>
                Search in the list
              </FilterLabel>
              <InputWithIcon
                type='text'
                id='placeSearch'
                placeholder='Enter place name'
                defaultValue={this.props.filters.searchString}
                value={this.state.searchString}
                onChange={this.handleNameSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearchStringChange(this.state.searchString);
                  }
                }}
              />
              <InputIcon
                htmlFor='placeSearch'
                useIcon='magnifier-left'
                onClick={() =>
                  this.handleSearchStringChange(this.state.searchString)}
              />
            </InputWrapper>
            { this.state.searchString && (
              <Button
                size='small'
                useIcon='xmark--small'
                onClick={() =>
                  this.handleSearchReset()}
              >
                Reset
              </Button>
            )}
            {isMobile && (
              <Button size='small' useIcon='sliders-vertical' onClick={this.toggleFilters}>
                { filtersOpened ? 'Hide Filters' : 'Show Filters'}
              </Button>
            )}

            {(!isMobile || (isMobile && filtersOpened)) && (
              <FilterButtons>
                <FilterLabel>Filters:</FilterLabel>
                <FilterButton
                  onClick={() => this.handlePlaceTypeChange('plasticFree')}
                  active={filters && filters.placeType === 'plasticFree'}
                >
                  Plastic Free
                </FilterButton>
                <FilterButton
                  onClick={() => this.handlePlaceTypeChange('plastic')}
                  active={filters && filters.placeType === 'plastic'}
                >
                  Plastic
                </FilterButton>
                <FilterButton
                  onClick={() => this.handlePlaceTypeChange('unsurveyed')}
                  active={filters && filters.placeType === 'unsurveyed'}
                >
                  Unsurveyed
                </FilterButton>
                {filters.placeType && (
                  <Button
                    size='small'
                    useIcon='xmark--small'
                    onClick={() => this.handlePlaceTypeChange(null)}
                  >
                    Clear Filters
                  </Button>
                )}
              </FilterButtons>
            )}
          </FilterToolbar>
        </Filters>

        {isReady() && !hasError() && (
          <Results>
            <ResultsItem>{this.renderPlacesCount(data)}</ResultsItem>
            {data.map(({ id, properties: { name, amenity, observations } }) => (
              <ResultsItem key={id} as={StyledLink} to={`/explore/${campaignSlug}/${id}`}>
                <Place>
                  <PlaceHeader>
                    {name && <PlaceTitle>{name}</PlaceTitle>}
                    {amenity && <PlaceType>{amenity}</PlaceType>}
                  </PlaceHeader>
                  <Rating observations={observations} />
                </Place>
              </ResultsItem>
            ))}
          </Results>
        )}
      </Panel>
    );
  }
}

if (environment !== 'production') {
  PlacesIndex.propTypes = {
    activeMobileTab: T.string,
    places: T.object,
    match: T.object,
    updateFilters: T.func,
    filters: T.object,
    isMobile: T.bool,
    mapViewport: T.object
  };
}

function mapStateToProps (state) {
  return {
    filters: getFromState(state, `explore.filters`),
    places: wrapApiResult(getFromState(state, `places.list`)),
    activeMobileTab: getFromState(state, `explore.activeMobileTab`),
    mapViewport: getFromState(state, `explore.mapViewport`)
  };
}

function dispatcher (dispatch) {
  return {
    updateFilters: (...args) => dispatch(exploreActions.updateFilters(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(withRouter(withMobileState(PlacesIndex)));
