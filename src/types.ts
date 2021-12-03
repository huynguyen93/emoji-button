export type EmojiDefinitions = {
  [key: string]: Emoji[];
};

export type Emoji = {
  emoji: string;
  name: string;
  variations?: string[];
  version: number;
  category: number;
};

export type CustomEmoji = {
  custom: true;
  name: string;
  emoji: string;
};

export type EmojiVariation = {
  name: string;
  emoji: string;
  key: string;
};

export type EmojiData = Emoji | CustomEmoji | EmojiVariation;

export type EmojiEmit = {
  url?: string;
  emoji: string;
  name: string;
};

export type CustomEmojiEmit = {
  url: string;
  name: string;
  custom: boolean;
};

export type VariationData = {
  name: string;
  emoji: string;
  key: string;
};

export type RecentEmojiRecord = {
  emoji: string;
  custom?: boolean;
};

export enum EmojiCategory {
  RECENTS = 'recents',
  SMILEYS = 'smileys-emotion',
  PEOPLE = 'people-body',
  ANIMALS = 'animals-nature',
  FOOD = 'food-drink',
  ACTIVITIES = 'activities',
  TRAVEL = 'travel-places',
  OBJECTS = 'objects',
  SYMBOLS = 'symbols',
  FLAGS = 'flags',
  CUSTOM = 'custom'
}

export enum PickerUIElement {
  PREVIEW,
  SEARCH,
  RECENTS,
  VARIANTS,
  CATEGORY_BUTTONS
}

export function isCustom(emoji: any) {
  return 'custom' in emoji && emoji.custom;
}
