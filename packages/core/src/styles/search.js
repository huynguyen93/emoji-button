import { css } from '@emotion/css';

export const searchResults = css`
  height: var(--content-height);
  overflow-y: auto;
`;

export const searchContainer = css`
  display: flex;
  height: var(--search-height);
  margin: 0.5em;
  margin-bottom: 0.25em;
  position: relative;
`;

export const search = css`
  background: var(--search-background-color);
  border-radius: 3px;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  color: var(--text-color);
  font-size: 0.85em;
  outline: none;
  padding-right: 2em;
  padding: 0.5em 2.25em 0.5em 0.5em;
  width: 100%;

  &:focus {
    border: 1px solid var(--search-focus-border-color);
  }

  &::placeholder {
    color: var(--search-placeholder-color);
  }
`;

export const clearButton = css`
  border: 0;
  color: var(--search-icon-color);
  background: transparent;
  cursor: pointer;
`;

export const searchIcon = css`
  color: var(--search-icon-color);
  height: 1em;
  position: absolute;
  right: 0.75em;
  top: calc(50% - 0.5em);
  width: 1em;

  img {
    width: 1em;
    height: 1em;
  }
`;

export const searchNotFound = css`
  color: var(--secondary-text-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  text-align: center;

  div {
    color: var(--secondary-text-color);
  }
`;

export const searchNotFoundMessage = css`
  color: var(--secondary-text-color);
  font-size: 1.25em;
  font-weight: bold;
  margin: 0.5em 0;
`;

export const searchNotFoundIcon = css`
  font-size: 3em;

  img {
    width: 1em;
    height: 1em;
  }
`;
