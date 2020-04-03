import React, { Component } from 'react';
import styled from 'styled-components';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { wrapApiResult, getFromState } from '../../../redux/utils';
import * as actions from '../../../redux/actions/places';

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
  showGlobalLoading,
  hideGlobalLoading
} from '../../common/global-loading';
import {
  Place,
  PlaceHeader,
  PlaceTitle,
  PlaceType,
  PlaceSelect
} from '../../../styles/place';
import { hideScrollbars } from '../../../styles/skins';
import Rating from './rating';

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
      filtersOpened: false
    };
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  async componentDidMount () {
    await this.fetchData();
  }

  async fetchData () {
    showGlobalLoading();
    await this.props.fetchPlaces();
    hideGlobalLoading();
  }

  toggleFilters () {
    const { filtersOpened } = this.state;
    this.setState({
      filtersOpened: !filtersOpened
    });
  }

  render () {
    const { filtersOpened } = this.state;
    const { isMobile } = this.props;
    const { isReady, getData, hasError } = this.props.places;

    if (!isReady()) {
      return <div>Loading...</div>;
    }

    if (hasError()) {
      return <div>An error occurred, could not fetch places!</div>;
    }

    return (
      <>
        <Filters>
          <FilterToolbar>
            <InputWrapper>
              <FilterLabel htmlFor='placeSearch'>Search places</FilterLabel>
              <InputIcon htmlFor='placeSearch' useIcon='magnifier-left' />
              <InputWithIcon
                type='text'
                id='placeSearch'
                placeholder='Look up location'
              />
            </InputWrapper>
            {isMobile ? (
              <>
                <Button useIcon='sliders-vertical' onClick={this.toggleFilters}>
                  Show Filters
                </Button>
                {filtersOpened && (
                  <FilterButtons>
                    <FilterButton>Plastic Free</FilterButton>
                    <FilterButton>Plastic</FilterButton>
                    <FilterButton>Unsurveyed</FilterButton>
                  </FilterButtons>
                )}
              </>
            ) : (
              <FilterButtons>
                <FilterButton>Plastic Free</FilterButton>
                <FilterButton>Plastic</FilterButton>
                <FilterButton>Unsurveyed</FilterButton>
              </FilterButtons>
            )}
          </FilterToolbar>
        </Filters>

        <Results>
          {getData().map(
            ({ id, properties: { name, amenity, observations } }) => (
              <ResultsItem key={id} as={StyledLink} to={`/explore/${id}`}>
                <Place>
                  <PlaceHeader>
                    {name && <PlaceTitle>{name}</PlaceTitle>}
                    {amenity && <PlaceType>{amenity}</PlaceType>}
                  </PlaceHeader>
                  <Rating observations={observations} />
                  <PlaceSelect />
                </Place>
              </ResultsItem>
            )
          )}
        </Results>
      </>
    );
  }
}

if (environment !== 'production') {
  PlacesIndex.propTypes = {
    places: T.object,
    fetchPlaces: T.func,
    isMobile: T.bool
  };
}

function mapStateToProps (state) {
  return {
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlaces: (...args) => dispatch(actions.fetchPlaces(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(withMobileState(PlacesIndex));
