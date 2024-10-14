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
exports.StatService = exports.routeCounterDimensionDimensionDelegate = exports.CounterConfigDimensionWindowType = exports.CounterConfigDimensionDimensionType = void 0;
const fm = __importStar(require("../fetch.pb"));
var CounterConfigDimensionDimensionType;
(function (CounterConfigDimensionDimensionType) {
    CounterConfigDimensionDimensionType["DIMENSION_TYPE_UNSPECIFIED"] = "DIMENSION_TYPE_UNSPECIFIED";
    CounterConfigDimensionDimensionType["DIMENSION_TYPE_USER_GLOBAL"] = "DIMENSION_TYPE_USER_GLOBAL";
    CounterConfigDimensionDimensionType["DIMENSION_TYPE_USER_GAME"] = "DIMENSION_TYPE_USER_GAME";
    CounterConfigDimensionDimensionType["DIMENSION_TYPE_USER_CHANNEL"] = "DIMENSION_TYPE_USER_CHANNEL";
})(CounterConfigDimensionDimensionType || (exports.CounterConfigDimensionDimensionType = CounterConfigDimensionDimensionType = {}));
var CounterConfigDimensionWindowType;
(function (CounterConfigDimensionWindowType) {
    CounterConfigDimensionWindowType["WINDOW_TYPE_UNSPECIFIED"] = "WINDOW_TYPE_UNSPECIFIED";
    CounterConfigDimensionWindowType["WINDOW_TYPE_DAILY"] = "WINDOW_TYPE_DAILY";
    CounterConfigDimensionWindowType["WINDOW_TYPE_WEEKLY"] = "WINDOW_TYPE_WEEKLY";
    CounterConfigDimensionWindowType["WINDOW_TYPE_MONTHLY"] = "WINDOW_TYPE_MONTHLY";
})(CounterConfigDimensionWindowType || (exports.CounterConfigDimensionWindowType = CounterConfigDimensionWindowType = {}));
function routeCounterDimensionDimensionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.userGlobal) && delegate.onUserGlobal(ctx, val.userGlobal);
    (val === null || val === void 0 ? void 0 : val.userGame) && delegate.onUserGame(ctx, val.userGame);
    (val === null || val === void 0 ? void 0 : val.userChannel) && delegate.onUserChannel(ctx, val.userChannel);
}
exports.routeCounterDimensionDimensionDelegate = routeCounterDimensionDimensionDelegate;
class StatService {
    static IncrCounter(req, initReq) {
        return fm.fetchReq(`/stat.StatService/IncrCounter`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListUserStats(req, initReq) {
        return fm.fetchReq(`/stat.StatService/ListUserStats`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StatService = StatService;
//# sourceMappingURL=stat.pb.js.map