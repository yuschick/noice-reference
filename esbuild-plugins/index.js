const svgUrlPlugin = require('./src/esbuild-plugin-svg-url');
const cssVariablePostcssPlugin = require('./src/css-variables-postcss-plugin');
const postcssModulesPlugin = require('./src/postcss-modules-plugin');
const postcssGlobalCssPlugin = require('./src/postcss-global-css-plugin');
const webworkerPlugin = require('./src/webworker-plugin');

module.exports = {
  svgUrlPlugin,
  cssVariablePostcssPlugin,
  postcssModulesPlugin,
  postcssGlobalCssPlugin,
  webworkerPlugin,
};
