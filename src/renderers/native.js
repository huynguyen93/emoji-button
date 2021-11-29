export default class NativeRenderer {
  emit(emoji) {
    return {
      emoji: emoji.emoji,
      name: emoji.name
    };
  }

  render(emoji) {
    const container = document.createElement('span');
    container.innerHTML = emoji.emoji;
    return container;
  }
}
