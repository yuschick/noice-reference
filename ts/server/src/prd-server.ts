import fs from 'fs';
import path from 'path';
import url from 'url';

import express, { Request, Response, Express, NextFunction } from 'express';
import fetch from 'node-fetch';

import { injectConfigToHtml } from './html-utils';
import { proxifyAuth } from './proxy';

export interface PrdServerOptions {
  distPath: string;
  config: any;
  port: number;
  useAuthProxy?: boolean;
  bundleBasePath?: string;
  workspaceHash?: string;
  keepPaths?: boolean;
  additionalProxies?: {
    path: string;
    fileName: string;
    keepPaths?: boolean;
  }[];
}

export const createPrdServer = async (app: Express, options: PrdServerOptions) => {
  const {
    config,
    port,
    distPath,
    useAuthProxy,
    additionalProxies,
    bundleBasePath,
    workspaceHash,
    keepPaths: keepAllPaths,
  } = options;

  if (useAuthProxy) {
    config.AUTH_BASE_URL = proxifyAuth({
      app,
      target: config.SERVICES_LIB_HOST,
      port,
      hostname: config.PROXY_AUTH_HOSTNAME,
    });
  }

  const proxyCDN = async (req: Request, res: Response) => {
    const response = await fetch(url.resolve(bundleBasePath || '', req.url));
    const buffer = await response.buffer();

    res.setHeader('Content-Type', response.headers.get('content-type') || '');
    res.send(buffer);
  };

  let indexFile = '';

  const readFile = async (fileName: string, keepPaths = false) => {
    let orgFile = '';
    if (bundleBasePath?.startsWith('http')) {
      orgFile = await fetch(`${bundleBasePath}/${fileName}?t=${Date.now()}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`Failed to fetch ${fileName}`);
          }

          return res;
        })
        .then((res) => res.text());
    } else {
      orgFile = fs.readFileSync(path.join(distPath, fileName), 'utf8');
    }

    let file = injectConfigToHtml(orgFile, config);

    if (bundleBasePath && !keepPaths && !keepAllPaths) {
      file = file.replaceAll(/"\/js\//g, `"${bundleBasePath}/js/`);
      file = file.replaceAll(/"\/assets\//g, `"${bundleBasePath}/assets/`);
    } else if (bundleBasePath && bundleBasePath.startsWith('http')) {
      // Make sure we dont have anything pointing to the bundle base path

      // eslint-disable-next-line no-useless-escape
      file = file.replaceAll(`"${bundleBasePath?.replaceAll('/', `\/`)}/js/`, '"/js/');
      file = file.replaceAll(
        // eslint-disable-next-line no-useless-escape
        `"${bundleBasePath?.replaceAll('/', `\/`)}/assets/`,
        '"/assets/',
      );
    }

    return file;
  };

  const returnIndex = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (indexFile === '') {
        indexFile = await readFile(
          bundleBasePath?.startsWith('http')
            ? `index-${workspaceHash}.html`
            : 'index.html',
        );
      }

      res.setHeader('Content-Type', 'text/html');
      res.send(indexFile);
    } catch (err) {
      next(err);
    }
  };

  // Serving the files on the dist folder
  app.use(
    express.static(distPath, {
      index: false,
      redirect: false,
      setHeaders: (res, path) => {
        if (path.endsWith('apple-app-site-association')) {
          res.setHeader('Content-Type', 'application/json');
        }
      },
    }),
  );

  // Serving additional proxy files
  if (additionalProxies?.length) {
    additionalProxies.forEach((additionalProxy) => {
      let additionalIndexFile = '';

      const returnAdditionalIndex = async (
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          if (additionalIndexFile === '') {
            additionalIndexFile = await readFile(
              additionalProxy.fileName,
              additionalProxy.keepPaths,
            );
          }

          res.setHeader('Content-Type', 'text/html');
          res.send(additionalIndexFile);
        } catch (err) {
          next(err);
        }
      };

      app.get(additionalProxy.path, returnAdditionalIndex);
    });
  }

  // Override index.html asset
  app.get('/index.html', returnIndex);
  app.get('/manifest.json', (_req, res) => {
    res.send({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      build_time: config.BUILD_TIME,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      build_hash: config.BUILD_HASH,
    });
  });

  if (bundleBasePath && bundleBasePath.startsWith('http')) {
    app.get('/assets/*', proxyCDN);
    app.get('/js/*', proxyCDN);
    app.get('/.well-known/*', proxyCDN);
  }

  // Send index.html when the user access the web
  app.get('*', returnIndex);
};
