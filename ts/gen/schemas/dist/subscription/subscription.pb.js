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
exports.ChannelSubscriptionInternalService = exports.ChannelSubscriptionService = exports.routeListUserChannelSubscriptionsRequestFilterFilterDelegate = exports.ChannelSubscriptionUpdateEventUpdateType = exports.ChannelSubscriptionProvider = exports.ChannelSubscriptionCancelReason = exports.ChannelSubscriptionState = exports.SubscriptionPricePeriod = exports.ErrorDetailsErrorType = exports.TaskUpdateType = exports.TaskStatus = void 0;
const fm = __importStar(require("../fetch.pb"));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TASK_STATUS_UNSPECIFIED"] = "TASK_STATUS_UNSPECIFIED";
    TaskStatus["TASK_STATUS_PENDING"] = "TASK_STATUS_PENDING";
    TaskStatus["TASK_STATUS_COMPLETED"] = "TASK_STATUS_COMPLETED";
    TaskStatus["TASK_STATUS_FAILED"] = "TASK_STATUS_FAILED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskUpdateType;
(function (TaskUpdateType) {
    TaskUpdateType["TASK_UPDATE_TYPE_UNSPECIFIED"] = "TASK_UPDATE_TYPE_UNSPECIFIED";
    TaskUpdateType["TASK_UPDATE_TYPE_CREATED"] = "TASK_UPDATE_TYPE_CREATED";
    TaskUpdateType["TASK_UPDATE_TYPE_COMPLETED"] = "TASK_UPDATE_TYPE_COMPLETED";
    TaskUpdateType["TASK_UPDATE_TYPE_FAILED"] = "TASK_UPDATE_TYPE_FAILED";
})(TaskUpdateType || (exports.TaskUpdateType = TaskUpdateType = {}));
var ErrorDetailsErrorType;
(function (ErrorDetailsErrorType) {
    ErrorDetailsErrorType["ERROR_TYPE_UNSPECIFIED"] = "ERROR_TYPE_UNSPECIFIED";
    ErrorDetailsErrorType["ERROR_TYPE_PAYMENT_FAILED"] = "ERROR_TYPE_PAYMENT_FAILED";
})(ErrorDetailsErrorType || (exports.ErrorDetailsErrorType = ErrorDetailsErrorType = {}));
var SubscriptionPricePeriod;
(function (SubscriptionPricePeriod) {
    SubscriptionPricePeriod["PERIOD_UNSPECIFIED"] = "PERIOD_UNSPECIFIED";
    SubscriptionPricePeriod["PERIOD_MONTH"] = "PERIOD_MONTH";
    SubscriptionPricePeriod["PERIOD_YEAR"] = "PERIOD_YEAR";
})(SubscriptionPricePeriod || (exports.SubscriptionPricePeriod = SubscriptionPricePeriod = {}));
var ChannelSubscriptionState;
(function (ChannelSubscriptionState) {
    ChannelSubscriptionState["STATE_UNSPECIFIED"] = "STATE_UNSPECIFIED";
    ChannelSubscriptionState["STATE_PENDING"] = "STATE_PENDING";
    ChannelSubscriptionState["STATE_ACTIVE"] = "STATE_ACTIVE";
    ChannelSubscriptionState["STATE_CANCELLED"] = "STATE_CANCELLED";
    ChannelSubscriptionState["STATE_EXPIRED"] = "STATE_EXPIRED";
    ChannelSubscriptionState["STATE_TERMINATED"] = "STATE_TERMINATED";
    ChannelSubscriptionState["STATE_LOCKED"] = "STATE_LOCKED";
})(ChannelSubscriptionState || (exports.ChannelSubscriptionState = ChannelSubscriptionState = {}));
var ChannelSubscriptionCancelReason;
(function (ChannelSubscriptionCancelReason) {
    ChannelSubscriptionCancelReason["CANCEL_REASON_UNSPECIFIED"] = "CANCEL_REASON_UNSPECIFIED";
    ChannelSubscriptionCancelReason["CANCEL_REASON_NOT_PAID"] = "CANCEL_REASON_NOT_PAID";
    ChannelSubscriptionCancelReason["CANCEL_REASON_NO_CARD"] = "CANCEL_REASON_NO_CARD";
    ChannelSubscriptionCancelReason["CANCEL_REASON_FRAUD_REVIEW_FAILED"] = "CANCEL_REASON_FRAUD_REVIEW_FAILED";
    ChannelSubscriptionCancelReason["CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER"] = "CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER";
    ChannelSubscriptionCancelReason["CANCEL_REASON_TAX_CALCULATION_FAILED"] = "CANCEL_REASON_TAX_CALCULATION_FAILED";
    ChannelSubscriptionCancelReason["CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY"] = "CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY";
    ChannelSubscriptionCancelReason["CANCEL_REASON_NON_COMPLIANT_CUSTOMER"] = "CANCEL_REASON_NON_COMPLIANT_CUSTOMER";
})(ChannelSubscriptionCancelReason || (exports.ChannelSubscriptionCancelReason = ChannelSubscriptionCancelReason = {}));
var ChannelSubscriptionProvider;
(function (ChannelSubscriptionProvider) {
    ChannelSubscriptionProvider["PROVIDER_UNSPECIFIED"] = "PROVIDER_UNSPECIFIED";
    ChannelSubscriptionProvider["PROVIDER_CHARGEBEE"] = "PROVIDER_CHARGEBEE";
    ChannelSubscriptionProvider["PROVIDER_APPLE"] = "PROVIDER_APPLE";
})(ChannelSubscriptionProvider || (exports.ChannelSubscriptionProvider = ChannelSubscriptionProvider = {}));
var ChannelSubscriptionUpdateEventUpdateType;
(function (ChannelSubscriptionUpdateEventUpdateType) {
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_UNSPECIFIED"] = "UPDATE_TYPE_UNSPECIFIED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_CREATED"] = "UPDATE_TYPE_CREATED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_ACTIVATED"] = "UPDATE_TYPE_ACTIVATED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_RENEWED"] = "UPDATE_TYPE_RENEWED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_EXPIRED"] = "UPDATE_TYPE_EXPIRED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_CANCELLED"] = "UPDATE_TYPE_CANCELLED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_TERMINATED"] = "UPDATE_TYPE_TERMINATED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_PAYMENT_FAILED"] = "UPDATE_TYPE_PAYMENT_FAILED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_CANCELLATION_REQUESTED"] = "UPDATE_TYPE_CANCELLATION_REQUESTED";
    ChannelSubscriptionUpdateEventUpdateType["UPDATE_TYPE_UPGRADED"] = "UPDATE_TYPE_UPGRADED";
})(ChannelSubscriptionUpdateEventUpdateType || (exports.ChannelSubscriptionUpdateEventUpdateType = ChannelSubscriptionUpdateEventUpdateType = {}));
function routeListUserChannelSubscriptionsRequestFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.state) && delegate.onState(ctx, val.state);
    (val === null || val === void 0 ? void 0 : val.paymentFailed) && delegate.onPaymentFailed(ctx, val.paymentFailed);
}
exports.routeListUserChannelSubscriptionsRequestFilterFilterDelegate = routeListUserChannelSubscriptionsRequestFilterFilterDelegate;
class ChannelSubscriptionService {
    static GetChannelSubscriptionConfig(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptionConfig?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static UpdateChannelSubscriptionConfig(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptionConfig`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CheckoutNewSubscription(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptions:checkoutNew`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateSubscriptionPaymentMethod(req, initReq) {
        return fm.fetchReq(`/v1/subscriptions:paymentMethod`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CheckoutExistingSubscription(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptions:checkoutExisting`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CancelSubscription(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptions:cancel`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ReactivateSubscription(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptions:reactivate`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetUserChannelSubscription(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/channelSubscription/${req["channelId"]}?${fm.renderURLSearchParams(req, ["userId", "channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListChannelSubscriptionTiers(req, initReq) {
        return fm.fetchReq(`/v1/channels/${req["channelId"]}/subscriptionTiers?${fm.renderURLSearchParams(req, ["channelId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListUserChannelSubscriptions(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/channelSubscriptions?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.ChannelSubscriptionService = ChannelSubscriptionService;
class ChannelSubscriptionInternalService {
    static CreateGiftSubscriptionTask(req, initReq) {
        return fm.fetchReq(`/subscription.ChannelSubscriptionInternalService/CreateGiftSubscriptionTask`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.ChannelSubscriptionInternalService = ChannelSubscriptionInternalService;
//# sourceMappingURL=subscription.pb.js.map