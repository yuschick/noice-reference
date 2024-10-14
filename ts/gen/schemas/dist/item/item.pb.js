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
exports.ItemInternalService = exports.ItemService = exports.routeListItemsRequestFilterFilterDelegate = exports.ItemType = void 0;
const fm = __importStar(require("../fetch.pb"));
var ItemType;
(function (ItemType) {
    ItemType["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    ItemType["TYPE_DAILY_GOAL_CARD_SLOT"] = "TYPE_DAILY_GOAL_CARD_SLOT";
    ItemType["TYPE_GAME_CARD"] = "TYPE_GAME_CARD";
    ItemType["TYPE_UNLOCK"] = "TYPE_UNLOCK";
    ItemType["TYPE_EMOTE"] = "TYPE_EMOTE";
    ItemType["TYPE_EMOJI"] = "TYPE_EMOJI";
    ItemType["TYPE_STREAMER_CARD"] = "TYPE_STREAMER_CARD";
    ItemType["TYPE_SUBSCRIPTION"] = "TYPE_SUBSCRIPTION";
    ItemType["TYPE_BOOTSTRAP"] = "TYPE_BOOTSTRAP";
    ItemType["TYPE_AVATAR_ITEM"] = "TYPE_AVATAR_ITEM";
})(ItemType || (exports.ItemType = ItemType = {}));
function routeListItemsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.gameId) && delegate.onGameId(ctx, val.gameId);
    (val === null || val === void 0 ? void 0 : val.seasonId) && delegate.onSeasonId(ctx, val.seasonId);
    (val === null || val === void 0 ? void 0 : val.channelId) && delegate.onChannelId(ctx, val.channelId);
    (val === null || val === void 0 ? void 0 : val.itemType) && delegate.onItemType(ctx, val.itemType);
    (val === null || val === void 0 ? void 0 : val.attribute) && delegate.onAttribute(ctx, val.attribute);
    (val === null || val === void 0 ? void 0 : val.parentId) && delegate.onParentId(ctx, val.parentId);
}
exports.routeListItemsRequestFilterFilterDelegate = routeListItemsRequestFilterFilterDelegate;
class ItemService {
    static GetItem(req, initReq) {
        return fm.fetchReq(`/v1/items/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetItems(req, initReq) {
        return fm.fetchReq(`/v1/items:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListItems(req, initReq) {
        return fm.fetchReq(`/v1/items?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannelItemStats(req, initReq) {
        return fm.fetchReq(`/item.ItemService/GetChannelItemStats`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetChannelItemStats(req, initReq) {
        return fm.fetchReq(`/item.ItemService/BatchGetChannelItemStats`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateItemBootstrap(req, initReq) {
        return fm.fetchReq(`/v1/items/${req["bootstrap"]["itemId"]}/bootstraps`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateItemBootstrap(req, initReq) {
        return fm.fetchReq(`/v1/items/${req["body"]["itemId"]}/bootstraps/${req["body"]["revision"]}`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req["body"]) }));
    }
    static ListItemBootstraps(req, initReq) {
        return fm.fetchReq(`/v1/itemBootstraps?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateItem(req, initReq) {
        return fm.fetchReq(`/v1/items`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ItemService = ItemService;
class ItemInternalService {
    static BatchListItems(req, initReq) {
        return fm.fetchReq(`/item.ItemInternalService/BatchListItems`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ItemInternalService = ItemInternalService;
//# sourceMappingURL=item.pb.js.map