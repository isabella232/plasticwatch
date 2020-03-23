import styled from 'styled-components';
import { themeVal } from './utils/general';
import media from './utils/media-queries';

const InnerPanel = styled.article`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-between;
  margin: 2rem 0 0;
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 6px 1px ${themeVal('color.shadow')};
  padding: 1rem;
  ${media.mediumUp`
    padding: 1.5rem;
    flex: 1;
  `}
`;

export default InnerPanel;
