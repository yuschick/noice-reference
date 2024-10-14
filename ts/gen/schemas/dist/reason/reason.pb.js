"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeReasonReasonDelegate = exports.RevenueRecipientKind = exports.ReasonMetadataField = void 0;
var ReasonMetadataField;
(function (ReasonMetadataField) {
    ReasonMetadataField["UNSPECIFIED"] = "UNSPECIFIED";
    ReasonMetadataField["TEAM_PLAYER_BONUS_XP"] = "TEAM_PLAYER_BONUS_XP";
    ReasonMetadataField["TEAM_PLAYER_BONUS_COINS"] = "TEAM_PLAYER_BONUS_COINS";
    ReasonMetadataField["PARTICIPATION_BONUS_XP"] = "PARTICIPATION_BONUS_XP";
    ReasonMetadataField["PARTICIPATION_BONUS_COINS"] = "PARTICIPATION_BONUS_COINS";
    ReasonMetadataField["DAILY_BOOST_XP"] = "DAILY_BOOST_XP";
})(ReasonMetadataField || (exports.ReasonMetadataField = ReasonMetadataField = {}));
var RevenueRecipientKind;
(function (RevenueRecipientKind) {
    RevenueRecipientKind["KIND_UNSPECIFIED"] = "KIND_UNSPECIFIED";
    RevenueRecipientKind["KIND_PLATFORM"] = "KIND_PLATFORM";
    RevenueRecipientKind["KIND_CHANNEL"] = "KIND_CHANNEL";
})(RevenueRecipientKind || (exports.RevenueRecipientKind = RevenueRecipientKind = {}));
function routeReasonReasonDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.goalCardComplete) && delegate.onGoalCardComplete(ctx, val.goalCardComplete);
    (val === null || val === void 0 ? void 0 : val.matchEnd) && delegate.onMatchEnd(ctx, val.matchEnd);
    (val === null || val === void 0 ? void 0 : val.rewardClaimed) && delegate.onRewardClaimed(ctx, val.rewardClaimed);
    (val === null || val === void 0 ? void 0 : val.administrative) && delegate.onAdministrative(ctx, val.administrative);
    (val === null || val === void 0 ? void 0 : val.goalCardSlotReshuffle) && delegate.onGoalCardSlotReshuffle(ctx, val.goalCardSlotReshuffle);
    (val === null || val === void 0 ? void 0 : val.levelUp) && delegate.onLevelUp(ctx, val.levelUp);
    (val === null || val === void 0 ? void 0 : val.reshuffle) && delegate.onReshuffle(ctx, val.reshuffle);
    (val === null || val === void 0 ? void 0 : val.adWatched) && delegate.onAdWatched(ctx, val.adWatched);
    (val === null || val === void 0 ? void 0 : val.provision) && delegate.onProvision(ctx, val.provision);
    (val === null || val === void 0 ? void 0 : val.purchaseWithInGameCurrency) && delegate.onPurchaseWithInGameCurrency(ctx, val.purchaseWithInGameCurrency);
    (val === null || val === void 0 ? void 0 : val.purchaseWithPayment) && delegate.onPurchaseWithPayment(ctx, val.purchaseWithPayment);
    (val === null || val === void 0 ? void 0 : val.channelSubscription) && delegate.onChannelSubscription(ctx, val.channelSubscription);
    (val === null || val === void 0 ? void 0 : val.storeOrderPayment) && delegate.onStoreOrderPayment(ctx, val.storeOrderPayment);
    (val === null || val === void 0 ? void 0 : val.channelOwner) && delegate.onChannelOwner(ctx, val.channelOwner);
    (val === null || val === void 0 ? void 0 : val.giftPurchaseWithInGameCurrency) && delegate.onGiftPurchaseWithInGameCurrency(ctx, val.giftPurchaseWithInGameCurrency);
    (val === null || val === void 0 ? void 0 : val.giftPurchaseWithPayment) && delegate.onGiftPurchaseWithPayment(ctx, val.giftPurchaseWithPayment);
}
exports.routeReasonReasonDelegate = routeReasonReasonDelegate;
//# sourceMappingURL=reason.pb.js.map