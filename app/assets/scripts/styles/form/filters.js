import styled from 'styled-components';
import Form from './form';
import FormInput from './input';
import FormLabel from './label';
import FormToolbar from './toolbar';
import collecticon from '../collecticons';
import { themeVal } from '../utils/general';
import Button from '../button/button';
import media from '../../styles/utils/media-queries';
import { filterComponentProps } from '../../utils';

export const Filters = styled(Form)`
  background: #edf6fb;
  position: sticky;
  top: 0;
  z-index: 42;
  overflow-x: hidden;
  ${media.mediumUp`
    overflow-x: visible;
  `};
`;
export const FilterToolbar = styled(FormToolbar)`
  align-items: flex-end;
  justify-content: flex-start;
  margin: 1rem -2rem 0;
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
  flex: 1 0 50%;
  max-width: 68%;

  + ${Button},
  + * + ${Button} {
    position: relative;
    bottom: 0.25rem;
  }
`;

export const InputWithIcon = styled(FormInput)`
  padding: 1rem 0.5rem;
  background: #FFFFFF;
`;

export const InputIcon = styled(filterComponentProps(FormLabel, ['useIcon']))`
  &::after {
    ${({ useIcon }) => collecticon(useIcon)}
    position: absolute;
    right: 0.5rem;
    top: 50%;
    opacity: 0.64;
  }
`;

export const FilterLabel = styled(FormLabel)`
  font-size: 0.875rem;
  font-weight: ${themeVal('type.base.regular')};
  margin-right: 0.5rem;
  ${media.mediumUp`
    margin-right: ${themeVal('layout.space')};
  `}
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
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  ${media.largeUp`
    margin-right: ${themeVal('layout.space')};
  `}
`;
