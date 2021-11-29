import { EmojiButton } from '../src/index';
import TwemojiRenderer from '../src/renderers/twemoji';
import NativeRenderer from '../src/renderers/native';
import emojiData from '../src/emoji-data/en';

document.querySelector('#version').innerHTML = `v${EmojiButton.version}`;

function createPicker(button, options, onEmoji) {
  const picker = new EmojiButton(options);
  picker.on('emoji', data => {
    onEmoji(data);
  });
  button.addEventListener('click', () => picker.togglePicker(button));

  return picker;
}

const native = document.querySelector('#native .emoji-button');
createPicker(
  native,
  {
    placement: 'bottom-start',
    emojiData,
    custom: [
      {
        name: 'kitty',
        emoji: 'https://placekitten.com/200/200'
      }
    ],
    renderer: new NativeRenderer()
  },
  ({ url, emoji }) => {
    if (url) {
      native.innerHTML = `<img src="${url}" />`;
    } else {
      native.innerHTML = emoji;
    }
  }
);

const twemoji = document.querySelector('#twemoji .emoji-button');
createPicker(
  twemoji,
  {
    placement: 'bottom-start',
    emojiData,
    renderer: new TwemojiRenderer()
  },
  ({ url }) => {
    twemoji.innerHTML = `<img src="${url}" />`;
  }
);