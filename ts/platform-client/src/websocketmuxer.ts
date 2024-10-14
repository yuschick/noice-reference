import {
  MuxerActionConnectMethod,
  MuxerEvent,
  MuxerEventConnected,
  MuxerEventData,
  MuxerEventDisconnected,
  MuxerEventPing,
  routeMuxerEventEventDelegate,
  MuxerAction,
  MuxerEventError,
} from '@noice-com/schemas/muxer/muxer.pb';

import { Logger, logger } from './lib';
import { IClient, IRequestParamsProvider } from './types';

interface ExtendedClient extends IClient, IRequestParamsProvider {}

export type DataListener = (data: string) => void;
export type CloseListener = (evt: MuxerEventDisconnected) => void;
export type ConnectListener = () => void;
export type ServerShutdownListener = () => void;
export type SendCB = (action: MuxerAction) => void;

type StringMap = { [key: string]: string };
type ConnectCallback = (ws: WebSocket) => void;

const MUX_PATH = '/v1/mux';

const log = logger('WebSocketMuxer');

export class Handle {
  public id: number;
  public headers: StringMap;
  public method: MuxerActionConnectMethod;
  public path: string;

  public ws: WebSocket;
  private _dataListeners: DataListener[] = [];
  private _closeListener: CloseListener[] = [];
  private _serverShutdownListener: ServerShutdownListener[] = [];
  private _connectListener: ConnectListener[] = [];
  private _closed = false;

  private _logger: Logger;

  constructor(
    id: number,
    method: MuxerActionConnectMethod,
    headers: StringMap,
    path: string,
  ) {
    this.id = id;
    this.headers = headers;
    this.method = method;
    this.path = path;
    this._logger = log.subWithProps(`${id}`, { path: path });
  }

  private _send(action: MuxerAction) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(action));
    }
  }

  public addDataListener(delegate: DataListener): void {
    this._dataListeners.push(delegate);
  }

  public removeDataListener(delegate: DataListener): void {
    const index = this._dataListeners.indexOf(delegate);

    if (index >= 0) {
      this._dataListeners.splice(index, 1);
    }
  }

  public addCloseListener(delegate: CloseListener): void {
    this._closeListener.push(delegate);
  }

  public removeCloseListener(delegate: CloseListener): void {
    const index = this._closeListener.indexOf(delegate);

    if (index >= 0) {
      this._closeListener.splice(index, 1);
    }
  }

  public addConnectListener(delegate: ConnectListener): void {
    this._connectListener.push(delegate);
  }

  public removeConnectListener(delegate: ConnectListener): void {
    const index = this._connectListener.indexOf(delegate);

    if (index >= 0) {
      this._connectListener.splice(index, 1);
    }
  }

  public addServerShutdownListener(delegate: ServerShutdownListener): void {
    this._serverShutdownListener.push(delegate);
  }

  public removeServerShutdownListener(delegate: ServerShutdownListener): void {
    const index = this._serverShutdownListener.indexOf(delegate);

    if (index >= 0) {
      this._serverShutdownListener.splice(index, 1);
    }
  }

  public _onEvent(event: MuxerEvent) {
    routeMuxerEventEventDelegate<void>(null, event, {
      onData: (_, data: MuxerEventData) => {
        this._logger.debug('onData', data.id, data.data);
        this._dataListeners.forEach((listener) => listener(data.data));
      },
      onConnected: (_, evt: MuxerEventConnected) => {
        this._logger.debug('onConnected', evt.id);
        this._connectListener.forEach((listener) => listener());
      },
      onDisconnected: (_, evt) => {
        this._logger.debug('onDisconnected', evt.id);
        this._closeListener.forEach((listener) => listener(evt));
        this._closeListener = [];
        this._dataListeners = [];
        this._connectListener = [];
        this._closed = true;
      },
      onPing: () => {
        // never called
      },
      onError: () => {
        // TODO inform user
      },
      onServerShuttingDown: () => {
        this._logger.debug('onServerShuttingDown');
        this._serverShutdownListener.forEach((listener) => listener());
      },
    });
  }

  public _connect(ws: WebSocket): void {
    this.ws = ws;

    this._logger.debug('connect', this.headers);

    this._send({
      connect: {
        id: this.id,
        headers: this.headers,
        method: this.method,
        path: this.path,
      },
    });
  }

  public _onServerShutdown(): void {
    this._logger.debug('onServerShutdown');

    this._serverShutdownListener.forEach((listener) => listener());
  }

  public close(): void {
    if (this._closed) {
      return;
    }

    this._logger.debug('close');

    this._send({
      disconnect: {
        id: this.id,
      },
    });
  }

  public send(data: string, eof = false): void {
    if (this._closed) {
      return;
    }

    this._logger.debug('send', data, { eof });

    this._send({
      data: {
        id: this.id,
        data,
        eof,
      },
    });
  }
}

class MuxedWebsocketBase {
  private _handle: Handle;
  private _onMessage: ((this: WebSocket, ev: MessageEvent) => any) | null;
  private _onClose: ((this: WebSocket, ev: CloseEvent) => any) | null;
  private _onError: ((this: WebSocket, ev: Event) => any) | null;
  private _onOpen: ((this: WebSocket, ev: Event) => any) | null;
  private _onServerShutdown: ((this: WebSocket) => any) | null;
  private _readyState: number = WebSocket.CONNECTING;

  constructor(handle: Handle) {
    this._handle = handle;

    handle.addCloseListener((evt: MuxerEventDisconnected) => {
      this._handleClose(evt);
    });

    handle.addConnectListener(() => {
      this._handleOpen();
    });

    handle.addDataListener((data: string) => {
      this._handleMessage(data);
    });

    handle.addServerShutdownListener(() => {
      this._onServerShutdown && this._onServerShutdown.call(this);
    });
  }

  public set onmessage(delegate: (this: WebSocket, ev: MessageEvent) => any) {
    this._onMessage = delegate;
  }

  public get onmessage(): (this: WebSocket, ev: MessageEvent) => any {
    return this._onMessage;
  }

  public set onclose(delegate: (this: WebSocket, ev: CloseEvent) => any) {
    this._onClose = delegate;
  }

  public get onclose(): (this: WebSocket, ev: CloseEvent) => any {
    return this._onClose;
  }

  public set onerror(delegate: (this: WebSocket, ev: Event) => any) {
    this._onError = delegate;
  }

  public get onerror(): (this: WebSocket, ev: Event) => any {
    return this._onError;
  }

  public get onopen(): (this: WebSocket, ev: Event) => any {
    return this._onOpen;
  }

  public set onopen(delegate: (this: WebSocket, ev: Event) => any) {
    this._onOpen = delegate;
  }

  public set onservershutdown(delegate: (this: WebSocket) => any) {
    this._onServerShutdown = delegate;
  }

  public get onservershutdown(): (this: WebSocket) => any {
    return this._onServerShutdown;
  }

  public get readyState(): number {
    return this._readyState;
  }

  private _handleClose(evt: MuxerEventDisconnected) {
    if (this._readyState === WebSocket.CLOSED) {
      return;
    }

    this._readyState = WebSocket.CLOSED;
    this._onClose &&
      this._onClose.call(this, {
        code: evt.code,
        reason: evt.reason,
      });
    this._onClose = null;
    this._onError = null;
    this._onMessage = null;
    this._onOpen = null;
  }

  private _handleOpen() {
    if (this._readyState === WebSocket.OPEN) {
      return;
    }

    this._readyState = WebSocket.OPEN;
    this._onOpen && this._onOpen.call(this);
  }

  private _handleMessage(data: string) {
    this._onMessage &&
      this._onMessage.call(this, {
        data,
      });
  }

  public close(_code?: number, _reason?: string): void {
    this._readyState = WebSocket.CLOSING;
    // TODO handle code and reason
    this._handle.close();
  }

  public send(data: string, eof = false): void {
    this._handle.send(data, eof);
  }
}

export class WebSocketMuxer {
  private _handles: { [id: number]: Handle } = {};
  private _id = 1;
  private _currentWebsocket?: WebSocket;
  private _liveSockets: WebSocket[] = [];
  private _connectCallbacks: ConnectCallback[] = [];
  private _cli: ExtendedClient;

  constructor(cli: ExtendedClient) {
    this._cli = cli;
    cli.onClose(() => {
      this.close();
    });
  }

  private _createSocket(): WebSocket {
    const pathPrefix = this._cli.getPathPrefix();
    const path = (pathPrefix ? `${pathPrefix}${MUX_PATH}` : MUX_PATH).replace(
      'http',
      'ws',
    );

    const ws = (this._currentWebsocket = new WebSocket(path));

    this._liveSockets.push(ws);

    ws.onopen = () => {
      this._connectCallbacks.forEach((cb) => cb(ws));
      this._connectCallbacks = [];
    };

    ws.onmessage = (wsEvent: { data: string }) => {
      const event = JSON.parse(wsEvent.data) as MuxerEvent;
      routeMuxerEventEventDelegate<void>(null, event, {
        onData: (_, data: MuxerEventData) => {
          this._handles[data.id] && this._handles[data.id]._onEvent(event);
        },
        onConnected: (_, connected: MuxerEventConnected) => {
          this._handles[connected.id] && this._handles[connected.id]._onEvent(event);
        },
        onDisconnected: (_, connected: MuxerEventDisconnected) => {
          this._handles[connected.id] && this._handles[connected.id]._onEvent(event);
          delete this._handles[connected.id];
          // TODO disconnect here if no more handles
        },
        onPing: (_, ping: MuxerEventPing) => {
          log.debug('ping received', ping);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                pong: {
                  seq: ping.seq,
                },
              }),
            );
          }
        },
        onError: (_, error: MuxerEventError) => {
          this._handles[error.id] && this._handles[error.id]._onEvent(event);
        },
        onServerShuttingDown: () => {
          if (this._currentWebsocket === ws) {
            this._currentWebsocket = null;
          }

          for (const id in this._handles) {
            const handle = this._handles[id];
            if (handle.ws === ws) {
              handle._onServerShutdown();
            }
          }
        },
      });
    };

    ws.onclose = (ev: CloseEvent) => {
      this._liveSockets.splice(this._liveSockets.indexOf(ws), 1);

      if (this._currentWebsocket === ws) {
        this._currentWebsocket = null;
      }

      for (const id in this._handles) {
        const handle = this._handles[id];
        if (handle.ws === ws) {
          handle._onEvent({
            disconnected: {
              code: ev.code,
              reason: ev.reason,
            },
          });
          delete this._handles[id];
        }
      }
    };

    return this._currentWebsocket;
  }

  private _ensureSocketConnection(callback: (ws: WebSocket) => void) {
    if (this._currentWebsocket) {
      switch (this._currentWebsocket.readyState) {
        case WebSocket.OPEN:
          callback(this._currentWebsocket);
          break;
        case WebSocket.CONNECTING:
          this._connectCallbacks.push(callback);
          break;
        case WebSocket.CLOSING:
        case WebSocket.CLOSED:
          this._connectCallbacks.push(callback);
          this._createSocket();
          break;
      }
    } else {
      this._connectCallbacks.push(callback);
      return this._createSocket();
    }
  }

  public connect(
    method: MuxerActionConnectMethod,
    headers: StringMap,
    path: string,
  ): Handle {
    const id = this._id++;
    const handle = new Handle(id, method, headers, path);
    this._handles[id] = handle;

    this._ensureSocketConnection((ws) => {
      handle._connect(ws);
    });

    return handle;
  }

  public close() {
    for (const id in this._handles) {
      const handle = this._handles[id];
      handle.close();
    }

    this._liveSockets.forEach((ws) => {
      ws.close();
    });
  }

  public WebSocketFactory(): typeof WebSocket {
    const createHandle = (
      method: MuxerActionConnectMethod,
      headers: StringMap,
      path: string,
    ) => {
      const handle = this.connect(method, headers, path);

      return handle;
    };

    return class MuxedWebsocket extends MuxedWebsocketBase {
      constructor(url: string | URL, protocols: string | string[]) {
        if (!Array.isArray(protocols)) {
          protocols = [protocols];
        }

        if (url instanceof URL) {
          url = url.toString();
        }

        let path = '';
        const parts = url.split('/');

        if (parts.length > 1) {
          path = parts.slice(3).join('/');
        }

        const headers: StringMap = {};

        if (protocols.length >= 2 && protocols[0].toLowerCase() === 'bearer') {
          headers['Authorization'] = `Bearer ${protocols[1]}`;
        }
        // TODO figure out what to do if there are more headers at some point

        const urlParts = url.split('?');
        const queryString = urlParts.length > 1 ? urlParts[1] : '';
        const query = queryString.split('&').reduce((acc, cur) => {
          const parts = cur.split('=');
          acc[parts[0]] = parts[1];
          return acc;
        }, {} as StringMap);

        let method = MuxerActionConnectMethod.METHOD_POST;

        if (query.method) {
          switch (query.method.toLowerCase()) {
            case 'get':
              method = MuxerActionConnectMethod.METHOD_GET;
              break;
            case 'post':
              method = MuxerActionConnectMethod.METHOD_POST;
              break;
            case 'put':
              method = MuxerActionConnectMethod.METHOD_PUT;
              break;
            case 'delete':
              method = MuxerActionConnectMethod.METHOD_DELETE;
              break;
          }
        }

        const handle = createHandle(method, headers, path);
        super(handle);
      }
    } as unknown as typeof WebSocket;
  }
}
