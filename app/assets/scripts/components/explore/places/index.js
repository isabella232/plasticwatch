import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';

import { stackSkin, cardSkin } from '../../../styles/skins';
import media from '../../../styles/utils/media-queries';
import { wrapApiResult } from '../../../redux/utils';
import { connect } from 'react-redux';

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
        <ul>
          {getData().map(p => (
            <li key={p.id}>
              <Link to={`/explore/${p.id}`}>{p.id}</Link>
            </li>
          ))}
        </ul>
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
