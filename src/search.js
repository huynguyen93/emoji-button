import * as icons from './icons';

import * as classes from './styles';

import { bindKey } from './bindKey';
import { FocusReference, renderEmojiContainer } from './emojiContainer';
import { HIDE_PREVIEW, SHOW_SEARCH_RESULTS, HIDE_SEARCH_RESULTS } from './events';
import { findByClass } from './util';
import { renderTemplate } from './renderTemplate';

const searchTemplate = `
  <div class="{{classes.searchContainer}}">
    <input class="{{classes.search}}" placeholder="{{i18n.search}}" />
    <span class="{{classes.searchIcon}}"></span>
  </div>
`;

const notFoundTemplate = `
  <div class="{{classes.searchNotFound}}">
    <div class="{{classes.searchNotFoundIcon}}">{{{icon}}}</div>
    <div class="{{classes.searchNotFoundMessage}}">{{i18n.notFound}}
  </div>
`;

const clearButtonTemplate = `
  <button class="{{classes.clearButton}}">
    {{{icon}}}
  </button>
`;

export function createSearch(i18n, renderer, events, emojis, options) {
  const searchData = Object.keys(emojis)
    .flatMap(category => emojis[category]);

  const searchIcon = renderTemplate(icons.search);

  const clearButton = renderTemplate(clearButtonTemplate, {
    icon: icons.times
  });
  clearButton.addEventListener('click', event => {
    event.stopPropagation();
    clearSearch();
  });

  const notFoundMessage = renderTemplate(notFoundTemplate, {
    i18n,
    icon: icons.notFound
  });

  const container = renderTemplate(searchTemplate, {
    i18n
  });

  const iconContainer = findByClass(container, classes.searchIcon);
  iconContainer.appendChild(searchIcon);

  function updateSearchResults() {
    events.emit(HIDE_PREVIEW);
    const searchResults = searchData.filter(emoji => emoji.name.includes(searchInput.value));
    if (searchResults.length) {
      const resultsContainer = renderEmojiContainer(
        searchResults,
        renderer,
        true,
        events,
        false,
        options
      );

      resultsContainer.activateFocus(0, FocusReference.START, false);
      events.emit(SHOW_SEARCH_RESULTS, resultsContainer.el);
    } else {
      events.emit(SHOW_SEARCH_RESULTS, notFoundMessage);
    }
  }

  const searchInput = container.querySelector('input');
  searchInput.addEventListener('input', () => {
    if (searchInput.value) {
      iconContainer.replaceChild(clearButton, iconContainer.firstChild);
    } else {
      events.emit(HIDE_SEARCH_RESULTS);
      iconContainer.replaceChild(searchIcon, iconContainer.firstChild);
    }

    if (!searchInput.value) {
      events.emit(HIDE_SEARCH_RESULTS);
    } else {
      updateSearchResults();
    }
  });


  bindKey({
    key: 'Escape',
    target: searchInput,
    callback: event => {
      if (searchInput.value) {
        event.stopPropagation();
        clearSearch();
        setTimeout(() => searchInput.focus());
      }
    }
  });

  function clearSearch() {
    iconContainer.replaceChild(searchIcon, iconContainer.firstChild);
    searchInput.value = '';
    updateSearchResults();
    events.emit(HIDE_SEARCH_RESULTS);
  }

  function focusSearch() {
    searchInput.focus();
  }

  return {
    container,
    clearSearch,
    focusSearch
  };
}
