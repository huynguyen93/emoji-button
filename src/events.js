import { createNanoEvents } from 'nanoevents';

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
export const ACTIVATE_CATEGORY = 'activateCategory';
export const NEXT_CATEGORY = 'nextCategory';
export const PREVIOUS_CATEGORY = 'previousCategory';

export default function createEmitter() {
  const unbindFns = [];
  const events = createNanoEvents();

  return {
    on(event, callback) {
      const unbind = events.on(event, callback);
      unbindFns.push(unbind);
      return unbind;
    },
  
    once(event, callback) {
      const unbind = events.on(event, (...args) => {
        unbind();
        callback(...args);
      });
      unbindFns.push(unbind);
      return unbind;
    },
  
    emit(event, ...args) {
      events.emit(event, ...args);
    },

    cleanup() {
      unbindFns.forEach(unbind => unbind());
    }
  };
}
