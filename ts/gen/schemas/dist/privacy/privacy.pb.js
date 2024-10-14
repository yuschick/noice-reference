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
exports.PrivacyService = exports.UserDataTaskStatus = void 0;
const fm = __importStar(require("../fetch.pb"));
var UserDataTaskStatus;
(function (UserDataTaskStatus) {
    UserDataTaskStatus["USER_DATA_TASK_STATUS_UNSPECIFIED"] = "USER_DATA_TASK_STATUS_UNSPECIFIED";
    UserDataTaskStatus["USER_DATA_TASK_STATUS_SCHEDULED"] = "USER_DATA_TASK_STATUS_SCHEDULED";
    UserDataTaskStatus["USER_DATA_TASK_STATUS_STARTED"] = "USER_DATA_TASK_STATUS_STARTED";
    UserDataTaskStatus["USER_DATA_TASK_STATUS_IN_PROGRESS"] = "USER_DATA_TASK_STATUS_IN_PROGRESS";
    UserDataTaskStatus["USER_DATA_TASK_STATUS_COMPLETE"] = "USER_DATA_TASK_STATUS_COMPLETE";
    UserDataTaskStatus["USER_DATA_TASK_STATUS_FAILED"] = "USER_DATA_TASK_STATUS_FAILED";
})(UserDataTaskStatus || (exports.UserDataTaskStatus = UserDataTaskStatus = {}));
class PrivacyService {
    static ExportUserData(req, initReq) {
        return fm.fetchReq(`/v1/privacy:export_user_data`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteUserData(req, initReq) {
        return fm.fetchReq(`/v1/privacy:delete_user_data`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CancelDeletion(req, initReq) {
        return fm.fetchReq(`/v1/privacy:cancel_deletion`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.PrivacyService = PrivacyService;
//# sourceMappingURL=privacy.pb.js.map