import { EmojiButton } from '../src/index';
import NativeRenderer from '../src/renderers/native';
import emojiData from '../src/emoji-data/en';

document.querySelector('#version').innerHTML = `v${EmojiButton.version}`;

const picker = new EmojiButton({
  renderer: new NativeRenderer(),
  emojiData
});

const button = document.querySelector('#native .emoji-button');
button.addEventListener('click', () => {
  picker.togglePicker(button);
});
