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
import { InnerPanel, Panel } from '../../../styles/panel';
import Button from '../../../styles/button/button';
import { StyledLink } from '../../common/link';

import { InpageBackLink } from '../../common/inpage';
import withMobileState from '../../common/with-mobile-state';
import Rating from './rating';
import { fromNow } from '../../../utils/utils';

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

    if (!isReady()) return null;
    if (hasError()) {
      return <div>As error occurred when fetching place data</div>;
    }

    const { properties } = getData();
    const { comments } = properties;

    return (
      <Panel>
        <InpageBackLink to='/explore'>View all places</InpageBackLink>
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
            {comments.length === 0 ? (
              <div>This place does not have any comments yet.</div>
            ) : (
              <>
                <h4>Recent comments</h4>
                {comments.map(
                  ({ observationId, osmDisplayName, createdAt, text }) => (
                    <PlaceComment key={observationId}>
                      <div>{text}</div>
                      <span>
                        {osmDisplayName}, {fromNow(createdAt)}
                      </span>
                    </PlaceComment>
                  )
                )}
              </>
            )}
          </PlaceDetails>
        </InnerPanel>
      </Panel>
    );
  }
}

if (environment !== 'production') {
  PlacesView.propTypes = {
    fetchPlace: T.func,
    match: T.object,
    place: T.object
  };
}

function mapStateToProps (state, props) {
  const { type, id } = props.match.params;
  const placeId = `${type}/${id}`;

  return {
    place: wrapApiResult(getFromState(state, `places.individual.${placeId}`))
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
