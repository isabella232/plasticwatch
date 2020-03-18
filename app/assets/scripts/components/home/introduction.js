import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { stackSkin, cardSkin } from '../../styles/skins';
import Heading from '../../styles/type/heading';
import media from '../../styles/utils/media-queries';
import Button from '../../styles/button/button';

const InpageBody = styled.div`
  ${stackSkin()};
  ${cardSkin()};
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  grid-row: 2/5;
  z-index: 10;
  margin: 0 auto;

  ${media.mediumUp`
    padding: 2rem;
    width: 100%;
    order: initial;
    padding: 4rem;
  `}
`;

export default class Introduction extends Component {
  render () {
    return (
      <InpageBody>
        <Heading size='x-large'>
          <span>Oceana</span> PlasticWatch
        </Heading>
        <Heading size='large'>About</Heading>
        <div>
          Voluptate aliquip ullamco incididunt incididunt exercitation eu.
          Consectetur ullamco eiusmod id mollit cillum proident in adipisicing
          reprehenderit. Et dolor excepteur Lorem laboris adipisicing magna
          commodo. Est minim et nulla sint do magna elit aliquip officia eu ut
          culpa. Nulla nisi consectetur et officia reprehenderit dolor eiusmod
          laboris exercitation magna et sit. Qui labore amet eiusmod mollit
          culpa cupidatat laboris nostrud ad velit amet.
        </div>
        <br />
        <Link to='/about'>Read more about this project</Link>
        <br />
        <br />
        <p>
          PlasticWatch uses OSM as a login provider. Login with OpenStreetMap to
          start contributing to the map
        </p>
        <Button
          useIcon='login'
          size='xlarge'
          variation='primary-raised-dark'
          onClick={() => this.login()}
        >
          Login
        </Button>
      </InpageBody>
    );
  }
}
