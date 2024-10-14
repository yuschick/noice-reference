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
exports.PaymentService = exports.routeSessionSessionDelegate = exports.PaymentStatus = exports.Currency = void 0;
const fm = __importStar(require("../fetch.pb"));
var Currency;
(function (Currency) {
    Currency["CURRENCY_UNSPECIFIED"] = "CURRENCY_UNSPECIFIED";
    Currency["CURRENCY_USD"] = "CURRENCY_USD";
    Currency["CURRENCY_EUR"] = "CURRENCY_EUR";
    Currency["CURRENCY_GBP"] = "CURRENCY_GBP";
})(Currency || (exports.Currency = Currency = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAYMENT_STATUS_UNSPECIFIED"] = "PAYMENT_STATUS_UNSPECIFIED";
    PaymentStatus["PAYMENT_STATUS_PENDING"] = "PAYMENT_STATUS_PENDING";
    PaymentStatus["PAYMENT_STATUS_SUCCESS"] = "PAYMENT_STATUS_SUCCESS";
    PaymentStatus["PAYMENT_STATUS_FAILED"] = "PAYMENT_STATUS_FAILED";
    PaymentStatus["PAYMENT_STATUS_REVERSED"] = "PAYMENT_STATUS_REVERSED";
    PaymentStatus["PAYMENT_STATUS_EXPIRED"] = "PAYMENT_STATUS_EXPIRED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
function routeSessionSessionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.adyen) && delegate.onAdyen(ctx, val.adyen);
}
exports.routeSessionSessionDelegate = routeSessionSessionDelegate;
class PaymentService {
    static CreatePayment(req, initReq) {
        return fm.fetchReq(`/v1/payments`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static StartSession(req, initReq) {
        return fm.fetchReq(`/v1/payment/session`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetPayment(req, initReq) {
        return fm.fetchReq(`/v1/payments/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static RefundPayment(req, initReq) {
        return fm.fetchReq(`/v1/payments/${req["id"]}:refund`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListSuccessfulPayments(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/successfulPayments?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListPayments(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/payments?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.pb.js.map