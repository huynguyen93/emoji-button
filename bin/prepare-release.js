const fs = require('fs/promises');
const path = require('path');

const copy = require('recursive-copy');

const {
  name,
  version,
  description,
  keywords,
  author,
  repository,
  homepage,
  bugs,
  license,
  dependencies
} = require('../package.json');

const newPkg = {
  name,
  version,
  description,
  keywords,
  author,
  repository,
  homepage,
  bugs,
  license,
  dependencies,
  main: 'index.js',
  files: [
    'emoji-data',
    'index.js*',
    'renderers',
    'theme'
  ]
};

const releasePath = path.resolve(__dirname, '..', 'release');
const distPath = path.resolve(__dirname, '..', 'dist');
const srcPath = path.resolve(__dirname, '..', 'src');

async function start() {
  try {
    await fs.stat(releasePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Creating release path ${releasePath}`);
      await fs.mkdir(releasePath);
    }
  }

  console.log('Writing package.json');
  fs.writeFile(
    path.resolve(releasePath, 'package.json'),
    JSON.stringify(newPkg, null, 2)
  );

  console.log('Copying build output');
  await copy(distPath, releasePath, {
    filter: [
      'index.js*',
      'renderers/*'
    ]
  });

  await copy(path.resolve(distPath, 'styles'), releasePath);

  await copy(srcPath, releasePath, {
    filter: 'emoji-data/*'
  });
}

start();
