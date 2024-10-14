/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

export class StreamError extends Error {
  public code: number;
  public reason: string;
  public streamClosed = false;

  constructor(code: number, reason: string, closed = false) {
    super(code + ': ' + reason);
    this.code = code;
    this.reason = reason;
    this.streamClosed = closed;
  }
}

export interface InitReq extends RequestInit {
  pathPrefix?: string;
  WebSocket?: typeof WebSocket;
  forceWebSocket?: boolean;
  shutdownCallback?: () => void;
}

interface hackWebsocket extends WebSocket {
  send(string, boolean): void;
}

// StreamEntityPusher is a client -> server message pusher
export interface StreamEntityPusher<T> {
  send(msg: T): void
  close(): void
}

export type NotifyStreamErrorArrival = (resp: StreamError) => void

export function biDirectionalStreamingRequest<S, R>(path: string, callback?: NotifyStreamEntityArrival<R>, errorCallback?: NotifyStreamErrorArrival, init?: InitReq): Promise<StreamEntityPusher<S>> {
  const {pathPrefix, method, ...req} = init || {}
  let url = (pathPrefix ? `${pathPrefix}${path}` : path).replace('http', 'ws')

  if (url.indexOf('?') === -1) {
    url += '?'
  } else {
    url += '&'
  }

  url += 'method=' + (method || 'POST');

  let resolveHandle = null
  let rejectHandle = null

  const promise = new Promise<StreamEntityPusher<S>>((resolve, reject) => {
    resolveHandle = resolve
    rejectHandle = reject
  })

  let protocols: string[] = []
  if (init.headers && init.headers['Authorization']) {
    protocols = init.headers['Authorization'].split(' ')
  }

  const WSClass = init.WebSocket || WebSocket
  const ws = new WSClass(url, protocols)
  var appError : any = null;

  const onError = (e: any) => {
    if (rejectHandle) {
      rejectHandle(e)
      rejectHandle = null
    } else if (errorCallback) {
      errorCallback(e)
    }
  }

  ws.onopen = (e: any) => {
    if (resolveHandle) {
      const pusher: StreamEntityPusher<S> = {
        send: (msg: S): void => {
          const json = JSON.stringify(msg);
          ws.send(json)
        },
        close: (): void => {
          if (ws.readyState !== ws.CLOSED || ws.readyState !== ws.CLOSING) {
            // NOTE! If given a code/reason, this will break the integration tests
            // (looks like the websocket polyfill fails to encode it properly)
            ws.close();
          }
        },
        sendAndCloseWriter: (data: string): void => {
          (ws as hackWebsocket).send(data, true);
        }
      }

      resolveHandle(pusher)
      resolveHandle = null;
      rejectHandle = null;
    }
  }

  ws.onmessage = (e: any) => {
    if (e.data === 'PING') {
      ws.send('PONG')
      return
    }

    try {
      const obj = JSON.parse(e.data)
      if (obj.code && obj.message) {
        onError(new StreamError(obj.code, obj.message))
        return
      }

      if (obj.error) {
        appError = obj.error
        return
      }

      if (obj.result && callback) {
        callback(obj.result)
      }
    } catch (e: Error) {
      if (e instanceof Error) {
        onError(new StreamError(0, e.message));
        return;
      }

      onError(new StreamError(0, e));
    }
  }

  ws.onclose = (e) => {
    onError(new StreamError(appError ? appError.code : e.code, appError ? appError.message : e.reason, true));
  }

  // this is custom to our own Websocket muxer client implementation
  ws.onservershutdown = init.shutdownCallback;

  ws.onerror = onError

  return promise
}

export async function webSocketStreamingRequest<S, R>(
  path: string,
  callback?: NotifyStreamEntityArrival<R>,
  init?: InitReq
) {
  return new Promise((resolve, reject) =>
    setTimeout(async () => {
      const end = (error: Error) => {
        if (error) {
          reject && reject(error);
        } else {
          resolve && resolve();
        }
        resolve = null;
        reject = null;
      };

      if (init && init.signal && init.signal.aborted) {
        end(init.signal.reason);
        return;
      }

      const pusher = await biDirectionalStreamingRequest<S, R>(
        path,
        (e: R) => {
          if (init && init.signal && init.signal.aborted) {
            // signal is aborted we should avoid passing data to the listener as that
            // is how it would work with regular HTTP streaming calls
            return;
          }
          if (callback) {
            callback(e);
          }
        },
        (err: StreamError) => {
          switch (err.code) {
            case 1000: // normal closure
            case 1001: // browser going to another page
              end(null);
              break;
            default:
              end(err);
              break;
          }
        },
        init
      );
      pusher.sendAndCloseWriter(init?.body || '', true);

      if (init && init.signal) {
        const signal = init.signal;

        if (signal.aborted) {
          end(signal.reason);
          pusher.close();
          return;
        }

        signal.addEventListener('abort', () => {
          end(signal.reason);
          pusher.close();
        });
      }
    })
  );
}

export function fetchReq<I, O>(path: string, init?: InitReq): Promise<O> {
  const {pathPrefix, ...req} = init || {}

  const url = pathPrefix ? `${pathPrefix}${path}` : path

  return fetch(url, req).then(r => r.json().then((body: O) => {
    if (!r.ok) { throw body; }
    return body;
  })) as Promise<O>
}

// NotifyStreamEntityArrival is a callback that will be called on streaming entity arrival
export type NotifyStreamEntityArrival<T> = (resp: T) => void

/**
 * fetchStreamingRequest is able to handle grpc-gateway server side streaming call
 * it takes NotifyStreamEntityArrival that lets users respond to entity arrival during the call
 * all entities will be returned as an array after the call finishes.
 **/
export async function fetchStreamingRequest<S, R>(path: string, callback?: NotifyStreamEntityArrival<R>, init?: InitReq) {
  const {pathPrefix, ...req} = init || {}
  const url = pathPrefix ?`${pathPrefix}${path}` : path
  const result = await fetch(url, req)
  // needs to use the .ok to check the status of HTTP status code
  // http other than 200 will not throw an error, instead the .ok will become false.
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#
  if (!result.ok) {
    const resp = await result.json()
    let errMsg = ""
    let code = 0;
    if (resp.error && resp.error.message) {
      errMsg = resp.error.message
    } else if (resp.message) {
      errMsg = resp.message;
    }
    if (resp.error && resp.error.code) {
      code = resp.error.code;
    }
    throw new StreamError(code, errMsg, true)
  }

  if (!result.body) {
    throw new Error("response doesnt have a body")
  }

  await result.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough<R>(getNewLineDelimitedJSONDecodingStream<R>())
    .pipeTo(getNotifyEntityArrivalSink((e: R) => {
      if (callback) {
        callback(e)
      }
    }))

  // wait for the streaming to finish and return the success respond
  return
}

/**
 * JSONStringStreamController represents the transform controller that's able to transform the incoming
 * new line delimited json content stream into entities and able to push the entity to the down stream
 */
interface JSONStringStreamController<T> extends TransformStreamDefaultController {
  buf?: string
  pos?: number
  enqueue: (s: T) => void
}

function _enqueue<T>(line: string, controller: JSONStringStreamController<T>) {
  const response = JSON.parse(line)
  if (response.error) {
    let errMsg = ""
    let code = 0;
    if (response.error && response.error.message) {
      errMsg = response.error.message
    } else if (response.message) {
      errMsg = response.message;
    }
    if (response.error && response.error.code) {
      code = response.error.code;
    }
    throw new StreamError(code, errMsg, true)
  }

  controller.enqueue(response.result)
}

/**
 * getNewLineDelimitedJSONDecodingStream returns a TransformStream that's able to handle new line delimited json stream content into parsed entities
 */
function getNewLineDelimitedJSONDecodingStream<T>(): TransformStream<string, T> {
  return new TransformStream({
    start(controller: JSONStringStreamController<T>) {
      controller.buf = ''
      controller.pos = 0
    },

    transform(chunk: string, controller: JSONStringStreamController<T>) {
      if (controller.buf === undefined) {
        controller.buf = ''
      }
      if (controller.pos === undefined) {
        controller.pos = 0
      }
      controller.buf += chunk
      while (controller.pos < controller.buf.length) {
        if (controller.buf[controller.pos] === '\n') {
          const line = controller.buf.substring(0, controller.pos)
          _enqueue(line, controller)
          controller.buf = controller.buf.substring(controller.pos + 1)
          controller.pos = 0
        } else {
          ++controller.pos
        }
      }
    },

    flush(controller: JSONStringStreamController<T>) {
      const lines = controller.buf.split('\n');
      for (let i = 0; i < lines.length; ++i) {
        if (lines[i].length > 0) {
          _enqueue(lines[i], controller)
        }
      }
    }
  })

}

/**
 * getNotifyEntityArrivalSink takes the NotifyStreamEntityArrival callback and return
 * a sink that will call the callback on entity arrival
 * @param notifyCallback
 */
function getNotifyEntityArrivalSink<T>(notifyCallback: NotifyStreamEntityArrival<T>) {
  return new WritableStream<T>({
    write(entity: T) {
      notifyCallback(entity)
    }
  })
}

type Primitive = string | boolean | number;
type RequestPayload = Record<string, unknown>;
type FlattenedRequestPayload = Record<string, Primitive | Array<Primitive>>;

/**
 * Checks if given value is a plain object
 * Logic copied and adapted from below source: 
 * https://github.com/char0n/ramda-adjunct/blob/master/src/isPlainObj.js
 * @param  {unknown} value
 * @return {boolean}
 */
function isPlainObject(value: unknown): boolean {
  const isObject =
    Object.prototype.toString.call(value).slice(8, -1) === "Object";
  const isObjLike = value !== null && isObject;

  if (!isObjLike || !isObject) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  const hasObjectConstructor =
    typeof proto === "object" &&
    proto.constructor === Object.prototype.constructor;

  return hasObjectConstructor;
}

/**
 * Checks if given value is of a primitive type
 * @param  {unknown} value
 * @return {boolean}
 */
function isPrimitive(value: unknown): boolean {
  return ["string", "number", "boolean"].some(t => typeof value === t);
}

/**
 * Checks if given primitive is zero-value
 * @param  {Primitive} value
 * @return {boolean}
 */
function isZeroValuePrimitive(value: Primitive): boolean {
  return value === false || value === 0 || value === "";
}

/**
 * Flattens a deeply nested request payload and returns an object
 * with only primitive values and non-empty array of primitive values
 * as per https://github.com/googleapis/googleapis/blob/master/google/api/http.proto
 * @param  {RequestPayload} requestPayload
 * @param  {String} path
 * @return {FlattenedRequestPayload>}
 */
function flattenRequestPayload<T extends RequestPayload>(
  requestPayload: T,
  path: string = ""
): FlattenedRequestPayload {
  return Object.keys(requestPayload).reduce(
    (acc: T, key: string): T => {
      const value = requestPayload[key];
      const newPath = path ? [path, key].join(".") : key;

      const isNonEmptyPrimitiveArray =
        Array.isArray(value) &&
        value.every(v => isPrimitive(v)) &&
        value.length > 0;

      const isNonZeroValuePrimitive =
        isPrimitive(value) && !isZeroValuePrimitive(value as Primitive);

      let objectToMerge = {};

      if (isPlainObject(value)) {
        objectToMerge = flattenRequestPayload(value as RequestPayload, newPath);
      } else if (isNonZeroValuePrimitive || isNonEmptyPrimitiveArray) {
        objectToMerge = { [newPath]: value };
      }

      return { ...acc, ...objectToMerge };
    },
    {} as T
  ) as FlattenedRequestPayload;
}

export function flattenMap<T extends RequestPayload>(requestPayload: T, path: string): RequestPayload {
  return Object.keys(requestPayload).reduce((acc: T, key: string): T => {
		const newKey = path + '[' + key + ']';
        acc[newKey] = requestPayload[key];
        return acc;
      },
      {} as T
  ) as RequestPayload;
}

/**
 * Renders a deeply nested request payload into a string of URL search
 * parameters by first flattening the request payload and then removing keys
 * which are already present in the URL path.
 * @param  {RequestPayload} requestPayload
 * @param  {string[]} urlPathParams
 * @return {string}
 */
export function renderURLSearchParams<T extends RequestPayload>(
  requestPayload: T,
  urlPathParams: string[] = []
): string {
  const flattenedRequestPayload = flattenRequestPayload(requestPayload);

  const urlSearchParams = Object.keys(flattenedRequestPayload).reduce(
    (acc: string[][], key: string): string[][] => {
      // key should not be present in the url path as a parameter
      const value = flattenedRequestPayload[key];
      if (urlPathParams.find(f => f === key)) {
        return acc;
      }
      return Array.isArray(value)
        ? [...acc, ...value.map(m => [key, m.toString()])]
        : (acc = [...acc, [key, value.toString()]]);
    },
    [] as string[][]
  );

  return new URLSearchParams(urlSearchParams).toString();
}