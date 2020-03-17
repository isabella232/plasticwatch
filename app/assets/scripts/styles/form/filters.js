import styled from 'styled-components';
import FormInput from './input';
import FormLabel from './label';
import FormToolbar from './toolbar';
import collecticon from '../collecticons';
import { themeVal } from '../utils/general';
import Button from '../button/button';

export const FilterToolbar = styled(FormToolbar)`
  align-items: flex-end;

  & input {
    max-width: 24rem;
  }
  & > * {
    margin-right: 1rem;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
`;

export const InputWithIcon = styled(FormInput)`
  padding: 1rem 1.5rem;
  background: #FFFFFF;
`;

export const InputIcon = styled(FormLabel)`
  &::after {
    ${({ useIcon }) => collecticon(useIcon)}
    position: absolute;
    left: 0.5rem;
    top: 50%;
    opacity: 0.64;
  }
`;

export const FilterLabel = styled(FormLabel)`
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.regular')};
`;

export const FilterButton = styled(Button)`
  text-transform: none;
  box-shadow: none;
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.regular')};
  border: 1px solid ${themeVal('color.smoke')};
`;