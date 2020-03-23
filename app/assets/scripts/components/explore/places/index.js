import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { rgba } from 'polished';

import { wrapApiResult, getFromState } from '../../../redux/utils';
import * as actions from '../../../redux/actions/places';

import collecticon from '../../../styles/collecticons';
import media from '../../../styles/utils/media-queries';
import { themeVal, stylizeFunction } from '../../../styles/utils/general';
import { visuallyHidden, listReset } from '../../../styles/helpers/index';

import Button from '../../../styles/button/button';
import Form from '../../../styles/form/form';
import {
  FilterToolbar,
  InputWrapper,
  InputWithIcon,
  InputIcon,
  FilterLabel,
  FilterButton
} from '../../../styles/form/filters';
import { showGlobalLoading, hideGlobalLoading } from '../../common/global-loading';
import { Place, PlaceHeader, PlaceTitle, PlaceType, PlaceRating } from '../../../styles/place';

const _rgba = stylizeFunction(rgba);

const Results = styled.ul`
  ${listReset()};
`;

const ResultsItem = styled.li`
  margin-bottom: ${themeVal('layout.space')};
  max-width: 28rem;
  ${media.mediumUp`
    margin-bottom: 1.5rem;
  `}
`;

const RatingType = styled.p`
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.8rem;
  line-height: 1;
  &::before {
    display: block;
    ${({ useIcon }) => collecticon(useIcon)}
    color: ${({ nonplastic }) =>
    nonplastic ? themeVal('color.primary') : themeVal('color.danger')};
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

const PlaceSurveys = styled.p``;

const PlaceSelect = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  margin: 0 !important;
  transition: all 0.24s ease 0s;
  flex: none;
  &:hover {
    opacity: 1;
    background: ${_rgba(themeVal('color.primary'), 0.05)};
  }
  span {
    ${visuallyHidden()}
  }
`;

class PlacesIndex extends Component {
  async componentDidMount () {
    await this.fetchData();
  }

  async fetchData () {
    showGlobalLoading();
    await this.props.fetchPlaces();
    hideGlobalLoading();
  }

  render () {
    const { isReady, getData, hasError } = this.props.places;

    if (!isReady()) {
      return (
        <div>Loading...</div>
      );
    }

    if (hasError()) {
      return (
        <div>An error occurred, could not fetch places!</div>
      );
    }

    return (
      <>
        <Form>
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
            <Button useIcon='sliders-vertical'>Show Filters</Button>
          </FilterToolbar>
          <FilterToolbar>
            <FilterButton>Plastic Free</FilterButton>
            <FilterButton>Plastic</FilterButton>
            <FilterButton>Unsurveyed</FilterButton>
          </FilterToolbar>
        </Form>

        <Results>
          {getData().map(({ id, properties }) => (
            <ResultsItem key={id} as={Link} to={`/explore/${id}`}>
              <Place>
                <PlaceHeader>
                  {properties.name && (
                    <PlaceTitle>{properties.name}</PlaceTitle>
                  )}
                  {properties.amenity && (
                    <PlaceType>{properties.amenity}</PlaceType>
                  )}
                </PlaceHeader>
                <PlaceRating>
                  <RatingType useIcon='circle-tick' nonplastic>
                    Non-plastic options
                  </RatingType>
                  <PlaceSurveys>12 out of 16 people</PlaceSurveys>
                </PlaceRating>
                <PlaceSelect />
              </Place>
            </ResultsItem>
          ))}
        </Results>
      </>
    );
  }
}

if (environment !== 'production') {
  PlacesIndex.propTypes = {
    places: T.object,
    fetchPlaces: T.func
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

export default connect(mapStateToProps, dispatcher)(PlacesIndex);
