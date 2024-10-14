const { postcssPlugins } = require('./index')

// This is for storybook
module.exports = {
  plugins: postcssPlugins(),
};