import React, { Component } from 'react';
import styled from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { environment, apiUrl, appPathname } from '../../config';

import { InnerPanel } from '../../styles/panel';
import Heading from '../../styles/type/heading';
import Button from '../../styles/button/button';
import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';
import { showAboutModal } from '../common/about-modal';

import { connect } from 'react-redux';
import { wrapApiResult } from '../../redux/utils';

const IntroPanel = styled(InnerPanel)`
  margin: 0;
  margin-bottom: -30vh;
  padding: 2rem;
  align-items: flex-start;
  z-index: 10;
  border-radius: 0.5rem;
  border: 2px solid ${themeVal('color.baseLight')};
  box-shadow: 0 -2px 12px 1px ${themeVal('color.smoke')};
  ${media.mediumUp`
    justify-content: flex-end;
    padding-bottom: 4rem;
    margin-bottom: 0;
    background: ${themeVal('color.background')};
    border: none;
    border-right: 1px solid ${themeVal('color.smoke')};
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
  font-family: ${themeVal('type.base.family')};
  img {
    display: block;
    max-width: 16rem;
  }
  span {
    letter-spacing: 0.1rem;
    font-weight: ${themeVal('type.heading.light')};
  }
`;

const ModalButton = styled(Button)`
  text-transform: none;
  letter-spacing: 0;
`;

const AboutLinks = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column nowrap;
  justify-content: space-between;
  ${Button} {
    flex: 1;
    margin-bottom: 1rem;
    min-width: inherit;
  }
  ${media.mediumUp`
    align-items: center;
    flex-flow: row nowrap;
    ${Button} {
      margin-bottom: 0;
      margin-right: 1rem;
    }
  `};
`;

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

class Introduction extends Component {
  async login () {
    // Setting for popup window, parsed into DOMString
    const w = 600;
    const h = 550;
    const settings = [
      ['width', w],
      ['height', h],
      ['left', screen.width / 2 - w / 2],
      ['top', screen.height / 2 - h / 2]
    ]
      .map(function (x) {
        return x.join('=');
      })
      .join(',');

    // Open API login route in popup window to start OAuth
    window.open(
      `${apiUrl}/login?redirect=${window.location.origin}${appPathname}/login/redirect`,
      'oauth_window',
      settings
    );
  }

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
        {!this.props.isLoggedIn && (
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
              PlasticWatch uses OSM as a login provider. Login with
              OpenStreetMap to start contributing to the map
            </p>
          </AboutLinks>
        )}
      </IntroPanel>
    );
  }
}

if (environment !== 'production') {
  Introduction.propTypes = {
    isLoggedIn: T.bool
  };
}

function mapStateToProps (state) {
  const { isReady, hasError, getData } = wrapApiResult(state.authenticatedUser);
  let isLoggedIn = false;
  let isAdmin = false;

  if (isReady() && !hasError()) {
    isLoggedIn = true;
    isAdmin = getData().isAdmin;
  }

  return {
    isLoggedIn,
    isAdmin
  };
}

export default connect(mapStateToProps)(Introduction);
