import { lazyLoadCustom } from './custom';

import Renderer from './renderers/renderer';

export default function lazyLoad(element: HTMLElement, renderer: Renderer): void {
  if (!element.dataset.loaded) {
    if (element.dataset.custom) {
      lazyLoadCustom(element);
    } else {
      renderer.lazyLoad(element);
      element.dataset.loaded = 'true';
      element.style.opacity = '1';
    }
  }
}
