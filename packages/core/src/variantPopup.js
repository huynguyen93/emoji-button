import { renderEmoji } from './emoji';
import { bindKey } from './bindKey';
import { createElement, findAllByClass, findByClass } from './util';

import { HIDE_VARIANT_POPUP } from './events';
import { renderEmojiContainer } from './emojiContainer';
import { renderTemplate } from './renderTemplate';

import * as classes from './styles';

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

export class VariantPopup {
  constructor(events, renderer, emoji, options) {
    this.events = events;
    this.renderer = renderer;
    this.emoji = emoji;
    this.options = options;

    this.focusedEmojiIndex = 0;
  }

  getEmoji(index) {
    return findAllByClass(this.popup, classes.emoji)[index];
  }

  setFocusedEmoji(newIndex) {
    const currentFocusedEmoji = this.getEmoji(this.focusedEmojiIndex);
    currentFocusedEmoji.tabIndex = -1;

    this.focusedEmojiIndex = newIndex;
    const newFocusedEmoji = this.getEmoji(this.focusedEmojiIndex);
    newFocusedEmoji.tabIndex = 0;
    newFocusedEmoji.focus();
  }

  render() {
    this.popup = createElement('div', classes.variantPopup);

    const overlay = createElement('div', classes.variantOverlay);
    overlay.addEventListener('click', event => {
      event.stopPropagation();

      if (!this.popup.contains(event.target)) {
        this.events.emit(HIDE_VARIANT_POPUP);
      }
    });

    this.popup.appendChild(
      renderEmoji(this.emoji, this.renderer, false, false, this.events, false)
    );

    (this.emoji.variations || []).forEach((variation, index) =>
      this.popup.appendChild(
        renderEmoji(
          {
            name: this.emoji.name,
            emoji: variation,
            key: this.emoji.name + index
          },
          this.renderer,
          false,
          false,
          this.events,
          false
        )
      )
    );

    const firstEmoji = findByClass(this.popup, classes.emoji);
    this.focusedEmojiIndex = 0;
    firstEmoji.tabIndex = 0;

    setTimeout(() => firstEmoji.focus());

    this.popup.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') {
        this.setFocusedEmoji(Math.min(this.focusedEmojiIndex + 1, findAllByClass(this.popup, classes.emoji).length - 1));
      } else if (event.key === 'ArrowLeft') {
        this.setFocusedEmoji(Math.max(this.focusedEmojiIndex - 1, 0));
      } else if (event.key === 'Escape') {
        event.stopPropagation();
        this.events.emit(HIDE_VARIANT_POPUP);
      }
    });

    overlay.appendChild(this.popup);

    return overlay;
  }
}
