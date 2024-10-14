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
exports.StoreServiceV2 = exports.routeListSellableItemsRequestFilterFilterDelegate = exports.routeOrderTotalValueDelegate = exports.routeOrderOrderTotalDelegate = exports.routeContentValueDelegate = exports.routeSellableItemOptionsValueDelegate = exports.StoreType = exports.OrderStatus = exports.RecipientRestriction = exports.PriceTier = exports.ItemType = void 0;
const fm = __importStar(require("../fetch.pb"));
var ItemType;
(function (ItemType) {
    ItemType["ITEM_TYPE_UNSPECIFIED"] = "ITEM_TYPE_UNSPECIFIED";
    ItemType["ITEM_TYPE_CURRENCY_PACK"] = "ITEM_TYPE_CURRENCY_PACK";
    ItemType["ITEM_TYPE_STANDARD_CARD_BUNDLE"] = "ITEM_TYPE_STANDARD_CARD_BUNDLE";
    ItemType["ITEM_TYPE_PREMIUM_CARD_BUNDLE"] = "ITEM_TYPE_PREMIUM_CARD_BUNDLE";
    ItemType["ITEM_TYPE_STREAMER_CARD"] = "ITEM_TYPE_STREAMER_CARD";
    ItemType["ITEM_TYPE_GIFT_SUBSCRIPTION"] = "ITEM_TYPE_GIFT_SUBSCRIPTION";
})(ItemType || (exports.ItemType = ItemType = {}));
var PriceTier;
(function (PriceTier) {
    PriceTier["PRICE_TIER_UNSPECIFIED"] = "PRICE_TIER_UNSPECIFIED";
    PriceTier["PRICE_TIER_1"] = "PRICE_TIER_1";
    PriceTier["PRICE_TIER_2"] = "PRICE_TIER_2";
    PriceTier["PRICE_TIER_3"] = "PRICE_TIER_3";
    PriceTier["PRICE_TIER_4"] = "PRICE_TIER_4";
    PriceTier["PRICE_TIER_5"] = "PRICE_TIER_5";
    PriceTier["PRICE_TIER_6"] = "PRICE_TIER_6";
    PriceTier["PRICE_TIER_7"] = "PRICE_TIER_7";
    PriceTier["PRICE_TIER_8"] = "PRICE_TIER_8";
    PriceTier["PRICE_TIER_9"] = "PRICE_TIER_9";
    PriceTier["PRICE_TIER_10"] = "PRICE_TIER_10";
})(PriceTier || (exports.PriceTier = PriceTier = {}));
var RecipientRestriction;
(function (RecipientRestriction) {
    RecipientRestriction["RECIPIENT_RESTRICTION_UNSPECIFIED"] = "RECIPIENT_RESTRICTION_UNSPECIFIED";
    RecipientRestriction["RECIPIENT_RESTRICTION_GIFT_ONLY"] = "RECIPIENT_RESTRICTION_GIFT_ONLY";
    RecipientRestriction["RECIPIENT_RESTRICTION_SELF_ONLY"] = "RECIPIENT_RESTRICTION_SELF_ONLY";
})(RecipientRestriction || (exports.RecipientRestriction = RecipientRestriction = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["ORDER_STATUS_UNSPECIFIED"] = "ORDER_STATUS_UNSPECIFIED";
    OrderStatus["ORDER_STATUS_PENDING"] = "ORDER_STATUS_PENDING";
    OrderStatus["ORDER_STATUS_COMPLETED"] = "ORDER_STATUS_COMPLETED";
    OrderStatus["ORDER_STATUS_FAILED"] = "ORDER_STATUS_FAILED";
    OrderStatus["ORDER_STATUS_REFUNDED"] = "ORDER_STATUS_REFUNDED";
    OrderStatus["ORDER_STATUS_REVERSED"] = "ORDER_STATUS_REVERSED";
    OrderStatus["ORDER_STATUS_CANCELLED"] = "ORDER_STATUS_CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var StoreType;
(function (StoreType) {
    StoreType["STORE_TYPE_UNSPECIFIED"] = "STORE_TYPE_UNSPECIFIED";
    StoreType["STORE_TYPE_PLATFORM"] = "STORE_TYPE_PLATFORM";
    StoreType["STORE_TYPE_CHANNEL"] = "STORE_TYPE_CHANNEL";
})(StoreType || (exports.StoreType = StoreType = {}));
function routeSellableItemOptionsValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.currencyPack) && delegate.onCurrencyPack(ctx, val.currencyPack);
    (val === null || val === void 0 ? void 0 : val.cardBundle) && delegate.onCardBundle(ctx, val.cardBundle);
}
exports.routeSellableItemOptionsValueDelegate = routeSellableItemOptionsValueDelegate;
function routeContentValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.item) && delegate.onItem(ctx, val.item);
    (val === null || val === void 0 ? void 0 : val.currency) && delegate.onCurrency(ctx, val.currency);
    (val === null || val === void 0 ? void 0 : val.subscription) && delegate.onSubscription(ctx, val.subscription);
}
exports.routeContentValueDelegate = routeContentValueDelegate;
function routeOrderOrderTotalDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.price) && delegate.onPrice(ctx, val.price);
    (val === null || val === void 0 ? void 0 : val.igcPrice) && delegate.onIgcPrice(ctx, val.igcPrice);
}
exports.routeOrderOrderTotalDelegate = routeOrderOrderTotalDelegate;
function routeOrderTotalValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.price) && delegate.onPrice(ctx, val.price);
    (val === null || val === void 0 ? void 0 : val.igcPrice) && delegate.onIgcPrice(ctx, val.igcPrice);
}
exports.routeOrderTotalValueDelegate = routeOrderTotalValueDelegate;
function routeListSellableItemsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.platform) && delegate.onPlatform(ctx, val.platform);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
}
exports.routeListSellableItemsRequestFilterFilterDelegate = routeListSellableItemsRequestFilterFilterDelegate;
class StoreServiceV2 {
    static GetPlatformStoreFront(req, initReq) {
        return fm.fetchReq(`/v1/store/storeFront:platform?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetChannelStoreFront(req, initReq) {
        return fm.fetchReq(`/v1/store/storeFront:channel?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static GetSellableItem(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListTopUpSellableItems(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems:topUp?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListGiftSellableItems(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems:gift?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListSellableItems(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BuyWithInGameCurrency(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems:buyWithInGameCurrency`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static BuyWithPayment(req, initReq) {
        return fm.fetchReq(`/v1/store/sellableItems:buyWithPayment`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CancelOrder(req, initReq) {
        return fm.fetchReq(`/v1/store/orders/${req["orderId"]}:cancel`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateStreamerCardSaleConfig(req, initReq) {
        return fm.fetchReq(`/v1/store/streamerCardSaleConfigs`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateStreamerCardSaleConfig(req, initReq) {
        return fm.fetchReq(`/v1/store/streamerCardSaleConfigs`, Object.assign(Object.assign({}, initReq), { method: "PATCH", body: JSON.stringify(req["body"]) }));
    }
    static ListStreamerCardSaleConfigs(req, initReq) {
        return fm.fetchReq(`/v1/store/streamerCardSaleConfigs?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetStreamerCardSaleConfigs(req, initReq) {
        return fm.fetchReq(`/v1/store/streamerCardSaleConfigs:batchGet`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StoreServiceV2 = StoreServiceV2;
//# sourceMappingURL=storev2.pb.js.map