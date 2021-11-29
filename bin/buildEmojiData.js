/* eslint-disable no-console, no-empty */

const fs = require('fs/promises');
const path = require('path');

const emojis = require('emojibase-data/en/data.json');
const { groups } = require('emojibase-data/meta/groups.json');

const chalk = require('chalk');
const xml2js = require('xml2js');

const distPath = path.resolve(__dirname, '..', 'src', 'emoji-data');

const annotationsPath = path.resolve(__dirname, '..', 'cldr', 'common', 'annotations');
const annotationsDerivedPath = path.resolve(__dirname, '..', 'cldr', 'common', 'annotationsDerived');

async function start() {
  try {
    await fs.stat(distPath);
  } catch (error) {
    console.log('Creating output directory');
    await fs.mkdir(distPath);
  }

  const localeFiles = await fs.readdir(annotationsPath);

  console.log('⚙️  Generating emoji locale data');

  localeFiles.forEach(async localeFile => {
    const [locale] = localeFile.split('.');

    const translations = await getTranslations(localeFile);

    const categoryMap = Object.values(groups).reduce(
      (result, category) => ({
        ...result,
        [category]: []
      }),
      {}
    );

    emojis.forEach(emojiRecord => {
      if (emojiRecord.group >= 0) {
        const item = {
          emoji: emojiRecord.emoji,
          name: emojiRecord.annotation,
          version: emojiRecord.version,
          category: emojiRecord.group
        };

        const translatedName = translations[getNormalizedEmoji(emojiRecord.hexcode)];
        if (translatedName) {
          item.name = translatedName;
        }

        if (emojiRecord.skins) {
          item.variations = emojiRecord.skins.map(skin => skin.emoji);
        }

        categoryMap[groups[emojiRecord.group]].push(item);
      }
    });

    const outputPath = path.resolve(distPath, `${locale}.js`);

    delete categoryMap.component;

    await fs.writeFile(outputPath, `export default ${JSON.stringify(categoryMap)}`);

    console.log(`  ${chalk.greenBright('✔')} ${locale}`);
  });
}

async function getTranslations(localeFile) {
  const annotations = await xml2js.parseStringPromise(await fs.readFile(path.resolve(annotationsPath, localeFile)));

  if (!annotations.ldml.annotations) {
    return {};
  }

  const localeData = annotations.ldml.annotations[0].annotation.filter(isTTS);

  try {
    const derivedParsed = await xml2js.parseStringPromise(
      await fs.readFile(path.resolve(annotationsDerivedPath, localeFile))
    );

    const derivedData = derivedParsed.ldml.annotations[0].annotation.filter(isTTS);
    localeData.push(...derivedData);
  } catch (error) {}

  const translations = {};

  localeData.forEach(localeItem => {
    translations[localeItem.$.cp] = localeItem._;
  });

  return translations;
}

function isTTS(item) {
  return item.$.type === 'tts';
}

// Takes an emoji sequence and removes FE0F code points from it.
// This is necessary because the CLDR data does not include FE0F characters.
function getNormalizedEmoji(sequence) {
  const codePoints = sequence
    .split('-')
    .filter(code => code !== 'FE0F')
    .map(char => parseInt(char, 16));

  return String.fromCodePoint(...codePoints);
}

start();
