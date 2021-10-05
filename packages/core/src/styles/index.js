import { css } from '@emotion/css';

import { show, hide } from './animations'

import { baseTheme } from './theme/base';

export * from './emoji';
export * from './categories';
export * from './preview';
export * from './search';
export * from './variantPopup';

export const picker = css`
  ${baseTheme};

  animation: ${show} var(--animation-duration) var(--animation-easing);
  background: var(--background-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  font-family: var(--ui-font);
  font-size: 16px;
  overflow: hidden;
  position: relative;
  width: calc(var(--emoji-per-row) * var(--emoji-size) * var(--emoji-size-multiplier) + 1em + 1.5rem);

  &.hiding {
    animation: ${hide} var(--animation-duration) var(--animation-easing);
  }

  & > * {
    font-family: var(--ui-font);
    box-sizing: content-box;
  }
`;

export const overlay = css`
  background: rgba(0, 0, 0, 0.75);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

export const content = css`
  height: var(--content-height);
  position: relative;
  overflow: hidden;
`;

export const pluginContainer = css`
  margin: 0.5em;
  display: flex;
  flex-direction: row;
`;
