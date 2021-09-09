import * as classes from './styles';

import { createElement } from './util';
import { renderTemplate } from './renderTemplate';
import getPlaceholder from './placeholder';

const template = '<img class="{{classes.customEmoji}}" src="{{emoji.emoji}}">';

export function emit(emoji) {
  return {
    url: emoji.emoji,
    name: emoji.name,
    custom: true
  };
}

export function renderCustom(emoji, lazy) {
  return lazy ? getPlaceholder() : renderTemplate(template, { emoji });
}

export function lazyLoadCustom(element) {
  if (element.dataset.emoji) {
    const img = createElement('img', classes.customEmoji);
    img.src = element.dataset.emoji;
    element.innerText = '';
    element.appendChild(img);
  }
}
