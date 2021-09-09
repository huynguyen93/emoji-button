import { css } from '@emotion/css';

import { fadeOut } from './animations';

export const emoji = css`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--emoji-font);
  font-size: var(--emoji-size);
  height: 1.5em;
  justify-content: center;
  margin: 0;
  outline: none;
  overflow: hidden;
  padding: 0;
  width: 1.5em;

  img.emoji {
    height: 1em;
    width: 1em;
    margin: 0 0.05em 0 0.1em;
    vertical-align: -0.1em;
  }

  &:focus {
    outline: 1px dotted var(--focus-indicator-color);
  }

  &:focus,
  &:hover {
    background: var(--hover-color);
  }
`;

export const emojis = css`
  height: calc(var(--content-height) - var(--category-button-height) - 0.5em);
  overflow-y: auto;
  position: relative;

  &.hiding {
    animation: ${fadeOut} 0.05s var(--animation-easing);
  }
`;

export const emojiContainer = css`
  display: grid;
  justify-content: space-between;
  padding: 0.5em;
  grid-template-columns: repeat(var(--emoji-per-row), calc(var(--emoji-size) * var(--emoji-size-multiplier)));
  grid-auto-rows: calc(var(--emoji-size) * var(--emoji-size-multiplier));
`;

export const customEmoji = css`
  width: 1em;
  height: 1em;
`;

export const imagePlaceholder = css`
  color: var(--image-placeholder-color);
  opacity: 0.1;
`;
