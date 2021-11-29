const template = '<div class="{{classes.imagePlaceholder}}">{{{image}}}</div>';

import { renderTemplate } from './renderTemplate';

import { image } from './icons';

const placeholder = renderTemplate(template, { image });

export default function getPlaceholder() {
  return placeholder.cloneNode(true);
}
