import React, { Component } from 'react';
import styled from 'styled-components';

const InpageBody = styled.div`
  padding: 4rem;
`;

export default class SidePanel extends Component {
  render () {
    return (
      <InpageBody>
        <h1>Welcome!</h1>
      </InpageBody>
    );
  }
}
