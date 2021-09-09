import { EMOJI, HIDE_PREVIEW, SHOW_PREVIEW } from './events';
import { render } from './render';
import { renderTemplate } from './renderTemplate';
import getPlaceholder from './placeholder';

const template = `
  <button 
    class="{{classes.emoji}}" 
    title="{{emoji.name}}" 
    data-emoji="{{emoji.emoji}}"
    tabindex="-1">
  </button>
`;

export function renderEmoji(emoji, renderer, showVariants, showPreview, events, lazy = true) {
  const button = renderTemplate(template, { emoji });
  button.appendChild(render(emoji, renderer, lazy && getPlaceholder()));

  if (emoji.custom) {
    button.dataset.custom = 'true';
  }

  button.addEventListener('click', () => {
    events.emit(EMOJI, { emoji, showVariants, button });
  });

  if (showPreview) {
    const showPreview = () => events.emit(SHOW_PREVIEW, emoji);
    const hidePreview = () => events.emit(HIDE_PREVIEW);

    button.addEventListener('focus', showPreview);
    button.addEventListener('mouseover', showPreview);
    button.addEventListener('blur', hidePreview);
    button.addEventListener('mouseout', hidePreview);
  }

  return button;
}
