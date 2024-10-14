import path from 'path';

import { createServer } from '@noice-com/server';

import { getConfig } from './config';

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '3020');
const USE_AUTH_PROXY = process.env.USE_AUTH_PROXY === 'true';
const BUNDLE_BASE_PATH = process.env.BUNDLE_BASE_PATH;
const WORKSPACE_HASH = process.env.WORKSPACE_HASH;

createServer({
  isDev: process.env.NODE_ENV === 'development',
  distPath: DIST_DIR,
  config: getConfig(process.env),
  port: PORT,
  hmrPort: 7432,
  useAuthProxy: USE_AUTH_PROXY,
  bundleBasePath: BUNDLE_BASE_PATH,
  workspaceHash: WORKSPACE_HASH,
  additionalProxies: [
    {
      fileName: 'popout.html',
      path: '/popout/*',
      keepPaths: true,
    },
  ],
});
