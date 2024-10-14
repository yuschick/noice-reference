const path = require('path');
const fs = require('fs-extra');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const ensureDir = util.promisify(fs.ensureDir);

module.exports = (buildFunction) => {
  return {
    name: 'webworker',
    setup({ onLoad, onResolve, onEnd }) {
      const files = [];

      onResolve({ filter: /\.worker\.ts$/ }, (args) => {
        return {
          path: args.path,
          namespace: 'webworker',
          pluginData: {
            resolveDir: args.resolveDir,
          },
        };
      });

      onLoad({ filter: /\.worker\.ts$/, namespace: 'webworker' }, async (args) => {
        return {
          contents: `
          import url from ${JSON.stringify(args.path.replace(/\.ts$/, '.bundle.js'))};
          export default function () {
            const objectURL = URL.createObjectURL(
              new Blob(['importScripts('  + JSON.stringify(url) + ');'], {
                  type: 'application/javascript'
              })
           );
            const w = new Worker(objectURL);
            URL.revokeObjectURL(objectURL);
            return w;
          };
        `,
          loader: 'js',
          resolveDir: args.pluginData.resolveDir,
        };
      });

      onResolve({ filter: /\.worker\.bundle\.js$/ }, (args) => {
        return {
          path: args.path,
          namespace: 'webworker',
          pluginData: {
            resolveDir: args.resolveDir,
          },
          watchFiles: [
            path.join(args.resolveDir, args.path.replace(/\.bundle\.js$/, '.ts')),
          ],
        };
      });

      onLoad(
        { filter: /\.worker\.bundle\.js$/, namespace: 'webworker' },
        async (args) => {
          const res = await buildFunction({
            write: false,
            metafile: true,
            entryPoints: [
              path.join(
                args.pluginData.resolveDir,
                args.path.replace(/\.bundle\.js$/, '.ts'),
              ),
            ],
          });

          const filename = path.basename(args.path.replace(/\.bundle\.js$/, '.js'));
          const mainFile = res.outputFiles.find((f) => {
            const basename = path.basename(f.path).replace(/-(\w+)?\.js$/, '.js');
            return basename === filename;
          });

          const otherFiles = res.outputFiles.filter(
            (f) => path.basename(f.path) !== filename,
          );

          for (const file of otherFiles) {
            files.push(file);
          }

          const watchFiles = Object.keys(res.metafile.inputs);

          return {
            contents: mainFile.contents,
            loader: 'file',
            watchFiles: watchFiles,
          };
        },
      );

      onEnd(async () => {
        for (const file of files) {
          await ensureDir(path.dirname(file.path));
          await writeFile(file.path, file.contents);
        }
      });
    },
  };
};
