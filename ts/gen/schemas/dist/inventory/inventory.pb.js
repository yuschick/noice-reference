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
exports.UserInventoryAdminService = exports.UserInventoryService = exports.routeListUserInventoryRequestFilterFilterDelegate = exports.routeInventoryEventEventDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeInventoryEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.entitlement) && delegate.onEntitlement(ctx, val.entitlement);
    (val === null || val === void 0 ? void 0 : val.consumption) && delegate.onConsumption(ctx, val.consumption);
}
exports.routeInventoryEventEventDelegate = routeInventoryEventEventDelegate;
function routeListUserInventoryRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.gameId) && delegate.onGameId(ctx, val.gameId);
    (val === null || val === void 0 ? void 0 : val.itemType) && delegate.onItemType(ctx, val.itemType);
    (val === null || val === void 0 ? void 0 : val.seasonId) && delegate.onSeasonId(ctx, val.seasonId);
}
exports.routeListUserInventoryRequestFilterFilterDelegate = routeListUserInventoryRequestFilterFilterDelegate;
class UserInventoryService {
    static ListUserInventory(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryService/ListUserInventory`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetInventoryItem(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryService/GetInventoryItem`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetInventoryItems(req, initReq) {
        return fm.fetchReq(`/v1/inventory/items:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.UserInventoryService = UserInventoryService;
class UserInventoryAdminService {
    static ConsumeItem(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryAdminService/ConsumeItem`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static AddEntitlements(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryAdminService/AddEntitlements`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteEntitlements(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryAdminService/DeleteEntitlements`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static AddEntitlementGroupedBatch(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryAdminService/AddEntitlementGroupedBatch`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static PublishInventoryEvents(req, initReq) {
        return fm.fetchReq(`/inventory.UserInventoryAdminService/PublishInventoryEvents`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.UserInventoryAdminService = UserInventoryAdminService;
//# sourceMappingURL=inventory.pb.js.map