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
exports.EmailService = exports.EmailTemplate = void 0;
const fm = __importStar(require("../fetch.pb"));
var EmailTemplate;
(function (EmailTemplate) {
    EmailTemplate["EMAIL_TEMPLATE_UNSPECIFIED"] = "EMAIL_TEMPLATE_UNSPECIFIED";
    EmailTemplate["EMAIL_TEMPLATE_WELCOME_EMAIL"] = "EMAIL_TEMPLATE_WELCOME_EMAIL";
    EmailTemplate["EMAIL_TEMPLATE_EMAIL_VERIFICATION"] = "EMAIL_TEMPLATE_EMAIL_VERIFICATION";
    EmailTemplate["EMAIL_TEMPLATE_PASSWORD_RESET"] = "EMAIL_TEMPLATE_PASSWORD_RESET";
    EmailTemplate["EMAIL_TEMPLATE_EMAIL_CHANGE"] = "EMAIL_TEMPLATE_EMAIL_CHANGE";
    EmailTemplate["EMAIL_TEMPLATE_ACCOUNT_DELETED"] = "EMAIL_TEMPLATE_ACCOUNT_DELETED";
    EmailTemplate["EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_ACCEPTED"] = "EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_ACCEPTED";
    EmailTemplate["EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_DECLINED"] = "EMAIL_TEMPLATE_CHANNEL_BAN_APPEAL_DECLINED";
    EmailTemplate["EMAIL_TEMPLATE_PLATFORM_USER_BANNED"] = "EMAIL_TEMPLATE_PLATFORM_USER_BANNED";
    EmailTemplate["EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_ACCEPTED"] = "EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_ACCEPTED";
    EmailTemplate["EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_DECLINED"] = "EMAIL_TEMPLATE_PLATFORM_BAN_APPEAL_DECLINED";
    EmailTemplate["EMAIL_TEMPLATE_PLATFORM_USER_UNBANNED"] = "EMAIL_TEMPLATE_PLATFORM_USER_UNBANNED";
    EmailTemplate["EMAIL_TEMPLATE_PURCHASE_RECEIPT"] = "EMAIL_TEMPLATE_PURCHASE_RECEIPT";
    EmailTemplate["EMAIL_TEMPLATE_USER_RELEASED_FROM_WAITLIST"] = "EMAIL_TEMPLATE_USER_RELEASED_FROM_WAITLIST";
    EmailTemplate["EMAIL_TEMPLATE_ACCOUNT_DELETION_SCHEDULED"] = "EMAIL_TEMPLATE_ACCOUNT_DELETION_SCHEDULED";
    EmailTemplate["EMAIL_TEMPLATE_CHANNEL_LIVE"] = "EMAIL_TEMPLATE_CHANNEL_LIVE";
    EmailTemplate["EMAIL_TEMPLATE_PURCHASE_REFUND"] = "EMAIL_TEMPLATE_PURCHASE_REFUND";
})(EmailTemplate || (exports.EmailTemplate = EmailTemplate = {}));
class EmailService {
    static SendEmail(req, initReq) {
        return fm.fetchReq(`/email.EmailService/SendEmail`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SendTemplateEmail(req, initReq) {
        return fm.fetchReq(`/email.EmailService/SendTemplateEmail`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.pb.js.map