import type * as http from 'http';

import { Express } from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

export class AuthProxyMiddleware {
  public proxifiedTarget: string;

  private target: string;
  private port: number;
  private prefix: string;
  private hostname: string;

  constructor(target: string, hostname: string, port: number, prefix: string) {
    this.target = target;
    this.hostname = hostname;
    this.prefix = prefix;
    this.port = port;
    this.proxifiedTarget = this.proxifyUrl(this.target);
  }

  private async rewriteCookies(
    buf: Buffer,
    proxyRes: http.IncomingMessage,
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): Promise<Buffer> {
    if (/^\/v[0-9]+\/auth/.test(req.url || '')) {
      Object.entries(proxyRes.headers).forEach(([name, values]) => {
        if (name.toLowerCase() === 'set-cookie' && values) {
          for (const v of values) {
            res.setHeader(name, v.replace(/(path=)([^;]+)/i, `$1${this.prefix}$2`));
          }
        }
      });
    }

    return buf;
  }

  public proxifyUrl(url: string): string {
    const u = new URL(url);
    const scheme = u.protocol.startsWith('ws') ? 'ws' : 'http';

    return `${scheme}://${this.hostname}:${this.port}${this.prefix}${u.pathname}`.replace(
      /\/$/,
      '',
    );
  }

  public use(app: Express) {
    app.use(
      this.prefix,
      createProxyMiddleware({
        target: this.target,
        pathRewrite: { [`^${this.prefix}`]: '' },
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyRes: responseInterceptor(this.rewriteCookies.bind(this)),
        ws: true,
      }),
    );
  }
}

interface Params {
  app: Express;
  target: string;
  port: number;
  hostname?: string;
  prefix?: string;
}

export function proxifyAuth(params: Params): string {
  const { app, target, port, hostname = 'localhost', prefix = '/proxy' } = params;
  const proxy = new AuthProxyMiddleware(target, hostname, port, prefix);
  proxy.use(app);
  return proxy.proxifiedTarget;
}
