import { Emitter } from './events';

import { SHOW_PREVIEW, HIDE_PREVIEW } from './events';
import { EmojiPreview } from './preview';

describe('EmojiPreview', () => {
  test('should show an emoji preview on the SHOW_PREVIEW event and remove it on the HIDE_PREVIEW event', () => {
    const events = new Emitter();
    const preview = new EmojiPreview(events, { style: 'native' }).render();

    events.emit(SHOW_PREVIEW, { emoji: '⚡️', name: 'zap' });

    const previewEmoji = preview.querySelector('.emoji-picker__preview-emoji');
    expect(previewEmoji.innerHTML).toBe('⚡️');

    const previewName = preview.querySelector('.emoji-picker__preview-name');
    expect(previewName.innerHTML).toBe('zap');

    events.emit(HIDE_PREVIEW);

    expect(previewEmoji.innerHTML).toBe('');
    expect(previewName.innerHTML).toBe('');
  });
});
