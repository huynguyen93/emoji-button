import { EMOJI } from './events';

import { PickerUIElement } from './constants';

const LOCAL_STORAGE_KEY = 'EmojiButton.recent';

let allEmoji;

function getName({ emoji }) {
  const record = allEmoji.find(e => e.emoji === emoji || e.variations?.includes(emoji));
  return record?.name || '';
}

function flattenEmojis(emojiData, custom) {
  allEmoji = Object.keys(emojiData).flatMap(category => emojiData[category]);
  allEmoji.push(...custom);
}

function load() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
}

export function getRecents({ emojiData, custom = [] }) {
  if (!allEmoji) {
    flattenEmojis(emojiData, custom);
  }

  const recents = load();

  return recents.map(recent => ({
    ...recent,
    name: getName(recent)
  }));
}

export function save(emoji, options) {
  const recents = load();

  const recent = {
    emoji: emoji.emoji
  };

  if (emoji.custom) {
    recent.custom = true;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([recent, ...recents.filter(r => r.emoji !== emoji.emoji)].slice(0, options.recentsCount)));
}

export function listenForEmojis(events, options) {
  if (options.uiElements.includes(PickerUIElement.RECENTS)) {
    events.on(EMOJI, ({ emoji, showVariants }) => {
      if (!emoji.variations || !showVariants || !options.uiElements.includes(PickerUIElement.VARIANTS)) {
        save(emoji, options);
      }
    });
  }
}
