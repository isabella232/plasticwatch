import React, { Component } from 'react';
import styled from 'styled-components';

const InpageBody = styled.div`
  padding: 4rem;
`;

export default class SidePanel extends Component {
  render () {
    return (
      <InpageBody>
        <h1>About</h1>
        <div>
          Voluptate aliquip ullamco incididunt incididunt exercitation eu. Consectetur ullamco eiusmod id mollit cillum proident in adipisicing reprehenderit. Et dolor excepteur Lorem laboris adipisicing magna commodo. Est minim et nulla sint do magna elit aliquip officia eu ut culpa. Nulla nisi consectetur et officia reprehenderit dolor eiusmod laboris exercitation magna et sit. Qui labore amet eiusmod mollit culpa cupidatat laboris nostrud ad velit amet.
        </div>
        <div>
          Read more about this project >
        </div>        
      </InpageBody>
    );
  }
}
