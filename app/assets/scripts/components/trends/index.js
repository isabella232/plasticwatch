import React from 'react';

import App from '../common/app';
import {
  Inpage,
  InpageBody,
  InpageBodyInner
} from '../common/inpage';
import Prose from '../../styles/type/prose';

export default class Trends extends React.Component {
  render () {
    return (
      <App pageTitle='Trends'>
        <Inpage>
          <InpageBody>
            <InpageBodyInner>
              <Prose>
                <p>
                  Dolor pariatur ullamco ex anim velit ut amet excepteur. Ex
                  magna amet proident pariatur nulla quis Lorem irure. Ut elit
                  mollit cillum sint. Consectetur ut non anim tempor anim
                  proident consequat incididunt ipsum.
                </p>
              </Prose>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </App>
    );
  }
}
