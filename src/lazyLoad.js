import { lazyLoadCustom } from './custom';

export default function lazyLoad(element, renderer) {
  if (!element.dataset.loaded) {
    if (element.dataset.custom) {
      lazyLoadCustom(element);
    } else {
      renderer.lazyLoad(element);
      element.dataset.loaded = 'true';
      // element.style.opacity = '1';
    }
  }
}
