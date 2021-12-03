import Mustache from 'mustache';

import * as classes from './styles';

export function renderTemplate(template: string, context = {}): HTMLElement {
  return (document
    .createRange()
    .createContextualFragment(renderMarkup(template, context))
    .firstElementChild) as HTMLElement;
}

export function renderMarkup(template: string, context = {}): string {
  return Mustache.render(template.trim(), {
    ...context,
    classes
  });
}