import { findByClass } from './util';

import * as classes from './styles';

import { renderCategoryButtons, categoryIcons } from './categoryButtons';
import { renderEmojiContainer } from './emojiContainer';

import { 
  CATEGORY_CLICKED, 
  SET_ACTIVE_CATEGORY, 
  SHOWING_PICKER, 
  HIDING_PICKER,
  ACTIVATE_CATEGORY,
  NEXT_CATEGORY,
  PREVIOUS_CATEGORY
} from './events';

import { bindKey } from './bindKey';
import { findAllByClass } from './util';
import { getRecents } from './recent';
import { renderTemplate } from './renderTemplate';
import { PickerUIElement, EmojiCategory } from './constants';

const template = `
  <div>
    <div class="{{classes.emojis}}"></div>
  </div>
`;

const categoryTemplate = `
  <div data-category="{{categoryKey}}">
    <h3 class="{{classes.categoryName}}">
      {{{icon}}}
      {{label}}
    </h3>
  </div>
`;

function getHeaderOffsets(headers) {
  return Array.prototype.map.call(headers, (header, index) =>
    index && header.offsetTop
  );
}

// TODO custom not showing?

export function createEmojiArea(events, renderer, i18n, options, filteredEmojis) {
  let focusedEmoji = null;
  // let focusedIndex = 0;
  let currentCategoryIndex = 0;
  let currentCategoryEl = null;
  let headerOffsets = [];

  const categories = [...options.categories];
  const emojiData = { ...filteredEmojis };

  // TODO add this to the categories earlier so we don't duplicate this logic in categoryButtons
  if (options.uiElements.includes(PickerUIElement.RECENTS)) {
    categories.unshift(EmojiCategory.RECENTS);
    emojiData[EmojiCategory.RECENTS] = getRecents(options);
  }

  if (options.custom) {
    categories.push(EmojiCategory.CUSTOM);
    emojiData[EmojiCategory.CUSTOM] = options.custom.map(custom => ({ ...custom, custom: true }));
  }

  const { el: container, emojiViews } = renderEmojiArea(categories, filteredEmojis, renderer, events, options, i18n);
  const headers = findAllByClass(container, classes.categoryName);
  const emojiContainer = findByClass(container, classes.emojis);

  events.on(PREVIOUS_CATEGORY, (offset, reference) => {
    if (currentCategoryIndex > 0) {
      const currentView = emojiViews[categories[currentCategoryIndex]];
      currentView.deactivateFocus();

      selectCategory({ category: currentCategoryIndex - 1, scroll: false });

      const previousView = emojiViews[categories[currentCategoryIndex]];
      
      previousView.activateFocus(offset, reference);
    }
  });

  events.on(NEXT_CATEGORY, (offset, reference) => {
    if (currentCategoryIndex < categories.length - 1) {
      const currentView = emojiViews[categories[currentCategoryIndex]];
      currentView.deactivateFocus();

      selectCategory({ category: currentCategoryIndex + 1, scroll: false });

      const nextView = emojiViews[categories[currentCategoryIndex]];
      nextView.activateFocus(offset, reference);
    }
  });

  function reset() {
    headerOffsets = getHeaderOffsets(headers);

    let initialCategory = options.initialCategory || categories[0];
    if (initialCategory === EmojiCategory.RECENTS && emojiData.recents.length === 0) {
      initialCategory = categories.indexOf(EmojiCategory.RECENTS) + 1;
    }

    selectCategory({ category: initialCategory });
    
    events.emit(SET_ACTIVE_CATEGORY, currentCategoryIndex, false);
  }

  function updateRecents() {
    const recents = getRecents(options);
    emojiData[EmojiCategory.RECENTS] = recents;

    const recentsContainer = findByClass(emojiContainer, classes.emojiContainer);
    if (recentsContainer?.parentNode) {
      const newView = renderEmojiContainer(EmojiCategory.RECENTS, recents, renderer, true, events, false, options);
      emojiViews[EmojiCategory.RECENTS] = newView;
      recentsContainer.parentNode.replaceChild(
        newView.el,
        recentsContainer
      );
    }
  }

  function setFocusedEmoji(index, focus = true) {
    if (focusedEmoji) {
      focusedEmoji.tabIndex = -1;
    }

    // focusedIndex = index;
    focusedEmoji = currentCategoryEl.children[index];

    if (focusedEmoji) {
      focusedEmoji.tabIndex = 0;

      if (focus) {
        focusedEmoji.focus();
      }
    }
  }

  function highlightCategory() {
    const currentCategoryContainer = currentCategoryEl.parentNode;
    const nextCategoryContainer = currentCategoryContainer.nextSibling;
    
    if (emojiContainer.scrollTop >= nextCategoryContainer.offsetTop) {
      selectCategory({
        category: nextCategoryContainer.dataset.category,
        scroll: false
      });
    } else {
      const previousCategoryContainer = currentCategoryContainer.previousSibling;
      if (previousCategoryContainer && emojiContainer.scrollTop < currentCategoryContainer.offsetTop) {
        selectCategory({
          category: previousCategoryContainer.dataset.category,
          scroll: false
        });
      }
    }
  }

  function selectCategory({ category, focusIndex = 0, focusTarget, scroll = true }) {
    if (focusedEmoji) {
      focusedEmoji.tabIndex = -1;
    }

    currentCategoryIndex = typeof category === 'number' ? category : categories.indexOf(category);
    currentCategoryEl = findByClass(emojiContainer.children[currentCategoryIndex], classes.emojiContainer);

    setFocusedEmoji(focusIndex, focusTarget === 'emoji');

    events.emit(SET_ACTIVE_CATEGORY, currentCategoryIndex, focusTarget === 'category');

    if (scroll) {
      const targetPosition = headerOffsets[currentCategoryIndex];
      emojiContainer.scrollTop = targetPosition;
    }
  }

  function nextCategory(focusIndex) {
    traverseCategory(1, focusIndex);
  }

  function previousCategory(focusIndex) {
    traverseCategory(-1, focusIndex);
  }

  function traverseCategory(direction, focusIndex) {
    selectCategory({
      category: currentCategoryIndex + direction,
      focusTarget: 'emoji',
      focusIndex,
      scroll: false
    });
  }

  function pauseScrollListener(fn) {
    return function() {
      emojiContainer.removeEventListener('scroll', highlightCategory);
      fn();
      setTimeout(() => emojiContainer.addEventListener('scroll', highlightCategory));
    }
  }

  emojiContainer.addEventListener('scroll', highlightCategory);

  events.on(CATEGORY_CLICKED, category => selectCategory({ category }));

  updateRecents();

  return {
    container,
    emojiContainer,
    updateRecents,
    reset
  };
}

function renderEmojiArea(categories, emojiData, renderer, events, options, i18n) {
  const showCategoryButtons = options.uiElements.includes(PickerUIElement.CATEGORY_BUTTONS);

  const categoryViews = categories.map(category => {
      return renderCategory(category, emojiData[category], renderer, events, i18n, options);
  });
  
  const categoryElements = categoryViews.map(({ el }) => el);
  const emojiViews = categoryViews.reduce((result, current) => ({
      ...result,
      [current.category]: current.emojiContainer
  }), {});

  const emojiArea = renderTemplate(template);

  if (showCategoryButtons) {
    emojiArea.prepend(renderCategoryButtons(options, events, i18n));
  }

  findByClass(emojiArea, classes.emojis).append(...categoryElements);

  return {
    el: emojiArea,
    emojiViews
  };
}

function renderCategory(category, filteredEmojis, renderer, events, i18n, options) {
  const container = renderTemplate(categoryTemplate, {
    categoryKey: category,
    label: i18n.categories[category],
    icon: categoryIcons[category]
  });

  const emojiContainer = renderEmojiContainer(category, filteredEmojis, renderer, true, events, category !== EmojiCategory.RECENTS, options);
  container.appendChild(emojiContainer.el);

  return { el: container, category, emojiContainer };
}
