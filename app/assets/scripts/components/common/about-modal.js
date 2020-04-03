import React, { Component } from 'react';

import styled from 'styled-components';
import { themeVal } from '../../styles/utils/general';

import Heading from '../../styles/type/heading';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../common/modal';

const IntroSubHeading = styled(Heading)`
  &:after {
    content: "";
    width: 12rem;
    max-width: 22vw;
    display: block;
    margin: 0.25rem 0;
    border: 0.25rem solid ${themeVal('color.primary')};
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

let theAboutModal = null;

export default class AboutModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      revealed: false
    };
  }

  componentDidMount () {
    if (theAboutModal !== null) {
      throw new Error(
        '<AboutModal /> component was already mounted. Only 1 is allowed.'
      );
    }
    theAboutModal = this;
  }

  componentWillUnmount () {
    theAboutModal = null;
  }

  render () {
    return (
      <Modal
        id='introExpanded'
        revealed={this.state.revealed}
        onCloseClick={hideAboutModal}
        headerComponent={
          <ModalHeader>
            <IntroSubHeading>About PlasticWatch</IntroSubHeading>
          </ModalHeader>
        }
        bodyComponent={
          <ModalBody>
            <p>
              <a href='https://oceana.org'>Oceana’s</a> PlasticWatch provides a
              platform for customers to survey restaurants’ single-use plastic
              usage and locate restaurants that offer plastic-free choices.
              Using crowdsourced ratings and reviews, PlasticWatch connects
              people who are seeking to reduce their plastic footprints with
              restaurants that provide plastic-free alternatives.
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
              restaurant ratings and reviews, you can help others make informed
              decisions. You can build your profile, compete with other
              surveyors for a place on the PlasticWatch leaderboard, and help to
              complete surveys on every restaurant in your city. Users can also
              track trends in their communities – and see the number of
              restaurants offering plastic-free options grow!
            </p>
          </ModalBody>
        }
        footerComponent={
          <ModalFooter>
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
    );
  }
}

export function showAboutModal () {
  if (theAboutModal === null) {
    throw new Error('<AboutModal /> component not mounted');
  }

  theAboutModal.setState({
    revealed: true
  });
}

export function hideAboutModal () {
  if (theAboutModal === null) {
    throw new Error('<AboutModal /> component not mounted');
  }

  theAboutModal.setState({
    revealed: false
  });
}
