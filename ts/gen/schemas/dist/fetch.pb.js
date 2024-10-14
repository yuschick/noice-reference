"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderURLSearchParams = exports.flattenMap = exports.fetchStreamingRequest = exports.fetchReq = exports.webSocketStreamingRequest = exports.biDirectionalStreamingRequest = exports.StreamError = void 0;
class StreamError extends Error {
    constructor(code, reason, closed = false) {
        super(code + ': ' + reason);
        this.streamClosed = false;
        this.code = code;
        this.reason = reason;
        this.streamClosed = closed;
    }
}
exports.StreamError = StreamError;
function biDirectionalStreamingRequest(path, callback, errorCallback, init) {
    const _a = init || {}, { pathPrefix, method } = _a, req = __rest(_a, ["pathPrefix", "method"]);
    let url = (pathPrefix ? `${pathPrefix}${path}` : path).replace('http', 'ws');
    if (url.indexOf('?') === -1) {
        url += '?';
    }
    else {
        url += '&';
    }
    url += 'method=' + (method || 'POST');
    let resolveHandle = null;
    let rejectHandle = null;
    const promise = new Promise((resolve, reject) => {
        resolveHandle = resolve;
        rejectHandle = reject;
    });
    let protocols = [];
    if (init.headers && init.headers['Authorization']) {
        protocols = init.headers['Authorization'].split(' ');
    }
    const WSClass = init.WebSocket || WebSocket;
    const ws = new WSClass(url, protocols);
    var appError = null;
    const onError = (e) => {
        if (rejectHandle) {
            rejectHandle(e);
            rejectHandle = null;
        }
        else if (errorCallback) {
            errorCallback(e);
        }
    };
    ws.onopen = (e) => {
        if (resolveHandle) {
            const pusher = {
                send: (msg) => {
                    const json = JSON.stringify(msg);
                    ws.send(json);
                },
                close: () => {
                    if (ws.readyState !== ws.CLOSED || ws.readyState !== ws.CLOSING) {
                        // NOTE! If given a code/reason, this will break the integration tests
                        // (looks like the websocket polyfill fails to encode it properly)
                        ws.close();
                    }
                },
                sendAndCloseWriter: (data) => {
                    ws.send(data, true);
                }
            };
            resolveHandle(pusher);
            resolveHandle = null;
            rejectHandle = null;
        }
    };
    ws.onmessage = (e) => {
        if (e.data === 'PING') {
            ws.send('PONG');
            return;
        }
        try {
            const obj = JSON.parse(e.data);
            if (obj.code && obj.message) {
                onError(new StreamError(obj.code, obj.message));
                return;
            }
            if (obj.error) {
                appError = obj.error;
                return;
            }
            if (obj.result && callback) {
                callback(obj.result);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                onError(new StreamError(0, e.message));
                return;
            }
            onError(new StreamError(0, e));
        }
    };
    ws.onclose = (e) => {
        onError(new StreamError(appError ? appError.code : e.code, appError ? appError.message : e.reason, true));
    };
    // this is custom to our own Websocket muxer client implementation
    ws.onservershutdown = init.shutdownCallback;
    ws.onerror = onError;
    return promise;
}
exports.biDirectionalStreamingRequest = biDirectionalStreamingRequest;
function webSocketStreamingRequest(path, callback, init) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const pusher = yield biDirectionalStreamingRequest(path, callback, (err) => {
                switch (err.code) {
                    case 1000: // normal closure
                    case 1001: // browser going to another page
                        resolve();
                    default:
                        reject(err);
                }
            }, init);
            pusher.sendAndCloseWriter((init === null || init === void 0 ? void 0 : init.body) || '', true);
        }));
    });
}
exports.webSocketStreamingRequest = webSocketStreamingRequest;
function fetchReq(path, init) {
    const _a = init || {}, { pathPrefix } = _a, req = __rest(_a, ["pathPrefix"]);
    const url = pathPrefix ? `${pathPrefix}${path}` : path;
    return fetch(url, req).then(r => r.json().then((body) => {
        if (!r.ok) {
            throw body;
        }
        return body;
    }));
}
exports.fetchReq = fetchReq;
/**
 * fetchStreamingRequest is able to handle grpc-gateway server side streaming call
 * it takes NotifyStreamEntityArrival that lets users respond to entity arrival during the call
 * all entities will be returned as an array after the call finishes.
 **/
function fetchStreamingRequest(path, callback, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = init || {}, { pathPrefix } = _a, req = __rest(_a, ["pathPrefix"]);
        const url = pathPrefix ? `${pathPrefix}${path}` : path;
        const result = yield fetch(url, req);
        // needs to use the .ok to check the status of HTTP status code
        // http other than 200 will not throw an error, instead the .ok will become false.
        // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#
        if (!result.ok) {
            const resp = yield result.json();
            let errMsg = "";
            let code = 0;
            if (resp.error && resp.error.message) {
                errMsg = resp.error.message;
            }
            else if (resp.message) {
                errMsg = resp.message;
            }
            if (resp.error && resp.error.code) {
                code = resp.error.code;
            }
            throw new StreamError(code, errMsg, true);
        }
        if (!result.body) {
            throw new Error("response doesnt have a body");
        }
        yield result.body
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(getNewLineDelimitedJSONDecodingStream())
            .pipeTo(getNotifyEntityArrivalSink((e) => {
            if (callback) {
                callback(e);
            }
        }));
        // wait for the streaming to finish and return the success respond
        return;
    });
}
exports.fetchStreamingRequest = fetchStreamingRequest;
function _enqueue(line, controller) {
    const response = JSON.parse(line);
    if (response.error) {
        let errMsg = "";
        let code = 0;
        if (response.error && response.error.message) {
            errMsg = response.error.message;
        }
        else if (response.message) {
            errMsg = response.message;
        }
        if (response.error && response.error.code) {
            code = response.error.code;
        }
        throw new StreamError(code, errMsg, true);
    }
    controller.enqueue(response.result);
}
/**
 * getNewLineDelimitedJSONDecodingStream returns a TransformStream that's able to handle new line delimited json stream content into parsed entities
 */
function getNewLineDelimitedJSONDecodingStream() {
    return new TransformStream({
        start(controller) {
            controller.buf = '';
            controller.pos = 0;
        },
        transform(chunk, controller) {
            if (controller.buf === undefined) {
                controller.buf = '';
            }
            if (controller.pos === undefined) {
                controller.pos = 0;
            }
            controller.buf += chunk;
            while (controller.pos < controller.buf.length) {
                if (controller.buf[controller.pos] === '\n') {
                    const line = controller.buf.substring(0, controller.pos);
                    _enqueue(line, controller);
                    controller.buf = controller.buf.substring(controller.pos + 1);
                    controller.pos = 0;
                }
                else {
                    ++controller.pos;
                }
            }
        },
        flush(controller) {
            const lines = controller.buf.split('\n');
            for (let i = 0; i < lines.length; ++i) {
                if (lines[i].length > 0) {
                    _enqueue(lines[i], controller);
                }
            }
        }
    });
}
/**
 * getNotifyEntityArrivalSink takes the NotifyStreamEntityArrival callback and return
 * a sink that will call the callback on entity arrival
 * @param notifyCallback
 */
function getNotifyEntityArrivalSink(notifyCallback) {
    return new WritableStream({
        write(entity) {
            notifyCallback(entity);
        }
    });
}
/**
 * Checks if given value is a plain object
 * Logic copied and adapted from below source:
 * https://github.com/char0n/ramda-adjunct/blob/master/src/isPlainObj.js
 * @param  {unknown} value
 * @return {boolean}
 */
function isPlainObject(value) {
    const isObject = Object.prototype.toString.call(value).slice(8, -1) === "Object";
    const isObjLike = value !== null && isObject;
    if (!isObjLike || !isObject) {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    const hasObjectConstructor = typeof proto === "object" &&
        proto.constructor === Object.prototype.constructor;
    return hasObjectConstructor;
}
/**
 * Checks if given value is of a primitive type
 * @param  {unknown} value
 * @return {boolean}
 */
function isPrimitive(value) {
    return ["string", "number", "boolean"].some(t => typeof value === t);
}
/**
 * Checks if given primitive is zero-value
 * @param  {Primitive} value
 * @return {boolean}
 */
function isZeroValuePrimitive(value) {
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
function flattenRequestPayload(requestPayload, path = "") {
    return Object.keys(requestPayload).reduce((acc, key) => {
        const value = requestPayload[key];
        const newPath = path ? [path, key].join(".") : key;
        const isNonEmptyPrimitiveArray = Array.isArray(value) &&
            value.every(v => isPrimitive(v)) &&
            value.length > 0;
        const isNonZeroValuePrimitive = isPrimitive(value) && !isZeroValuePrimitive(value);
        let objectToMerge = {};
        if (isPlainObject(value)) {
            objectToMerge = flattenRequestPayload(value, newPath);
        }
        else if (isNonZeroValuePrimitive || isNonEmptyPrimitiveArray) {
            objectToMerge = { [newPath]: value };
        }
        return Object.assign(Object.assign({}, acc), objectToMerge);
    }, {});
}
function flattenMap(requestPayload, path) {
    return Object.keys(requestPayload).reduce((acc, key) => {
        const newKey = path + '[' + key + ']';
        acc[newKey] = requestPayload[key];
        return acc;
    }, {});
}
exports.flattenMap = flattenMap;
/**
 * Renders a deeply nested request payload into a string of URL search
 * parameters by first flattening the request payload and then removing keys
 * which are already present in the URL path.
 * @param  {RequestPayload} requestPayload
 * @param  {string[]} urlPathParams
 * @return {string}
 */
function renderURLSearchParams(requestPayload, urlPathParams = []) {
    const flattenedRequestPayload = flattenRequestPayload(requestPayload);
    const urlSearchParams = Object.keys(flattenedRequestPayload).reduce((acc, key) => {
        // key should not be present in the url path as a parameter
        const value = flattenedRequestPayload[key];
        if (urlPathParams.find(f => f === key)) {
            return acc;
        }
        return Array.isArray(value)
            ? [...acc, ...value.map(m => [key, m.toString()])]
            : (acc = [...acc, [key, value.toString()]]);
    }, []);
    return new URLSearchParams(urlSearchParams).toString();
}
exports.renderURLSearchParams = renderURLSearchParams;
//# sourceMappingURL=fetch.pb.js.map