import { library, icon } from '@fortawesome/fontawesome-svg-core';
import {
  faCat,
  faCoffee,
  faFutbol,
  faHistory,
  faIcons,
  faMusic,
  faSearch,
  faTimes,
  faUser
} from '@fortawesome/free-solid-svg-icons';

import { 
  faBuilding, 
  faFlag, 
  faFrown, 
  faImage,
  faLightbulb, 
  faSmile, 
  faTimesCircle 
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faBuilding,
  faCat,
  faCoffee,
  faFlag,
  faFrown,
  faFutbol,
  faHistory,
  faIcons,
  faImage,
  faLightbulb,
  faMusic,
  faSearch,
  faSmile,
  faTimes,
  faTimesCircle,
  faUser
);

export const building = buildIcon('far', 'building');
export const cat = buildIcon('fas', 'cat');
export const coffee = buildIcon('fas', 'coffee');
export const flag = buildIcon('far', 'flag');
export const futbol = buildIcon('fas', 'futbol');
export const frown = buildIcon('far', 'frown');
export const history = buildIcon('fas', 'history');
export const icons = buildIcon('fas', 'icons');
export const image = buildIcon('far', 'image');
export const lightbulb = buildIcon('far', 'lightbulb');
export const music = buildIcon('fas', 'music');
export const search = buildIcon('fas', 'search');
export const smile = buildIcon('far', 'smile');
export const times = buildIcon('fas', 'times');
export const user = buildIcon('fas', 'user');
export const notFound = buildIcon('far', 'times-circle');

function buildIcon(prefix, iconName) {
  return icon({ prefix, iconName }).html[0];
}

export function createIcon(src) {
  const img = document.createElement('img');
  img.src = src;
  return img;
}
