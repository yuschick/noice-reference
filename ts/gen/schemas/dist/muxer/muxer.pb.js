"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeMuxerEventEventDelegate = exports.routeMuxerActionActionDelegate = exports.MuxerActionConnectMethod = void 0;
var MuxerActionConnectMethod;
(function (MuxerActionConnectMethod) {
    MuxerActionConnectMethod["METHOD_UNSPECIFIED"] = "METHOD_UNSPECIFIED";
    MuxerActionConnectMethod["METHOD_GET"] = "METHOD_GET";
    MuxerActionConnectMethod["METHOD_POST"] = "METHOD_POST";
    MuxerActionConnectMethod["METHOD_PUT"] = "METHOD_PUT";
    MuxerActionConnectMethod["METHOD_PATCH"] = "METHOD_PATCH";
    MuxerActionConnectMethod["METHOD_DELETE"] = "METHOD_DELETE";
})(MuxerActionConnectMethod || (exports.MuxerActionConnectMethod = MuxerActionConnectMethod = {}));
function routeMuxerActionActionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.addHeaders) && delegate.onAddHeaders(ctx, val.addHeaders);
    (val === null || val === void 0 ? void 0 : val.removeHeaders) && delegate.onRemoveHeaders(ctx, val.removeHeaders);
    (val === null || val === void 0 ? void 0 : val.connect) && delegate.onConnect(ctx, val.connect);
    (val === null || val === void 0 ? void 0 : val.disconnect) && delegate.onDisconnect(ctx, val.disconnect);
    (val === null || val === void 0 ? void 0 : val.data) && delegate.onData(ctx, val.data);
    (val === null || val === void 0 ? void 0 : val.pong) && delegate.onPong(ctx, val.pong);
}
exports.routeMuxerActionActionDelegate = routeMuxerActionActionDelegate;
function routeMuxerEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.connected) && delegate.onConnected(ctx, val.connected);
    (val === null || val === void 0 ? void 0 : val.disconnected) && delegate.onDisconnected(ctx, val.disconnected);
    (val === null || val === void 0 ? void 0 : val.data) && delegate.onData(ctx, val.data);
    (val === null || val === void 0 ? void 0 : val.ping) && delegate.onPing(ctx, val.ping);
    (val === null || val === void 0 ? void 0 : val.error) && delegate.onError(ctx, val.error);
    (val === null || val === void 0 ? void 0 : val.serverShuttingDown) && delegate.onServerShuttingDown(ctx, val.serverShuttingDown);
}
exports.routeMuxerEventEventDelegate = routeMuxerEventEventDelegate;
//# sourceMappingURL=muxer.pb.js.map