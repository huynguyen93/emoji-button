import * as classes from './styles';
import escape from 'escape-html';

import { createElement } from './util';
import { renderTemplate } from './renderTemplate';
import getPlaceholder from './placeholder';
import { CustomEmojiEmit, EmojiData, EmojiEmit } from './types';

const template = '<img class="{{classes.customEmoji}}" src="{{emoji.emoji}}">';

export function emit(emoji: EmojiData): CustomEmojiEmit {
  return {
    url: emoji.emoji,
    name: emoji.name,
    custom: true
  };
}

export function renderCustom(emoji: EmojiData, lazy: boolean): HTMLElement {
  return lazy ? getPlaceholder() : renderTemplate(template, { emoji });
}

export function lazyLoadCustom(element: HTMLElement) {
  if (element.dataset.emoji) {
    const img = createElement('img', classes.customEmoji) as HTMLImageElement;
    img.src = escape(element.dataset.emoji);
    element.innerText = '';
    element.appendChild(img);
  }
}
