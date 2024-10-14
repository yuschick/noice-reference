const fs = require('fs-extra');
const postcss = require('postcss');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

module.exports = (plugins = []) => ({
  name: 'css-variable-postcss',
  setup: function (build) {
    build.onLoad({ filter: /.?variables\.(css)$/ }, async (args) => {
      // Get the file to read
      let sourceFullPath;
      // handle path for variables from dependencies with require
      if (args.path.startsWith('@noice-com')) {
        sourceFullPath = require.resolve(args.path);
      } else {
        sourceFullPath = path.resolve(args.resolveDir, args.path);
      }

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
