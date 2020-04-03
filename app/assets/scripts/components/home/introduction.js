import React, { Component } from 'react';
import styled from 'styled-components';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../common/modal';
import { StyledLink } from '../common/link';
import { InnerPanel } from '../../styles/panel';
import Heading from '../../styles/type/heading';
import Button from '../../styles/button/button';
import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';

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

const IntroSubHeading = styled(Heading)`
  &:after {
    content: "";
    width: 16rem;
    display: block;
    margin: 0.25rem 0;
    border: 0.25rem solid ${themeVal('color.primary')};
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

const PartnerCards = styled.ul`
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0 ${themeVal('layout.space')};
  list-style: none;
  padding: 0;
  margin: 0;

  dt {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 700;
    grid-column: 1 / span 4;

    &:not(:first-child) {
      margin-top: $global-spacing;
    }
  }
`;

const PartnerCard = styled.a`
  grid-column: auto / span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 6rem;
  position: relative;
  z-index: 1;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.smoke')};
  transition: all 0.16s ease 0s;

  img {
    display: inline-flex;
    width: auto;
    max-width: 100%;
    max-height: 4rem;
  }
`;

export default class Introduction extends Component {
  constructor (props) {
    super(props);
    this.state = {
      modalActive: false
    };
    this.setModalState = this.setModalState.bind(this);
  }

  setModalState (nextState) {
    this.setState({
      modalActive: nextState
    });
  }

  render () {
    const { modalActive } = this.state;
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
          onClick={() => this.setModalState(true)}
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
        <Modal
          id='introExpanded'
          revealed={modalActive}
          onCloseClick={() => this.setModalState(false)}
          headerComponent={
            <ModalHeader>
              <IntroSubHeading>About PlasticWatch</IntroSubHeading>
            </ModalHeader>
          }
          bodyComponent={
            <ModalBody>
              <p>
                <a href='https://oceana.org'>Oceana’s</a> PlasticWatch provides
                a platform for customers to survey restaurants’ single-use
                plastic usage and locate restaurants that offer plastic-free
                choices. Using crowdsourced ratings and reviews, PlasticWatch
                connects people who are seeking to reduce their plastic
                footprints with restaurants that provide plastic-free
                alternatives.
              </p>
              <br />
              <p>
                You can easily search for restaurants by name or use the
                PlasticWatch map to explore nearby options and find all the
                information you need to make a sustainable decision. Whether
                you’re looking for a new coffee shop or a quick lunch on the go,
                PlasticWatch can guide you to a plastic-free option.
              </p>
              <br />
              <p>
                By joining the PlasticWatch community and adding your own
                restaurant ratings and reviews, you can help others make
                informed decisions. You can build your profile, compete with
                other surveyors for a place on the PlasticWatch leaderboard, and
                help to complete surveys on every restaurant in your city. Users
                can also track trends in their communities – and see the number
                of restaurants offering plastic-free options grow!
              </p>
            </ModalBody>
          }
          footerComponent={
            <ModalFooter>
              <Button
                variation='base-raised-dark'
                useIcon='map'
                as={StyledLink}
                to='/explore'
              >
                Show me the map!
              </Button>
              <PartnerCards>
                <dt>A project by</dt>
                <PartnerCard
                  href='https://oceana.org'
                  title='Read more about Oceana'
                >
                  <img
                    src='../../../assets/graphics/content/Oceana_logo1.png'
                    alt='Oceana logo'
                  />
                </PartnerCard>
              </PartnerCards>
            </ModalFooter>
          }
        />
      </IntroPanel>
    );
  }
}
