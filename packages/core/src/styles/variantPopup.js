import { css } from '@emotion/css';

import { fadeIn, fadeOut, shrink, grow } from './animations';

import { emojiContainer } from './emoji';

export const variantOverlay = css`
  animation: ${fadeIn} var(--animation-duration) var(--animation-easing);
  background: var(--overlay-background-color);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  &.hiding {
    animation: ${fadeOut} var(--animation-duration) var(--animation-easing);

    div {
      animation: ${shrink} var(--animation-duration) var(--animation-easing);
    }
  }
`;

export const variantPopup = css`
  animation: ${grow} var(--animation-duration) var(--animation-easing);
  background: var(--popup-background-color);
  border-radius: 5px;
  margin: 0.5em;
  padding: 0.5em;
  text-align: center;
  user-select: none;

  & > div {
    display: inline-flex;
    gap: 2px;
  }
`;