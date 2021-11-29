import twemoji from 'twemoji';

const DEFAULT_OPTIONS = {
  ext: '.svg',
  folder: 'svg'
};

export default class TwemojiRenderer {
  constructor(options) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }

  emit({ emoji, name }) {
    return new Promise(resolve => {
      twemoji.parse(emoji, {
        ...this.options,
        callback(icon, { base, size, ext }) {
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

  render({ emoji }, lazyPlaceholder) {
    if (lazyPlaceholder) {
      return lazyPlaceholder;
    }

    return document
      .createRange()
      .createContextualFragment(twemoji.parse(emoji, this.options))
      .firstElementChild;
  }

  lazyLoad(element) {
    if (element.dataset.emoji) {
      element.innerHTML = twemoji.parse(element.dataset.emoji, this.options);
    }
  }
}
