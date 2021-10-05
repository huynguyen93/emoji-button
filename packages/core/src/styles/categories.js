import { css } from '@emotion/css';

export const categoryName = css`
  margin: 1px 0;
  font-size: 0.85em;
  padding: 0.5em;
  background-image: var(--category-name-background);
  color: var(--category-name-text-color);
  text-transform: uppercase;
  box-shadow: 0 0 2px 0 var(--category-name-shadow);
  position: sticky;
  top: 0;
`;

export const categoryButtons = css`
  display: flex;
  flex-direction: row;
  height: var(--category-button-height);
  justify-content: space-around;
  margin-bottom: 0.5em;
  padding: 0 0.5em;
`;

export const categoryButton = css`
  background: transparent;
  border: none;
  border-radius: 0.25em;
  color: var(--category-button-color);
  cursor: pointer;
  flex-grow: 1;
  font-size: var(--category-button-size);
  padding: 0;
  vertical-align: middle;

  img {
    width: var(--category-button-size);
    height: var(--category-button-size);
  }

  &:hover {
    color: var(--category-button-highlight-color);
  }

  &:focus {
    outline: 1px dotted var(--focus-indicator-color);
  }

  &.active {
    background: var(--category-button-active-background);
    color: var(--category-button-active-color);
  }
`;