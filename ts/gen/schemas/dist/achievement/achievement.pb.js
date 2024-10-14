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
exports.AchievementService = exports.routeFilterFilterDelegate = exports.AchievementConfigCounterRuleDefaultType = void 0;
const fm = __importStar(require("../fetch.pb"));
var AchievementConfigCounterRuleDefaultType;
(function (AchievementConfigCounterRuleDefaultType) {
    AchievementConfigCounterRuleDefaultType["DEFAULT_TYPE_UNSPECIFIED"] = "DEFAULT_TYPE_UNSPECIFIED";
    AchievementConfigCounterRuleDefaultType["DEFAULT_TYPE_ZERO"] = "DEFAULT_TYPE_ZERO";
    AchievementConfigCounterRuleDefaultType["DEFAULT_TYPE_CURRENT_VALUE"] = "DEFAULT_TYPE_CURRENT_VALUE";
})(AchievementConfigCounterRuleDefaultType || (exports.AchievementConfigCounterRuleDefaultType = AchievementConfigCounterRuleDefaultType = {}));
function routeFilterFilterDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.game) && delegate.onGame(ctx, val.game);
    (val === null || val === void 0 ? void 0 : val.channel) && delegate.onChannel(ctx, val.channel);
}
exports.routeFilterFilterDelegate = routeFilterFilterDelegate;
class AchievementService {
    static ListUserAchievements(req, initReq) {
        return fm.fetchReq(`/achievement.AchievementService/ListUserAchievements`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AchievementService = AchievementService;
//# sourceMappingURL=achievement.pb.js.map