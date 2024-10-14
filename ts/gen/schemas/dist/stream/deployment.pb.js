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
exports.StreamDeploymentOptionsService = exports.StreamDeploymentStatusComponentStatus = void 0;
const fm = __importStar(require("../fetch.pb"));
var StreamDeploymentStatusComponentStatus;
(function (StreamDeploymentStatusComponentStatus) {
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_UNSPECIFIED"] = "COMPONENT_STATUS_UNSPECIFIED";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_DISABLED"] = "COMPONENT_STATUS_DISABLED";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_OFFLINE"] = "COMPONENT_STATUS_OFFLINE";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_DEPLOYMENT_STARTED"] = "COMPONENT_STATUS_DEPLOYMENT_STARTED";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_PROVISIONING_NODE"] = "COMPONENT_STATUS_PROVISIONING_NODE";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_DEPLOYING_POD"] = "COMPONENT_STATUS_DEPLOYING_POD";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_DEPLOYING_CONTAINERS"] = "COMPONENT_STATUS_DEPLOYING_CONTAINERS";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_CONTAINERS_UNREADY"] = "COMPONENT_STATUS_CONTAINERS_UNREADY";
    StreamDeploymentStatusComponentStatus["COMPONENT_STATUS_READY"] = "COMPONENT_STATUS_READY";
})(StreamDeploymentStatusComponentStatus || (exports.StreamDeploymentStatusComponentStatus = StreamDeploymentStatusComponentStatus = {}));
class StreamDeploymentOptionsService {
    static GetDeploymentOptions(req, initReq) {
        return fm.fetchReq(`/stream_deployment.StreamDeploymentOptionsService/GetDeploymentOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static ListDeploymentOptions(req, initReq) {
        return fm.fetchReq(`/stream_deployment.StreamDeploymentOptionsService/ListDeploymentOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static CreateDeploymentOptions(req, initReq) {
        return fm.fetchReq(`/stream_deployment.StreamDeploymentOptionsService/CreateDeploymentOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static UpdateDeploymentOptions(req, initReq) {
        return fm.fetchReq(`/stream_deployment.StreamDeploymentOptionsService/UpdateDeploymentOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static DeleteDeploymentOptions(req, initReq) {
        return fm.fetchReq(`/stream_deployment.StreamDeploymentOptionsService/DeleteDeploymentOptions`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.StreamDeploymentOptionsService = StreamDeploymentOptionsService;
//# sourceMappingURL=deployment.pb.js.map