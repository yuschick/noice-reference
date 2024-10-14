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
exports.RewardAdminService = exports.RewardService = exports.routeRewardTypeRewardDelegate = void 0;
const fm = __importStar(require("../fetch.pb"));
function routeRewardTypeRewardDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.item) && delegate.onItem(ctx, val.item);
    (val === null || val === void 0 ? void 0 : val.currency) && delegate.onCurrency(ctx, val.currency);
}
exports.routeRewardTypeRewardDelegate = routeRewardTypeRewardDelegate;
class RewardService {
    static ListRewards(req, initReq) {
        return fm.fetchReq(`/reward.RewardService/ListRewards`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ClaimReward(req, initReq) {
        return fm.fetchReq(`/reward.RewardService/ClaimReward`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.RewardService = RewardService;
class RewardAdminService {
    static AwardReward(req, initReq) {
        return fm.fetchReq(`/reward.RewardAdminService/AwardReward`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.RewardAdminService = RewardAdminService;
//# sourceMappingURL=reward.pb.js.map