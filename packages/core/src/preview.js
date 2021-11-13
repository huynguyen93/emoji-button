import { SHOW_PREVIEW, HIDE_PREVIEW } from './events';

import { render } from './render';

import { renderTemplate } from './renderTemplate';

const template = `
  <div class="{{classes.preview}}">
    <div class="{{classes.previewEmoji}}"></div>
    <div class="{{classes.previewName}}">{{name}}</div>
  </div>
`;

export function renderPreview(events, renderer, options) {
  const preview = renderTemplate(template);
  const [emojiEl, nameEl] = preview.children;

  events.on(SHOW_PREVIEW, emoji => {
    emojiEl.replaceChildren(render(emoji, renderer));
    nameEl.innerHTML = emoji.name;
  });

  events.on(HIDE_PREVIEW, () => {
    emojiEl.replaceChildren();
    nameEl.replaceChildren();
  });

  return preview;
}
