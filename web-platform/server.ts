import path from 'path';

import { createServer } from '@noice-com/server';

import { getConfig } from './config';

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '3000');
const BUNDLE_BASE_PATH = process.env.BUNDLE_BASE_PATH;
const WORKSPACE_HASH = process.env.WORKSPACE_HASH;

createServer({
  isDev: process.env.NODE_ENV === 'development',
  distPath: DIST_DIR,
  config: getConfig(process.env),
  port: PORT,
  useAuthProxy: process.env.USE_AUTH_PROXY === 'true',
  bundleBasePath: BUNDLE_BASE_PATH,
  workspaceHash: WORKSPACE_HASH,
  hmrPort: 5432,
});
