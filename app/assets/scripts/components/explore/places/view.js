import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { stackSkin, cardSkin } from '../../../styles/skins';
import media from '../../../styles/utils/media-queries';

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

export default class PlacesView extends Component {
  render () {
    return (
      <InpageBody>
        <Link to='/explore'>Return to places index</Link>

        <div>A single place</div>
      </InpageBody>
    );
  }
}
