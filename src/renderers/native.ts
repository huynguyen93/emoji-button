import Renderer from './renderer';

import { EmojiData, EmojiEmit } from '../types';

export default class NativeRenderer extends Renderer  {
  emit(emoji: EmojiData): EmojiEmit {
    console.log({ emoji });
    return {
      emoji: emoji.emoji,
      name: emoji.name
    };
  }

  render(emoji: EmojiData): HTMLElement {
    const container = document.createElement('span');
    container.innerHTML = emoji.emoji;
    return container;
  }
}
