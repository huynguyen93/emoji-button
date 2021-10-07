import { findByClass } from './util';

import * as classes from './styles';

import { renderCategoryButtons, categoryIcons } from './categoryButtons';
import { renderEmojiContainer } from './emojiContainer';

import { CATEGORY_CLICKED, SET_ACTIVE_CATEGORY, SHOWING_PICKER, HIDING_PICKER } from './events';

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
  let focusedIndex = 0;
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

  let emojiCounts = categories.map(category => emojiData[category].length);

  const container = renderEmojiArea(categories, filteredEmojis, renderer, events, options, i18n);
  const headers = findAllByClass(container, classes.categoryName);
  const emojiContainer = findByClass(container, classes.emojis);

  function reset() {
    headerOffsets = getHeaderOffsets(headers);

    emojiCounts = categories.map(category => emojiData[category].length);

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
      recentsContainer.parentNode.replaceChild(
        renderEmojiContainer(recents, renderer, true, events, false, options),
        recentsContainer
      )
    }
  }

  function setFocusedEmoji(index, focus = true) {
    if (focusedEmoji) {
      focusedEmoji.tabIndex = -1;
    }

    focusedIndex = index;
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

  /*
  bindKey({
    key: 'ArrowRight',
    target: emojiContainer,
    callback: pauseScrollListener(() => {
      if (focusedIndex === emojiCounts[currentCategoryIndex] - 1 && currentCategoryIndex < categories.length - 1) {
        nextCategory();
      } else if (focusedIndex < emojiCounts[currentCategoryIndex] - 1) {
        setFocusedEmoji(focusedIndex + 1);
      }
    })
  });

  bindKey({
    key: 'ArrowLeft',
    target: emojiContainer,
    callback: pauseScrollListener(() => {
      if (focusedIndex === 0 && currentCategoryIndex > 0 && emojiCounts[currentCategoryIndex - 1]) {
        previousCategory(emojiCounts[currentCategoryIndex - 1] - 1);
      } else {
        setFocusedEmoji(Math.max(0, focusedIndex - 1));
      }
    })
  });

  bindKey({
    key: 'ArrowDown',
    target: emojiContainer,
    callback: pauseScrollListener(() => {
      if (focusedIndex + options.emojisPerRow >= emojiCounts[currentCategoryIndex] && currentCategoryIndex < categories.length - 1) {
        nextCategory(Math.min(focusedIndex % options.emojisPerRow, emojiCounts[currentCategoryIndex] - 1));
      } else if (emojiCounts[currentCategoryIndex] - focusedIndex > options.emojisPerRow) {
        setFocusedEmoji(focusedIndex + options.emojisPerRow);
      }
    })
  });

  bindKey({
    key: 'ArrowUp',
    target: emojiContainer,
    callback: pauseScrollListener(() => {
      // If we're on the first row of a category and there is a (non-empty) previous category, we will move to the
      // previous category.
      if (focusedIndex < options.emojisPerRow && currentCategoryIndex > 0 && emojiCounts[currentCategoryIndex - 1]) {
        const previousCategoryCount = emojiCounts[currentCategoryIndex - 1];
        const previousLastRowCount = (previousCategoryCount % options.emojisPerRow) || options.emojisPerRow;

        let newIndex = previousCategoryCount - 1;

        // If the current column exceeds the count of the previous category's last row, we will move to the
        // last item in the previous category's last row.
        if (focusedIndex <= (previousLastRowCount - 1)) {
          const previousRowCount = Math.ceil(previousCategoryCount / options.emojisPerRow);
          newIndex = (options.emojisPerRow * (previousRowCount - 1)) + focusedIndex;
        }

        previousCategory(newIndex);
      } else {
        setFocusedEmoji(focusedIndex >= options.emojisPerRow ? focusedIndex - options.emojisPerRow : focusedIndex);
      }
    })
  });
  */

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

  const categoryElements = categories.map(category => {
      return renderCategory(category, emojiData[category], renderer, events, i18n);
  });

  const emojiArea = renderTemplate(template);

  if (showCategoryButtons) {
    emojiArea.prepend(renderCategoryButtons(options, events, i18n));
  }

  findByClass(emojiArea, classes.emojis).append(...categoryElements);

  return emojiArea;
}

function renderCategory(category, filteredEmojis, renderer, events, i18n, options) {
  const container = renderTemplate(categoryTemplate, {
    categoryKey: category,
    label: i18n.categories[category],
    icon: categoryIcons[category]
  });

  container.appendChild(renderEmojiContainer(filteredEmojis, renderer, true, events, category !== EmojiCategory.RECENTS), options);

  return container;
}
