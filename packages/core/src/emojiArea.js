import { findByClass } from './util';

import * as classes from './styles';

import { renderCategoryButtons, categoryIcons } from './categoryButtons';
import { renderEmojiContainer, FocusReference } from './emojiContainer';

import { 
  CATEGORY_CLICKED, 
  SET_ACTIVE_CATEGORY, 
  NEXT_CATEGORY,
  PREVIOUS_CATEGORY
} from './events';

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
  let currentCategoryIndex = 0;
  let headerOffsets = [];

  let focusedCategoryIndex = 0;

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

  function setFocusedCategory(categoryIndex, offset, reference, applyFocus = true) {
    emojiViews[categories[focusedCategoryIndex]].deactivateFocus();
    focusedCategoryIndex = categoryIndex;
    emojiViews[categories[focusedCategoryIndex]].activateFocus(offset, reference, applyFocus);
  }

  events.on(PREVIOUS_CATEGORY, (offset, reference) => {
    if (focusedCategoryIndex > 0) {
      setFocusedCategory(focusedCategoryIndex - 1, offset, reference);
    }
  });

  events.on(NEXT_CATEGORY, (offset, reference) => {
    if (focusedCategoryIndex < categories.length - 1) {
      setFocusedCategory(focusedCategoryIndex + 1, offset, reference);
    }
  });

  function reset() {
    headerOffsets = getHeaderOffsets(headers);

    let initialCategory = options.initialCategory || categories[0];
    if (initialCategory === EmojiCategory.RECENTS && emojiData.recents.length === 0) {
      initialCategory = categories[categories.indexOf(EmojiCategory.RECENTS) + 1];
    }

    selectCategory({ category: initialCategory, changeFocus: true });
    
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

  // TODO: need to be able to jump multiple categories:
  // Focus in one category
  // Scroll down past several categories
  // Press an arrow, scroll jumps back up
  // Wrong category highlghted
  function highlightCategory() {
    const currentCategoryContainer = getCurrentCategoryView().el.parentNode;
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

  function getCurrentCategoryView() {
    return emojiViews[categories[currentCategoryIndex]];
  }

  function selectCategory({ category, changeFocus = false, focusTarget, scroll = true }) {
    currentCategoryIndex = typeof category === 'number' ? category : categories.indexOf(category);
    if (changeFocus) {
      setFocusedCategory(currentCategoryIndex, 0, FocusReference.START, focusTarget === 'emoji');
    }

    events.emit(SET_ACTIVE_CATEGORY, currentCategoryIndex, focusTarget === 'category');

    if (scroll) {
      const targetPosition = headerOffsets[currentCategoryIndex];
      emojiContainer.scrollTop = targetPosition;
    }
  }

  emojiContainer.addEventListener('scroll', highlightCategory);

  events.on(CATEGORY_CLICKED, category => selectCategory({ category, changeFocus: true, focusTarget: 'category' }));

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
