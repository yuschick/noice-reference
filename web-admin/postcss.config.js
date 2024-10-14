const { postcssPlugins } = require('@noice-com/postcss');
const { resolve } = require('path');

// This is for storybook
module.exports = {
  plugins: postcssPlugins(resolve('./src/assets/css/mixins')),
};
