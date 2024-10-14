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
exports.StreamerCardService = exports.BoosterService = exports.GameCardAdminService = exports.GameCardService = exports.routeListStreamerCardDraftsRequestFilterFilterDelegate = exports.routeListStreamerCardsRequestFilterFilterDelegate = exports.StreamerCardUpdateEventUpdateType = exports.HighScoringCardTimingsSpeed = exports.AssetType = void 0;
const fm = __importStar(require("../fetch.pb"));
var AssetType;
(function (AssetType) {
    AssetType["ASSET_TYPE_UNSPECIFIED"] = "ASSET_TYPE_UNSPECIFIED";
    AssetType["ASSET_TYPE_VIDEO"] = "ASSET_TYPE_VIDEO";
    AssetType["ASSET_TYPE_THUMBNAIL"] = "ASSET_TYPE_THUMBNAIL";
})(AssetType || (exports.AssetType = AssetType = {}));
var HighScoringCardTimingsSpeed;
(function (HighScoringCardTimingsSpeed) {
    HighScoringCardTimingsSpeed["SPEED_UNSPECIFIED"] = "SPEED_UNSPECIFIED";
    HighScoringCardTimingsSpeed["SPEED_SLOWEST"] = "SPEED_SLOWEST";
    HighScoringCardTimingsSpeed["SPEED_SLOW"] = "SPEED_SLOW";
    HighScoringCardTimingsSpeed["SPEED_DEFAULT"] = "SPEED_DEFAULT";
    HighScoringCardTimingsSpeed["SPEED_FAST"] = "SPEED_FAST";
    HighScoringCardTimingsSpeed["SPEED_FASTEST"] = "SPEED_FASTEST";
})(HighScoringCardTimingsSpeed || (exports.HighScoringCardTimingsSpeed = HighScoringCardTimingsSpeed = {}));
var StreamerCardUpdateEventUpdateType;
(function (StreamerCardUpdateEventUpdateType) {
    StreamerCardUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    StreamerCardUpdateEventUpdateType["UPDATE_TYPE_CREATED"] = "UPDATE_TYPE_CREATED";
    StreamerCardUpdateEventUpdateType["UPDATE_TYPE_UPDATED"] = "UPDATE_TYPE_UPDATED";
    StreamerCardUpdateEventUpdateType["UPDATE_TYPE_DELETED"] = "UPDATE_TYPE_DELETED";
})(StreamerCardUpdateEventUpdateType || (exports.StreamerCardUpdateEventUpdateType = StreamerCardUpdateEventUpdateType = {}));
function routeListStreamerCardsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.channelId) && delegate.onChannelId(ctx, val.channelId);
    (val === null || val === void 0 ? void 0 : val.familyId) && delegate.onFamilyId(ctx, val.familyId);
    (val === null || val === void 0 ? void 0 : val.gameId) && delegate.onGameId(ctx, val.gameId);
}
exports.routeListStreamerCardsRequestFilterFilterDelegate = routeListStreamerCardsRequestFilterFilterDelegate;
function routeListStreamerCardDraftsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.familyId) && delegate.onFamilyId(ctx, val.familyId);
    (val === null || val === void 0 ? void 0 : val.gameId) && delegate.onGameId(ctx, val.gameId);
}
exports.routeListStreamerCardDraftsRequestFilterFilterDelegate = routeListStreamerCardDraftsRequestFilterFilterDelegate;
class GameCardService {
    static ListGameCards(req, initReq) {
        return fm.fetchReq(`/v1/gamecards?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static InventoryGetGameCards(req, initReq) {
        return fm.fetchReq(`/v1/inventory/items:getGameCards`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BatchGetGameCards(req, initReq) {
        return fm.fetchReq(`/v1/gamecards:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetProgressionConfig(req, initReq) {
        return fm.fetchReq(`/game_card.GameCardService/GetProgressionConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetHighScoringCardsConfig(req, initReq) {
        return fm.fetchReq(`/game_card.GameCardService/GetHighScoringCardsConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.GameCardService = GameCardService;
class GameCardAdminService {
    static GetGameCardConfigByFamilyId(req, initReq) {
        return fm.fetchReq(`/game_card.GameCardAdminService/GetGameCardConfigByFamilyId`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListGameCardsConfigs(req, initReq) {
        return fm.fetchReq(`/game_card.GameCardAdminService/ListGameCardsConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.GameCardAdminService = GameCardAdminService;
class BoosterService {
    static GetBooster(req, initReq) {
        return fm.fetchReq(`/game_card.BoosterService/GetBooster`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListBoosters(req, initReq) {
        return fm.fetchReq(`/game_card.BoosterService/ListBoosters`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.BoosterService = BoosterService;
class StreamerCardService {
    static BatchGetStreamerCards(req, initReq) {
        return fm.fetchReq(`/v1/streamerCards:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListStreamerCards(req, initReq) {
        return fm.fetchReq(`/v1/streamerCards`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListInventoryStreamerCards(req, initReq) {
        return fm.fetchReq(`/game_card.StreamerCardService/ListInventoryStreamerCards`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetStreamerCardSelection(req, initReq) {
        return fm.fetchReq(`/game_card.StreamerCardService/GetStreamerCardSelection`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListStreamerCardSelections(req, initReq) {
        return fm.fetchReq(`/game_card.StreamerCardService/ListStreamerCardSelections`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetStreamerCardSelection(req, initReq) {
        return fm.fetchReq(`/game_card.StreamerCardService/SetStreamerCardSelection`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UnsetStreamerCardSelection(req, initReq) {
        return fm.fetchReq(`/game_card.StreamerCardService/UnsetStreamerCardSelection`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetStreamerCard(req, initReq) {
        return fm.fetchReq(`/v1/streamerCards/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateStreamerCardDraft(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streamerCardDrafts`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateStreamerCardDraft(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["body"]["channelId"]}/streamerCardDrafts/${req["body"]["cardId"]}`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static DeleteStreamerCardDraft(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streamerCardDrafts/${req["cardId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static PublishStreamerCardDraft(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streamerCardDrafts/${req["cardId"]}:publish`, Object.assign(Object.assign({}, initReq), { method: "POST" }));
    }
    static ListStreamerCardDrafts(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streamerCardDrafts?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static CreateStreamerCardAssetUploadToken(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/streamerCards:assetUploadToken`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StreamerCardService = StreamerCardService;
//# sourceMappingURL=game_card.pb.js.map