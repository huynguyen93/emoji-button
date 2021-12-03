import twemoji from 'twemoji';
import { EmojiData, EmojiEmit } from '../types';
import Renderer from './renderer';

type TwemojiOptions = {
  ext: string;
  folder: string;
}

const DEFAULT_OPTIONS = {
  ext: '.svg',
  folder: 'svg'
};

export default class TwemojiRenderer extends Renderer {
  private options;

  constructor(options: TwemojiOptions) {
    super();
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }

  emit({ emoji, name }: EmojiData): Promise<EmojiEmit> {
    return new Promise(resolve => {
      twemoji.parse(emoji, {
        ...this.options,
        callback(icon, { base, size, ext }: any) {
          const imageUrl = `${base}${size}/${icon}${ext}`;
          resolve({
            url: imageUrl,
            emoji,
            name
          });

          return imageUrl;
        }
      });
    });
  }

  render({ emoji }: EmojiData, lazyPlaceholder: HTMLElement): HTMLElement {
    if (lazyPlaceholder) {
      return lazyPlaceholder;
    }

    return (document
      .createRange()
      .createContextualFragment(twemoji.parse(emoji, this.options))
      .firstElementChild) as HTMLElement;
  }

  lazyLoad(element: HTMLElement): void {
    if (element.dataset.emoji) {
      element.innerHTML = twemoji.parse(element.dataset.emoji, this.options);
    }
  }
}
