"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeAttributeValueDelegate = void 0;
function routeAttributeValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.intValue) && delegate.onIntValue(ctx, val.intValue);
    (val === null || val === void 0 ? void 0 : val.floatValue) && delegate.onFloatValue(ctx, val.floatValue);
    (val === null || val === void 0 ? void 0 : val.stringValue) && delegate.onStringValue(ctx, val.stringValue);
    (val === null || val === void 0 ? void 0 : val.boolValue) && delegate.onBoolValue(ctx, val.boolValue);
    (val === null || val === void 0 ? void 0 : val.mapValue) && delegate.onMapValue(ctx, val.mapValue);
    (val === null || val === void 0 ? void 0 : val.intArrayValue) && delegate.onIntArrayValue(ctx, val.intArrayValue);
    (val === null || val === void 0 ? void 0 : val.floatArrayValue) && delegate.onFloatArrayValue(ctx, val.floatArrayValue);
    (val === null || val === void 0 ? void 0 : val.stringArrayValue) && delegate.onStringArrayValue(ctx, val.stringArrayValue);
    (val === null || val === void 0 ? void 0 : val.boolArrayValue) && delegate.onBoolArrayValue(ctx, val.boolArrayValue);
}
exports.routeAttributeValueDelegate = routeAttributeValueDelegate;
//# sourceMappingURL=attribute.pb.js.map