import { renderEmoji } from './emoji';
import { ACTIVATE_CATEGORY, NEXT_CATEGORY, PREVIOUS_CATEGORY } from './events';
import { bindKey } from './bindKey';
import { renderTemplate } from './renderTemplate';

const template = '<div class="{{classes.emojiContainer}}"></div>';

const FocusReference = {
  LAST_ROW: 'LAST_ROW',
  LAST_EMOJI: 'LAST_EMOJI',
  START: 'START'
};

export function renderEmojiContainer(key, emojis = [], renderer, showVariants, events, lazy = true, options) {
  const emojiContainer = renderTemplate(template);

  let focusedIndex = 0;

  const emojiElements = emojis.map(emoji => renderEmoji(emoji, renderer, showVariants, true, events, lazy));
  const lastRowStart = emojis.length - (emojis.length % options.emojisPerRow);

  function setFocusedEmoji(index) {
    emojiElements[focusedIndex].tabIndex = -1;
    focusedIndex = index;
    emojiElements[focusedIndex].tabIndex = 0;
    emojiElements[focusedIndex].focus();
  }
  
  if (emojis.length) {
    const fragment = document.createDocumentFragment();
    fragment.append(...emojiElements);
    emojiContainer.appendChild(fragment);
  }

  function getNewFocusIndex(offset, reference) {
    switch (reference) {
      case FocusReference.START:
        return offset;
      case FocusReference.LAST_EMOJI:
        return emojis.length + offset;
      case FocusReference.LAST_ROW:
        return Math.min(emojis.length - 1, lastRowStart + offset);
    }
  }

  function activateFocus(offset = 0, reference = FocusReference.START) {
    setFocusedEmoji(getNewFocusIndex(offset, reference));
  }

  function deactivateFocus() {
    emojiElements[focusedIndex].tabIndex = -1;
    focusedIndex = 0;
  }

  bindKey({
    key: 'ArrowRight',
    target: emojiContainer,
    callback() {
      if (focusedIndex < (emojis.length - 1)) {
        setFocusedEmoji(focusedIndex + 1);
      } else {
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
      } else {
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
      } else {
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
      } else {
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
