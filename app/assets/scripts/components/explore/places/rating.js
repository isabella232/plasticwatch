import React, { Component } from 'react';
import styled from 'styled-components';
import { PlaceRating, RatingType, PlaceSurveys } from '../../../styles/place';

import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';

import collecticon from '../../../styles/collecticons';
import { themeVal } from '../../../styles/utils/general';

const Unsurveyed = styled.p`
  font-weight: ${themeVal('type.base.bold')};
  font-size: 0.8rem;
  line-height: 1;
  &::before {
    display: block;
    useicon: ${collecticon('circle-question')};
    color: ${themeVal('color.smoke')};
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

class Rating extends Component {
  render () {
    const {
      total,
      totalTrue,
      totalFalse
    } = this.props.observations;
    return (
      <PlaceRating>
        {total > 0 ? (
          <>
            <RatingType
              useIcon={
                total > 0
                  ? totalTrue > totalFalse
                    ? 'circle-tick'
                    : 'circle-xmark'
                  : 'circle-question'
              }
              nonplastic={totalTrue > totalFalse}
            >
              {
                totalTrue > totalFalse
                  ? <>Plastic-free available</>
                  : <>Not plastic-free</>
              }
            </RatingType>
            <PlaceSurveys>
              {totalTrue > totalFalse ? totalTrue : totalFalse} out of {total} surveys
            </PlaceSurveys>
          </>
        ) : (
          <Unsurveyed>Unsurveyed</Unsurveyed>
        )}
      </PlaceRating>
    );
  }
}

if (environment !== 'production') {
  Rating.propTypes = {
    observations: T.object
  };
}

export default Rating;
