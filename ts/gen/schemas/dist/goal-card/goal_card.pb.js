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
exports.GoalCardAdminService = exports.GoalCardService = exports.GoalCardTargetType = void 0;
const fm = __importStar(require("../fetch.pb"));
var GoalCardTargetType;
(function (GoalCardTargetType) {
    GoalCardTargetType["TARGET_TYPE_UNSPECIFIED"] = "TARGET_TYPE_UNSPECIFIED";
    GoalCardTargetType["TARGET_TYPE_TOTAL"] = "TARGET_TYPE_TOTAL";
    GoalCardTargetType["TARGET_TYPE_SINGLE_UPDATE"] = "TARGET_TYPE_SINGLE_UPDATE";
    GoalCardTargetType["TARGET_TYPE_UPDATE_COUNT"] = "TARGET_TYPE_UPDATE_COUNT";
})(GoalCardTargetType || (exports.GoalCardTargetType = GoalCardTargetType = {}));
class GoalCardService {
    static GetGoalCard(req, initReq) {
        return fm.fetchReq(`/v1/goalcards/${req["id"]}?${fm.renderURLSearchParams(req, ["id"])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static BatchGetGoalCards(req, initReq) {
        return fm.fetchReq(`/v1/goalcards:batchGet?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
    static ListGoalCardSlots(req, initReq) {
        return fm.fetchReq(`/goal_card.GoalCardService/ListGoalCardSlots`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetGoalCardSlot(req, initReq) {
        return fm.fetchReq(`/goal_card.GoalCardService/SetGoalCardSlot`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static GetSlotOptions(req, initReq) {
        return fm.fetchReq(`/goal_card.GoalCardService/GetSlotOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ReshuffleSlot(req, initReq) {
        return fm.fetchReq(`/goal_card.GoalCardService/ReshuffleSlot`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.GoalCardService = GoalCardService;
class GoalCardAdminService {
    static ListAllGoalCards(req, initReq) {
        return fm.fetchReq(`/goal_card.GoalCardAdminService/ListAllGoalCards`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.GoalCardAdminService = GoalCardAdminService;
//# sourceMappingURL=goal_card.pb.js.map