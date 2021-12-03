import { Emitter } from 'nanoevents';

import { EMOJI, HIDE_PREVIEW, SHOW_PREVIEW } from './events';
import { render } from './render';
import { renderTemplate } from './renderTemplate';
import getPlaceholder from './placeholder';
import { EmojiData, isCustom } from './types';
import Renderer from './renderers/renderer';

const template = `
  <button 
    class="{{classes.emoji}}" 
    title="{{emoji.name}}" 
    data-emoji="{{emoji.emoji}}"
    tabindex="-1">
  </button>
`;

export function renderEmoji(emoji: EmojiData, renderer: Renderer, showVariants: boolean, showPreview: boolean, events: Emitter, lazy = true) {
  const button = renderTemplate(template, { emoji });

  if (lazy) {
    button.appendChild(render(emoji, renderer, getPlaceholder()));  
  } else {
    button.appendChild(render(emoji, renderer));
  }

  if (isCustom(emoji)) {
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
