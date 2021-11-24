import './index.css';

import lightTheme from '@emoji-button/core/dist/themes/light';
import darkTheme from '@emoji-button/core/dist/themes/dark';

import { EmojiButton, EmojiCategory, PickerUIElement } from '@emoji-button/core';
import NativeRenderer from '@emoji-button/renderer-native';
import TwemojiRenderer from '@emoji-button/renderer-twemoji';
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
    // uiElements: [
    //   PickerUIElement.PREVIEW,
    //   PickerUIElement.SEARCH,
    //   PickerUIElement.RECENTS,
    //   PickerUIElement.CATEGORY_BUTTONS
    // ],
    custom: [
      {
        name: 'O RLY?',
        emoji: '/orly.jpg'
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
// createPicker(
//   twemoji,
//   {
//     theme: darkTheme,
//     placement: 'bottom-start',
//     emojiData,
//     renderer: new TwemojiRenderer()
//   },
//   ({ url }) => {
//     twemoji.innerHTML = `<img src="${url}" />`;
//   }
// );
