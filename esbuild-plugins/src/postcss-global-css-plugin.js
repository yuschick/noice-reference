const fs = require('fs-extra');
const postcss = require('postcss');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

let GlobalPostcssPlugin = (plugins = []) => ({
  name: 'global-postcss',
  setup: async (build) => {
    build.onLoad({ filter: /\.global?\.css$/ }, async (args) => {
      // Get the file to read
      const sourceFullPath = path.resolve(args.resolveDir, args.path);

      // Get the css
      const css = await readFile(sourceFullPath);
      const result = await postcss(plugins).process(css, {
        from: sourceFullPath,
      });

      return {
        contents: result.css,
        loader: 'css',
      };
    });
  },
});

module.exports = GlobalPostcssPlugin;
