import { renderCustom } from './custom';

export function render(emoji, renderer, lazyPlaceholder) {
  if (emoji.custom) {
    return renderCustom(emoji, lazyPlaceholder);
  }

  return renderer.render(emoji, lazyPlaceholder);
}
