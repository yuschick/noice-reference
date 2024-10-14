"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventInspectorService = void 0;
const fm = __importStar(require("../fetch.pb"));
class EventInspectorService {
    static StreamEvents(req, entityNotifier, initReq) {
        if (initReq === null || initReq === void 0 ? void 0 : initReq.forceWebSocket) {
            return fm.webSocketStreamingRequest(`/v1/events/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
        }
        if (req.eventFilter) {
            req = Object.assign(Object.assign({}, req), fm.flattenMap(req.eventFilter, "eventFilter"));
            delete req.eventFilter;
        }
        return fm.fetchStreamingRequest(`/v1/events/stream?${fm.renderURLSearchParams(req, [])}`, entityNotifier, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.EventInspectorService = EventInspectorService;
//# sourceMappingURL=event_inspector.pb.js.map