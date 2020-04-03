import React, { Component } from 'react';
import styled from 'styled-components';

import { InnerPanel } from '../../styles/panel';
import Heading from '../../styles/type/heading';
import Button from '../../styles/button/button';
import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';
import { showAboutModal } from '../common/about-modal';

const IntroPanel = styled(InnerPanel)`
  margin: 0;
  padding: 2rem;
  align-items: flex-start;
  justify-content: flex-end;
  grid-row: 2/5;
  z-index: 10;
  border-radius: 0.5rem;
  border: 2px solid ${themeVal('color.shadow')};
  box-shadow: 0 -2px 12px 1px ${themeVal('color.shadow')};
  ${media.mediumUp`
    padding-bottom: 4rem;
    background: ${themeVal('color.background')};
    &:before {
      content: '';
      width: 100%;
      height: 400px;
      background: linear-gradient(150deg, transparent, #EEF6FC 50%), url('../../../assets/graphics/content/underwater.jpg');
      position: absolute;
      top: -10%;
      left: 0;
      z-index: -1;
      clip-path: polygon(
        0 0, /* left top */
        100% 0, /* right top */ 
        100% 20%, /* right bottom */
        0 100% /* left bottom */
      );   
    }
  `};
  & > ${Button} {
    margin: 1rem 0 2rem;
  }
`;

const IntroHeading = styled(Heading)`
  margin: 0;
  img {
    display: block;
    max-width: 16rem;
  }
  span {
    font-weight: ${themeVal('type.heading.regular')};
  }
`;

const ModalButton = styled(Button)`
  text-transform: none;
  letter-spacing: 0;
`;

const AboutLinks = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  ${Button} {
    flex: 1;
    margin-right: 1rem;
    min-width: inherit;
  }
`;

const IntroSubHeading = styled(Heading)`
  &:after {
    content: "";
    width: 16rem;
    display: block;
    margin: 0.25rem 0;
    border: 0.25rem solid ${themeVal('color.primary')};
  }
`;

export default class Introduction extends Component {
  render () {
    return (
      <IntroPanel>
        <IntroHeading size='x-large' variation='primary'>
          <img
            src='../../../assets/graphics/content/Oceana_2.svg'
            alt='Oceana logo'
          />
          <span>Plastic</span>Watch
        </IntroHeading>
        <IntroSubHeading>About</IntroSubHeading>
        <p>
          <a href='https://oceana.org'>Oceana’s</a> PlasticWatch provides a
          platform for customers to survey restaurants’ single-use plastic usage
          and locate restaurants that offer plastic-free choices. Using
          crowdsourced ratings and reviews, PlasticWatch connects people who are
          seeking to reduce their plastic footprints with restaurants that
          provide plastic-free alternatives.
        </p>
        <ModalButton
          variation='primary-plain'
          useIcon={['chevron-right--small', 'after']}
          onClick={showAboutModal}
        >
          Read more about the project
        </ModalButton>
        <AboutLinks>
          <Button
            useIcon='login'
            size='large'
            variation='primary-raised-dark'
            onClick={() => this.login()}
          >
            Login
          </Button>
          <p>
            PlasticWatch uses OSM as a login provider. Login with OpenStreetMap
            to start contributing to the map
          </p>
        </AboutLinks>
      </IntroPanel>
    );
  }
}
