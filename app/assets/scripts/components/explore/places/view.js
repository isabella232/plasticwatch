import React, { Component } from 'react';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';

import * as actions from '../../../redux/actions/places';

import { wrapApiResult, getFromState } from '../../../redux/utils';
import { connect } from 'react-redux';
import {
  PlaceMeta,
  PlaceHeader,
  PlaceDetails,
  PlaceTitle,
  PlaceType,
  PlaceComment
} from '../../../styles/place';
import { InnerPanel } from '../../../styles/panel';
import Button from '../../../styles/button/button';
import { StyledLink } from '../../common/link';

import { InpageBackLink } from '../../common/inpage';
import withMobileState from '../../common/with-mobile-state';
import Rating from './rating';

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
      <>
        <InpageBackLink to='/explore'>Return to places index</InpageBackLink>
        <InnerPanel>
          <PlaceMeta>
            <PlaceHeader>
              {properties.name && <PlaceTitle>{properties.name}</PlaceTitle>}
              {properties.amenity && (
                <PlaceType>{properties.amenity}</PlaceType>
              )}
            </PlaceHeader>
            <Rating observations={properties.observations} />
          </PlaceMeta>
          <Button
            variation='primary-raised-dark'
            size='large'
            as={StyledLink}
            to={`/explore/${properties.id}/survey`}
          >
            Submit a survey
          </Button>
          <PlaceDetails>
            <h4>Recent comments</h4>
            {recentComments.length === 0 ? (
              <div>This place did not received comments yet.</div>
            ) : (
              recentComments.map(({ userId, comment }) => (
                <PlaceComment key={userId}>
                  <div>
                    {comment}
                    <span>- {userId}</span>
                  </div>
                </PlaceComment>
              ))
            )}
          </PlaceDetails>
        </InnerPanel>
      </>
    );
  }
}

if (environment !== 'production') {
  PlacesView.propTypes = {
    fetchPlace: T.func,
    match: T.object,
    place: T.object,
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
        comment:
          'Velit veniam dolore labore aute ut. Adipisicing et tempor reprehenderit incididunt sit culpa in dolore.'
      },
      {
        userId: 'reprehenderit',
        comment:
          'Ex quis quis sint amet dolor reprehenderit consectetur consequat. Cillum sit culpa cupidatat ex ipsum culpa .'
      },
      {
        userId: 'tempor',
        comment:
          'Amet dolore velit velit pariatur irure et elit id do non enim ullamco velit. Consequat aute exercitation.'
      },
      {
        userId: 'commodo',
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

export default connect(
  mapStateToProps,
  dispatcher
)(withMobileState(PlacesView));
