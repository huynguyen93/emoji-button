import Mustache from 'mustache';

import * as classes from './styles';

export function renderTemplate(template, context) {
  return document
    .createRange()
    .createContextualFragment(renderMarkup(template, context))
    .firstElementChild;
}

export function renderMarkup(template, context = {}) {
  return Mustache.render(template.trim(), {
    ...context,
    classes
  });
}