import fs from 'fs';

import { Request, Response, Express } from 'express';

import { injectConfigToHtml } from './html-utils';
import { proxifyAuth } from './proxy';

export interface ViteDevServerOptions {
  config: any;
  port: number;
  hmrPort?: number;
  useAuthProxy?: boolean;
  bundleBasePath?: string;
  additionalProxies?: {
    path: string;
    fileName: string;
  }[];
}

export const createViteDevServer = async (
  app: Express,
  options: ViteDevServerOptions,
) => {
  const {
    config,
    port,
    hmrPort = 5432,
    useAuthProxy,
    additionalProxies,
    bundleBasePath,
  } = options;
  const root = process.cwd();

  const viteServer = await (
    await import(`vite`)
  ).createServer({
    root,
    logLevel: 'info',
    server: {
      middlewareMode: true,
      hmr: {
        port: hmrPort,
      },
    },
    appType: 'custom',
  });

  app.use(viteServer.middlewares);

  if (useAuthProxy) {
    config.AUTH_BASE_URL = proxifyAuth({
      app,
      target: config.SERVICES_LIB_HOST,
      port,
      hostname: config.PROXY_AUTH_HOSTNAME,
    });
  }

  const returnIndex = async (req: Request, res: Response) => {
    let indexFile = fs.readFileSync('index.html', 'utf8');

    if (bundleBasePath) {
      indexFile = indexFile.replace(/"\/js\//g, `"${bundleBasePath}/js/`);
    }

    indexFile = await viteServer.transformIndexHtml(req.url, indexFile);
    indexFile = injectConfigToHtml(indexFile, config);

    res.status(200).set('Content-Type', 'text/html').end(indexFile);
  };

  // Serving additional proxy files
  if (additionalProxies?.length) {
    additionalProxies.forEach((additionalProxy) => {
      const returnAdditionalIndex = async (req: Request, res: Response) => {
        let additionalIndexFile = fs.readFileSync(additionalProxy.fileName, 'utf8');

        additionalIndexFile = await viteServer.transformIndexHtml(
          req.url,
          additionalIndexFile,
        );
        additionalIndexFile = injectConfigToHtml(additionalIndexFile, config);

        res.status(200).set('Content-Type', 'text/html').end(additionalIndexFile);
      };

      app.get(additionalProxy.path, returnAdditionalIndex);
    });
  }

  // Override index.html asset
  app.get('/index.html', returnIndex);

  // Send index.html when the user access the web
  app.get('*', returnIndex);
};
