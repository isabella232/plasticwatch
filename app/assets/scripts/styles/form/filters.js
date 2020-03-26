import styled from 'styled-components';
import Form from './form';
import FormInput from './input';
import FormLabel from './label';
import FormToolbar from './toolbar';
import collecticon from '../collecticons';
import { themeVal } from '../utils/general';
import Button from '../button/button';
import media from '../../styles/utils/media-queries';

export const Filters = styled(Form)`
  background: #edf6fb;
  position: sticky;
  top: 0;
  z-index: 42;
`;
export const FilterToolbar = styled(FormToolbar)`
  align-items: flex-end;
  justify-content: space-between;
  margin: 1rem -2rem;
  padding: 0 3rem 1rem;
  border-bottom: 1px solid ${themeVal('color.smoke')};
  & input {
    max-width: 24rem;
  }
  ${media.mediumUp`
    padding: 0 2rem 1rem;
  `};
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

export const FilterButtons = styled.div`
  margin-top: 0.5rem;
`;
export const FilterButton = styled(Button)`
  text-transform: none;
  box-shadow: none;
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.regular')};
  border: 1px solid ${themeVal('color.smoke')};
  margin-right: ${themeVal('layout.space')};
`;
