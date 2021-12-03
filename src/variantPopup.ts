import { Emitter } from 'nanoevents';

import { bindKey } from './bindKey';
import { Emoji, VariationData } from './types';
import Renderer from './renderers/renderer';
import { HIDE_VARIANT_POPUP } from './events';
import { renderEmojiContainer } from './emojiContainer';
import { renderTemplate } from './renderTemplate';

const template = `
  <div class="{{classes.variantOverlay}}">
    <div class="{{classes.variantPopup}}"></div>
  </div>
`;

export function renderVariantPopup(events: Emitter, renderer: Renderer, emoji: Emoji, options: any): HTMLElement {
  const container = renderTemplate(template);
  const popup = container.firstElementChild as HTMLElement;

  container.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();

    if (!popup.contains(event.target as Node)) {
      events.emit(HIDE_VARIANT_POPUP);
    }
  });

  const variations = emoji.variations || [];

  popup.style.setProperty('--emoji-per-row', (variations.length + 1).toString());

  const variationChildren: Array<Emoji | VariationData> = [
    emoji,
    ...variations.map((variation, index) => ({
      name: emoji.name,
      emoji: variation,
      key: `${emoji.name}${index}`
    }))
  ];

  const emojis = renderEmojiContainer(
    variationChildren,
    renderer,
    true,
    events,
    false,
    options,
    true
  );

  popup.replaceChildren(emojis.el);

  setTimeout(() => { emojis.activateFocus(); });

  bindKey({
    key: 'Escape',
    target: popup,
    callback(event) {
        event.stopPropagation();
        events.emit(HIDE_VARIANT_POPUP);
    }
  })

  return container;
}
