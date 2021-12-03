import { Emitter } from 'nanoevents';

import { renderEmoji } from './emoji';
import { ACTIVATE_CATEGORY, NEXT_CATEGORY, PREVIOUS_CATEGORY } from './events';
import { bindKey } from './bindKey';
import { renderTemplate } from './renderTemplate';
import Renderer from './renderers/renderer';
import { EmojiData, VariationData } from './types';

const template = '<div class="{{classes.emojiContainer}}"></div>';


export enum FocusReference {
  LAST_ROW,
  LAST_EMOJI,
  START
};

export function renderEmojiContainer(emojis: EmojiData[] = [], renderer: Renderer, showVariants: boolean, events: Emitter, lazy = true, options: any, standalone = false) {
  const emojiContainer = renderTemplate(template);

  let focusedIndex = 0;

  const emojiElements = emojis.map(emoji => renderEmoji(emoji, renderer, showVariants, true, events, lazy));
  const lastRowStart = emojis.length - (emojis.length % options.emojisPerRow);

  function setFocusedEmoji(index: number, applyFocus = true) {
    emojiElements[focusedIndex].tabIndex = -1;
    focusedIndex = index;
    emojiElements[focusedIndex].tabIndex = 0;

    if (applyFocus) {
      emojiElements[focusedIndex].focus();
    }
  }
  
  if (emojis.length) {
    const fragment = document.createDocumentFragment();
    fragment.append(...emojiElements);
    emojiContainer.appendChild(fragment);
  }

  function getNewFocusIndex(offset: number, reference: FocusReference) {
    switch (reference) {
      case FocusReference.START:
        return offset;
      case FocusReference.LAST_EMOJI:
        return emojis.length + offset;
      case FocusReference.LAST_ROW:
        return Math.min(emojis.length - 1, lastRowStart + offset);
    }
  }

  function activateFocus(offset = 0, reference = FocusReference.START, applyFocus = true) {
    setFocusedEmoji(getNewFocusIndex(offset, reference), applyFocus);
  }

  function deactivateFocus() {
    if (emojiElements.length) {
      emojiElements[focusedIndex].tabIndex = -1;
      focusedIndex = 0;
    }
  }

  bindKey({
    key: 'ArrowRight',
    target: emojiContainer,
    callback() {
      if (focusedIndex < (emojis.length - 1)) {
        setFocusedEmoji(focusedIndex + 1);
      } else if (!standalone) {
        events.emit(NEXT_CATEGORY);
      }
    }
  });

  bindKey({
    key: 'ArrowLeft',
    target: emojiContainer,
    callback() {
      if (focusedIndex > 0) {
        setFocusedEmoji(focusedIndex - 1);
      } else if (!standalone) {
        events.emit(PREVIOUS_CATEGORY, -1, FocusReference.LAST_EMOJI);
      }
    }
  });

  bindKey({
    key: 'ArrowDown',
    target: emojiContainer,
    callback() {
      if (focusedIndex < lastRowStart) {
        setFocusedEmoji(Math.min(emojis.length - 1, focusedIndex + options.emojisPerRow));
      } else if (!standalone) {
        events.emit(NEXT_CATEGORY, focusedIndex % options.emojisPerRow, FocusReference.START);
      }
    }
  });

  bindKey({
    key: 'ArrowUp',
    target: emojiContainer,
    callback() {
      if (focusedIndex >= options.emojisPerRow) {
        setFocusedEmoji(focusedIndex - options.emojisPerRow);
      } else if (!standalone) {
        events.emit(PREVIOUS_CATEGORY, focusedIndex, FocusReference.LAST_ROW);
      }
    }
  })

  return {
    el: emojiContainer,
    activateFocus,
    deactivateFocus
  };
}
