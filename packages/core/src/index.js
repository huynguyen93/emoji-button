import pkg from '../package.json';

import lightTheme from './styles/theme/light';

import * as classes from './styles';

import { createFocusTrap } from 'focus-trap';
import Events from './events';
import { createPopper } from '@popperjs/core';

import { EMOJI, SHOW_SEARCH_RESULTS, HIDE_SEARCH_RESULTS, HIDE_VARIANT_POPUP, PICKER_HIDDEN, SHOWING_PICKER, HIDING_PICKER } from './events';
import { EmojiPreview } from './preview';
import { Search, createSearch } from './search';
import { createElement, empty, findAllByClass } from './util';
import { VariantPopup } from './variantPopup';
import { listenForEmojis } from './recent';

import { emit as emitCustom } from './custom';

import lazyLoad from './lazyLoad';

import { i18n } from './i18n';

import { createEmojiArea, EmojiArea } from './emojiArea';

const MOBILE_BREAKPOINT = 450;

import { PickerUIElement, EmojiCategory } from './constants';

export { PickerUIElement, EmojiCategory };

const DEFAULT_OPTIONS = {
  placement: 'auto',
  autoHide: true,
  autoFocusSearch: true,
  showAnimation: true,
  recentsCount: 50,
  emojiVersion: 13,
  theme: lightTheme,
  uiElements: [
    PickerUIElement.PREVIEW,
    PickerUIElement.SEARCH,
    PickerUIElement.RECENTS,
    PickerUIElement.VARIANTS,
    PickerUIElement.CATEGORY_BUTTONS
  ],
  categories: [ // TODO include recents and custom here to allow reordering them as well, will need some refactoring
    EmojiCategory.SMILEYS,
    EmojiCategory.PEOPLE,
    EmojiCategory.ANIMALS,
    EmojiCategory.FOOD,
    EmojiCategory.ACTIVITIES,
    EmojiCategory.TRAVEL,
    EmojiCategory.OBJECTS,
    EmojiCategory.SYMBOLS,
    EmojiCategory.FLAGS
  ],
  emojisPerRow: 9,
  rows: 6,
  emojiSize: '1.5em'
};

// REFACTOR TODO:
//
// 0. FIX BROKEN TESTS!
// 4. Look into using basic Mustache templating?
// 5. OR, clean up class selection/element creation
// 6. Use different CSS imports for themes rather than passing a `theme` option
//
// IDEAS:
//
// 1. React component/hook for using Emoji Button?
//
// Drop classes and use objects/factories?

export class EmojiButton {
  constructor(options = {}) {
    this.pickerVisible = false;

    this.events = new Events();
    this.publicEvents = new Events();

    this.options = { ...DEFAULT_OPTIONS, ...options };
    if (!this.options.rootElement) {
      this.options.rootElement = document.body;
    }

    this.i18n = {
      ...i18n,
      ...options.i18n
    };

    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKeydown = this.onDocumentKeydown.bind(this);

    this.theme = this.options.theme;

    if (!this.options.renderer) {
      throw new Error('No Emoji Button renderer was specified');
    }

    this.buildPicker(this.options.renderer);
  }

  /**
   * Adds an event listener to the picker.
   *
   * @param event The name of the event to listen for
   * @param callback The function to call when the event is fired
   */
  on(event, callback) {
    this.publicEvents.on(event, callback);
  }

  /**
   * Removes an event listener from the picker.
   *
   * @param event The name of the event
   * @param callback The callback to remove
   */
  off(event, callback) {
    this.publicEvents.off(event, callback);
  }

  /**
   * Sets any CSS variable values that need to be set.
   */
  setStyleProperties() {
    if (this.options.themeOverrides) {
      Object.keys(this.options.themeOverrides).forEach(styleVar => {
        this.pickerEl.style.setProperty(styleVar, this.options.themeOverrides[styleVar]);
      });
    }

    if (!this.options.showAnimation) {
      this.pickerEl.style.setProperty('--animation-duration', '0s');
    }

    this.options.emojisPerRow &&
      this.pickerEl.style.setProperty('--emoji-per-row', this.options.emojisPerRow.toString());

    this.options.rows && this.pickerEl.style.setProperty('--row-count', this.options.rows.toString());

    this.options.emojiSize && this.pickerEl.style.setProperty('--emoji-size', this.options.emojiSize);

    if (!this.options.uiElements.includes(PickerUIElement.CATEGORY_BUTTONS)) {
      this.pickerEl.style.setProperty('--category-button-height', '0');
    }

    if (this.options.styleProperties) {
      Object.keys(this.options.styleProperties).forEach(key => {
        if (this.options.styleProperties) {
          this.pickerEl.style.setProperty(key, this.options.styleProperties[key]);
        }
      });
    }
  }

  /**
   * Shows the search results in the main emoji area.
   *
   * @param searchResults The element containing the search results.
   */
  showSearchResults(searchResults) {
    empty(this.pickerContent);
    searchResults.classList.add(classes.searchResults);
    this.pickerContent.appendChild(searchResults);
  }

  /**
   * Hides the search results and resets the picker.
   */
  hideSearchResults() {
    if (this.pickerContent.firstChild !== this.emojiArea.container) {
      empty(this.pickerContent);
      this.pickerContent.appendChild(this.emojiArea.container);
    }

    this.emojiArea.reset();
  }

  /**
   * Emits a selected emoji event.
   * @param param0 The selected emoji and show variants flag
   */
  async emitEmoji({ emoji, showVariants }) {
    if (emoji.variations && showVariants && this.options.uiElements.includes(PickerUIElement.VARIANTS)) {
      this.showVariantPopup(emoji);
    } else {
      if (emoji.custom) {
        this.publicEvents.emit(EMOJI, emitCustom(emoji));
      } else {
        this.publicEvents.emit(EMOJI, await this.renderer.emit(emoji));
      }

      if (this.options.autoHide) {
        this.hidePicker();
      }
    }
  }

  /**
   * Builds the search UI.
   */
  buildSearch() {
    if (this.options.uiElements.includes(PickerUIElement.SEARCH)) {
      this.search = createSearch(
        this.i18n, 
        this.renderer,
        this.events,
        this.filteredEmojis,
        this.options
      );
      this.pickerEl.appendChild(this.search.container);
    }
  }

  /**
   * Builds the emoji preview area.
   */
  buildPreview() {
    if (this.options.uiElements.includes(PickerUIElement.PREVIEW)) {
      this.pickerEl.appendChild(new EmojiPreview(this.events, this.renderer, this.options).render());
    }
  }

  /**
   * Initializes any plugins that were specified.
   */
  initPlugins() {
    if (this.options.plugins) {
      const pluginContainer = createElement('div', pluginContainer);

      this.options.plugins.forEach(plugin => {
        if (!plugin.render) {
          throw new Error('Emoji Button plugins must have a "render" function.');
        }
        pluginContainer.appendChild(plugin.render(this));
      });

      this.pickerEl.appendChild(pluginContainer);
    }
  }

  /**
   * Initializes the emoji picker's focus trap.
   */
  initFocusTrap() {
    this.focusTrap = createFocusTrap(this.pickerEl, {
      clickOutsideDeactivates: true,
      initialFocus:
        this.options.uiElements.includes(PickerUIElement.SEARCH) && this.options.autoFocusSearch
          ? `.${classes.search}`
          : `.${classes.emoji}[tabindex="0"]`
    });
  }

  filterEmojis() {
    this.filteredEmojis = {};
    Object.keys(this.options.emojiData).forEach(category => {
      this.filteredEmojis[category] = this.options.emojiData[category]
        .filter(e => !e.version || parseFloat(e.version) <= parseFloat(this.options.emojiVersion));
    });
  }

  /**
   * Builds the emoji picker.
   */
  buildPicker(renderer) {
    this.renderer = renderer;

    this.filterEmojis();

    this.pickerEl = createElement('div', 'emoji-picker');
    this.pickerEl.classList.add(classes.picker);
    this.pickerEl.classList.add(this.theme);

    this.setStyleProperties();
    this.initFocusTrap();

    this.pickerContent = createElement('div', classes.content);

    this.initPlugins();
    this.buildSearch();

    this.pickerEl.appendChild(this.pickerContent);

    this.emojiArea = createEmojiArea(this.events, this.renderer, this.i18n, this.options, this.filteredEmojis);
    this.pickerContent.appendChild(this.emojiArea.container);

    listenForEmojis(this.events, this.options);

    this.cleanupEvents = this.events.bindEvents(
      {
        [SHOW_SEARCH_RESULTS]: this.showSearchResults,
        [HIDE_SEARCH_RESULTS]: this.hideSearchResults,
        [EMOJI]: this.emitEmoji
      },
      this
    );

    this.buildPreview();

    this.wrapper = createElement('div');

    this.wrapper.appendChild(this.pickerEl);
    this.wrapper.style.display = 'none';

    if (this.options.zIndex) {
      this.wrapper.style.zIndex = this.options.zIndex + '';
    }

    if (this.options.rootElement) {
      this.options.rootElement.appendChild(this.wrapper);
    }

    this.observeForLazyLoad();
  }

  /**
   * Shows the variant popup for an emoji.
   *
   * @param emoji The emoji whose variants are to be shown.
   */
  showVariantPopup(emoji) {
    const variantPopup = new VariantPopup(this.events, this.renderer, emoji, this.options).render();

    if (variantPopup) {
      this.pickerEl.appendChild(variantPopup);
    }

    this.events.once(HIDE_VARIANT_POPUP, () => {
      if (variantPopup) {
        variantPopup.classList.add('hiding');
        setTimeout(() => {
          variantPopup && this.pickerEl.removeChild(variantPopup);
        }, 200);
      }
    });
  }

  /**
   * Initializes the IntersectionObserver for lazy loading emoji images
   * as they are scrolled into view.
   */
  observeForLazyLoad() {
    this.observer = new IntersectionObserver(this.handleIntersectionChange.bind(this), {
      root: this.emojiArea.emojiContainer
    });

    findAllByClass(this.emojiArea.emojiContainer, classes.emoji).forEach(element => {
      if (this.shouldLazyLoad(element)) {
        this.observer.observe(element);
      }
    });
  }

  /**
   * IntersectionObserver callback that triggers lazy loading of emojis
   * that need it.
   *
   * @param entries The entries observed by the IntersectionObserver.
   */
  handleIntersectionChange(entries) {
    Array.prototype.filter
      .call(entries, entry => entry.intersectionRatio > 0)
      .map(entry => entry.target)
      .forEach(element => {
        lazyLoad(element, this.renderer);
      });
  }

  /**
   * Determines whether or not an emoji should be lazily loaded.
   *
   * @param element The element containing the emoji.
   * @return true if the emoji should be lazily loaded, false if not.
   */
  shouldLazyLoad(element) {
    return this.renderer.lazyLoad || element.dataset.custom === 'true';
  }

  /**
   * Handles a click on the document, so that the picker is hidden
   * if the mouse is clicked outside of it.
   *
   * @param event The MouseEvent that was dispatched.
   */
  onDocumentClick(event) {
    if (!this.pickerEl.contains(event.target)) {
      this.hidePicker();
    }
  }

  /**
   * Destroys the picker. Once this is called, the picker can no longer
   * be shown.
   */
  destroyPicker() {
    this.events.off(EMOJI);
    this.events.off(HIDE_VARIANT_POPUP);

    this.cleanupEvents();

    if (this.options.rootElement) {
      this.options.rootElement.removeChild(this.wrapper);
      this.popper?.destroy();
    }

    this.observer?.disconnect();

    if (this.options.plugins) {
      this.options.plugins.forEach(plugin => {
        plugin?.destroy();
      });
    }

    this.events.destroy();
  }

  /**
   * Hides, but does not destroy, the picker.
   */
  hidePicker() {
    this.hideInProgress = true;
    this.focusTrap.deactivate();
    this.pickerVisible = false;

    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = undefined;
    }

    // In some browsers, the delayed hide was triggering the scroll event handler
    // and stealing the focus. Remove the scroll listener before doing the delayed hide.
    this.emojiArea.emojiContainer.removeEventListener('scroll', this.emojiArea.highlightCategory);

    this.pickerEl.classList.add('hiding');

    // Let the transition finish before actually hiding the picker so that
    // the user sees the hide animation.
    setTimeout(
      () => {
        this.wrapper.style.display = 'none';
        this.pickerEl.classList.remove('hiding');

        if (this.pickerContent.firstChild !== this.emojiArea.container) {
          empty(this.pickerContent);
          this.pickerContent.appendChild(this.emojiArea.container);
        }

        this.search?.clearSearch();

        this.events.emit(HIDE_VARIANT_POPUP);

        this.hideInProgress = false;
        this.popper?.destroy();

        this.publicEvents.emit(PICKER_HIDDEN);
      },
      this.options.showAnimation ? 170 : 0
    );

    setTimeout(() => {
      document.removeEventListener('click', this.onDocumentClick);
      document.removeEventListener('keydown', this.onDocumentKeydown);
    });
  }

  /**
   * Shows the picker.
   *
   * @param referenceEl The element to position relative to if relative positioning is used.
   */
  showPicker(referenceEl) {
    if (this.hideInProgress) {
      // TODO use animationEnd event instead of static setTimeout
      setTimeout(() => this.showPicker(referenceEl), 100);
      return;
    }

    if (this.options.uiElements.includes(PickerUIElement.RECENTS)) {
      this.emojiArea.updateRecents();
    }

    this.pickerVisible = true;
    this.wrapper.style.display = 'block';

    this.determineDisplay(referenceEl);

    this.focusTrap.activate();

    setTimeout(() => {
      this.addEventListeners();
      this.setInitialFocus();
    });

    this.emojiArea.reset();
    this.events.emit(SHOWING_PICKER);
  }

  /**
   * Determines which display and position are used for the picker, based on
   * the viewport size and specified options.
   *
   * @param referenceEl The element to position relative to if relative positioning is used.
   */
  determineDisplay(referenceEl) {
    if (window.matchMedia(`screen and (max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
      this.showMobileView();
    } else if (typeof this.options.placement === 'string') {
      this.setRelativePosition(referenceEl);
    } else {
      this.setFixedPosition();
    }
  }

  /**
   * Sets the initial focus to the appropriate element, depending on the specified
   * options.
   */
  setInitialFocus() {
    // If the search field is visible and should be auto-focused, set the focus on
    // the search field. Otherwise, the initial focus will be on the first focusable emoji.
    const initialFocusElement = this.pickerEl.querySelector(
      this.options.uiElements.includes(PickerUIElement.SEARCH) && this.options.autoFocusSearch
        ? `.${classes.search}`
        : `.${classes.emoji}[tabindex="0"]`
    );
    initialFocusElement.focus();
  }

  /**
   * Adds the event listeners that will close the picker without selecting an emoji.
   */
  addEventListeners() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeydown);
  }

  /**
   * Sets relative positioning with Popper.js.
   *
   * @param referenceEl The element to position relative to.
   */
  setRelativePosition(referenceEl) {
    this.popper = createPopper(referenceEl, this.wrapper, {
      placement: this.options.placement
    });
  }

  /**
   * Sets fixed positioning.
   */
  setFixedPosition() {
    if (this.options?.position) {
      this.wrapper.style.position = 'fixed';

      const fixedPosition = this.options.position;

      Object.keys(fixedPosition).forEach(key => {
        this.wrapper.style[key] = fixedPosition[key];
      });
    }
  }

  /**
   * Shows the picker in a mobile view.
   */
  showMobileView() {
    const style = window.getComputedStyle(this.pickerEl);
    const htmlEl = document.querySelector('html');
    const viewportHeight = htmlEl?.clientHeight;
    const viewportWidth = htmlEl?.clientWidth;

    const height = parseInt(style.height);
    const newTop = viewportHeight ? viewportHeight / 2 - height / 2 : 0;

    const width = parseInt(style.width);
    const newLeft = viewportWidth ? viewportWidth / 2 - width / 2 : 0;

    this.wrapper.style.position = 'fixed';
    this.wrapper.style.top = `${newTop}px`;
    this.wrapper.style.left = `${newLeft}px`;
    this.wrapper.style.zIndex = '5000';

    this.overlay = createElement('div', classes.overlay);
    document.body.appendChild(this.overlay);
  }

  /**
   * Toggles the picker's visibility.
   *
   * @param referenceEl The element to position relative to if relative positioning is used.
   */
  togglePicker(referenceEl) {
    this.pickerVisible ? this.hidePicker() : this.showPicker(referenceEl);
  }

  /**
   * Determines whether or not the picker is currently visible.
   * @return true if the picker is visible, false if not.
   */
  isPickerVisible() {
    return this.pickerVisible;
  }

  /**
   * Handles a keydown event on the document.
   * @param event The keyboard event that was dispatched.
   */
  onDocumentKeydown(event) {
    if (event.key === 'Escape') {
      // Escape closes the picker.
      this.hidePicker();
    } else if (event.key === 'Tab') {
      // The `keyboard` class adds some extra styling to indicate keyboard focus.
      this.pickerEl.classList.add('keyboard');
    } else if (event.key.match(/^[\w]$/) && this.search) {
      // If a search term is entered, move the focus to the search field.
      this.search.focusSearch();
    }
  }

  /**
   * Sets the theme to use for the picker.
   */
  setTheme(theme) {
    if (theme !== this.theme) {
      this.pickerEl.classList.remove(this.theme);
      this.theme = theme;
      this.pickerEl.classList.add(theme);
    }
  }
}

EmojiButton.version = pkg.version;
