import { renderEmoji } from './emoji';

import { renderTemplate } from './renderTemplate';

const template = '<div class="{{classes.emojiContainer}}"></div>';

export function renderEmojiContainer(emojis, renderer, showVariants, events, lazy = true) {
  const emojiContainer = renderTemplate(template);

  emojis?.forEach(emoji =>
    emojiContainer.appendChild(
      renderEmoji(emoji, renderer, showVariants, true, events, lazy)
    )
  );

  return emojiContainer;
}
