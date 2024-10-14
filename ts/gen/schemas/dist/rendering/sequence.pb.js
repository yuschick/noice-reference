"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeSequenceStepKindDelegate = void 0;
function routeSequenceStepKindDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.contentMode) && delegate.onContentMode(ctx, val.contentMode);
    (val === null || val === void 0 ? void 0 : val.transition) && delegate.onTransition(ctx, val.transition);
}
exports.routeSequenceStepKindDelegate = routeSequenceStepKindDelegate;
//# sourceMappingURL=sequence.pb.js.map