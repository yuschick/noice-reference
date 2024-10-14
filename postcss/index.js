const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');
const postcssFunctions = require('postcss-functions');
const postcssMixins = require('postcss-mixins');
const postcssCustomMedia = require('postcss-custom-media');
const functions = require('./src/functions.js')

const postcssFunctionPlugin = [
  postcssFunctions({
    functions
  }),
];

const postcssPlugins = (projectMixinsDir) => [
  postcssMixins({
    mixinsDir: projectMixinsDir ? [path.join(__dirname, './src/mixins'), projectMixinsDir]: path.join(__dirname, './src/mixins')
  }),
  autoprefixer,
  postcssNested,
  postcssCustomMedia({
    importFrom: [
      {
        customMedia: {
          '--breakpoint-small': '(min-width: 640px)',
          '--breakpoint-medium': '(min-width: 768px)',
          '--breakpoint-large': '(min-width: 1024px)',
          '--breakpoint-xlarge': '(min-width: 1280px)',
          '--breakpoint-xxlarge': '(min-width: 1536px)',
          '--breakpoint-xxxlarge': '(min-width: 1920px)',
          '--breakpoint-use-sidebar': '(min-width: 1024px)',
        },
      },
    ],
  }),
  ...postcssFunctionPlugin,
];

module.exports = { postcssPlugins };