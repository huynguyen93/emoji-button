import { EmojiData, EmojiEmit } from '../types';

export default abstract class Renderer {
  abstract emit(emoji: EmojiData): EmojiEmit | Promise<EmojiEmit>;
  abstract render(emoji: EmojiData, lazyPlaceholder?: HTMLElement): HTMLElement;
}