import express, { Express } from 'express';

import { PrdServerOptions, createPrdServer } from './prd-server';
import { createViteDevServer, ViteDevServerOptions } from './vite-dev-server';

type ServerOptions = ViteDevServerOptions &
  PrdServerOptions & {
    app?: Express;
    isDev: boolean;
  };

export const createServer = async (options: ServerOptions) => {
  const { isDev, port = 3000, app = express(), ...serverOptions } = options;

  isDev
    ? await createViteDevServer(app, { ...serverOptions, port })
    : await createPrdServer(app, { ...serverOptions, port });

  // eslint-disable-next-line no-console
  console.log(`Listening to port ${port}, mode ${isDev ? 'development' : 'production'}`);
  app.listen(port);
};
