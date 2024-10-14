module.exports = {
  name: 'svg-url',
  setup({ onLoad }) {
    const fs = require('fs');

    onLoad({ filter: /\.svg/ }, async (args) => {
      const svg = await fs.promises.readFile(args.path, 'utf8');

      // the svg import ends with .svg?url, then process it as a path
      if (args.suffix === '?url') {
        return {
          contents: svg,
          loader: 'file',
        };
      }
    });
  },
};
