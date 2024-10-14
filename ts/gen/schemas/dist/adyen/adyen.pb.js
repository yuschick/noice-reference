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
exports.AdyenProxyService = exports.EventCode = void 0;
const fm = __importStar(require("../fetch.pb"));
var EventCode;
(function (EventCode) {
    EventCode["EVENT_CODE_UNSPECIFIED"] = "EVENT_CODE_UNSPECIFIED";
    EventCode["EVENT_CODE_AUTHORISATION"] = "EVENT_CODE_AUTHORISATION";
    EventCode["EVENT_CODE_AUTHORISATION_ADJUSTMENT"] = "EVENT_CODE_AUTHORISATION_ADJUSTMENT";
    EventCode["EVENT_CODE_CANCELLATION"] = "EVENT_CODE_CANCELLATION";
    EventCode["EVENT_CODE_CANCEL_OR_REFUND"] = "EVENT_CODE_CANCEL_OR_REFUND";
    EventCode["EVENT_CODE_CAPTURE"] = "EVENT_CODE_CAPTURE";
    EventCode["EVENT_CODE_CAPTURE_FAILED"] = "EVENT_CODE_CAPTURE_FAILED";
    EventCode["EVENT_CODE_HANDLED_EXTERNALLY"] = "EVENT_CODE_HANDLED_EXTERNALLY";
    EventCode["EVENT_CODE_ORDER_OPENED"] = "EVENT_CODE_ORDER_OPENED";
    EventCode["EVENT_CODE_ORDER_CLOSED"] = "EVENT_CODE_ORDER_CLOSED";
    EventCode["EVENT_CODE_REFUND"] = "EVENT_CODE_REFUND";
    EventCode["EVENT_CODE_REFUND_FAILED"] = "EVENT_CODE_REFUND_FAILED";
    EventCode["EVENT_CODE_REFUNDED_REVERSED"] = "EVENT_CODE_REFUNDED_REVERSED";
    EventCode["EVENT_CODE_REFUND_WITH_DATA"] = "EVENT_CODE_REFUND_WITH_DATA";
    EventCode["EVENT_CODE_REPORT_AVAILABLE"] = "EVENT_CODE_REPORT_AVAILABLE";
    EventCode["EVENT_CODE_VOID_PENDING_REFUND"] = "EVENT_CODE_VOID_PENDING_REFUND";
    EventCode["EVENT_CODE_CHARGEBACK"] = "EVENT_CODE_CHARGEBACK";
    EventCode["EVENT_CODE_CHARGEBACK_REVERSED"] = "EVENT_CODE_CHARGEBACK_REVERSED";
    EventCode["EVENT_CODE_NOTIFICATION_OF_CHARGEBACK"] = "EVENT_CODE_NOTIFICATION_OF_CHARGEBACK";
    EventCode["EVENT_CODE_NOTIFICATION_OF_FRAUD"] = "EVENT_CODE_NOTIFICATION_OF_FRAUD";
    EventCode["EVENT_CODE_PREARBITRATION_LOST"] = "EVENT_CODE_PREARBITRATION_LOST";
    EventCode["EVENT_CODE_PREARBITRATION_WON"] = "EVENT_CODE_PREARBITRATION_WON";
    EventCode["EVENT_CODE_REQUEST_FOR_INFORMATION"] = "EVENT_CODE_REQUEST_FOR_INFORMATION";
    EventCode["EVENT_CODE_SECOND_CHARGEBACK"] = "EVENT_CODE_SECOND_CHARGEBACK";
    EventCode["EVENT_CODE_PAYOUT_EXPIRE"] = "EVENT_CODE_PAYOUT_EXPIRE";
    EventCode["EVENT_CODE_PAYOUT_DECLINE"] = "EVENT_CODE_PAYOUT_DECLINE";
    EventCode["EVENT_CODE_PAYOUT_THIRDPARTY"] = "EVENT_CODE_PAYOUT_THIRDPARTY";
    EventCode["EVENT_CODE_PAIDOUT_REVERSED"] = "EVENT_CODE_PAIDOUT_REVERSED";
})(EventCode || (exports.EventCode = EventCode = {}));
class AdyenProxyService {
    static CreateNotification(req, initReq) {
        return fm.fetchReq(`/v1/adyen/notifications`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AdyenProxyService = AdyenProxyService;
//# sourceMappingURL=adyen.pb.js.map