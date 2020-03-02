import React from 'react';
import { Link } from 'react-router-dom';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../common/inpage';
import Prose from '../../styles/type/prose';

export default class NotImplemented extends React.Component {
  render () {
    return (
      <App pageTitle='Page not implemented'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <InpageHeadline>
                <InpageTitle>Page not implemented</InpageTitle>
              </InpageHeadline>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <InpageBodyInner>
              <Prose>
                <p>This is a place holder page.</p>
                <p><Link to='/' title='Visit the homepage'>Visit the homepage</Link></p>
              </Prose>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </App>
    );
  }
}
