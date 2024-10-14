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
exports.AnalyticsService = exports.routeAnalyticsEventEventDelegate = exports.routeAnalyticsEventClientStoreItemClickedItemDelegate = exports.AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType = exports.AnalyticsEventClientUpSellingDialogUpSellingDialogSource = exports.AnalyticsEventClientUpSellingDialogUpSellingDialogActionType = exports.AnalyticsEventClientSignupCookiesConsentActionedUserDecision = exports.AnalyticsEventClientChatSettingsChatSettingType = exports.AnalyticsEventStudioWidgetStudioWidgetEvent = exports.AnalyticsEventWebRTCMetricsStreamType = exports.AnalyticsEventMatchEndCtaMatchEndCtaType = exports.AnalyticsEventClientRenderingStatsRendererClass = exports.AnalyticsEventClientRenderingStatsRendererType = exports.AnalyticsEventClientSignupStepSignupMode = exports.AnalyticsEventClientSignupStepSignupStep = exports.AnalyticsEventClientAdAvailableAdAvailableContext = exports.AnalyticsEventClientTimedAdsOpenedTimedAdsContext = exports.AnalyticsEventClientShuffleUsedShuffleContext = exports.AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext = exports.AnalyticsAntiAliasingType = exports.AnalyticsCrowdMode = exports.AnalyticsLightingType = exports.AnalyticsShadowQuality = exports.AnalyticsShadowType = exports.AnalyticsCrowdDetailType = void 0;
const fm = __importStar(require("../fetch.pb"));
var AnalyticsCrowdDetailType;
(function (AnalyticsCrowdDetailType) {
    AnalyticsCrowdDetailType["ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED"] = "ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED";
    AnalyticsCrowdDetailType["ANALYTICS_CROWD_DETAIL_TYPE_HIGH"] = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH";
    AnalyticsCrowdDetailType["ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP"] = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP";
    AnalyticsCrowdDetailType["ANALYTICS_CROWD_DETAIL_TYPE_LOW"] = "ANALYTICS_CROWD_DETAIL_TYPE_LOW";
})(AnalyticsCrowdDetailType || (exports.AnalyticsCrowdDetailType = AnalyticsCrowdDetailType = {}));
var AnalyticsShadowType;
(function (AnalyticsShadowType) {
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_UNSPECIFIED"] = "ANALYTICS_SHADOW_TYPE_UNSPECIFIED";
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_DISABLED"] = "ANALYTICS_SHADOW_TYPE_DISABLED";
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_UNFILTERED"] = "ANALYTICS_SHADOW_TYPE_UNFILTERED";
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED"] = "ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED";
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED"] = "ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED";
    AnalyticsShadowType["ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED"] = "ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED";
})(AnalyticsShadowType || (exports.AnalyticsShadowType = AnalyticsShadowType = {}));
var AnalyticsShadowQuality;
(function (AnalyticsShadowQuality) {
    AnalyticsShadowQuality["ANALYTICS_SHADOW_QUALITY_UNSPECIFIED"] = "ANALYTICS_SHADOW_QUALITY_UNSPECIFIED";
    AnalyticsShadowQuality["ANALYTICS_SHADOW_QUALITY_LOW"] = "ANALYTICS_SHADOW_QUALITY_LOW";
    AnalyticsShadowQuality["ANALYTICS_SHADOW_QUALITY_MEDIUM"] = "ANALYTICS_SHADOW_QUALITY_MEDIUM";
    AnalyticsShadowQuality["ANALYTICS_SHADOW_QUALITY_HIGH"] = "ANALYTICS_SHADOW_QUALITY_HIGH";
})(AnalyticsShadowQuality || (exports.AnalyticsShadowQuality = AnalyticsShadowQuality = {}));
var AnalyticsLightingType;
(function (AnalyticsLightingType) {
    AnalyticsLightingType["ANALYTICS_LIGHTING_TYPE_UNSPECIFIED"] = "ANALYTICS_LIGHTING_TYPE_UNSPECIFIED";
    AnalyticsLightingType["ANALYTICS_LIGHTING_TYPE_FULL"] = "ANALYTICS_LIGHTING_TYPE_FULL";
    AnalyticsLightingType["ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY"] = "ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY";
    AnalyticsLightingType["ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY"] = "ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY";
    AnalyticsLightingType["ANALYTICS_LIGHTING_TYPE_NONE"] = "ANALYTICS_LIGHTING_TYPE_NONE";
})(AnalyticsLightingType || (exports.AnalyticsLightingType = AnalyticsLightingType = {}));
var AnalyticsCrowdMode;
(function (AnalyticsCrowdMode) {
    AnalyticsCrowdMode["ANALYTICS_CROWD_MODE_UNSPECIFIED"] = "ANALYTICS_CROWD_MODE_UNSPECIFIED";
    AnalyticsCrowdMode["ANALYTICS_CROWD_MODE_NONE"] = "ANALYTICS_CROWD_MODE_NONE";
    AnalyticsCrowdMode["ANALYTICS_CROWD_MODE_LOCAL_GROUP"] = "ANALYTICS_CROWD_MODE_LOCAL_GROUP";
    AnalyticsCrowdMode["ANALYTICS_CROWD_MODE_ALL"] = "ANALYTICS_CROWD_MODE_ALL";
})(AnalyticsCrowdMode || (exports.AnalyticsCrowdMode = AnalyticsCrowdMode = {}));
var AnalyticsAntiAliasingType;
(function (AnalyticsAntiAliasingType) {
    AnalyticsAntiAliasingType["ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED"] = "ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED";
    AnalyticsAntiAliasingType["ANALYTICS_ANTI_ALIASING_TYPE_SMAA"] = "ANALYTICS_ANTI_ALIASING_TYPE_SMAA";
    AnalyticsAntiAliasingType["ANALYTICS_ANTI_ALIASING_TYPE_FXAA"] = "ANALYTICS_ANTI_ALIASING_TYPE_FXAA";
    AnalyticsAntiAliasingType["ANALYTICS_ANTI_ALIASING_TYPE_NONE"] = "ANALYTICS_ANTI_ALIASING_TYPE_NONE";
})(AnalyticsAntiAliasingType || (exports.AnalyticsAntiAliasingType = AnalyticsAntiAliasingType = {}));
var AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext;
(function (AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext) {
    AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext["SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED"] = "SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED";
    AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext["SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW"] = "SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW";
    AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext["SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU"] = "SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU";
    AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext["SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK"] = "SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK";
    AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext["SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU"] = "SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU";
})(AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext || (exports.AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext = AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext = {}));
var AnalyticsEventClientShuffleUsedShuffleContext;
(function (AnalyticsEventClientShuffleUsedShuffleContext) {
    AnalyticsEventClientShuffleUsedShuffleContext["SHUFFLE_CONTEXT_UNSPECIFIED"] = "SHUFFLE_CONTEXT_UNSPECIFIED";
    AnalyticsEventClientShuffleUsedShuffleContext["SHUFFLE_CONTEXT_GAME"] = "SHUFFLE_CONTEXT_GAME";
    AnalyticsEventClientShuffleUsedShuffleContext["SHUFFLE_CONTEXT_DGC"] = "SHUFFLE_CONTEXT_DGC";
})(AnalyticsEventClientShuffleUsedShuffleContext || (exports.AnalyticsEventClientShuffleUsedShuffleContext = AnalyticsEventClientShuffleUsedShuffleContext = {}));
var AnalyticsEventClientTimedAdsOpenedTimedAdsContext;
(function (AnalyticsEventClientTimedAdsOpenedTimedAdsContext) {
    AnalyticsEventClientTimedAdsOpenedTimedAdsContext["TIMED_ADS_CONTEXT_UNSPECIFIED"] = "TIMED_ADS_CONTEXT_UNSPECIFIED";
    AnalyticsEventClientTimedAdsOpenedTimedAdsContext["TIMED_ADS_CONTEXT_NAV_SIDEBAR"] = "TIMED_ADS_CONTEXT_NAV_SIDEBAR";
    AnalyticsEventClientTimedAdsOpenedTimedAdsContext["TIMED_ADS_CONTEXT_APP_HEADER"] = "TIMED_ADS_CONTEXT_APP_HEADER";
    AnalyticsEventClientTimedAdsOpenedTimedAdsContext["TIMED_ADS_CONTEXT_STORE"] = "TIMED_ADS_CONTEXT_STORE";
    AnalyticsEventClientTimedAdsOpenedTimedAdsContext["TIMED_ADS_CONTEXT_MATCH_END"] = "TIMED_ADS_CONTEXT_MATCH_END";
})(AnalyticsEventClientTimedAdsOpenedTimedAdsContext || (exports.AnalyticsEventClientTimedAdsOpenedTimedAdsContext = AnalyticsEventClientTimedAdsOpenedTimedAdsContext = {}));
var AnalyticsEventClientAdAvailableAdAvailableContext;
(function (AnalyticsEventClientAdAvailableAdAvailableContext) {
    AnalyticsEventClientAdAvailableAdAvailableContext["AD_AVAILABLE_CONTEXT_UNSPECIFIED"] = "AD_AVAILABLE_CONTEXT_UNSPECIFIED";
    AnalyticsEventClientAdAvailableAdAvailableContext["AD_AVAILABLE_CONTEXT_GAME"] = "AD_AVAILABLE_CONTEXT_GAME";
    AnalyticsEventClientAdAvailableAdAvailableContext["AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION"] = "AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION";
    AnalyticsEventClientAdAvailableAdAvailableContext["AD_AVAILABLE_CONTEXT_STORE_PAGE"] = "AD_AVAILABLE_CONTEXT_STORE_PAGE";
})(AnalyticsEventClientAdAvailableAdAvailableContext || (exports.AnalyticsEventClientAdAvailableAdAvailableContext = AnalyticsEventClientAdAvailableAdAvailableContext = {}));
var AnalyticsEventClientSignupStepSignupStep;
(function (AnalyticsEventClientSignupStepSignupStep) {
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_UNSPECIFIED"] = "SIGNUP_STEP_UNSPECIFIED";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_METHOD"] = "SIGNUP_STEP_METHOD";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_DISCORD"] = "SIGNUP_STEP_DISCORD";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_ACCOUNT_EXISTS"] = "SIGNUP_STEP_ACCOUNT_EXISTS";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_RECAPTCHA"] = "SIGNUP_STEP_RECAPTCHA";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_COMPLETE_ACCOUNT"] = "SIGNUP_STEP_COMPLETE_ACCOUNT";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_NDA"] = "SIGNUP_STEP_NDA";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_EMAIL_VERIFICATION"] = "SIGNUP_STEP_EMAIL_VERIFICATION";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_WAITLIST"] = "SIGNUP_STEP_WAITLIST";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_ERROR"] = "SIGNUP_STEP_ERROR";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_TOS"] = "SIGNUP_STEP_TOS";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_AVATAR_SELECT"] = "SIGNUP_STEP_AVATAR_SELECT";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_COMPLETED"] = "SIGNUP_STEP_COMPLETED";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_DISCORD_CLICK"] = "SIGNUP_STEP_DISCORD_CLICK";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_APPLE_CLICK"] = "SIGNUP_STEP_APPLE_CLICK";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_EXECUTE"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_EXECUTE";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_OPEN"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_OPEN";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_DISMISS"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_DISMISS";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_EXPIRED"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_EXPIRED";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_VERIFIED"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_VERIFIED";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_INVISIBLE_CAPTHA_ERROR"] = "SIGNUP_STEP_INVISIBLE_CAPTHA_ERROR";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_AVATAR_EDITOR_ENTER"] = "SIGNUP_STEP_AVATAR_EDITOR_ENTER";
    AnalyticsEventClientSignupStepSignupStep["SIGNUP_STEP_AVATAR_EDITOR_COMPLETED"] = "SIGNUP_STEP_AVATAR_EDITOR_COMPLETED";
})(AnalyticsEventClientSignupStepSignupStep || (exports.AnalyticsEventClientSignupStepSignupStep = AnalyticsEventClientSignupStepSignupStep = {}));
var AnalyticsEventClientSignupStepSignupMode;
(function (AnalyticsEventClientSignupStepSignupMode) {
    AnalyticsEventClientSignupStepSignupMode["SIGNUP_MODE_UNSPECIFIED"] = "SIGNUP_MODE_UNSPECIFIED";
    AnalyticsEventClientSignupStepSignupMode["SIGNUP_MODE_SIGNIN"] = "SIGNUP_MODE_SIGNIN";
    AnalyticsEventClientSignupStepSignupMode["SIGNUP_MODE_SIGNUP"] = "SIGNUP_MODE_SIGNUP";
})(AnalyticsEventClientSignupStepSignupMode || (exports.AnalyticsEventClientSignupStepSignupMode = AnalyticsEventClientSignupStepSignupMode = {}));
var AnalyticsEventClientRenderingStatsRendererType;
(function (AnalyticsEventClientRenderingStatsRendererType) {
    AnalyticsEventClientRenderingStatsRendererType["RENDERER_TYPE_UNSPECIFIED"] = "RENDERER_TYPE_UNSPECIFIED";
    AnalyticsEventClientRenderingStatsRendererType["RENDERER_TYPE_WEBGL"] = "RENDERER_TYPE_WEBGL";
    AnalyticsEventClientRenderingStatsRendererType["RENDERER_TYPE_VIDEO"] = "RENDERER_TYPE_VIDEO";
})(AnalyticsEventClientRenderingStatsRendererType || (exports.AnalyticsEventClientRenderingStatsRendererType = AnalyticsEventClientRenderingStatsRendererType = {}));
var AnalyticsEventClientRenderingStatsRendererClass;
(function (AnalyticsEventClientRenderingStatsRendererClass) {
    AnalyticsEventClientRenderingStatsRendererClass["RENDERER_CLASS_UNSPECIFIED"] = "RENDERER_CLASS_UNSPECIFIED";
    AnalyticsEventClientRenderingStatsRendererClass["RENDERER_CLASS_COMPOSITOR"] = "RENDERER_CLASS_COMPOSITOR";
    AnalyticsEventClientRenderingStatsRendererClass["RENDERER_CLASS_DIRECT"] = "RENDERER_CLASS_DIRECT";
})(AnalyticsEventClientRenderingStatsRendererClass || (exports.AnalyticsEventClientRenderingStatsRendererClass = AnalyticsEventClientRenderingStatsRendererClass = {}));
var AnalyticsEventMatchEndCtaMatchEndCtaType;
(function (AnalyticsEventMatchEndCtaMatchEndCtaType) {
    AnalyticsEventMatchEndCtaMatchEndCtaType["MATCH_END_CTA_TYPE_UNSPECIFIED"] = "MATCH_END_CTA_TYPE_UNSPECIFIED";
    AnalyticsEventMatchEndCtaMatchEndCtaType["MATCH_END_CTA_TYPE_SEASONS"] = "MATCH_END_CTA_TYPE_SEASONS";
})(AnalyticsEventMatchEndCtaMatchEndCtaType || (exports.AnalyticsEventMatchEndCtaMatchEndCtaType = AnalyticsEventMatchEndCtaMatchEndCtaType = {}));
var AnalyticsEventWebRTCMetricsStreamType;
(function (AnalyticsEventWebRTCMetricsStreamType) {
    AnalyticsEventWebRTCMetricsStreamType["STREAM_TYPE_UNSPECIFIED"] = "STREAM_TYPE_UNSPECIFIED";
    AnalyticsEventWebRTCMetricsStreamType["STREAM_TYPE_RAW_STREAM"] = "STREAM_TYPE_RAW_STREAM";
    AnalyticsEventWebRTCMetricsStreamType["STREAM_TYPE_ARENA"] = "STREAM_TYPE_ARENA";
})(AnalyticsEventWebRTCMetricsStreamType || (exports.AnalyticsEventWebRTCMetricsStreamType = AnalyticsEventWebRTCMetricsStreamType = {}));
var AnalyticsEventStudioWidgetStudioWidgetEvent;
(function (AnalyticsEventStudioWidgetStudioWidgetEvent) {
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_UNSPECIFIED"] = "STUDIO_WIDGET_EVENT_UNSPECIFIED";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_INIT"] = "STUDIO_WIDGET_EVENT_INIT";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_ADD"] = "STUDIO_WIDGET_EVENT_ADD";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_REMOVE"] = "STUDIO_WIDGET_EVENT_REMOVE";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_SETTINGS_CHANGE"] = "STUDIO_WIDGET_EVENT_SETTINGS_CHANGE";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_POPOUT"] = "STUDIO_WIDGET_EVENT_POPOUT";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_RESTORE_SAVED"] = "STUDIO_WIDGET_EVENT_RESTORE_SAVED";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_SAVE_LAYOUT"] = "STUDIO_WIDGET_EVENT_SAVE_LAYOUT";
    AnalyticsEventStudioWidgetStudioWidgetEvent["STUDIO_WIDGET_EVENT_RESET_LAYOUT"] = "STUDIO_WIDGET_EVENT_RESET_LAYOUT";
})(AnalyticsEventStudioWidgetStudioWidgetEvent || (exports.AnalyticsEventStudioWidgetStudioWidgetEvent = AnalyticsEventStudioWidgetStudioWidgetEvent = {}));
var AnalyticsEventClientChatSettingsChatSettingType;
(function (AnalyticsEventClientChatSettingsChatSettingType) {
    AnalyticsEventClientChatSettingsChatSettingType["CHAT_SETTING_TYPE_UNSPECIFIED"] = "CHAT_SETTING_TYPE_UNSPECIFIED";
    AnalyticsEventClientChatSettingsChatSettingType["CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS"] = "CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS";
    AnalyticsEventClientChatSettingsChatSettingType["CHAT_SETTING_TYPE_FONT_SIZE"] = "CHAT_SETTING_TYPE_FONT_SIZE";
    AnalyticsEventClientChatSettingsChatSettingType["CHAT_SETTING_TYPE_AVATAR_VISIBILITY"] = "CHAT_SETTING_TYPE_AVATAR_VISIBILITY";
})(AnalyticsEventClientChatSettingsChatSettingType || (exports.AnalyticsEventClientChatSettingsChatSettingType = AnalyticsEventClientChatSettingsChatSettingType = {}));
var AnalyticsEventClientSignupCookiesConsentActionedUserDecision;
(function (AnalyticsEventClientSignupCookiesConsentActionedUserDecision) {
    AnalyticsEventClientSignupCookiesConsentActionedUserDecision["USER_DECISION_UNSPECIFIED"] = "USER_DECISION_UNSPECIFIED";
    AnalyticsEventClientSignupCookiesConsentActionedUserDecision["USER_DECISION_SAVE_SETTINGS"] = "USER_DECISION_SAVE_SETTINGS";
    AnalyticsEventClientSignupCookiesConsentActionedUserDecision["USER_DECISION_ACCEPT_ALL"] = "USER_DECISION_ACCEPT_ALL";
    AnalyticsEventClientSignupCookiesConsentActionedUserDecision["USER_DECISION_DENY_ALL"] = "USER_DECISION_DENY_ALL";
})(AnalyticsEventClientSignupCookiesConsentActionedUserDecision || (exports.AnalyticsEventClientSignupCookiesConsentActionedUserDecision = AnalyticsEventClientSignupCookiesConsentActionedUserDecision = {}));
var AnalyticsEventClientUpSellingDialogUpSellingDialogActionType;
(function (AnalyticsEventClientUpSellingDialogUpSellingDialogActionType) {
    AnalyticsEventClientUpSellingDialogUpSellingDialogActionType["UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED"] = "UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED";
    AnalyticsEventClientUpSellingDialogUpSellingDialogActionType["UP_SELLING_DIALOG_ACTION_TYPE_OPEN"] = "UP_SELLING_DIALOG_ACTION_TYPE_OPEN";
    AnalyticsEventClientUpSellingDialogUpSellingDialogActionType["UP_SELLING_DIALOG_ACTION_TYPE_LOGIN"] = "UP_SELLING_DIALOG_ACTION_TYPE_LOGIN";
    AnalyticsEventClientUpSellingDialogUpSellingDialogActionType["UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP"] = "UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP";
    AnalyticsEventClientUpSellingDialogUpSellingDialogActionType["UP_SELLING_DIALOG_ACTION_TYPE_CLOSE"] = "UP_SELLING_DIALOG_ACTION_TYPE_CLOSE";
})(AnalyticsEventClientUpSellingDialogUpSellingDialogActionType || (exports.AnalyticsEventClientUpSellingDialogUpSellingDialogActionType = AnalyticsEventClientUpSellingDialogUpSellingDialogActionType = {}));
var AnalyticsEventClientUpSellingDialogUpSellingDialogSource;
(function (AnalyticsEventClientUpSellingDialogUpSellingDialogSource) {
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_UNSPECIFIED"] = "UP_SELLING_DIALOG_SOURCE_UNSPECIFIED";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE"] = "UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE"] = "UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE"] = "UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL"] = "UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL"] = "UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR"] = "UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE"] = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE";
    AnalyticsEventClientUpSellingDialogUpSellingDialogSource["UP_SELLING_DIALOG_SOURCE_CREATOR_CARD"] = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD";
})(AnalyticsEventClientUpSellingDialogUpSellingDialogSource || (exports.AnalyticsEventClientUpSellingDialogUpSellingDialogSource = AnalyticsEventClientUpSellingDialogUpSellingDialogSource = {}));
var AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType;
(function (AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType) {
    AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType["ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED"] = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED";
    AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType["ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP"] = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP";
    AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType["ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN"] = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN";
})(AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType || (exports.AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType = AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType = {}));
function routeAnalyticsEventClientStoreItemClickedItemDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.bundle) && delegate.onBundle(ctx, val.bundle);
    (val === null || val === void 0 ? void 0 : val.card) && delegate.onCard(ctx, val.card);
}
exports.routeAnalyticsEventClientStoreItemClickedItemDelegate = routeAnalyticsEventClientStoreItemClickedItemDelegate;
function routeAnalyticsEventEventDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.clientNavigate) && delegate.onClientNavigate(ctx, val.clientNavigate);
    (val === null || val === void 0 ? void 0 : val.clientConsoleError) && delegate.onClientConsoleError(ctx, val.clientConsoleError);
    (val === null || val === void 0 ? void 0 : val.clientUnhandledPromiseRejection) && delegate.onClientUnhandledPromiseRejection(ctx, val.clientUnhandledPromiseRejection);
    (val === null || val === void 0 ? void 0 : val.clientJavascriptError) && delegate.onClientJavascriptError(ctx, val.clientJavascriptError);
    (val === null || val === void 0 ? void 0 : val.clientStorePage) && delegate.onClientStorePage(ctx, val.clientStorePage);
    (val === null || val === void 0 ? void 0 : val.clientButtonClick) && delegate.onClientButtonClick(ctx, val.clientButtonClick);
    (val === null || val === void 0 ? void 0 : val.clientFtueDisplayed) && delegate.onClientFtueDisplayed(ctx, val.clientFtueDisplayed);
    (val === null || val === void 0 ? void 0 : val.clientCardSelectOpened) && delegate.onClientCardSelectOpened(ctx, val.clientCardSelectOpened);
    (val === null || val === void 0 ? void 0 : val.clientBoosterClicked) && delegate.onClientBoosterClicked(ctx, val.clientBoosterClicked);
    (val === null || val === void 0 ? void 0 : val.clientShuffleUsed) && delegate.onClientShuffleUsed(ctx, val.clientShuffleUsed);
    (val === null || val === void 0 ? void 0 : val.clientStoreBundleClicked) && delegate.onClientStoreBundleClicked(ctx, val.clientStoreBundleClicked);
    (val === null || val === void 0 ? void 0 : val.clientStoreRevealAllCards) && delegate.onClientStoreRevealAllCards(ctx, val.clientStoreRevealAllCards);
    (val === null || val === void 0 ? void 0 : val.clientStoreRevealCard) && delegate.onClientStoreRevealCard(ctx, val.clientStoreRevealCard);
    (val === null || val === void 0 ? void 0 : val.clientSwitchStore) && delegate.onClientSwitchStore(ctx, val.clientSwitchStore);
    (val === null || val === void 0 ? void 0 : val.clientAdAvailable) && delegate.onClientAdAvailable(ctx, val.clientAdAvailable);
    (val === null || val === void 0 ? void 0 : val.clientWatchingAd) && delegate.onClientWatchingAd(ctx, val.clientWatchingAd);
    (val === null || val === void 0 ? void 0 : val.clientSkippedAd) && delegate.onClientSkippedAd(ctx, val.clientSkippedAd);
    (val === null || val === void 0 ? void 0 : val.clientOpenMiniProfile) && delegate.onClientOpenMiniProfile(ctx, val.clientOpenMiniProfile);
    (val === null || val === void 0 ? void 0 : val.clientAddFriendFormViewed) && delegate.onClientAddFriendFormViewed(ctx, val.clientAddFriendFormViewed);
    (val === null || val === void 0 ? void 0 : val.clientToggleSeasons) && delegate.onClientToggleSeasons(ctx, val.clientToggleSeasons);
    (val === null || val === void 0 ? void 0 : val.clientCollectionCardClicked) && delegate.onClientCollectionCardClicked(ctx, val.clientCollectionCardClicked);
    (val === null || val === void 0 ? void 0 : val.clientToggleCollections) && delegate.onClientToggleCollections(ctx, val.clientToggleCollections);
    (val === null || val === void 0 ? void 0 : val.clientSelectAvatar) && delegate.onClientSelectAvatar(ctx, val.clientSelectAvatar);
    (val === null || val === void 0 ? void 0 : val.clientBrowseAvatarPages) && delegate.onClientBrowseAvatarPages(ctx, val.clientBrowseAvatarPages);
    (val === null || val === void 0 ? void 0 : val.clientViewFriends) && delegate.onClientViewFriends(ctx, val.clientViewFriends);
    (val === null || val === void 0 ? void 0 : val.clientFriendMenuOpened) && delegate.onClientFriendMenuOpened(ctx, val.clientFriendMenuOpened);
    (val === null || val === void 0 ? void 0 : val.clientDailyGoalCardSlotClicked) && delegate.onClientDailyGoalCardSlotClicked(ctx, val.clientDailyGoalCardSlotClicked);
    (val === null || val === void 0 ? void 0 : val.clientEnvironmentCheck) && delegate.onClientEnvironmentCheck(ctx, val.clientEnvironmentCheck);
    (val === null || val === void 0 ? void 0 : val.clientSignupStep) && delegate.onClientSignupStep(ctx, val.clientSignupStep);
    (val === null || val === void 0 ? void 0 : val.clientRenderingStats) && delegate.onClientRenderingStats(ctx, val.clientRenderingStats);
    (val === null || val === void 0 ? void 0 : val.clientMatchEndCta) && delegate.onClientMatchEndCta(ctx, val.clientMatchEndCta);
    (val === null || val === void 0 ? void 0 : val.clientPerformanceProfileChanged) && delegate.onClientPerformanceProfileChanged(ctx, val.clientPerformanceProfileChanged);
    (val === null || val === void 0 ? void 0 : val.clientStreamQualityChanged) && delegate.onClientStreamQualityChanged(ctx, val.clientStreamQualityChanged);
    (val === null || val === void 0 ? void 0 : val.clientWebrtcMetrics) && delegate.onClientWebrtcMetrics(ctx, val.clientWebrtcMetrics);
    (val === null || val === void 0 ? void 0 : val.clientInactivityKickPromptShown) && delegate.onClientInactivityKickPromptShown(ctx, val.clientInactivityKickPromptShown);
    (val === null || val === void 0 ? void 0 : val.clientBestPlaysOpened) && delegate.onClientBestPlaysOpened(ctx, val.clientBestPlaysOpened);
    (val === null || val === void 0 ? void 0 : val.clientSoloPlayToggle) && delegate.onClientSoloPlayToggle(ctx, val.clientSoloPlayToggle);
    (val === null || val === void 0 ? void 0 : val.clientTimedAdsOpened) && delegate.onClientTimedAdsOpened(ctx, val.clientTimedAdsOpened);
    (val === null || val === void 0 ? void 0 : val.clientTimedAdsWatchingAd) && delegate.onClientTimedAdsWatchingAd(ctx, val.clientTimedAdsWatchingAd);
    (val === null || val === void 0 ? void 0 : val.clientTimedAdsRewardsClaimed) && delegate.onClientTimedAdsRewardsClaimed(ctx, val.clientTimedAdsRewardsClaimed);
    (val === null || val === void 0 ? void 0 : val.clientTimedAdsClosed) && delegate.onClientTimedAdsClosed(ctx, val.clientTimedAdsClosed);
    (val === null || val === void 0 ? void 0 : val.clientFirstPageLoad) && delegate.onClientFirstPageLoad(ctx, val.clientFirstPageLoad);
    (val === null || val === void 0 ? void 0 : val.studioWidgets) && delegate.onStudioWidgets(ctx, val.studioWidgets);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorSaveStarted) && delegate.onClientAvatarEditorSaveStarted(ctx, val.clientAvatarEditorSaveStarted);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorSaveCompleted) && delegate.onClientAvatarEditorSaveCompleted(ctx, val.clientAvatarEditorSaveCompleted);
    (val === null || val === void 0 ? void 0 : val.clientAvatarSelectorAvatarViewed) && delegate.onClientAvatarSelectorAvatarViewed(ctx, val.clientAvatarSelectorAvatarViewed);
    (val === null || val === void 0 ? void 0 : val.clientAvatarSelectorAvatarSelected) && delegate.onClientAvatarSelectorAvatarSelected(ctx, val.clientAvatarSelectorAvatarSelected);
    (val === null || val === void 0 ? void 0 : val.clientSpotlightsEmoteClicked) && delegate.onClientSpotlightsEmoteClicked(ctx, val.clientSpotlightsEmoteClicked);
    (val === null || val === void 0 ? void 0 : val.clientStreamConnectionRetry) && delegate.onClientStreamConnectionRetry(ctx, val.clientStreamConnectionRetry);
    (val === null || val === void 0 ? void 0 : val.clientStreamConnectionMediaStream) && delegate.onClientStreamConnectionMediaStream(ctx, val.clientStreamConnectionMediaStream);
    (val === null || val === void 0 ? void 0 : val.clientLoadFinished) && delegate.onClientLoadFinished(ctx, val.clientLoadFinished);
    (val === null || val === void 0 ? void 0 : val.clientStreamConnectionWatch) && delegate.onClientStreamConnectionWatch(ctx, val.clientStreamConnectionWatch);
    (val === null || val === void 0 ? void 0 : val.clientStoreItemClicked) && delegate.onClientStoreItemClicked(ctx, val.clientStoreItemClicked);
    (val === null || val === void 0 ? void 0 : val.studioChannelArenaChanged) && delegate.onStudioChannelArenaChanged(ctx, val.studioChannelArenaChanged);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorOpened) && delegate.onClientAvatarEditorOpened(ctx, val.clientAvatarEditorOpened);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorClosed) && delegate.onClientAvatarEditorClosed(ctx, val.clientAvatarEditorClosed);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorItemSelected) && delegate.onClientAvatarEditorItemSelected(ctx, val.clientAvatarEditorItemSelected);
    (val === null || val === void 0 ? void 0 : val.clientChatSettings) && delegate.onClientChatSettings(ctx, val.clientChatSettings);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEmoteClicked) && delegate.onClientAvatarEmoteClicked(ctx, val.clientAvatarEmoteClicked);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEmojiClicked) && delegate.onClientAvatarEmojiClicked(ctx, val.clientAvatarEmojiClicked);
    (val === null || val === void 0 ? void 0 : val.clientCardSelectCanceled) && delegate.onClientCardSelectCanceled(ctx, val.clientCardSelectCanceled);
    (val === null || val === void 0 ? void 0 : val.clientAvatarEditorColorCustomisationSelected) && delegate.onClientAvatarEditorColorCustomisationSelected(ctx, val.clientAvatarEditorColorCustomisationSelected);
    (val === null || val === void 0 ? void 0 : val.clientSignupCookiesConsentLoaded) && delegate.onClientSignupCookiesConsentLoaded(ctx, val.clientSignupCookiesConsentLoaded);
    (val === null || val === void 0 ? void 0 : val.clientSignupCookiesConsentActioned) && delegate.onClientSignupCookiesConsentActioned(ctx, val.clientSignupCookiesConsentActioned);
    (val === null || val === void 0 ? void 0 : val.clientStreamPlayback) && delegate.onClientStreamPlayback(ctx, val.clientStreamPlayback);
    (val === null || val === void 0 ? void 0 : val.clientUpSellingDialog) && delegate.onClientUpSellingDialog(ctx, val.clientUpSellingDialog);
    (val === null || val === void 0 ? void 0 : val.clientMatchEndSequenceCompleted) && delegate.onClientMatchEndSequenceCompleted(ctx, val.clientMatchEndSequenceCompleted);
    (val === null || val === void 0 ? void 0 : val.clientSignupButtonClick) && delegate.onClientSignupButtonClick(ctx, val.clientSignupButtonClick);
    (val === null || val === void 0 ? void 0 : val.clientMicroSurveyShown) && delegate.onClientMicroSurveyShown(ctx, val.clientMicroSurveyShown);
    (val === null || val === void 0 ? void 0 : val.clientMicroSurveyDismissed) && delegate.onClientMicroSurveyDismissed(ctx, val.clientMicroSurveyDismissed);
    (val === null || val === void 0 ? void 0 : val.clientMicroSurveyCompleted) && delegate.onClientMicroSurveyCompleted(ctx, val.clientMicroSurveyCompleted);
}
exports.routeAnalyticsEventEventDelegate = routeAnalyticsEventEventDelegate;
class AnalyticsService {
    static SendAnalytics(req, initReq) {
        return fm.fetchReq(`/analytics.AnalyticsService/SendAnalytics`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
    static SetIdentity(req, initReq) {
        return fm.fetchReq(`/analytics.AnalyticsService/SetIdentity`, Object.assign(Object.assign({}, initReq), { method: "POST", body: JSON.stringify(req) }));
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.pb.js.map