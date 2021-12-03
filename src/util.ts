export function createElement(tagName: string, className: string): HTMLElement {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
}

export function empty(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function findByClass(container: HTMLElement, className: string): HTMLElement | null {
  return container.querySelector(`.${className}`);
}

export function findAllByClass(container: HTMLElement, className: string): NodeList {
  return container.querySelectorAll(`.${className}`);
}

export function formatEmojiName(name: string): string {
  const words = name.split(/[-_]/);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);

  return words.join(' ');
}
