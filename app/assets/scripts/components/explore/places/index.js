import React, { Component } from 'react';
import styled from 'styled-components';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { wrapApiResult, getFromState } from '../../../redux/utils';
import * as exploreActions from '../../../redux/actions/explore';

import withMobileState from '../../common/with-mobile-state';
import { StyledLink } from '../../common/link';

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

    if (count === 0) return <div />;
    else if (count.length === 1) return <div>1 place found in the area.</div>;
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

  render () {
    const { filtersOpened } = this.state;
    const { isMobile, location, handleFilterChange, filters } = this.props;
    const { isReady, getData, hasError } = this.props.places;

    if (isMobile && location && location.search.indexOf('viewAs=list') === -1) {
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
                onChange={this.handleNameSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFilterChange('search', this.state.searchString);
                  }
                }}
              />
              <InputIcon
                htmlFor='placeSearch'
                useIcon='magnifier-left'
                onClick={() => handleFilterChange('search', this.state.searchString)}
              />
            </InputWrapper>
            {isMobile && (
              <Button useIcon='sliders-vertical' onClick={this.toggleFilters}>
                Show Filters
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
              </FilterButtons>
            )}
          </FilterToolbar>
        </Filters>

        {isReady() && !hasError() && (
          <Results>
            {this.renderPlacesCount(data)}
            {data.map(({ id, properties: { name, amenity, observations } }) => (
              <ResultsItem key={id} as={StyledLink} to={`/explore/${id}`}>
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
    places: T.object,
    updateFilters: T.object,
    filters: T.object,
    handleFilterChange: T.func,
    isMobile: T.bool,
    location: T.object
  };
}

function mapStateToProps (state) {
  return {
    filters: getFromState(state, `explore.filters`),
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

function dispatcher (dispatch) {
  return {
    updateFilters: (...args) =>
      dispatch(exploreActions.updateFilters(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(withRouter(withMobileState(PlacesIndex)));
