import esbuild from '@noice-com/esbuild';
import { postcssModulesPlugin, postcssGlobalCssPlugin } from '@noice-com/esbuild-plugins';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import fs from 'fs';
import config from '../config.js';
import { postcssPlugins } from '@noice-com/postcss';

// the publicPath is almost always '/' but the exception being CI when we
// build static pages. Then the url is not in root, it is something like
// '/client/pr/<pr-number>/client
const publicPath = process.env.BASE_PATH || '/';
const bundleBasePath = process.env.BUNDLE_BASE_PATH || 'http://localhost:3000/';
const workspaceHash = process.env.WORKSPACE_HASH;
const nodeEnv = process.env.NODE_ENV || 'development';
const configRegex = /(window\.NOICE =) (\{.*\})/;

export const build = (isWatch) => {
  return esbuild.build(
    {
      entryPoints: ['src/index.tsx'],
      outdir: process.env.DIST_PATH || 'dist',
      publicPath: bundleBasePath,
      assetNames: 'assets/[ext]/[name]-[hash]',
      entryNames: workspaceHash ? `js/[name]-${workspaceHash}` : `js/[name]`,
      define: {
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        'process.env.BASE_PATH': JSON.stringify(publicPath),
      },
      // Plugins
      plugins: [
        // Css modules with postcss
        postcssModulesPlugin(postcssPlugins(), { cache: isWatch }),
        // Postcss global styles
        postcssGlobalCssPlugin(postcssPlugins()),
        // this plugin builds the final dist/index.html for us
        htmlPlugin({
          files: [
            {
              entryPoints: ['src/index.tsx'],
              filename: 'index.html',
              htmlTemplate: fs
                .readFileSync('src/index.html', 'utf-8')
                // config is injected to index.html head script so that we can have
                // static build (in CI) with certain env variables. Variables are also
                // injected by server (see server.ts).
                .replace(configRegex, `$1 ${JSON.stringify(config(process.env))}`),
            },
          ],
        }),
      ],
    },
    { isWatch, name: 'web-app' },
  );
};

// Parse args
const [...args] = process.argv.slice(2);
const isWatchMode = args.includes('--watch');

build(isWatchMode);
