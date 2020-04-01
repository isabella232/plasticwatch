import React from 'react';

import App from '../common/app';
import {
  Inpage,
  InpageBody,
  InpageBodyInner
} from '../common/inpage';
import Prose from '../../styles/type/prose';

export default class About extends React.Component {
  render () {
    return (
      <App pageTitle='About'>
        <Inpage>
          <InpageBody>
            <InpageBodyInner>
              <Prose>
                <p>
                Oceana’s PlasticWatch provides a platform for customers to survey restaurants’ single-use plastic usage and locate restaurants that offer plastic-free choices. Using crowdsourced ratings and reviews, PlasticWatch connects people who are seeking to reduce their plastic footprints with restaurants that provide plastic-free alternatives.
                </p>
                <br />
                <p>
                You can easily search for restaurants by name or use the PlasticWatch map to explore nearby options and find all the information you need to make a sustainable decision. Whether you’re looking for a new coffee shop or a quick lunch on the go, PlasticWatch can guide you to a plastic-free option.
                </p>
                <br />
                <p>
                By joining the PlasticWatch community and adding your own restaurant ratings and reviews, you can help others make informed decisions. You can build your profile, compete with other surveyors for a place on the PlasticWatch leaderboard, and help to complete surveys on every restaurant in your city. Users can also track trends in their communities – and see the number of restaurants offering plastic-free options grow!
                </p>
                <a href='https://oceana.org'>Read More About Oceana</a>
              </Prose>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </App>
    );
  }
}
