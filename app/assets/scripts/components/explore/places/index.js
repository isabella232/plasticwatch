import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { rgba } from 'polished';

import { wrapApiResult } from '../../../redux/utils';

import collecticon from '../../../styles/collecticons';
import media from '../../../styles/utils/media-queries';
import { stackSkin, cardSkin } from '../../../styles/skins';
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

const _rgba = stylizeFunction(rgba);

const InpageBody = styled.div`
  ${stackSkin()};
  ${cardSkin()};
  padding: 1rem 2rem;
  grid-row: 2/5;
  z-index: 10;
  width: 95%;
  margin: 0 auto;

  a {
    text-decoration: none;
  }

  ${media.mediumUp`
    padding: 2rem;
    width: 100%;
    order: initial;
    padding: 4rem;
  `}
`;

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

const Place = styled.article`
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 6px 1px ${themeVal('color.shadow')};
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  ${media.mediumUp`
    padding: 1.5rem;
  `}
`;

const PlaceHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  align-items: flex-start;
`;

const PlaceTitle = styled.h2`
  margin: 0;
`;

const PlaceType = styled.p`
  color: ${themeVal('color.baseMed')};
  line-height: 1;
`;

const PlaceRating = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-left: auto;
  padding-left: ${themeVal('layout.space')};
  text-align: center;
  color: ${themeVal('color.baseMed')};
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
  render () {
    const { isReady, getData, hasError } = this.props.places;

    if (!isReady()) {
      return (
        <InpageBody>
          <div>Loading...</div>
        </InpageBody>
      );
    }

    if (hasError()) {
      return (
        <InpageBody>
          <div>An error occurred, could not fetch places!</div>
        </InpageBody>
      );
    }

    return (
      <InpageBody>
        <h1>Places</h1>
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
      </InpageBody>
    );
  }
}

if (environment !== 'production') {
  PlacesIndex.propTypes = {
    places: T.object
  };
}

function mapStateToProps (state) {
  return {
    places: wrapApiResult(state.places)
  };
}

export default connect(mapStateToProps)(PlacesIndex);
