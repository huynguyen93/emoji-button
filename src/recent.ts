import { Emitter, EMOJI } from './events';

import { isCustom, CustomEmoji, Emoji, EmojiData, EmojiDefinitions, PickerUIElement, RecentEmojiRecord } from './types';

const LOCAL_STORAGE_KEY = 'EmojiButton.recent';

let allEmoji: EmojiData[] = [];

function getName({ emoji }: RecentEmojiRecord) {
  const record = allEmoji.find((e: EmojiData) => {
    e.emoji === emoji || 'varations' in e && (e as Emoji).variations?.includes(emoji)
  });
  return record?.name || '';
}

function flattenEmojis(emojiData: EmojiDefinitions, custom: CustomEmoji[]) {
  allEmoji = Object.keys(emojiData).flatMap(category => emojiData[category]);
  allEmoji.push(...custom);
}

function load() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
}

export function getRecents({ emojiData, custom = [] }: { emojiData: EmojiDefinitions, custom: CustomEmoji[] }) {
  if (!allEmoji) {
    flattenEmojis(emojiData, custom);
  }

  const recents = load();

  return recents.map((recent: RecentEmojiRecord) => ({
    ...recent,
    name: getName(recent)
  }));
}

export function save(emoji: EmojiData, options: { recentsCount: number }) {
  const recents = load();

  const recent: RecentEmojiRecord = {
    emoji: emoji.emoji
  };

  if (isCustom(emoji)) {
    recent.custom = true;
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(
    [recent, ...recents.filter((r: RecentEmojiRecord) => r.emoji !== emoji.emoji)]
    .slice(0, options.recentsCount)));
}

export function listenForEmojis(events: Emitter, options: { uiElements: PickerUIElement[], recentsCount: number }) {
  if (options.uiElements.includes(PickerUIElement.RECENTS)) {
    events.on(EMOJI, ({ emoji, showVariants }) => {
      if (!emoji.variations || !showVariants || !options.uiElements.includes(PickerUIElement.VARIANTS)) {
        save(emoji, options);
      }
    });
  }
}
