"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeCALModuleExpressionExpressionDelegate = exports.routeCALModuleCheckCheckDelegate = exports.routeCALModuleCheckParamValueDelegate = exports.routeCardEventEventDelegate = exports.CALModuleUnaryOp = exports.CALModuleBinaryOp = exports.IntComparisonOperator = exports.StringComparisonOperator = void 0;
var StringComparisonOperator;
(function (StringComparisonOperator) {
    StringComparisonOperator["STRING_COMPARISON_OPERATOR_UNSPECIFIED"] = "STRING_COMPARISON_OPERATOR_UNSPECIFIED";
    StringComparisonOperator["STRING_COMPARISON_OPERATOR_EQUAL"] = "STRING_COMPARISON_OPERATOR_EQUAL";
    StringComparisonOperator["STRING_COMPARISON_OPERATOR_NOT_EQUAL"] = "STRING_COMPARISON_OPERATOR_NOT_EQUAL";
    StringComparisonOperator["STRING_COMPARISON_OPERATOR_IN"] = "STRING_COMPARISON_OPERATOR_IN";
    StringComparisonOperator["STRING_COMPARISON_OPERATOR_NOT_IN"] = "STRING_COMPARISON_OPERATOR_NOT_IN";
})(StringComparisonOperator || (exports.StringComparisonOperator = StringComparisonOperator = {}));
var IntComparisonOperator;
(function (IntComparisonOperator) {
    IntComparisonOperator["INT_COMPARISON_OPERATOR_UNSPECIFIED"] = "INT_COMPARISON_OPERATOR_UNSPECIFIED";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_EQUAL"] = "INT_COMPARISON_OPERATOR_EQUAL";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_GREATER"] = "INT_COMPARISON_OPERATOR_GREATER";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL"] = "INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_LESS"] = "INT_COMPARISON_OPERATOR_LESS";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_LESS_OR_EQUAL"] = "INT_COMPARISON_OPERATOR_LESS_OR_EQUAL";
    IntComparisonOperator["INT_COMPARISON_OPERATOR_NOT_EQUAL"] = "INT_COMPARISON_OPERATOR_NOT_EQUAL";
})(IntComparisonOperator || (exports.IntComparisonOperator = IntComparisonOperator = {}));
var CALModuleBinaryOp;
(function (CALModuleBinaryOp) {
    CALModuleBinaryOp["BINARY_OP_UNSPECIFIED"] = "BINARY_OP_UNSPECIFIED";
    CALModuleBinaryOp["BINARY_OP_AND"] = "BINARY_OP_AND";
    CALModuleBinaryOp["BINARY_OP_OR"] = "BINARY_OP_OR";
})(CALModuleBinaryOp || (exports.CALModuleBinaryOp = CALModuleBinaryOp = {}));
var CALModuleUnaryOp;
(function (CALModuleUnaryOp) {
    CALModuleUnaryOp["UNARY_OP_UNSPECIFIED"] = "UNARY_OP_UNSPECIFIED";
    CALModuleUnaryOp["UNARY_OP_NOT"] = "UNARY_OP_NOT";
})(CALModuleUnaryOp || (exports.CALModuleUnaryOp = CALModuleUnaryOp = {}));
function routeCardEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.cardSucceeded) && delegate.onCardSucceeded(ctx, val.cardSucceeded);
    (val === null || val === void 0 ? void 0 : val.cardFailed) && delegate.onCardFailed(ctx, val.cardFailed);
    (val === null || val === void 0 ? void 0 : val.cardTargetValueChanged) && delegate.onCardTargetValueChanged(ctx, val.cardTargetValueChanged);
    (val === null || val === void 0 ? void 0 : val.shouldCollectAonPoints) && delegate.onShouldCollectAonPoints(ctx, val.shouldCollectAonPoints);
}
exports.routeCardEventEventDelegate = routeCardEventEventDelegate;
function routeCALModuleCheckParamValueDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.intValue) && delegate.onIntValue(ctx, val.intValue);
    (val === null || val === void 0 ? void 0 : val.stringValue) && delegate.onStringValue(ctx, val.stringValue);
}
exports.routeCALModuleCheckParamValueDelegate = routeCALModuleCheckParamValueDelegate;
function routeCALModuleCheckCheckDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.globalIntAttributeCheck) && delegate.onGlobalIntAttributeCheck(ctx, val.globalIntAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.globalIntAttributeSumCheck) && delegate.onGlobalIntAttributeSumCheck(ctx, val.globalIntAttributeSumCheck);
    (val === null || val === void 0 ? void 0 : val.globalStringAttributeCheck) && delegate.onGlobalStringAttributeCheck(ctx, val.globalStringAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.globalBoolAttributeCheck) && delegate.onGlobalBoolAttributeCheck(ctx, val.globalBoolAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.globalAnyBoolAttributeCheck) && delegate.onGlobalAnyBoolAttributeCheck(ctx, val.globalAnyBoolAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.eventTypeCheck) && delegate.onEventTypeCheck(ctx, val.eventTypeCheck);
    (val === null || val === void 0 ? void 0 : val.eventIntAttributeCheck) && delegate.onEventIntAttributeCheck(ctx, val.eventIntAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.eventStringAttributeCheck) && delegate.onEventStringAttributeCheck(ctx, val.eventStringAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.eventBoolAttributeCheck) && delegate.onEventBoolAttributeCheck(ctx, val.eventBoolAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.countEventIntAttributeCheck) && delegate.onCountEventIntAttributeCheck(ctx, val.countEventIntAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.repeatedEventTypeCheck) && delegate.onRepeatedEventTypeCheck(ctx, val.repeatedEventTypeCheck);
    (val === null || val === void 0 ? void 0 : val.repeatedEventIntAttributeCheck) && delegate.onRepeatedEventIntAttributeCheck(ctx, val.repeatedEventIntAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.repeatedEventStringAttributeCheck) && delegate.onRepeatedEventStringAttributeCheck(ctx, val.repeatedEventStringAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.repeatedEventBoolAttributeCheck) && delegate.onRepeatedEventBoolAttributeCheck(ctx, val.repeatedEventBoolAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.eventTypeCheckAfterEventIntAttributeCheck) && delegate.onEventTypeCheckAfterEventIntAttributeCheck(ctx, val.eventTypeCheckAfterEventIntAttributeCheck);
    (val === null || val === void 0 ? void 0 : val.timeoutCheck) && delegate.onTimeoutCheck(ctx, val.timeoutCheck);
}
exports.routeCALModuleCheckCheckDelegate = routeCALModuleCheckCheckDelegate;
function routeCALModuleExpressionExpressionDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.check) && delegate.onCheck(ctx, val.check);
    (val === null || val === void 0 ? void 0 : val.binaryExpression) && delegate.onBinaryExpression(ctx, val.binaryExpression);
    (val === null || val === void 0 ? void 0 : val.unaryExpression) && delegate.onUnaryExpression(ctx, val.unaryExpression);
    (val === null || val === void 0 ? void 0 : val.group) && delegate.onGroup(ctx, val.group);
    (val === null || val === void 0 ? void 0 : val.checkSequence) && delegate.onCheckSequence(ctx, val.checkSequence);
    (val === null || val === void 0 ? void 0 : val.forDuration) && delegate.onForDuration(ctx, val.forDuration);
    (val === null || val === void 0 ? void 0 : val.repeat) && delegate.onRepeat(ctx, val.repeat);
}
exports.routeCALModuleExpressionExpressionDelegate = routeCALModuleExpressionExpressionDelegate;
//# sourceMappingURL=game_state.pb.js.map