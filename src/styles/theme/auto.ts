import light from './light';
import dark from './dark';

import { css } from '@emotion/css';

export default css`
  @media (prefers-color-scheme: light) {
    ${light};
  }

  @media (prefers-color-scheme: dark) {
    ${dark};
  }
`;
