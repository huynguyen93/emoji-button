import { CATEGORY_CLICKED, SET_ACTIVE_CATEGORY } from './events';

import { EmojiCategory, PickerUIElement } from './constants';

import * as icons from './icons';
import { renderTemplate } from './renderTemplate';

export const categoryIcons = {
  [EmojiCategory.RECENTS]: icons.history,
  [EmojiCategory.SMILEYS]: icons.smile,
  [EmojiCategory.PEOPLE]: icons.user,
  [EmojiCategory.ANIMALS]: icons.cat,
  [EmojiCategory.FOOD]: icons.coffee,
  [EmojiCategory.ACTIVITIES]: icons.futbol,
  [EmojiCategory.TRAVEL]: icons.building,
  [EmojiCategory.OBJECTS]: icons.lightbulb,
  [EmojiCategory.SYMBOLS]: icons.music,
  [EmojiCategory.FLAGS]: icons.flag,
  [EmojiCategory.CUSTOM]: icons.icons
};

const template = `
  <div class="{{classes.categoryButtons}}">
    {{#categories}}
      <button class="{{classes.categoryButton}}" tabindex="-1" title="{{name}}" type="button" data-category="{{.}}">
        {{{icon}}}
      </button>
    {{/categories}}
  </div>
`;

function clearActive(buttons) {
  const activeButtonEl = buttons.find(button => button.classList.contains('active'));
  if (activeButtonEl) {
    activeButtonEl.classList.remove('active');
    activeButtonEl.tabIndex = -1;
  }
}

function setActive(newActiveButton, category, focus) {
  newActiveButton.classList.add('active');
  newActiveButton.tabIndex = 0;

  if (focus) {
    newActiveButton.focus();
  }
}

export function renderCategoryButtons(options, events, i18n) {
  const categoryData = options.categories;
  let categories = options.uiElements.includes(PickerUIElement.RECENTS)
    ? [EmojiCategory.RECENTS, ...categoryData]
    : categoryData;

  if (options.custom) {
    categories = [...categories, EmojiCategory.CUSTOM];
  }

  const container = renderTemplate(template, {
    categories,
    name() {
      return i18n.categories[this];
    },
    icon() {
      return categoryIcons[this] || icons.smile;
    }
  });

  const buttons = [...container.querySelectorAll('button')];

  container.addEventListener('click', event => {
    const target = event.target.closest('button');
    events.emit(CATEGORY_CLICKED, target.dataset.category);
  });

  container.addEventListener('keydown', event => {
    const activeButton = buttons.findIndex(button => button.classList.contains('active'));
    switch (event.key) {
      case 'ArrowRight':
        events.emit(CATEGORY_CLICKED, categories[(activeButton + 1) % buttons.length]);
        break;
      case 'ArrowLeft':
        events.emit(
          CATEGORY_CLICKED,
          categories[activeButton === 0 ? buttons.length - 1 : activeButton - 1]
        );
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.stopPropagation();
        event.preventDefault();
    }
  });

  events.on(SET_ACTIVE_CATEGORY, (category, focus = true) => {
    clearActive(buttons);
    setActive(buttons[category], category, focus);
  });

  return container;
}
