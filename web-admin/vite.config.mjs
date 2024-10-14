import ViteYaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import glsl from 'vite-plugin-glsl';
import tsconfigPaths from 'vite-tsconfig-paths';
import { injectNoiceConfigToHtml, optimizeSvgFiles } from '@noice-com/vite-plugins';

import { getConfig } from './config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, `${process.cwd()}/.env`, '');

  // the publicPath is almost always '/' but the exception being CI when we
  // build static pages. Then the url is not in root, it is something like
  const publicPath = process.env.BASE_PATH ?? '/';
  const bundleBasePath = process.env.BUNDLE_BASE_PATH || 'http://localhost:3010/';
  const workspaceHash = process.env.WORKSPACE_HASH;
  const nodeEnv = env.NODE_ENV ?? 'development';
  const config = getConfig(env);

  return {
    base: bundleBasePath,
    plugins: [
      react(),
      tsconfigPaths(),
      ViteYaml(),
      optimizeSvgFiles(),
      glsl(),
      injectNoiceConfigToHtml(config),
    ],
    assetsInclude: ['**/*.exr', '**/*.glb', '**/*.webm'],
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.BASE_PATH': JSON.stringify(publicPath),
    },
    server: {
      fs: {
        allow: ['.', '../../lib/ts/common-ui', , '../../tools/postcss'],
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    build: {
      outDir: process.env.DIST_PATH || 'dist',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          entryFileNames: workspaceHash
            ? `js/[name]-${workspaceHash}.js`
            : `js/[name].js`,
        },
      },
      sourcemap: nodeEnv !== 'production',
    },
    worker: {
      plugins: [glsl(), tsconfigPaths()],
    },
  };
});
