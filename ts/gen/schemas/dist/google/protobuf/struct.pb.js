"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeValueKindDelegate = exports.NullValue = void 0;
var NullValue;
(function (NullValue) {
    NullValue["NULL_VALUE"] = "NULL_VALUE";
})(NullValue || (exports.NullValue = NullValue = {}));
function routeValueKindDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.nullValue) && delegate.onNullValue(ctx, val.nullValue);
    (val === null || val === void 0 ? void 0 : val.numberValue) && delegate.onNumberValue(ctx, val.numberValue);
    (val === null || val === void 0 ? void 0 : val.stringValue) && delegate.onStringValue(ctx, val.stringValue);
    (val === null || val === void 0 ? void 0 : val.boolValue) && delegate.onBoolValue(ctx, val.boolValue);
    (val === null || val === void 0 ? void 0 : val.structValue) && delegate.onStructValue(ctx, val.structValue);
    (val === null || val === void 0 ? void 0 : val.listValue) && delegate.onListValue(ctx, val.listValue);
}
exports.routeValueKindDelegate = routeValueKindDelegate;
//# sourceMappingURL=struct.pb.js.map