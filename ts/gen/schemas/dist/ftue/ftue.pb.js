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
exports.FTUEService = exports.ConfigItemMessageType = exports.ConfigItemAlignment = exports.DismissalType = void 0;
const fm = __importStar(require("../fetch.pb"));
var DismissalType;
(function (DismissalType) {
    DismissalType["DISMISSAL_TYPE_UNSPECIFIED"] = "DISMISSAL_TYPE_UNSPECIFIED";
    DismissalType["DISMISSAL_TYPE_ACTION_TAKEN"] = "DISMISSAL_TYPE_ACTION_TAKEN";
    DismissalType["DISMISSAL_TYPE_CLOSED"] = "DISMISSAL_TYPE_CLOSED";
})(DismissalType || (exports.DismissalType = DismissalType = {}));
var ConfigItemAlignment;
(function (ConfigItemAlignment) {
    ConfigItemAlignment["ALIGNMENT_UNSPECIFIED"] = "ALIGNMENT_UNSPECIFIED";
    ConfigItemAlignment["ALIGNMENT_TOP"] = "ALIGNMENT_TOP";
    ConfigItemAlignment["ALIGNMENT_LEFT"] = "ALIGNMENT_LEFT";
    ConfigItemAlignment["ALIGNMENT_RIGHT"] = "ALIGNMENT_RIGHT";
    ConfigItemAlignment["ALIGNMENT_BOTTOM"] = "ALIGNMENT_BOTTOM";
    ConfigItemAlignment["ALIGNMENT_CENTER"] = "ALIGNMENT_CENTER";
})(ConfigItemAlignment || (exports.ConfigItemAlignment = ConfigItemAlignment = {}));
var ConfigItemMessageType;
(function (ConfigItemMessageType) {
    ConfigItemMessageType["MESSAGE_TYPE_UNSPECIFIED"] = "MESSAGE_TYPE_UNSPECIFIED";
    ConfigItemMessageType["MESSAGE_TYPE_NOTIFICATION"] = "MESSAGE_TYPE_NOTIFICATION";
    ConfigItemMessageType["MESSAGE_TYPE_LINK"] = "MESSAGE_TYPE_LINK";
})(ConfigItemMessageType || (exports.ConfigItemMessageType = ConfigItemMessageType = {}));
class FTUEService {
    static DismissTooltip(req, initReq) {
        return fm.fetchReq(`/v1/ftue/dismissedTooltips/${req["tooltipId"]}`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteDismissedTooltip(req, initReq) {
        return fm.fetchReq(`/v1/ftue/dismissedTooltips/${req["tooltipId"]}`, Object.assign(Object.assign({}, initReq), { method: "DELETE" }));
    }
    static ListDismissedTooltips(req, initReq) {
        return fm.fetchReq(`/v1/ftue/dismissedTooltips?${fm.renderURLSearchParams(req, [])}`, Object.assign(Object.assign({}, initReq), { method: "GET" }));
    }
}
exports.FTUEService = FTUEService;
//# sourceMappingURL=ftue.pb.js.map