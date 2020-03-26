import styled from 'styled-components';
import { themeVal } from '../utils/general';
import { divide } from '../utils/math';

export const FormGroup = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-gap: ${divide(themeVal('layout.space'), 2)};
`;

export const FormGroupHeader = styled.div`
  display: flex;
  flex-flow: wrap nowrap;
  justify-content: space-between;
`;

export const FormGroupBody = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-gap: ${divide(themeVal('layout.space'), 4)};
`;

export const FormGroupFooter = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin-top: auto;
  padding-top: ${themeVal('layout.space')};
  border-top: 1px solid ${themeVal('color.smoke')};
  >* {
    margin-bottom: ${divide(themeVal('layout.space'), 2)};
  }
`;
