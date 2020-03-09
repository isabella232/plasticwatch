import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { stackSkin, cardSkin } from '../../styles/skins';
import Heading from '../../styles/type/heading';
import media from '../../styles/utils/media-queries';

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

export default class SidePanel extends Component {
  render () {
    return (
      <InpageBody>
        <Heading size='x-large'><span>Oceana</span> PlasticWatch</Heading>
        <Heading size='large'>About</Heading>
        <div>
          Voluptate aliquip ullamco incididunt incididunt exercitation eu. Consectetur ullamco eiusmod id mollit cillum proident in adipisicing reprehenderit. Et dolor excepteur Lorem laboris adipisicing magna commodo. Est minim et nulla sint do magna elit aliquip officia eu ut culpa. Nulla nisi consectetur et officia reprehenderit dolor eiusmod laboris exercitation magna et sit. Qui labore amet eiusmod mollit culpa cupidatat laboris nostrud ad velit amet.
        </div>
        <br />
        <Link to='/about'>
          Read more about this project
        </Link>
        <br />
        <br />
        <Link to='/map'>
          Show me the map
        </Link>
      </InpageBody>
    );
  }
}
