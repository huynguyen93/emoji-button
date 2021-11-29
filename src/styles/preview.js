import { css } from '@emotion/css';

export const preview = css`
  align-items: center;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: row;
  height: var(--emoji-preview-size);
  padding: 0.5em;
`;

export const previewEmoji = css`
  font-size: var(--emoji-preview-size);
  margin-right: 0.25em;
  font-family: var(--emoji-font);

  img.emoji {
    height: 1em;
    width: 1em;
    margin: 0 0.05em 0 0.1em;
    vertical-align: -0.1em;
  }
`;

export const previewName = css`
  color: var(--text-color);
  font-size: 0.85em;
  overflow-wrap: break-word;
  word-break: break-all;
`;
