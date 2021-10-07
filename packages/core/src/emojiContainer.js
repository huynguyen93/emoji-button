import { renderEmoji } from './emoji';

import { bindKey } from './bindKey';
import { renderTemplate } from './renderTemplate';

const template = '<div class="{{classes.emojiContainer}}"></div>';

export function renderEmojiContainer(emojis = [], renderer, showVariants, events, lazy = true, options) {
  const emojiContainer = renderTemplate(template);

  let focusedIndex = 0;

  const emojiElements = emojis.map(emoji => renderEmoji(emoji, renderer, showVariants, true, events, lazy));

  function setFocusedEmoji(index) {
    emojiElements[focusedIndex].tabIndex = -1;
    focusedIndex = index;
    emojiElements[focusedIndex].focus();
  }
  
  if (emojis.length) {
    emojiElements[0].tabIndex = 0;
    const fragment = document.createDocumentFragment();
    fragment.append(...emojiElements);
    emojiContainer.appendChild(fragment);
  }
  
  // todo when reaching boundary, fire an event
  // so the previous/next category can take over

  bindKey({
    key: 'ArrowRight',
    target: emojiContainer,
    callback() {
      if (focusedIndex < (emojis.length - 1)) {
        setFocusedEmoji(focusedIndex + 1);
      }
    }
  });

  bindKey({
    key: 'ArrowLeft',
    target: emojiContainer,
    callback() {
      if (focusedIndex > 0) {
        setFocusedEmoji(focusedIndex - 1);
      }
    }
  });

  bindKey({
    key: 'ArrowDown',
    target: emojiContainer,
    callback() {
      if (focusedIndex + options.emojisPerRow < emojis.length) {
        setFocusedEmoji(focusedIndex + options.emojisPerRow);
      }
    }
  });

  bindKey({
    key: 'ArrowUp',
    target: emojiContainer,
    callback() {
      if (focusedIndex >= options.emojisPerRow) {
        setFocusedEmoji(focusedIndex - options.emojisPerRow);
      }
    }
  })

  return emojiContainer;
}
