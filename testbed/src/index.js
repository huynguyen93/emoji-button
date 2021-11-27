import './index.css';

import lightTheme from '@emoji-button/core/dist/themes/light';
import darkTheme from '@emoji-button/core/dist/themes/dark';

import { EmojiButton } from '@emoji-button/core';
import NativeRenderer from '@emoji-button/renderer-native';
import createTwemojiRenderer from '@emoji-button/renderer-twemoji';
import emojiData from '@emoji-button/emoji-data/dist/en';

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
    theme: lightTheme,
    placement: 'bottom-start',
    emojiData,
    custom: [
      {
        name: 'O RLY?',
        emoji: '/orly.jpg'
      },
      {
        name: '"> <img src="foobar" onerror="alert(1);" /> <',
        emoji: '"> <img src="foobar" onerror="alert(1);" /> <',
      }
    ],
    renderer: NativeRenderer
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
    theme: darkTheme,
    placement: 'bottom-start',
    emojiData,
    renderer: createTwemojiRenderer()
  },
  ({ url }) => {
    twemoji.innerHTML = `<img src="${url}" />`;
  }
);
