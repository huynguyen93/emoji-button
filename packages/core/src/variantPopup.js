import { bindKey } from './bindKey';

import { HIDE_VARIANT_POPUP } from './events';
import { renderEmojiContainer } from './emojiContainer';
import { renderTemplate } from './renderTemplate';

const template = `
  <div class="{{classes.variantOverlay}}">
    <div class="{{classes.variantPopup}}"></div>
  </div>
`;

export function renderVariantPopup(events, renderer, emoji, options) {
  const container = renderTemplate(template);
  const popup = container.firstElementChild;

  container.addEventListener('click', event => {
    event.stopPropagation();

    if (!popup.contains(event.target)) {
      events.emit(HIDE_VARIANT_POPUP);
    }
  });

  const variations = emoji.variations || [];
  
  popup.style.setProperty('--emoji-per-row', variations.length + 1);

  const variationChildren = [
    emoji,
    ...variations.map((variation, index) => ({
      name: emoji.name,
      emoji: variation,
      key: `${emoji.name}${index}`
    }))
  ];

  const emojis = renderEmojiContainer(
    'variations',
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
