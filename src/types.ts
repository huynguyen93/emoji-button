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

// export type EmojiData = {
//   emoji: string;
//   name: string;
//   variations?: string[];
//   version: number;
//   category: number;
//   custom?: boolean;
// };

export type EmojiEmit = {
  url?: string;
  emoji: string;
  name: string;
}

export type CustomEmojiEmit = {
  url: string;
  name: string;
  custom: boolean;
}

export type VariationData = {
  name: string;
  emoji: string;
  key: string;
}

export function isCustom(emoji: any) {
  return 'custom' in emoji && emoji.custom;
}

export function hasVariations(emoji: EmojiData) {
  return 'variations' in emoji && emoji.variations;
}
