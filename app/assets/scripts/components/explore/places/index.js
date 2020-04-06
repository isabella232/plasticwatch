import React, { Component } from 'react';
import styled from 'styled-components';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { wrapApiResult, getFromState } from '../../../redux/utils';

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
      filtersOpened: false
    };
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  toggleFilters () {
    const { filtersOpened } = this.state;
    this.setState({
      filtersOpened: !filtersOpened
    });
  }

  render () {
    const { filtersOpened } = this.state;
    const {
      isMobile,
      location,
      filterValues,
      handleFilterTypeChange
    } = this.props;
    const { isReady, getData, hasError } = this.props.places;

    if (isMobile && location && location.search.indexOf('viewAs=list') === -1) { return null; }

    return (
      <Panel>
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
            {isMobile && (
              <Button useIcon='sliders-vertical' onClick={this.toggleFilters}>
                Show Filters
              </Button>
            )}

            {(!isMobile || (isMobile && filtersOpened)) && (
              <FilterButtons>
                <FilterLabel>Filters:</FilterLabel>
                <FilterButton
                  onClick={() => handleFilterTypeChange('plasticFree')}
                  active={
                    filterValues && filterValues.placeType === 'plasticFree'
                  }
                >
                  Plastic Free
                </FilterButton>
                <FilterButton
                  onClick={() => handleFilterTypeChange('plastic')}
                  active={filterValues && filterValues.placeType === 'plastic'}
                >
                  Plastic
                </FilterButton>
                <FilterButton
                  onClick={() => handleFilterTypeChange('unsurveyed')}
                  active={
                    filterValues && filterValues.placeType === 'unsurveyed'
                  }
                >
                  Unsurveyed
                </FilterButton>
              </FilterButtons>
            )}
          </FilterToolbar>
        </Filters>

        {isReady() && !hasError() && (
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
                  </Place>
                </ResultsItem>
              )
            )}
          </Results>
        )}
      </Panel>
    );
  }
}

if (environment !== 'production') {
  PlacesIndex.propTypes = {
    places: T.object,
    filterValues: T.object,
    handleFilterTypeChange: T.func,
    isMobile: T.bool,
    location: T.object
  };
}

function mapStateToProps (state) {
  return {
    places: wrapApiResult(getFromState(state, `places.list`))
  };
}

export default connect(mapStateToProps)(
  withRouter(withMobileState(PlacesIndex))
);
