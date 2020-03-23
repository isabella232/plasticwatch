import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';

import * as actions from '../../../redux/actions/places';

import { stackSkin, cardSkin } from '../../../styles/skins';
import media from '../../../styles/utils/media-queries';
import { wrapApiResult, getFromState } from '../../../redux/utils';
import { connect } from 'react-redux';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../../common/global-loading';
import {
  Place,
  PlaceHeader,
  PlaceTitle,
  PlaceType,
  PlaceRating,
  RatingType,
  PlaceSurveys,
  PlaceSelect
} from '../../../styles/place';
import Button from '../../../styles/button/button';

const InpageBody = styled.div`
  ${stackSkin()};
  ${cardSkin()};
  padding: 1rem 2rem;
  grid-row: 2/5;
  z-index: 10;
  width: 95%;
  margin: 0 auto;

  ${media.mediumUp`
    padding: 2rem;
    width: 100%;
    order: initial;
    padding: 4rem;
  `}
`;

class PlacesView extends Component {
  async componentDidMount () {
    await this.fetchData();
  }

  async fetchData () {
    const { type, id } = this.props.match.params;
    const placeId = `${type}/${id}`;
    await this.props.fetchPlace(placeId);
  }

  render () {
    const { isReady, hasError, getData } = this.props.place;

    if (!isReady()) return <div>Loading...</div>;
    if (hasError()) {
      return <div>As error occurred when fetching place data</div>;
    }

    const { properties } = getData();
    const { recentComments } = this.props;

    return (
      <InpageBody>
        <Link to='/explore'>Return to places index</Link>
        <Place>
          <PlaceHeader>
            {properties.name && <PlaceTitle>{properties.name}</PlaceTitle>}
            {properties.amenity && <PlaceType>{properties.amenity}</PlaceType>}
          </PlaceHeader>
          <PlaceRating>
            <RatingType useIcon='circle-tick' nonplastic>
              Non-plastic options
            </RatingType>
            <PlaceSurveys>12 out of 16 people</PlaceSurveys>
          </PlaceRating>
          <PlaceSelect />
        </Place>

        <h2>Recent comments</h2>
        {recentComments.length === 0 ? (
          <div>This place did not received comments yet.</div>
        ) : (
          <ul>
            {recentComments.map(({ userId, userPhoto, comment }) => (
              <li key={userId}>
                <img width='50' height='50' src={userPhoto} alt={userId} />
                <div>
                  <b>{comment}</b> - {userId}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button as={Link} to={`/explore/${properties.id}/submit-survey`}>
          Submit a survey
        </Button>
      </InpageBody>
    );
  }
}

if (environment !== 'production') {
  PlacesView.propTypes = {
    place: T.object,
    match: T.object,
    fetchPlace: T.func,
    recentComments: T.array
  };
}

function mapStateToProps (state, props) {
  const { type, id } = props.match.params;
  const placeId = `${type}/${id}`;

  return {
    place: wrapApiResult(getFromState(state, `places.individual.${placeId}`)),
    recentComments: [
      {
        userId: 'sunt',
        userPhoto: 'https://dummyimage.com/50.png',
        comment:
          'Velit veniam dolore labore aute ut. Adipisicing et tempor reprehenderit incididunt sit culpa in dolore.'
      },
      {
        userId: 'reprehenderit',
        userPhoto: 'https://dummyimage.com/50.png',
        comment:
          'Ex quis quis sint amet dolor reprehenderit consectetur consequat. Cillum sit culpa cupidatat ex ipsum culpa .'
      },
      {
        userId: 'tempor',
        userPhoto: 'https://dummyimage.com/50.png',
        comment:
          'Amet dolore velit velit pariatur irure et elit id do non enim ullamco velit. Consequat aute exercitation.'
      },
      {
        userId: 'commodo',
        userPhoto: 'https://dummyimage.com/50.png',
        comment:
          'Reprehenderit anim Lorem ipsum sit ad magna incididunt cupidatat eiusmod fugiat. Cillum esse enim nisi reprehenderit.'
      }
    ]
  };
}

function dispatcher (dispatch) {
  return {
    fetchPlace: (...args) => dispatch(actions.fetchPlace(...args))
  };
}

export default connect(mapStateToProps, dispatcher)(PlacesView);
