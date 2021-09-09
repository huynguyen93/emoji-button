export const EMOJI = 'emoji';
export const SHOW_SEARCH_RESULTS = 'showSearchResults';
export const HIDE_SEARCH_RESULTS = 'hideSearchResults';
export const SHOW_PREVIEW = 'showPreview';
export const HIDE_PREVIEW = 'hidePreview';
export const HIDE_VARIANT_POPUP = 'hideVariantPopup';
export const CATEGORY_CLICKED = 'categoryClicked';
export const PICKER_HIDDEN = 'hidden';
export const SET_ACTIVE_CATEGORY = 'setActiveCategory';
export const HIDING_PICKER = 'hidingPicker';
export const SHOWING_PICKER = 'showingPicker';

// TODO write tests
export default class Events {
  constructor() {
    this.listeners = {};
  }

  bindEvents(bindings, context) {
    const cleanupFns = Object.keys(bindings).map(event => this.on(event, bindings[event], context));

    return () => {
      cleanupFns.forEach(cleanupFn => cleanupFn());
    };
  }

  getListeners(event) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    return this.listeners[event];
  }

  addListener(event, listener) {
    this.listeners[event] = [...this.getListeners(event), listener];

    return () => {
      this.off(event, listener.callback);
    };
  }

  on(event, callback, context) {
    return this.addListener(event, { callback, context });
  }

  once(event, callback, context) {
    return this.addListener(event, { callback, context, once: true });
  }

  off(event, callback) {
    if (callback) {
      this.listeners[event] = this.getListeners(event).filter(listener => listener.callback !== callback);
    } else {
      this.listeners[event] = [];
    }
  }

  emit(event, ...args) {
    this.getListeners(event).forEach(({ callback, context, once }) => {
      if (context) {
        callback.apply(context, args);
      } else {
        callback(...args);
      }

      if (once) {
        this.off(event, callback);
      }
    });
  }

  destroy() {
    this.listeners = {};
  }
}
