"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeEventEventDelegate = exports.TrustLevel = exports.TextRisk = exports.Topic = void 0;
var Topic;
(function (Topic) {
    Topic["TOPIC_UNSPECIFIED"] = "TOPIC_UNSPECIFIED";
    Topic["TOPIC_GENERAL_RISK"] = "TOPIC_GENERAL_RISK";
    Topic["TOPIC_BULLYING"] = "TOPIC_BULLYING";
    Topic["TOPIC_VIOLENCE"] = "TOPIC_VIOLENCE";
    Topic["TOPIC_PERSONAL_IDENTIFYING_INFO"] = "TOPIC_PERSONAL_IDENTIFYING_INFO";
    Topic["TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT"] = "TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT";
    Topic["TOPIC_VULGARITY"] = "TOPIC_VULGARITY";
    Topic["TOPIC_DRUGS_AND_ALCOHOL"] = "TOPIC_DRUGS_AND_ALCOHOL";
    Topic["TOPIC_IN_APP"] = "TOPIC_IN_APP";
    Topic["TOPIC_ALARM"] = "TOPIC_ALARM";
    Topic["TOPIC_FRAUD"] = "TOPIC_FRAUD";
    Topic["TOPIC_HATE_SPEECH"] = "TOPIC_HATE_SPEECH";
    Topic["TOPIC_RELIGIOUS"] = "TOPIC_RELIGIOUS";
    Topic["TOPIC_JUNK"] = "TOPIC_JUNK";
    Topic["TOPIC_WEBSITE"] = "TOPIC_WEBSITE";
    Topic["TOPIC_CHILD_GROOMING"] = "TOPIC_CHILD_GROOMING";
    Topic["TOPIC_PUBLIC_THREAT"] = "TOPIC_PUBLIC_THREAT";
    Topic["TOPIC_REAL_NAME"] = "TOPIC_REAL_NAME";
    Topic["TOPIC_EXTREMISM"] = "TOPIC_EXTREMISM";
    Topic["TOPIC_SUBVERSIVE"] = "TOPIC_SUBVERSIVE";
    Topic["TOPIC_SENTIMENT"] = "TOPIC_SENTIMENT";
    Topic["TOPIC_POLITICS"] = "TOPIC_POLITICS";
})(Topic || (exports.Topic = Topic = {}));
var TextRisk;
(function (TextRisk) {
    TextRisk["TEXT_RISK_UNSPECIFIED"] = "TEXT_RISK_UNSPECIFIED";
    TextRisk["TEXT_RISK_SAFE"] = "TEXT_RISK_SAFE";
    TextRisk["TEXT_RISK_LOW"] = "TEXT_RISK_LOW";
    TextRisk["TEXT_RISK_NOTABLE"] = "TEXT_RISK_NOTABLE";
    TextRisk["TEXT_RISK_QUESTIONABLE"] = "TEXT_RISK_QUESTIONABLE";
    TextRisk["TEXT_RISK_UNKNOWN"] = "TEXT_RISK_UNKNOWN";
    TextRisk["TEXT_RISK_MATURE"] = "TEXT_RISK_MATURE";
    TextRisk["TEXT_RISK_EXPLICIT"] = "TEXT_RISK_EXPLICIT";
    TextRisk["TEXT_RISK_DANGEROUS"] = "TEXT_RISK_DANGEROUS";
})(TextRisk || (exports.TextRisk = TextRisk = {}));
var TrustLevel;
(function (TrustLevel) {
    TrustLevel["TRUST_LEVEL_UNSPECIFIED"] = "TRUST_LEVEL_UNSPECIFIED";
    TrustLevel["TRUST_LEVEL_SUPERUSER"] = "TRUST_LEVEL_SUPERUSER";
    TrustLevel["TRUST_LEVEL_TRUSTED"] = "TRUST_LEVEL_TRUSTED";
    TrustLevel["TRUST_LEVEL_DEFAULT"] = "TRUST_LEVEL_DEFAULT";
    TrustLevel["TRUST_LEVEL_NOT_TRUSTED"] = "TRUST_LEVEL_NOT_TRUSTED";
    TrustLevel["TRUST_LEVEL_MUTE"] = "TRUST_LEVEL_MUTE";
})(TrustLevel || (exports.TrustLevel = TrustLevel = {}));
function routeEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.eventTrustChanged) && delegate.onEventTrustChanged(ctx, val.eventTrustChanged);
    (val === null || val === void 0 ? void 0 : val.eventFlooding) && delegate.onEventFlooding(ctx, val.eventFlooding);
    (val === null || val === void 0 ? void 0 : val.customEvent) && delegate.onCustomEvent(ctx, val.customEvent);
}
exports.routeEventEventDelegate = routeEventEventDelegate;
//# sourceMappingURL=classification.pb.js.map