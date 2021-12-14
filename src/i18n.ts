import { EmojiCategory } from './types';

export const i18n = {
  search: 'Search emojis...',
  categories: {
    [EmojiCategory.RECENTS]: 'Recent Emojis',
    [EmojiCategory.SMILEYS]: 'Smileys & Emotion',
    [EmojiCategory.PEOPLE]: 'People & Body',
    [EmojiCategory.ANIMALS]: 'Animals & Nature',
    [EmojiCategory.FOOD]: 'Food & Drink',
    [EmojiCategory.ACTIVITIES]: 'Activities',
    [EmojiCategory.TRAVEL]: 'Travel & Places',
    [EmojiCategory.OBJECTS]: 'Objects',
    [EmojiCategory.SYMBOLS]: 'Symbols',
    [EmojiCategory.FLAGS]: 'Flags',
    [EmojiCategory.CUSTOM]: 'Custom'
  },
  notFound: 'No matching emojis found.'
};

export type I18NDefinitions = typeof i18n;
