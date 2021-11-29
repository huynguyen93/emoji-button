export function createElement(tagName, className) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
}

export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function findByClass(container, className) {
  return container.querySelector(`.${className}`);
}

export function findAllByClass(container, className) {
  return container.querySelectorAll(`.${className}`);
}

export function formatEmojiName(name) {
  const words = name.split(/[-_]/);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);

  return words.join(' ');
}

export function bindMethods(context, methods) {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
}
