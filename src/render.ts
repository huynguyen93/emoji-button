import { renderCustom } from './custom';

import { EmojiData, isCustom } from './types';
import Renderer from './renderers/renderer';

export function render(emoji: EmojiData, renderer: Renderer, lazyPlaceholder?: HTMLElement) {
  if (isCustom(emoji)) {
    return renderCustom(emoji as EmojiData, lazyPlaceholder != null);
  }

  return renderer.render(emoji, lazyPlaceholder);
}
