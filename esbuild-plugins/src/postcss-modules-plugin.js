/**
 * Modified from https://github.com/indooorsman/esbuild-css-modules-plugin
 * This one support to giving own postcss plugins
 *
 * Esbuild has plans to have own css module support https://github.com/evanw/esbuild/issues/20,
 * after that this plugin is not needed anymore
 */
const path = require('path');
const fs = require('fs-extra');
const postcss = require('postcss');
const cssModules = require('postcss-modules');
const util = require('util');
const crypto = require('crypto');
const { getCachedOutput } = require('./utils/cache');
const hash = crypto.createHash('sha256');
const readFile = util.promisify(fs.readFile);

const buildCssModulesJS = async (cssFullPath, plugins = []) => {
  const css = await readFile(cssFullPath);

  let cssModulesJSON = {};
  const result = await postcss([
    ...plugins,
    cssModules({
      localsConvention: 'camelCaseOnly',
      getJSON(cssSourceFile, json) {
        cssModulesJSON = { ...json };
        return cssModulesJSON;
      },
    }),
  ]).process(css, {
    from: undefined,
    map: false,
  });

  const classNames = JSON.stringify(cssModulesJSON);
  hash.update(cssFullPath);
  const digest = hash.copy().digest('hex');

  const injectedCode = `
    (function() {
      if (!document.getElementById(digest)) {
        var el = document.createElement('style');
        el.id = digest;
        el.textContent = css;
        document.head.appendChild(el);
      }
    })();`;

  let jsContent = `
    const digest = '${digest}';
    const css = \`${result.css}\`;
    ${injectedCode}
    export default ${classNames};
    export { css, digest };
  `;

  return {
    jsContent,
    cssContent: result.css,
  };
};

let CssModulesPlugin = (plugins = [], options = { cache: false }) => ({
  name: 'postcss-modules',
  setup: async (build) => {
    let cacheMap = new Map();

    build.onLoad({ filter: /\.modules?\.css$/ }, (args) =>
      getCachedOutput(
        { cacheMap, cacheEnabled: options.cache, path: args.path },
        async () => {
          const sourceFullPath = path.resolve(args.resolveDir, args.path);
          const { jsContent } = await buildCssModulesJS(sourceFullPath, plugins);

          return { contents: jsContent, loader: 'js', watchFiles: [sourceFullPath] };
        },
      ),
    );
  },
});

module.exports = CssModulesPlugin;
