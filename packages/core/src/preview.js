import { SHOW_PREVIEW, HIDE_PREVIEW } from './events';

import { render } from './render';

import { renderTemplate } from './renderTemplate';

const template = `
  <div class="{{classes.preview}}">
    <div class="{{classes.previewEmoji}}"></div>
    <div class="{{classes.previewName}}">{{name}}</div>
  </div>
`;

export class EmojiPreview {
  constructor(events, renderer, options) {
    this.events = events;
    this.renderer = renderer;
    this.options = options;
  }

  render() {
    const preview = renderTemplate(template);
    [this.emoji, this.name] = preview.children;

    this.events.bindEvents(
      {
        [SHOW_PREVIEW]: this.showPreview,
        [HIDE_PREVIEW]: this.hidePreview
      },
      this
    );

    return preview;
  }

  showPreview(emoji) {
    this.emoji.replaceChildren(render(emoji, this.renderer));
    this.name.innerHTML = emoji.name;
  }

  hidePreview() {
    this.emoji.replaceChildren();
    this.name.replaceChildren();
  }
}
