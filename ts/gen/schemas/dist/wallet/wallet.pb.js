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
exports.WalletAdminService = exports.WalletService = exports.OperationType = exports.TransactionReason = void 0;
const fm = __importStar(require("../fetch.pb"));
var TransactionReason;
(function (TransactionReason) {
    TransactionReason["TRANSACTION_REASON_UNSPECIFIED"] = "TRANSACTION_REASON_UNSPECIFIED";
    TransactionReason["TRANSACTION_REASON_GOAL_CARD_COMPLETE"] = "TRANSACTION_REASON_GOAL_CARD_COMPLETE";
    TransactionReason["TRANSACTION_REASON_MATCH_END"] = "TRANSACTION_REASON_MATCH_END";
    TransactionReason["TRANSACTION_REASON_REWARD_CLAIMED"] = "TRANSACTION_REASON_REWARD_CLAIMED";
    TransactionReason["TRANSACTION_REASON_ADMINISTRATIVE"] = "TRANSACTION_REASON_ADMINISTRATIVE";
    TransactionReason["TRANSACTION_REASON_GOAL_CARD_SLOT_RESHUFFLE"] = "TRANSACTION_REASON_GOAL_CARD_SLOT_RESHUFFLE";
    TransactionReason["TRANSACTION_REASON_LEVEL_UP"] = "TRANSACTION_REASON_LEVEL_UP";
    TransactionReason["TRANSACTION_REASON_RESHUFFLE"] = "TRANSACTION_REASON_RESHUFFLE";
    TransactionReason["TRANSACTION_REASON_AD_WATCHED"] = "TRANSACTION_REASON_AD_WATCHED";
    TransactionReason["TRANSACTION_REASON_PROVISION"] = "TRANSACTION_REASON_PROVISION";
    TransactionReason["TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY"] = "TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY";
    TransactionReason["TRANSACTION_REASON_PURCHASE_WITH_PAYMENT"] = "TRANSACTION_REASON_PURCHASE_WITH_PAYMENT";
    TransactionReason["TRANSACTION_REASON_CHANNEL_SUBSCRIPTION"] = "TRANSACTION_REASON_CHANNEL_SUBSCRIPTION";
    TransactionReason["TRANSACTION_REASON_STORE_ORDER_PAYMENT"] = "TRANSACTION_REASON_STORE_ORDER_PAYMENT";
})(TransactionReason || (exports.TransactionReason = TransactionReason = {}));
var OperationType;
(function (OperationType) {
    OperationType["TYPE_UNSPECIFIED"] = "TYPE_UNSPECIFIED";
    OperationType["TYPE_ADD"] = "TYPE_ADD";
    OperationType["TYPE_SUBTRACT"] = "TYPE_SUBTRACT";
})(OperationType || (exports.OperationType = OperationType = {}));
class WalletService {
    static GetWallet(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/wallet?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListWalletTransactions(req, initReq) {
        return fm.fetchReq(`/v1/users/${req["userId"]}/wallet/transactions?${fm.renderURLSearchParams(req, ["userId"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.WalletService = WalletService;
class WalletAdminService {
    static AddCurrencies(req, initReq) {
        return fm.fetchReq(`/wallet.WalletAdminService/AddCurrencies`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SubtractCurrencies(req, initReq) {
        return fm.fetchReq(`/wallet.WalletAdminService/SubtractCurrencies`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.WalletAdminService = WalletAdminService;
//# sourceMappingURL=wallet.pb.js.map