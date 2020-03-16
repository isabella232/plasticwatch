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

const places = [
  {
    id: 'node/111'
  },
  {
    id: 'node/112'
  },
  {
    id: 'node/113'
  },
  {
    id: 'node/114'
  }
];

export default class PlacesIndex extends Component {
  render () {
    return (
      <InpageBody>
        <h1>Places</h1>
        <ul>
          {places.map((p) => (
            <li key={p.id}>
              <Link to={`/explore/${p.id}`}>{p.id}</Link>
            </li>
          ))}
        </ul>
      </InpageBody>
    );
  }
}
