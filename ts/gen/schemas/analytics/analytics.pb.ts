/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as AdsAds from "../ads/ads.pb"
import * as ApiClient from "../api/client.pb"
import * as AvatarAvatar from "../avatar/avatar.pb"
import * as fm from "../fetch.pb"
import * as FriendsFriends from "../friends/friends.pb"
import * as FtueFtue from "../ftue/ftue.pb"
import * as Game_logicGame_logic from "../game-logic/game_logic.pb"
import * as GoogleProtobufTimestamp from "../google/protobuf/timestamp.pb"
import * as MatchMatch from "../match/match.pb"
import * as RarityRarity from "../rarity/rarity.pb"
import * as StoreV2Storev2 from "../store/storev2.pb"
import * as Stream_egressEgress from "../stream/egress.pb"
import * as StreamerStreamer from "../streamer/streamer.pb"
import * as WalletWallet from "../wallet/wallet.pb"

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (
    keyof T extends infer K ?
      (K extends string & keyof T ? { [k in K]: T[K] } & Absent<T, K>
        : never)
    : never);

export enum AnalyticsCrowdDetailType {
  ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED = "ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED",
  ANALYTICS_CROWD_DETAIL_TYPE_HIGH = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH",
  ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP",
  ANALYTICS_CROWD_DETAIL_TYPE_LOW = "ANALYTICS_CROWD_DETAIL_TYPE_LOW",
}

export enum AnalyticsShadowType {
  ANALYTICS_SHADOW_TYPE_UNSPECIFIED = "ANALYTICS_SHADOW_TYPE_UNSPECIFIED",
  ANALYTICS_SHADOW_TYPE_DISABLED = "ANALYTICS_SHADOW_TYPE_DISABLED",
  ANALYTICS_SHADOW_TYPE_UNFILTERED = "ANALYTICS_SHADOW_TYPE_UNFILTERED",
  ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED = "ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED",
  ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED = "ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED",
  ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED = "ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED",
}

export enum AnalyticsShadowQuality {
  ANALYTICS_SHADOW_QUALITY_UNSPECIFIED = "ANALYTICS_SHADOW_QUALITY_UNSPECIFIED",
  ANALYTICS_SHADOW_QUALITY_LOW = "ANALYTICS_SHADOW_QUALITY_LOW",
  ANALYTICS_SHADOW_QUALITY_MEDIUM = "ANALYTICS_SHADOW_QUALITY_MEDIUM",
  ANALYTICS_SHADOW_QUALITY_HIGH = "ANALYTICS_SHADOW_QUALITY_HIGH",
}

export enum AnalyticsLightingType {
  ANALYTICS_LIGHTING_TYPE_UNSPECIFIED = "ANALYTICS_LIGHTING_TYPE_UNSPECIFIED",
  ANALYTICS_LIGHTING_TYPE_FULL = "ANALYTICS_LIGHTING_TYPE_FULL",
  ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY = "ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY",
  ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY = "ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY",
  ANALYTICS_LIGHTING_TYPE_NONE = "ANALYTICS_LIGHTING_TYPE_NONE",
}

export enum AnalyticsCrowdMode {
  ANALYTICS_CROWD_MODE_UNSPECIFIED = "ANALYTICS_CROWD_MODE_UNSPECIFIED",
  ANALYTICS_CROWD_MODE_NONE = "ANALYTICS_CROWD_MODE_NONE",
  ANALYTICS_CROWD_MODE_LOCAL_GROUP = "ANALYTICS_CROWD_MODE_LOCAL_GROUP",
  ANALYTICS_CROWD_MODE_ALL = "ANALYTICS_CROWD_MODE_ALL",
}

export enum AnalyticsAntiAliasingType {
  ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED = "ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED",
  ANALYTICS_ANTI_ALIASING_TYPE_SMAA = "ANALYTICS_ANTI_ALIASING_TYPE_SMAA",
  ANALYTICS_ANTI_ALIASING_TYPE_FXAA = "ANALYTICS_ANTI_ALIASING_TYPE_FXAA",
  ANALYTICS_ANTI_ALIASING_TYPE_NONE = "ANALYTICS_ANTI_ALIASING_TYPE_NONE",
}

export enum AnalyticsEventClientRankUpDialogType {
  ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_UNSPECIFIED = "ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_UNSPECIFIED",
  ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_JOIN_STREAM = "ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_JOIN_STREAM",
  ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_MATCH_END = "ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_MATCH_END",
  ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_SEASONS = "ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_SEASONS",
}

export enum AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext {
  SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED = "SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED",
  SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW = "SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW",
  SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU = "SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU",
  SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK = "SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK",
  SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU = "SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU",
}

export enum AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext {
  CARD_SELECT_OPENED_CONTEXT_UNSPECIFIED = "CARD_SELECT_OPENED_CONTEXT_UNSPECIFIED",
  CARD_SELECT_OPENED_CONTEXT_SWITCH_OUT = "CARD_SELECT_OPENED_CONTEXT_SWITCH_OUT",
  CARD_SELECT_OPENED_CONTEXT_PICK_A_CARD = "CARD_SELECT_OPENED_CONTEXT_PICK_A_CARD",
  CARD_SELECT_OPENED_CONTEXT_JOINED_GAME_AUTO_OPEN = "CARD_SELECT_OPENED_CONTEXT_JOINED_GAME_AUTO_OPEN",
  CARD_SELECT_OPENED_CONTEXT_ROUND_END_AUTO_OPEN = "CARD_SELECT_OPENED_CONTEXT_ROUND_END_AUTO_OPEN",
}

export enum AnalyticsEventClientShuffleUsedShuffleContext {
  SHUFFLE_CONTEXT_UNSPECIFIED = "SHUFFLE_CONTEXT_UNSPECIFIED",
  SHUFFLE_CONTEXT_GAME = "SHUFFLE_CONTEXT_GAME",
  SHUFFLE_CONTEXT_DGC = "SHUFFLE_CONTEXT_DGC",
}

export enum AnalyticsEventClientTimedAdsOpenedTimedAdsContext {
  TIMED_ADS_CONTEXT_UNSPECIFIED = "TIMED_ADS_CONTEXT_UNSPECIFIED",
  TIMED_ADS_CONTEXT_NAV_SIDEBAR = "TIMED_ADS_CONTEXT_NAV_SIDEBAR",
  TIMED_ADS_CONTEXT_APP_HEADER = "TIMED_ADS_CONTEXT_APP_HEADER",
  TIMED_ADS_CONTEXT_STORE = "TIMED_ADS_CONTEXT_STORE",
  TIMED_ADS_CONTEXT_MATCH_END = "TIMED_ADS_CONTEXT_MATCH_END",
}

export enum AnalyticsEventClientAdAvailableAdAvailableContext {
  AD_AVAILABLE_CONTEXT_UNSPECIFIED = "AD_AVAILABLE_CONTEXT_UNSPECIFIED",
  AD_AVAILABLE_CONTEXT_GAME = "AD_AVAILABLE_CONTEXT_GAME",
  AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION = "AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION",
  AD_AVAILABLE_CONTEXT_STORE_PAGE = "AD_AVAILABLE_CONTEXT_STORE_PAGE",
}

export enum AnalyticsEventClientSignupStepSignupStep {
  SIGNUP_STEP_UNSPECIFIED = "SIGNUP_STEP_UNSPECIFIED",
  SIGNUP_STEP_METHOD = "SIGNUP_STEP_METHOD",
  SIGNUP_STEP_DISCORD = "SIGNUP_STEP_DISCORD",
  SIGNUP_STEP_ACCOUNT_EXISTS = "SIGNUP_STEP_ACCOUNT_EXISTS",
  SIGNUP_STEP_RECAPTCHA = "SIGNUP_STEP_RECAPTCHA",
  SIGNUP_STEP_COMPLETE_ACCOUNT = "SIGNUP_STEP_COMPLETE_ACCOUNT",
  SIGNUP_STEP_NDA = "SIGNUP_STEP_NDA",
  SIGNUP_STEP_EMAIL_VERIFICATION = "SIGNUP_STEP_EMAIL_VERIFICATION",
  SIGNUP_STEP_WAITLIST = "SIGNUP_STEP_WAITLIST",
  SIGNUP_STEP_ERROR = "SIGNUP_STEP_ERROR",
  SIGNUP_STEP_TOS = "SIGNUP_STEP_TOS",
  SIGNUP_STEP_AVATAR_SELECT = "SIGNUP_STEP_AVATAR_SELECT",
  SIGNUP_STEP_COMPLETED = "SIGNUP_STEP_COMPLETED",
  SIGNUP_STEP_DISCORD_CLICK = "SIGNUP_STEP_DISCORD_CLICK",
  SIGNUP_STEP_APPLE_CLICK = "SIGNUP_STEP_APPLE_CLICK",
  SIGNUP_STEP_INVISIBLE_CAPTHA_EXECUTE = "SIGNUP_STEP_INVISIBLE_CAPTHA_EXECUTE",
  SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_OPEN = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_OPEN",
  SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_DISMISS = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_DISMISS",
  SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_EXPIRED = "SIGNUP_STEP_INVISIBLE_CAPTHA_CHALLENGE_EXPIRED",
  SIGNUP_STEP_INVISIBLE_CAPTHA_VERIFIED = "SIGNUP_STEP_INVISIBLE_CAPTHA_VERIFIED",
  SIGNUP_STEP_INVISIBLE_CAPTHA_ERROR = "SIGNUP_STEP_INVISIBLE_CAPTHA_ERROR",
  SIGNUP_STEP_AVATAR_EDITOR_ENTER = "SIGNUP_STEP_AVATAR_EDITOR_ENTER",
  SIGNUP_STEP_AVATAR_EDITOR_COMPLETED = "SIGNUP_STEP_AVATAR_EDITOR_COMPLETED",
  SIGNUP_STEP_LOGIN_OR_SIGNUP_CLICK = "SIGNUP_STEP_LOGIN_OR_SIGNUP_CLICK",
  SIGNUP_STEP_VERIFY_ACCOUNT_CLICK = "SIGNUP_STEP_VERIFY_ACCOUNT_CLICK",
  SIGNUP_STEP_VERIFY_EMAIL_CLICK = "SIGNUP_STEP_VERIFY_EMAIL_CLICK",
}

export enum AnalyticsEventClientSignupStepSignupMode {
  SIGNUP_MODE_UNSPECIFIED = "SIGNUP_MODE_UNSPECIFIED",
  SIGNUP_MODE_SIGNIN = "SIGNUP_MODE_SIGNIN",
  SIGNUP_MODE_SIGNUP = "SIGNUP_MODE_SIGNUP",
}

export enum AnalyticsEventClientRenderingStatsRendererType {
  RENDERER_TYPE_UNSPECIFIED = "RENDERER_TYPE_UNSPECIFIED",
  RENDERER_TYPE_WEBGL = "RENDERER_TYPE_WEBGL",
  RENDERER_TYPE_VIDEO = "RENDERER_TYPE_VIDEO",
}

export enum AnalyticsEventClientRenderingStatsRendererClass {
  RENDERER_CLASS_UNSPECIFIED = "RENDERER_CLASS_UNSPECIFIED",
  RENDERER_CLASS_COMPOSITOR = "RENDERER_CLASS_COMPOSITOR",
  RENDERER_CLASS_DIRECT = "RENDERER_CLASS_DIRECT",
  RENDERER_CLASS_CLIENT = "RENDERER_CLASS_CLIENT",
  RENDERER_CLASS_FALLBACK = "RENDERER_CLASS_FALLBACK",
}

export enum AnalyticsEventMatchEndCtaMatchEndCtaType {
  MATCH_END_CTA_TYPE_UNSPECIFIED = "MATCH_END_CTA_TYPE_UNSPECIFIED",
  MATCH_END_CTA_TYPE_SEASONS = "MATCH_END_CTA_TYPE_SEASONS",
}

export enum AnalyticsEventWebRTCMetricsStreamType {
  STREAM_TYPE_UNSPECIFIED = "STREAM_TYPE_UNSPECIFIED",
  STREAM_TYPE_RAW_STREAM = "STREAM_TYPE_RAW_STREAM",
  STREAM_TYPE_ARENA = "STREAM_TYPE_ARENA",
  STREAM_TYPE_TRANSCODER = "STREAM_TYPE_TRANSCODER",
}

export enum AnalyticsEventStudioWidgetStudioWidgetEvent {
  STUDIO_WIDGET_EVENT_UNSPECIFIED = "STUDIO_WIDGET_EVENT_UNSPECIFIED",
  STUDIO_WIDGET_EVENT_INIT = "STUDIO_WIDGET_EVENT_INIT",
  STUDIO_WIDGET_EVENT_ADD = "STUDIO_WIDGET_EVENT_ADD",
  STUDIO_WIDGET_EVENT_REMOVE = "STUDIO_WIDGET_EVENT_REMOVE",
  STUDIO_WIDGET_EVENT_SETTINGS_CHANGE = "STUDIO_WIDGET_EVENT_SETTINGS_CHANGE",
  STUDIO_WIDGET_EVENT_POPOUT = "STUDIO_WIDGET_EVENT_POPOUT",
  STUDIO_WIDGET_EVENT_RESTORE_SAVED = "STUDIO_WIDGET_EVENT_RESTORE_SAVED",
  STUDIO_WIDGET_EVENT_SAVE_LAYOUT = "STUDIO_WIDGET_EVENT_SAVE_LAYOUT",
  STUDIO_WIDGET_EVENT_RESET_LAYOUT = "STUDIO_WIDGET_EVENT_RESET_LAYOUT",
}

export enum AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup {
  AUDIENCE_INSIGHTS_FILTER_GROUP_UNSPECIFIED = "AUDIENCE_INSIGHTS_FILTER_GROUP_UNSPECIFIED",
  AUDIENCE_INSIGHTS_FILTER_GROUP_VISITORS_FOLLOWERS = "AUDIENCE_INSIGHTS_FILTER_GROUP_VISITORS_FOLLOWERS",
  AUDIENCE_INSIGHTS_FILTER_GROUP_NON_SUBS_SUBSRIBERS = "AUDIENCE_INSIGHTS_FILTER_GROUP_NON_SUBS_SUBSRIBERS",
  AUDIENCE_INSIGHTS_FILTER_GROUP_WATCHERS_PLAYERS = "AUDIENCE_INSIGHTS_FILTER_GROUP_WATCHERS_PLAYERS",
  AUDIENCE_INSIGHTS_FILTER_GROUP_LURKERS_CHATTERS = "AUDIENCE_INSIGHTS_FILTER_GROUP_LURKERS_CHATTERS",
}

export enum AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterState {
  AUDIENCE_INSIGHTS_FILTER_STATE_UNSPECIFIED = "AUDIENCE_INSIGHTS_FILTER_STATE_UNSPECIFIED",
  AUDIENCE_INSIGHTS_FILTER_STATE_ON = "AUDIENCE_INSIGHTS_FILTER_STATE_ON",
  AUDIENCE_INSIGHTS_FILTER_STATE_OFF = "AUDIENCE_INSIGHTS_FILTER_STATE_OFF",
}

export enum AnalyticsEventStudioWidgetActionsAction {
  ACTION_EDIT_UNSPECIFIED = "ACTION_EDIT_UNSPECIFIED",
  ACTION_EDIT_STREAM_INFO = "ACTION_EDIT_STREAM_INFO",
  ACTION_START_INTERMISSION = "ACTION_START_INTERMISSION",
  ACTION_END_INTERMISSION = "ACTION_END_INTERMISSION",
}

export enum AnalyticsEventStudioWidgetActionsOrigin {
  ORIGIN_UNSPECIFIED = "ORIGIN_UNSPECIFIED",
  ORIGIN_STUDIO = "ORIGIN_STUDIO",
  ORIGIN_EXTERNAL = "ORIGIN_EXTERNAL",
}

export enum AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity {
  ACTIVITY_FEED_FILTER_ACTIVITY_UNSPECIFIED = "ACTIVITY_FEED_FILTER_ACTIVITY_UNSPECIFIED",
  ACTIVITY_FEED_FILTER_ACTIVITY_STREAM_AND_MATCH = "ACTIVITY_FEED_FILTER_ACTIVITY_STREAM_AND_MATCH",
  ACTIVITY_FEED_FILTER_ACTIVITY_NEW_VIEWERS = "ACTIVITY_FEED_FILTER_ACTIVITY_NEW_VIEWERS",
  ACTIVITY_FEED_FILTER_ACTIVITY_NEW_FOLLOWERS = "ACTIVITY_FEED_FILTER_ACTIVITY_NEW_FOLLOWERS",
  ACTIVITY_FEED_FILTER_ACTIVITY_SUBSCRIPTIONS = "ACTIVITY_FEED_FILTER_ACTIVITY_SUBSCRIPTIONS",
  ACTIVITY_FEED_FILTER_ACTIVITY_PURCHASES = "ACTIVITY_FEED_FILTER_ACTIVITY_PURCHASES",
  ACTIVITY_FEED_FILTER_ACTIVITY_HIGH_SCORING_CARDS = "ACTIVITY_FEED_FILTER_ACTIVITY_HIGH_SCORING_CARDS",
}

export enum AnalyticsEventStudioActivityFeedFiltersActivityFeedFiltersState {
  ACTIVITY_FEED_FILTERS_STATE_UNSPECIFIED = "ACTIVITY_FEED_FILTERS_STATE_UNSPECIFIED",
  ACTIVITY_FEED_FILTERS_STATE_ON = "ACTIVITY_FEED_FILTERS_STATE_ON",
  ACTIVITY_FEED_FILTERS_STATE_OFF = "ACTIVITY_FEED_FILTERS_STATE_OFF",
}

export enum AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction {
  WEB_MOBILE_APP_BANNER_ACTION_TYPE_UNSPECIFIED = "WEB_MOBILE_APP_BANNER_ACTION_TYPE_UNSPECIFIED",
  WEB_MOBILE_APP_BANNER_ACTION_TYPE_DOWNLOAD = "WEB_MOBILE_APP_BANNER_ACTION_TYPE_DOWNLOAD",
  WEB_MOBILE_APP_BANNER_ACTION_TYPE_DISMISS = "WEB_MOBILE_APP_BANNER_ACTION_TYPE_DISMISS",
  WEB_MOBILE_APP_BANNER_ACTION_TYPE_SHOWN = "WEB_MOBILE_APP_BANNER_ACTION_TYPE_SHOWN",
}

export enum AnalyticsEventClientChatSettingsChatSettingType {
  CHAT_SETTING_TYPE_UNSPECIFIED = "CHAT_SETTING_TYPE_UNSPECIFIED",
  CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS = "CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS",
  CHAT_SETTING_TYPE_FONT_SIZE = "CHAT_SETTING_TYPE_FONT_SIZE",
  CHAT_SETTING_TYPE_AVATAR_VISIBILITY = "CHAT_SETTING_TYPE_AVATAR_VISIBILITY",
}

export enum AnalyticsEventClientSignupCookiesConsentActionedUserDecision {
  USER_DECISION_UNSPECIFIED = "USER_DECISION_UNSPECIFIED",
  USER_DECISION_SAVE_SETTINGS = "USER_DECISION_SAVE_SETTINGS",
  USER_DECISION_ACCEPT_ALL = "USER_DECISION_ACCEPT_ALL",
  USER_DECISION_DENY_ALL = "USER_DECISION_DENY_ALL",
}

export enum AnalyticsEventClientUpSellingDialogUpSellingDialogActionType {
  UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED = "UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED",
  UP_SELLING_DIALOG_ACTION_TYPE_OPEN = "UP_SELLING_DIALOG_ACTION_TYPE_OPEN",
  UP_SELLING_DIALOG_ACTION_TYPE_LOGIN = "UP_SELLING_DIALOG_ACTION_TYPE_LOGIN",
  UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP = "UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP",
  UP_SELLING_DIALOG_ACTION_TYPE_CLOSE = "UP_SELLING_DIALOG_ACTION_TYPE_CLOSE",
}

export enum AnalyticsEventClientUpSellingDialogUpSellingDialogSource {
  UP_SELLING_DIALOG_SOURCE_UNSPECIFIED = "UP_SELLING_DIALOG_SOURCE_UNSPECIFIED",
  UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE = "UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE",
  UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE = "UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE",
  UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE = "UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE",
  UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL = "UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL",
  UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL = "UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL",
  UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR = "UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR",
  UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE",
  UP_SELLING_DIALOG_SOURCE_CREATOR_CARD = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD",
  UP_SELLING_DIALOG_SOURCE_SEND_CHAT_MESSAGE = "UP_SELLING_DIALOG_SOURCE_SEND_CHAT_MESSAGE",
}

export enum AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType {
  ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED",
  ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP",
  ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN",
}

export enum AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep {
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_UNSPECIFIED = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_UNSPECIFIED",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_EXECUTE = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_EXECUTE",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_OPEN = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_OPEN",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_DISMISS = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_DISMISS",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_EXPIRED = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_CHALLENGE_EXPIRED",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_VERIFIED = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_VERIFIED",
  GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_ERROR = "GUEST_CREATION_INVISIBLE_CAPTCHA_STEP_ERROR",
}

export enum AnalyticsEventKeyContentLoadedEndReason {
  END_REASON_UNSPECIFIED = "END_REASON_UNSPECIFIED",
  END_REASON_FINISHED = "END_REASON_FINISHED",
  END_REASON_NAVIGATION = "END_REASON_NAVIGATION",
  END_REASON_PAGE_UNLOAD = "END_REASON_PAGE_UNLOAD",
}

export enum AnalyticsEventClientStreamVideoEventEventType {
  EVENT_TYPE_UNSPECIFIED = "EVENT_TYPE_UNSPECIFIED",
  EVENT_TYPE_PLAY = "EVENT_TYPE_PLAY",
  EVENT_TYPE_PAUSE = "EVENT_TYPE_PAUSE",
  EVENT_TYPE_END = "EVENT_TYPE_END",
  EVENT_TYPE_ERROR = "EVENT_TYPE_ERROR",
  EVENT_TYPE_SUSPEND = "EVENT_TYPE_SUSPEND",
  EVENT_TYPE_STALLED = "EVENT_TYPE_STALLED",
  EVENT_TYPE_FIRST_VIDEO_FRAME = "EVENT_TYPE_FIRST_VIDEO_FRAME",
  EVENT_TYPE_MUTED = "EVENT_TYPE_MUTED",
  EVENT_TYPE_UNMUTED = "EVENT_TYPE_UNMUTED",
}

export enum AnalyticsEventClientImplicitAccountLoginStep {
  STEP_UNSPECIFIED = "STEP_UNSPECIFIED",
  STEP_STARTED = "STEP_STARTED",
  STEP_CAPTCHA_DONE = "STEP_CAPTCHA_DONE",
  STEP_CAPTCHA_FAILED = "STEP_CAPTCHA_FAILED",
  STEP_TOKEN_VERIFICATION_DONE = "STEP_TOKEN_VERIFICATION_DONE",
  STEP_TOKEN_VERIFICATION_FAILED = "STEP_TOKEN_VERIFICATION_FAILED",
  STEP_ACCOUNT_CREATION_DONE = "STEP_ACCOUNT_CREATION_DONE",
  STEP_ACCOUNT_CREATION_FAILED = "STEP_ACCOUNT_CREATION_FAILED",
}

export enum AnalyticsEventClientAppStateChangedAppState {
  APP_STATE_UNSPECIFIED = "APP_STATE_UNSPECIFIED",
  APP_STATE_BACKGROUND = "APP_STATE_BACKGROUND",
  APP_STATE_FOREGROUND = "APP_STATE_FOREGROUND",
  APP_STATE_INACTIVE = "APP_STATE_INACTIVE",
}

export enum AnalyticsEventClientInsufficientCreditsSource {
  SOURCE_UNSPECIFIED = "SOURCE_UNSPECIFIED",
  SOURCE_STORE = "SOURCE_STORE",
  SOURCE_AVATAR_EDITOR = "SOURCE_AVATAR_EDITOR",
  SOURCE_DAILY_GOAL_CARD = "SOURCE_DAILY_GOAL_CARD",
  SOURCE_CARD_GAME = "SOURCE_CARD_GAME",
}

export enum AnalyticsEventClientOrientationChangedOrientation {
  ORIENTATION_UNSPECIFIED = "ORIENTATION_UNSPECIFIED",
  ORIENTATION_PORTRAIT = "ORIENTATION_PORTRAIT",
  ORIENTATION_LANDSCAPE = "ORIENTATION_LANDSCAPE",
}

export enum AnalyticsEventClientWebPushNotificationActionAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_ENABLED = "ACTION_ENABLED",
  ACTION_DISABLED = "ACTION_DISABLED",
  ACTION_DENIED = "ACTION_DENIED",
  ACTION_TEST = "ACTION_TEST",
  ACTION_TEST_CONFIRMED = "ACTION_TEST_CONFIRMED",
}

export enum AnalyticsEventClientMobilePushNotificationActionAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_ENABLED = "ACTION_ENABLED",
  ACTION_DISABLED = "ACTION_DISABLED",
  ACTION_MODAL_SHOWN = "ACTION_MODAL_SHOWN",
  ACTION_USER_OPENED_APP_FROM_NOTIFICATION = "ACTION_USER_OPENED_APP_FROM_NOTIFICATION",
  ACTION_USER_DISMISSED_NOTIFICATION = "ACTION_USER_DISMISSED_NOTIFICATION",
  ACTION_USER_BLOCKED_APP_NOTIFICATIONS = "ACTION_USER_BLOCKED_APP_NOTIFICATIONS",
  ACTION_USER_PRESSED_NOTIFICATION = "ACTION_USER_PRESSED_NOTIFICATION",
}

export enum AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_DIALOG_SHOWN = "ACTION_DIALOG_SHOWN",
  ACTION_BUTTON_CLICK_CANCEL = "ACTION_BUTTON_CLICK_CANCEL",
  ACTION_BUTTON_CLICK_PURCHASE = "ACTION_BUTTON_CLICK_PURCHASE",
}

export enum AnalyticsEventStudioSettingsChannelVisibilityVisibility {
  VISIBILITY_UNSPECIFIED = "VISIBILITY_UNSPECIFIED",
  VISIBILITY_PUBLIC = "VISIBILITY_PUBLIC",
  VISIBILITY_UNLISTED = "VISIBILITY_UNLISTED",
}

export enum AnalyticsEventStudioSettingsChannelVisibilityAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_OPEN_CHANGE_DIALOG = "ACTION_OPEN_CHANGE_DIALOG",
  ACTION_CANCEL_CHANGE_DIALOG = "ACTION_CANCEL_CHANGE_DIALOG",
  ACTION_CONFIRM_CHANGE_DIALOG = "ACTION_CONFIRM_CHANGE_DIALOG",
}

export enum AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_COSMETICS_ARE_AVAILABLE = "ACTION_COSMETICS_ARE_AVAILABLE",
  ACTION_DIALOG_SHOWN = "ACTION_DIALOG_SHOWN",
  ACTION_BUTTON_CLICK_CANCEL = "ACTION_BUTTON_CLICK_CANCEL",
  ACTION_BUTTON_CLICK_PREVIEW = "ACTION_BUTTON_CLICK_PREVIEW",
  ACTION_BUTTON_CLICK_PURCHASE = "ACTION_BUTTON_CLICK_PURCHASE",
  ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY = "ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY",
  ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_GO_TO_STORE = "ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_GO_TO_STORE",
  ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_CANCEL = "ACTION_BUTTON_CLICK_PURCHASE_NOT_ENOUGH_CURRENCY_CANCEL",
  ACTION_BUTTON_CLICK_PURCHASE_COMPLETE_CUSTOMIZE_AVATAR = "ACTION_BUTTON_CLICK_PURCHASE_COMPLETE_CUSTOMIZE_AVATAR",
  ACTION_BUTTON_CLICK_PURCHASE_COMPLETE_SAVE_AVATAR = "ACTION_BUTTON_CLICK_PURCHASE_COMPLETE_SAVE_AVATAR",
}

export enum AnalyticsEventClientContentSearchAction {
  ACTION_UNSPECIFIED = "ACTION_UNSPECIFIED",
  ACTION_INPUT_SUBMIT = "ACTION_INPUT_SUBMIT",
  ACTION_SEE_ALL_RESULTS_CLICK = "ACTION_SEE_ALL_RESULTS_CLICK",
  ACTION_RESULT_CLICK = "ACTION_RESULT_CLICK",
}

export enum AnalyticsEventClientContentSearchSection {
  SECTION_UNSPECIFIED = "SECTION_UNSPECIFIED",
  SECTION_POPOVER = "SECTION_POPOVER",
  SECTION_PAGE = "SECTION_PAGE",
}

export enum AnalyticsEventClientContentSearchResultCategory {
  RESULT_CATEGORY_UNSPECIFIED = "RESULT_CATEGORY_UNSPECIFIED",
  RESULT_CATEGORY_CHANNELS = "RESULT_CATEGORY_CHANNELS",
  RESULT_CATEGORY_CATEGORIES = "RESULT_CATEGORY_CATEGORIES",
}

export enum AnalyticsEventClientIdleStateState {
  STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
  STATE_ACTIVE = "STATE_ACTIVE",
  STATE_IDLE = "STATE_IDLE",
  STATE_OFFLINE = "STATE_OFFLINE",
  STATE_RETURNED = "STATE_RETURNED",
}

export type AnalyticsEventClientNavigate = {
  pathname?: string
  buildHash?: string
}

export type AnalyticsEventClientLoadFinished = {
  loadtimeMs?: string
  buildHash?: string
  buildTime?: string
  ttfbMs?: number
}

export type AnalyticsEventClientFirstPageLoad = {
  pathname?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  utmCreator?: string
  utmFormat?: string
}

export type AnalyticsEventClientSpotlightsEmoteClicked = {
  emoteId?: string
  name?: string
  icon?: string
}

export type AnalyticsEventClientAvatarEmoteClicked = {
  emoteId?: string
  name?: string
  icon?: string
}

export type AnalyticsEventClientAvatarEmojiClicked = {
  emojiId?: string
  name?: string
  icon?: string
}

export type AnalyticsEventClientAvatarSelectorAvatarViewed = {
  avatarId?: string
}

export type AnalyticsEventClientAvatarSelectorAvatarSelected = {
  avatarId?: string
}

export type AnalyticsEventClientAvatarEditorSaveStarted = {
  avatarParts?: AvatarAvatar.AvatarPart[]
  avatarEditorSessionId?: string
  customisations?: AvatarAvatar.AvatarPartCustomization[]
}

export type AnalyticsEventClientAvatarEditorSaveCompleted = {
  avatarParts?: AvatarAvatar.AvatarPart[]
  avatarId?: string
  avatarEditorSessionId?: string
  customisations?: AvatarAvatar.AvatarPartCustomization[]
}

export type AnalyticsEventClientAvatarEditorOpened = {
  avatarEditorSessionId?: string
}

export type AnalyticsEventClientAvatarEditorClosed = {
  avatarEditorSessionId?: string
}

export type AnalyticsEventClientAvatarEditorItemSelected = {
  part?: AvatarAvatar.AvatarPart
  avatarEditorSessionId?: string
}

export type AnalyticsEventClientAvatarEditorColorCustomisationSelected = {
  part?: AvatarAvatar.AvatarPart
  customisation?: AvatarAvatar.AvatarPartCustomization
  avatarEditorSessionId?: string
}

export type AnalyticsEventClientConsoleError = {
  message?: string
}

export type AnalyticsEventClientUnhandledPromiseRejection = {
  message?: string
}

export type AnalyticsEventClientJavaScriptError = {
  message?: string
}

export type BundleItem = {
  itemId?: string
  revealed?: boolean
}

export type Bundle = {
  id?: string
  revealed?: boolean
  items?: BundleItem[]
}

export type AnalyticsEventClientInactivityKickPromptShown = {
}

export type AnalyticsEventClientBestPlaysOpened = {
}

export type AnalyticsEventClientSoloPlayToggle = {
  enabled?: boolean
  context?: AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext
}

export type AnalyticsEventClientStorePage = {
  standardBundles?: Bundle[]
  premiumBundles?: Bundle[]
  gameId?: string
  wallet?: WalletWallet.WalletCurrency[]
  channelId?: string
}

export type AnalyticsEventClientFTUEDisplayed = {
  ftueId?: string
  ftueMessageType?: FtueFtue.ConfigItemMessageType
}

export type AnalyticsEventClientButtonClick = {
  action?: string
  pathname?: string
  section?: string
}

export type AnalyticsEventClientAnchorClick = {
  label?: string
  pathname?: string
  section?: string
  targetAddress?: string
}

export type AnalyticsEventClientCardSelectOpened = {
  currentCardId?: string
  reshufflePrice?: number
  teamSize?: number
  isPlayingSolo?: boolean
  isCardMaxedOut?: boolean
  context?: AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext
}

export type AnalyticsEventClientCardSelectCanceled = {
  currentCardId?: string
  reshufflePrice?: number
  teamSize?: number
  isPlayingSolo?: boolean
  isCardMaxedOut?: boolean
}

export type AnalyticsEventClientBoosterClicked = {
  boosterId?: number
  teamSize?: number
  currentCardId?: string
  isCardMaxedOut?: boolean
}

export type AnalyticsEventClientShuffleUsed = {
  context?: AnalyticsEventClientShuffleUsedShuffleContext
  reshufflePrice?: number
}

export type AnalyticsEventClientStoreBundleClicked = {
  bundle?: Bundle
  cost?: WalletWallet.WalletCurrency
  wallet?: WalletWallet.WalletCurrency[]
  itemType?: StoreV2Storev2.ItemType
}

export type AnalyticsEventClientStoreRevealAllCards = {
  bundle?: Bundle
  cost?: WalletWallet.WalletCurrency
  wallet?: WalletWallet.WalletCurrency[]
  itemType?: StoreV2Storev2.ItemType
}

export type AnalyticsEventClientStoreRevealCard = {
  cardId?: string
  bundle?: Bundle
  cost?: WalletWallet.WalletCurrency
  wallet?: WalletWallet.WalletCurrency[]
  itemType?: StoreV2Storev2.ItemType
}


type BaseAnalyticsEventClientStoreItemClicked = {
  action?: string
  cost?: WalletWallet.WalletCurrency
  wallet?: WalletWallet.WalletCurrency[]
  itemType?: StoreV2Storev2.ItemType
  targetAttributes?: {[key: string]: string}
}

export type AnalyticsEventClientStoreItemClicked = BaseAnalyticsEventClientStoreItemClicked
  & OneOf<{ bundle: Bundle; card: Game_logicGame_logic.StreamerCard }>

export type AnalyticsEventClientSwitchStore = {
  gameId?: string
  channelId?: string
}

export type AnalyticsEventClientTimedAdsOpened = {
  pathname?: string
  placementId?: string
  context?: AnalyticsEventClientTimedAdsOpenedTimedAdsContext
}

export type AnalyticsEventClientTimedAdsWatchingAd = {
  pathname?: string
  placementId?: string
  rarity?: RarityRarity.Rarity
  possibleRewards?: AdsAds.RewardDescriptionPrizeDescription[]
}

export type AnalyticsEventClientTimedAdsRewardsClaimed = {
  pathname?: string
  placementId?: string
  rarity?: RarityRarity.Rarity
  possibleRewards?: AdsAds.RewardDescriptionPrizeDescription[]
  actualRewards?: WalletWallet.WalletCurrency[]
  adWatched?: boolean
}

export type AnalyticsEventClientTimedAdsClosed = {
  pathname?: string
  placementId?: string
}

export type AnalyticsEventClientAdAvailable = {
  context?: AnalyticsEventClientAdAvailableAdAvailableContext
  pathname?: string
  placementId?: string
}

export type AnalyticsEventClientWatchingAd = {
  pathname?: string
  placementId?: string
}

export type AnalyticsEventClientSkippedAd = {
  pathname?: string
  placementId?: string
}

export type AnalyticsEventClientOpenMiniProfile = {
  friendshipStatus?: FriendsFriends.FriendshipStatusStatus
}

export type AnalyticsEventClientAddFriendFormViewed = {
  pathname?: string
}

export type AnalyticsEventClientToggleSeasons = {
  gameId?: string
}

export type AnalyticsEventClientCollectionCardClicked = {
  cardId?: string
}

export type AnalyticsEventClientToggleCollections = {
  gameId?: string
  channelId?: string
}

export type AnalyticsEventClientSelectAvatar = {
  avatarId?: string
}

export type AnalyticsEventClientBrowseAvatarPages = {
  page?: number
}

export type AnalyticsEventClientFriendMenuOpened = {
  friendCount?: number
}

export type AnalyticsEventClientViewFriends = {
  friendCount?: number
}

export type AnalyticsEventClientDailyGoalCardSlotClicked = {
  selectedCardId?: string
}

export type AnalyticsEventClientSignupStep = {
  step?: AnalyticsEventClientSignupStepSignupStep
  mode?: AnalyticsEventClientSignupStepSignupMode
  discordTokenExists?: boolean
  captchaTokenExists?: boolean
  verifyEmailTokenExists?: boolean
  from?: string
  error?: string
}

export type AnalyticsEventClientEnvironmentCheck = {
  browserGpu?: string
  browserIsMobile?: boolean
  browserIsSupported?: boolean
  browserPlatform?: string
  browserUserAgent?: string
  browserViewport?: number
  browserGpuTier?: number
  browserName?: string
  browserOsName?: string
  environmentCheckFailed?: boolean
  mobileOsName?: string
  mobileBuildNumber?: string
  mobileVersion?: string
  mobileDeviceModel?: string
}

export type AnalyticsEventClientRenderingStats = {
  frameTimeAvgMs?: number
  frameTimeP50Ms?: number
  frameTimeP75Ms?: number
  frameTimeP90Ms?: number
  frameTimeP99Ms?: number
  frameJankCount?: number
  textures?: number
  geometries?: number
  memoryJsMb?: number
  sampleLengthMs?: number
  emoteCount?: number
  emojiCount?: number
  avatarCount?: number
  totalLengthMs?: number
  type?: AnalyticsEventClientRenderingStatsRendererType
  crowdMode?: AnalyticsCrowdMode
  crowdAnimationRate?: number
  crowdDetail?: AnalyticsCrowdDetailType
  frameRate?: number
  shadowType?: AnalyticsShadowType
  lightingType?: AnalyticsLightingType
  crowdResolution?: number
  antiAliasingType?: AnalyticsAntiAliasingType
  gpuTier?: number
  renderQualityLevel?: number
  frameSampleCount?: number
  frameStaticLimiterCount?: number
  frameDynamicLimiterCount?: number
  frameUnderLimiterCount?: number
  frameRenderThread60Count?: number
  frameRenderThread30Count?: number
  frameRenderThreadUnder30Count?: number
  rendererClass?: AnalyticsEventClientRenderingStatsRendererClass
  hardwareConcurrency?: number
  batteryStatus?: string
  streamUpdateTimeAvgMs?: number
  streamUpdateP50Ms?: number
  streamUpdateP75Ms?: number
  streamUpdateP90Ms?: number
  streamUpdateP99Ms?: number
  avatarVersions?: {[key: string]: number}
}

export type AnalyticsEventMatchEndCta = {
  type?: AnalyticsEventMatchEndCtaMatchEndCtaType
}

export type AnalyticsEventPerformanceProfileChanged = {
  profileName?: string
  profileIndex?: number
  crowdAnimationRate?: number
  crowdDetail?: AnalyticsCrowdDetailType
  frameRate?: number
  shadowType?: AnalyticsShadowType
  lightingType?: AnalyticsLightingType
  crowdResolution?: number
  crowdMode?: AnalyticsCrowdMode
  antiAliasingType?: AnalyticsAntiAliasingType
  shadowQuality?: AnalyticsShadowQuality
}

export type AnalyticsEventStreamQualityChanged = {
  layerName?: string
}

export type StreamMetricsMetadata = {
  streamId?: string
  channelId?: string
  streamType?: Stream_egressEgress.StreamType
  egressType?: string
  sessionId?: string
}

export type WebRTCMetrics = {
  sampleLengthMs?: number
  roundTripTimeSec?: number
  roundTripTimesAvailable?: boolean
  videoPacketsReceivedTotal?: number
  videoPacketsLostTotal?: number
  videoPacketsDiscardedTotal?: number
  videoNackCountTotal?: number
  videoFirCountTotal?: number
  videoPliCountTotal?: number
  videoMebibytesReceivedTotal?: number
  videoJitterSec?: number
  videoJitterBufferDelaySec?: number
  videoJitterBufferEmittedCount?: number
  videoFrameWidth?: number
  videoFrameHeight?: number
  videoFreezeCountTotal?: number
  videoFreezeDurationSecTotal?: number
  videoPauseCountTotal?: number
  videoPauseDurationSecTotal?: number
  videoFramesReceivedTotal?: number
  videoFramesDecodedTotal?: number
  videoKeyFramesDecodedTotal?: number
  videoFramesDroppedTotal?: number
  audioPacketsReceivedTotal?: number
  audioPacketsLostTotal?: number
  audioPacketsDiscardedTotal?: number
  audioNackCountTotal?: number
  audioMebibytesReceivedTotal?: number
  audioJitterSec?: number
  audioJitterBufferDelaySec?: number
  audioJitterBufferEmittedCount?: number
  audioSamplesReceivedTotal?: number
}

export type AnalyticsEventWebRTCMetricsSample = {
  metadata?: StreamMetricsMetadata
  metrics?: WebRTCMetrics
}

export type AnalyticsEventWebRTCMetricsTotal = {
  metadata?: StreamMetricsMetadata
  metrics?: WebRTCMetrics
}

export type AnalyticsEventWebRTCMetrics = {
  streamId?: string
  streamType?: AnalyticsEventWebRTCMetricsStreamType
  timeTotalMs?: number
  sampleLengthMs?: number
  currentRoundTripTimeSec?: number
  totalRoundTripTimeSec?: number
  roundTripTimesAvailable?: boolean
  channelId?: string
  egressType?: string
  videoPacketsReceivedTotal?: number
  videoPacketsLostTotal?: number
  videoPacketsDiscardedTotal?: number
  videoNackCountTotal?: number
  videoFirCountTotal?: number
  videoPliCountTotal?: number
  sampleVideoPacketsReceived?: number
  sampleVideoPacketsLost?: number
  sampleVideoPacketsDiscarded?: number
  sampleVideoNackCount?: number
  sampleVideoFirCountTotal?: number
  sampleVideoPliCountTotal?: number
  videoJitterSec?: number
  videoJitterBufferDelaySec?: number
  videoJitterBufferEmittedCount?: number
  videoFrameWidth?: number
  videoFrameHeight?: number
  videoMebibytesReceivedTotal?: number
  sampleVideoMebibytesReceived?: number
  videoFreezeCountTotal?: number
  videoFreezeDurationSecTotal?: number
  videoPauseCountTotal?: number
  videoPauseDurationSecTotal?: number
  sampleVideoFreezeCount?: number
  sampleVideoFreezeDurationSec?: number
  sampleVideoPauseCount?: number
  sampleVideoPauseDurationSec?: number
  audioPacketsReceivedTotal?: number
  audioPacketsLostTotal?: number
  audioPacketsDiscardedTotal?: number
  audioNackCountTotal?: number
  sampleAudioMebibytesReceived?: number
  sampleAudioPacketsReceived?: number
  sampleAudioPacketsLost?: number
  sampleAudioPacketsDiscarded?: number
  sampleAudioNackCount?: number
  audioJitterSec?: number
  audioJitterBufferDelaySec?: number
  audioJitterBufferEmittedCount?: number
  audioMebibytesReceivedTotal?: number
}

export type AnalyticsEventStreamAlertLoading = {
  channelName?: string
  alertType?: string
}

export type AnalyticsEventStreamAlertShown = {
  channelName?: string
  alertType?: string
  streamId?: string
  channelId?: string
}


type BaseAnalyticsEventStreamAlertItemShown = {
  channelName?: string
  alertType?: string
  streamId?: string
  channelId?: string
  alertItemId?: string
}

export type AnalyticsEventStreamAlertItemShown = BaseAnalyticsEventStreamAlertItemShown
  & OneOf<{ topPrediction: MatchMatch.CardCount; highScoringCard: Game_logicGame_logic.HighScoringCardPromotedMsg; channelEvent: StreamerStreamer.ChannelActivityEvent }>

export type AnalyticsEventStreamAlertApolloError = {
  channelName?: string
  alertType?: string
  streamId?: string
  channelId?: string
  errorName?: string
  errorMessage?: string
}

export type AnalyticsEventStudioWidgetStudioWidget = {
  widgetName?: string
  settings?: string
}

export type AnalyticsEventStudioWidget = {
  channelId?: string
  userId?: string
  event?: AnalyticsEventStudioWidgetStudioWidgetEvent
  widgets?: AnalyticsEventStudioWidgetStudioWidget[]
}

export type AnalyticsEventStudioAudienceInsightsFilters = {
  streamId?: string
  group?: AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup
  option?: AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterState
}

export type AnalyticsEventStudioWidgetActions = {
  action?: AnalyticsEventStudioWidgetActionsAction
  channelId?: string
  origin?: AnalyticsEventStudioWidgetActionsOrigin
}

export type AnalyticsEventStudioActivityFeedFilters = {
  channelId?: string
  activity?: AnalyticsEventStudioActivityFeedFiltersActivityFeedFilterActivity
  option?: AnalyticsEventStudioActivityFeedFiltersActivityFeedFiltersState
}

export type AnalyticsEventClientWebMobileAppBannerAction = {
  pathname?: string
  action?: AnalyticsEventClientWebMobileAppBannerActionWebMobileAppBannerAction
}

export type AnalyticsEventStudioChannelArenaChanged = {
  arenaId?: string
  arenaName?: string
}

export type AnalyticsEventClientStreamConnectionRetry = {
  streamId?: string
  rawVideo?: boolean
  reconnectAttempt?: number
  reason?: string
}

export type AnalyticsEventClientStreamConnectionMediaStream = {
  streamId?: string
  rawVideo?: boolean
  audioTracks?: number
  videoTracks?: number
}

export type AnalyticsEventClientStreamConnectionWatch = {
  streamId?: string
  rawVideo?: boolean
  reconnectAttempt?: number
}

export type AnalyticsEventClientChatSettings = {
  settingType?: AnalyticsEventClientChatSettingsChatSettingType
  value?: string
  chatId?: string
}

export type AnalyticsEventClientSignupCookiesConsentLoaded = {
  isShown?: boolean
}

export type AnalyticsEventClientSignupCookiesConsentActioned = {
  userDecision?: AnalyticsEventClientSignupCookiesConsentActionedUserDecision
}

export type AnalyticsEventClientStreamPlayback = {
  isIntentionallyMutedPlayback?: boolean
  wasAutoUnmuteSuccessful?: boolean
  wasVideoAutoplaySuccessful?: boolean
}

export type AnalyticsEventClientMatchEndResultsDialogShown = {
}

export type AnalyticsEventClientMatchEndResultsSummaryDetailsClicked = {
}

export type AnalyticsEventClientMatchEndResultsSummaryCloseClicked = {
}

export type AnalyticsEventClientMatchEndResultsSummaryCountdownEnded = {
}

export type AnalyticsEventClientMatchEndSequenceCompleted = {
  hideContent?: boolean
}

export type AnalyticsEventClientUpSellingDialog = {
  action?: AnalyticsEventClientUpSellingDialogUpSellingDialogActionType
  source?: AnalyticsEventClientUpSellingDialogUpSellingDialogSource
}

export type AnalyticsEventClientSignupButtonClick = {
  action?: AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType
  section?: string
}

export type AnalyticsMicroSurveyTraitType = {
  name?: string
  value?: string
}

export type AnalyticsMicroSurveyResponseType = {
  question?: string
  response?: string
}

export type AnalyticsEventClientMicroSurveyShown = {
  formId?: string
  traits?: AnalyticsMicroSurveyTraitType[]
}

export type AnalyticsEventClientMicroSurveyDismissed = {
  formId?: string
  traits?: AnalyticsMicroSurveyTraitType[]
}

export type AnalyticsEventClientMicroSurveyCompleted = {
  formId?: string
  traits?: AnalyticsMicroSurveyTraitType[]
  responses?: AnalyticsMicroSurveyResponseType[]
}

export type AnalyticsEventClientChannelListClick = {
  channelId?: string
  pathname?: string
  section?: string
  columnIndex?: number
  rowIndex?: number
  listIndex?: number
  listGameId?: string
}

export type AnalyticsEventClientRankUpDialogShown = {
  location?: AnalyticsEventClientRankUpDialogType
}

export type AnalyticsEventClientRankUpDialogRewardsCollected = {
  location?: AnalyticsEventClientRankUpDialogType
  rewardsAmount?: number
}

export type AnalyticsEventClientGuestCreationInvisibleCaptcha = {
  step?: AnalyticsEventClientGuestCreationInvisibleCaptchaGuestCreationInvisibleCaptchaStep
  durationMs?: number
}

export type AnalyticsEventClientGameViewRendered = {
  channelId?: string
  streamId?: string
  matchGroupId?: string
  isNoicePredictionsEnabled?: boolean
  isTheaterMode?: boolean
  isArenaModeCapable?: boolean
  isSoftwareRendering?: boolean
  isSmallScreen?: boolean
}

export type AnalyticsEventClientChannelPageRendered = {
  channelId?: string
  streamId?: string
  isLive?: boolean
}

export type AnalyticsEventClientStreamerCardVideoHoverPlayStarted = {
  channelId?: string
  cardId?: string
}

export type AnalyticsEventClientStreamerCardVideoHoverPlayEnded = {
  channelId?: string
  cardId?: string
}

export type AnalyticsEventClientStreamerCardVideoModalPlayStarted = {
  channelId?: string
  cardId?: string
}

export type AnalyticsEventClientStreamerCardVideoModalPlayEnded = {
  channelId?: string
  cardId?: string
}

export type AnalyticsEventClientFirstMatchStart = {
  channelId?: string
  streamId?: string
  matchGroupId?: string
}

export type AnalyticsEventKeyContentLoadedTiming = {
  duration?: number
  end?: number
}

export type AnalyticsEventKeyContentLoaded = {
  duration?: number
  endReason?: AnalyticsEventKeyContentLoadedEndReason
  timings?: {[key: string]: AnalyticsEventKeyContentLoadedTiming}
  pathname?: string
  metadata?: {[key: string]: string}
}

export type AnalyticsEventClientImplicitAccountLoginFailed = {
  error?: string
}

export type AnalyticsEventClientStreamVideoEvent = {
  eventType?: AnalyticsEventClientStreamVideoEventEventType
}

export type AnalyticsEventClientChallengeDialogOpened = {
  channelId?: string
  streamId?: string
  currentSelectedChallengeId?: string
}

export type AnalyticsEventClientChallengeDialogClosed = {
  channelId?: string
  streamId?: string
  hadChallengeSelected?: boolean
}

export type AnalyticsEventClientChallengeSelected = {
  channelId?: string
  streamId?: string
  challengeId?: string
  pickRatePercentagesPerChallenge?: {[key: string]: number}
  previousChallengeId?: string
}

export type AnalyticsEventClientReactError = {
  pathname?: string
  error?: string
}

export type AnalyticsEventClientImplicitAccountLogin = {
  step?: AnalyticsEventClientImplicitAccountLoginStep
  durationMs?: number
}

export type AnalyticsEventClientChannelOverlayShown = {
  channelId?: string
}

export type AnalyticsEventClientRoundStarted = {
  channelId?: string
  streamId?: string
  uiCountdownDurationMs?: number
  uiCountdownStartedToRoundStartedDurationMs?: number
  uiCountdownFinishedToRoundStartedDifferenceMs?: number
  currentCardId?: string
  gameId?: string
  roundNumber?: number
}

export type AnalyticsEventClientSwitchOutButtonClicked = {
  isCardSelectAvailable?: boolean
  isLocked?: boolean
  isCoolingDown?: boolean
  currentCardId?: string
  roundPhase?: Game_logicGame_logic.StreamStateRoundPhase
  isRoundBasedGame?: boolean
  gameId?: string
}

export type AnalyticsEventClientEmptyCardClicked = {
  isCardSelectAvailable?: boolean
  isSwitchOutLocked?: boolean
  isSwitchOutCoolingDown?: boolean
  roundPhase?: Game_logicGame_logic.StreamStateRoundPhase
  isRoundBasedGame?: boolean
  gameId?: string
}

export type AnalyticsEventClientAppStateChanged = {
  appState?: AnalyticsEventClientAppStateChangedAppState
}

export type AnalyticsEventClientMobileAppLaunch = {
}

export type AnalyticsEventClientCardHighlightClicked = {
  cardId?: string
  isCardSelectAvailable?: boolean
  isSwitchOutLocked?: boolean
  isSwitchOutCoolingDown?: boolean
  roundPhase?: Game_logicGame_logic.StreamStateRoundPhase
  isRoundBasedGame?: boolean
  gameId?: string
}

export type AnalyticsEventClientInsufficientCredits = {
  source?: AnalyticsEventClientInsufficientCreditsSource
  currencyId?: string
  cost?: number
  balance?: number
  skus?: string[]
}

export type AnalyticsEventClientMatchStarted = {
  channelId?: string
  streamId?: string
  areChallengesEnabled?: boolean
  selectedChallengeId?: string
}

export type AnalyticsEventClientOrientationChanged = {
  orientation?: AnalyticsEventClientOrientationChangedOrientation
}

export type AnalyticsEventClientWebPushNotificationAction = {
  action?: AnalyticsEventClientWebPushNotificationActionAction
}

export type AnalyticsEventClientMobilePushNotificationAction = {
  action?: AnalyticsEventClientMobilePushNotificationActionAction
}

export type AnalyticsEventClientAvatarCosmeticsPurchaseDialog = {
  action?: AnalyticsEventClientAvatarCosmeticsPurchaseDialogAction
  name?: string
  id?: string
  price?: number
}

export type AnalyticsEventStudioSettingsChannelVisibility = {
  action?: AnalyticsEventStudioSettingsChannelVisibilityAction
  visibility?: AnalyticsEventStudioSettingsChannelVisibilityVisibility
  channelId?: string
}

export type AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialog = {
  action?: AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialogAction
  name?: string
  id?: string
  price?: number
}

export type AnalyticsEventClientSessionRefreshFailure = {
  error?: string
  tokenIssuedAt?: string
  tokenExpiresAt?: string
}

export type AnalyticsEventClientContentSearch = {
  searchTerm?: string
  action?: AnalyticsEventClientContentSearchAction
  section?: AnalyticsEventClientContentSearchSection
  resultId?: string
  resultCategory?: AnalyticsEventClientContentSearchResultCategory
}

export type AnalyticsEventClientIdleState = {
  state?: AnalyticsEventClientIdleStateState
}

export type AnalyticsEventClientSidebarChannelClick = {
  channelId?: string
  section?: string
  listIndex?: number
  sidebarMode?: string
}

export type AnalyticsEventClientCategoryListClick = {
  categoryId?: string
  pathname?: string
  columnIndex?: number
  rowIndex?: number
  listIndex?: number
}

export type AnalyticsEventClientOnboardingVideoPlay = {
  video?: string
}


type BaseAnalyticsEvent = {
  eventName?: string
  identity?: string
  sequenceId?: number
  clientTime?: string
  clientType?: ApiClient.ClientType
  batchOffsetMs?: number
  windowWidth?: number
  windowHeight?: number
  performanceNow?: number
}

export type AnalyticsEvent = BaseAnalyticsEvent
  & OneOf<{ clientNavigate: AnalyticsEventClientNavigate; clientConsoleError: AnalyticsEventClientConsoleError; clientUnhandledPromiseRejection: AnalyticsEventClientUnhandledPromiseRejection; clientJavascriptError: AnalyticsEventClientJavaScriptError; clientStorePage: AnalyticsEventClientStorePage; clientButtonClick: AnalyticsEventClientButtonClick; clientFtueDisplayed: AnalyticsEventClientFTUEDisplayed; clientCardSelectOpened: AnalyticsEventClientCardSelectOpened; clientBoosterClicked: AnalyticsEventClientBoosterClicked; clientShuffleUsed: AnalyticsEventClientShuffleUsed; clientStoreBundleClicked: AnalyticsEventClientStoreBundleClicked; clientStoreRevealAllCards: AnalyticsEventClientStoreRevealAllCards; clientStoreRevealCard: AnalyticsEventClientStoreRevealCard; clientSwitchStore: AnalyticsEventClientSwitchStore; clientAdAvailable: AnalyticsEventClientAdAvailable; clientWatchingAd: AnalyticsEventClientWatchingAd; clientSkippedAd: AnalyticsEventClientSkippedAd; clientOpenMiniProfile: AnalyticsEventClientOpenMiniProfile; clientAddFriendFormViewed: AnalyticsEventClientAddFriendFormViewed; clientToggleSeasons: AnalyticsEventClientToggleSeasons; clientCollectionCardClicked: AnalyticsEventClientCollectionCardClicked; clientToggleCollections: AnalyticsEventClientToggleCollections; clientSelectAvatar: AnalyticsEventClientSelectAvatar; clientBrowseAvatarPages: AnalyticsEventClientBrowseAvatarPages; clientViewFriends: AnalyticsEventClientViewFriends; clientFriendMenuOpened: AnalyticsEventClientFriendMenuOpened; clientDailyGoalCardSlotClicked: AnalyticsEventClientDailyGoalCardSlotClicked; clientEnvironmentCheck: AnalyticsEventClientEnvironmentCheck; clientSignupStep: AnalyticsEventClientSignupStep; clientRenderingStats: AnalyticsEventClientRenderingStats; clientMatchEndCta: AnalyticsEventMatchEndCta; clientPerformanceProfileChanged: AnalyticsEventPerformanceProfileChanged; clientStreamQualityChanged: AnalyticsEventStreamQualityChanged; clientWebrtcMetrics: AnalyticsEventWebRTCMetrics; clientInactivityKickPromptShown: AnalyticsEventClientInactivityKickPromptShown; clientBestPlaysOpened: AnalyticsEventClientBestPlaysOpened; clientSoloPlayToggle: AnalyticsEventClientSoloPlayToggle; clientTimedAdsOpened: AnalyticsEventClientTimedAdsOpened; clientTimedAdsWatchingAd: AnalyticsEventClientTimedAdsWatchingAd; clientTimedAdsRewardsClaimed: AnalyticsEventClientTimedAdsRewardsClaimed; clientTimedAdsClosed: AnalyticsEventClientTimedAdsClosed; clientFirstPageLoad: AnalyticsEventClientFirstPageLoad; studioWidgets: AnalyticsEventStudioWidget; clientAvatarEditorSaveStarted: AnalyticsEventClientAvatarEditorSaveStarted; clientAvatarEditorSaveCompleted: AnalyticsEventClientAvatarEditorSaveCompleted; clientAvatarSelectorAvatarViewed: AnalyticsEventClientAvatarSelectorAvatarViewed; clientAvatarSelectorAvatarSelected: AnalyticsEventClientAvatarSelectorAvatarSelected; clientSpotlightsEmoteClicked: AnalyticsEventClientSpotlightsEmoteClicked; clientStreamConnectionRetry: AnalyticsEventClientStreamConnectionRetry; clientStreamConnectionMediaStream: AnalyticsEventClientStreamConnectionMediaStream; clientLoadFinished: AnalyticsEventClientLoadFinished; clientStreamConnectionWatch: AnalyticsEventClientStreamConnectionWatch; clientStoreItemClicked: AnalyticsEventClientStoreItemClicked; studioChannelArenaChanged: AnalyticsEventStudioChannelArenaChanged; clientAvatarEditorOpened: AnalyticsEventClientAvatarEditorOpened; clientAvatarEditorClosed: AnalyticsEventClientAvatarEditorClosed; clientAvatarEditorItemSelected: AnalyticsEventClientAvatarEditorItemSelected; clientChatSettings: AnalyticsEventClientChatSettings; clientAvatarEmoteClicked: AnalyticsEventClientAvatarEmoteClicked; clientAvatarEmojiClicked: AnalyticsEventClientAvatarEmojiClicked; clientCardSelectCanceled: AnalyticsEventClientCardSelectCanceled; clientAvatarEditorColorCustomisationSelected: AnalyticsEventClientAvatarEditorColorCustomisationSelected; clientSignupCookiesConsentLoaded: AnalyticsEventClientSignupCookiesConsentLoaded; clientSignupCookiesConsentActioned: AnalyticsEventClientSignupCookiesConsentActioned; clientStreamPlayback: AnalyticsEventClientStreamPlayback; clientUpSellingDialog: AnalyticsEventClientUpSellingDialog; clientMatchEndSequenceCompleted: AnalyticsEventClientMatchEndSequenceCompleted; clientSignupButtonClick: AnalyticsEventClientSignupButtonClick; clientMicroSurveyShown: AnalyticsEventClientMicroSurveyShown; clientMicroSurveyDismissed: AnalyticsEventClientMicroSurveyDismissed; clientMicroSurveyCompleted: AnalyticsEventClientMicroSurveyCompleted; clientChannelListClick: AnalyticsEventClientChannelListClick; clientRankUpDialogShown: AnalyticsEventClientRankUpDialogShown; clientRankUpDialogRewardsCollected: AnalyticsEventClientRankUpDialogRewardsCollected; clientGuestCreationInvisibleCaptcha: AnalyticsEventClientGuestCreationInvisibleCaptcha; clientWebrtcMetricsSample: AnalyticsEventWebRTCMetricsSample; clientWebrtcMetricsTotal: AnalyticsEventWebRTCMetricsTotal; clientGameViewRendered: AnalyticsEventClientGameViewRendered; clientChannelPageRendered: AnalyticsEventClientChannelPageRendered; clientStreamerCardVideoHoverPlayStarted: AnalyticsEventClientStreamerCardVideoHoverPlayStarted; clientStreamerCardVideoHoverPlayEnded: AnalyticsEventClientStreamerCardVideoHoverPlayEnded; clientStreamerCardVideoModalPlayStarted: AnalyticsEventClientStreamerCardVideoModalPlayStarted; clientStreamerCardVideoModalPlayEnded: AnalyticsEventClientStreamerCardVideoModalPlayEnded; clientFirstMatchStart: AnalyticsEventClientFirstMatchStart; keyContentLoaded: AnalyticsEventKeyContentLoaded; clientImplicitAccountLoginFailed: AnalyticsEventClientImplicitAccountLoginFailed; clientStreamVideoEvent: AnalyticsEventClientStreamVideoEvent; clientChallengeDialogOpened: AnalyticsEventClientChallengeDialogOpened; clientChallengeDialogClosed: AnalyticsEventClientChallengeDialogClosed; clientChallengeSelected: AnalyticsEventClientChallengeSelected; clientReactError: AnalyticsEventClientReactError; clientImplicitAccountLogin: AnalyticsEventClientImplicitAccountLogin; clientChannelOverlayShown: AnalyticsEventClientChannelOverlayShown; clientRoundStarted: AnalyticsEventClientRoundStarted; clientSwitchOutButtonClicked: AnalyticsEventClientSwitchOutButtonClicked; clientEmptyCardClicked: AnalyticsEventClientEmptyCardClicked; clientAppStateChanged: AnalyticsEventClientAppStateChanged; clientMobileAppLaunch: AnalyticsEventClientMobileAppLaunch; clientCardHighlightClicked: AnalyticsEventClientCardHighlightClicked; clientStudioWidgetActivityFeedFilter: AnalyticsEventStudioActivityFeedFilters; clientInsufficientCredits: AnalyticsEventClientInsufficientCredits; clientMatchStarted: AnalyticsEventClientMatchStarted; clientOrientationChanged: AnalyticsEventClientOrientationChanged; clientWebPushNotificationAction: AnalyticsEventClientWebPushNotificationAction; clientWebMobileAppBannerAction: AnalyticsEventClientWebMobileAppBannerAction; clientAvatarCosmeticsPurchaseDialog: AnalyticsEventClientAvatarCosmeticsPurchaseDialog; streamAlertLoading: AnalyticsEventStreamAlertLoading; streamAlertShown: AnalyticsEventStreamAlertShown; streamAlertItemShown: AnalyticsEventStreamAlertItemShown; streamAlertApolloError: AnalyticsEventStreamAlertApolloError; clientStudioWidgetAudienceInsightsFilter: AnalyticsEventStudioAudienceInsightsFilters; clientStoreAvatarCosmeticsPurchaseDialog: AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialog; studioSettingsChannelVisibility: AnalyticsEventStudioSettingsChannelVisibility; clientStudioWidgetActions: AnalyticsEventStudioWidgetActions; clientMobilePushNotificationAction: AnalyticsEventClientMobilePushNotificationAction; clientSessionRefreshFailure: AnalyticsEventClientSessionRefreshFailure; clientContentSearch: AnalyticsEventClientContentSearch; clientIdleState: AnalyticsEventClientIdleState; clientSidebarChannelClick: AnalyticsEventClientSidebarChannelClick; clientCategoryListClick: AnalyticsEventClientCategoryListClick; clientMatchEndResultsDialogShown: AnalyticsEventClientMatchEndResultsDialogShown; clientMatchEndResultsSummaryDetailsClicked: AnalyticsEventClientMatchEndResultsSummaryDetailsClicked; clientMatchEndResultsSummaryCountdownEnded: AnalyticsEventClientMatchEndResultsSummaryCountdownEnded; clientMatchEndResultsSummaryCloseClicked: AnalyticsEventClientMatchEndResultsSummaryCloseClicked; clientAnchorClick: AnalyticsEventClientAnchorClick; clientOnboardingVideoPlay: AnalyticsEventClientOnboardingVideoPlay }>

export type IdentityMappingEvent = {
  identity?: string
  userIdentity?: string
}

export type SendAnalyticsRequest = {
  events?: AnalyticsEvent[]
}

export type SetIdentityRequest = {
  identity?: string
  userIdentity?: string
}

export type SendAnalyticsResponse = {
}

export type SetIdentityResponse = {
}




export interface IAnalyticsEventClientStoreItemClickedItemDelegate<C> {
  onBundle(ctx: C, ev: Bundle): void
  onCard(ctx: C, ev: Game_logicGame_logic.StreamerCard): void
}

export function routeAnalyticsEventClientStoreItemClickedItemDelegate<C>(ctx: C, val: AnalyticsEventClientStoreItemClicked, delegate: IAnalyticsEventClientStoreItemClickedItemDelegate<C>) {
  val?.bundle && delegate.onBundle(ctx, val.bundle)
  val?.card && delegate.onCard(ctx, val.card)
}




export interface IAnalyticsEventStreamAlertItemShownDataDelegate<C> {
  onTopPrediction(ctx: C, ev: MatchMatch.CardCount): void
  onHighScoringCard(ctx: C, ev: Game_logicGame_logic.HighScoringCardPromotedMsg): void
  onChannelEvent(ctx: C, ev: StreamerStreamer.ChannelActivityEvent): void
}

export function routeAnalyticsEventStreamAlertItemShownDataDelegate<C>(ctx: C, val: AnalyticsEventStreamAlertItemShown, delegate: IAnalyticsEventStreamAlertItemShownDataDelegate<C>) {
  val?.topPrediction && delegate.onTopPrediction(ctx, val.topPrediction)
  val?.highScoringCard && delegate.onHighScoringCard(ctx, val.highScoringCard)
  val?.channelEvent && delegate.onChannelEvent(ctx, val.channelEvent)
}




export interface IAnalyticsEventEventDelegate<C> {
  onClientNavigate(ctx: C, ev: AnalyticsEventClientNavigate): void
  onClientConsoleError(ctx: C, ev: AnalyticsEventClientConsoleError): void
  onClientUnhandledPromiseRejection(ctx: C, ev: AnalyticsEventClientUnhandledPromiseRejection): void
  onClientJavascriptError(ctx: C, ev: AnalyticsEventClientJavaScriptError): void
  onClientStorePage(ctx: C, ev: AnalyticsEventClientStorePage): void
  onClientButtonClick(ctx: C, ev: AnalyticsEventClientButtonClick): void
  onClientFtueDisplayed(ctx: C, ev: AnalyticsEventClientFTUEDisplayed): void
  onClientCardSelectOpened(ctx: C, ev: AnalyticsEventClientCardSelectOpened): void
  onClientBoosterClicked(ctx: C, ev: AnalyticsEventClientBoosterClicked): void
  onClientShuffleUsed(ctx: C, ev: AnalyticsEventClientShuffleUsed): void
  onClientStoreBundleClicked(ctx: C, ev: AnalyticsEventClientStoreBundleClicked): void
  onClientStoreRevealAllCards(ctx: C, ev: AnalyticsEventClientStoreRevealAllCards): void
  onClientStoreRevealCard(ctx: C, ev: AnalyticsEventClientStoreRevealCard): void
  onClientSwitchStore(ctx: C, ev: AnalyticsEventClientSwitchStore): void
  onClientAdAvailable(ctx: C, ev: AnalyticsEventClientAdAvailable): void
  onClientWatchingAd(ctx: C, ev: AnalyticsEventClientWatchingAd): void
  onClientSkippedAd(ctx: C, ev: AnalyticsEventClientSkippedAd): void
  onClientOpenMiniProfile(ctx: C, ev: AnalyticsEventClientOpenMiniProfile): void
  onClientAddFriendFormViewed(ctx: C, ev: AnalyticsEventClientAddFriendFormViewed): void
  onClientToggleSeasons(ctx: C, ev: AnalyticsEventClientToggleSeasons): void
  onClientCollectionCardClicked(ctx: C, ev: AnalyticsEventClientCollectionCardClicked): void
  onClientToggleCollections(ctx: C, ev: AnalyticsEventClientToggleCollections): void
  onClientSelectAvatar(ctx: C, ev: AnalyticsEventClientSelectAvatar): void
  onClientBrowseAvatarPages(ctx: C, ev: AnalyticsEventClientBrowseAvatarPages): void
  onClientViewFriends(ctx: C, ev: AnalyticsEventClientViewFriends): void
  onClientFriendMenuOpened(ctx: C, ev: AnalyticsEventClientFriendMenuOpened): void
  onClientDailyGoalCardSlotClicked(ctx: C, ev: AnalyticsEventClientDailyGoalCardSlotClicked): void
  onClientEnvironmentCheck(ctx: C, ev: AnalyticsEventClientEnvironmentCheck): void
  onClientSignupStep(ctx: C, ev: AnalyticsEventClientSignupStep): void
  onClientRenderingStats(ctx: C, ev: AnalyticsEventClientRenderingStats): void
  onClientMatchEndCta(ctx: C, ev: AnalyticsEventMatchEndCta): void
  onClientPerformanceProfileChanged(ctx: C, ev: AnalyticsEventPerformanceProfileChanged): void
  onClientStreamQualityChanged(ctx: C, ev: AnalyticsEventStreamQualityChanged): void
  onClientWebrtcMetrics(ctx: C, ev: AnalyticsEventWebRTCMetrics): void
  onClientInactivityKickPromptShown(ctx: C, ev: AnalyticsEventClientInactivityKickPromptShown): void
  onClientBestPlaysOpened(ctx: C, ev: AnalyticsEventClientBestPlaysOpened): void
  onClientSoloPlayToggle(ctx: C, ev: AnalyticsEventClientSoloPlayToggle): void
  onClientTimedAdsOpened(ctx: C, ev: AnalyticsEventClientTimedAdsOpened): void
  onClientTimedAdsWatchingAd(ctx: C, ev: AnalyticsEventClientTimedAdsWatchingAd): void
  onClientTimedAdsRewardsClaimed(ctx: C, ev: AnalyticsEventClientTimedAdsRewardsClaimed): void
  onClientTimedAdsClosed(ctx: C, ev: AnalyticsEventClientTimedAdsClosed): void
  onClientFirstPageLoad(ctx: C, ev: AnalyticsEventClientFirstPageLoad): void
  onStudioWidgets(ctx: C, ev: AnalyticsEventStudioWidget): void
  onClientAvatarEditorSaveStarted(ctx: C, ev: AnalyticsEventClientAvatarEditorSaveStarted): void
  onClientAvatarEditorSaveCompleted(ctx: C, ev: AnalyticsEventClientAvatarEditorSaveCompleted): void
  onClientAvatarSelectorAvatarViewed(ctx: C, ev: AnalyticsEventClientAvatarSelectorAvatarViewed): void
  onClientAvatarSelectorAvatarSelected(ctx: C, ev: AnalyticsEventClientAvatarSelectorAvatarSelected): void
  onClientSpotlightsEmoteClicked(ctx: C, ev: AnalyticsEventClientSpotlightsEmoteClicked): void
  onClientStreamConnectionRetry(ctx: C, ev: AnalyticsEventClientStreamConnectionRetry): void
  onClientStreamConnectionMediaStream(ctx: C, ev: AnalyticsEventClientStreamConnectionMediaStream): void
  onClientLoadFinished(ctx: C, ev: AnalyticsEventClientLoadFinished): void
  onClientStreamConnectionWatch(ctx: C, ev: AnalyticsEventClientStreamConnectionWatch): void
  onClientStoreItemClicked(ctx: C, ev: AnalyticsEventClientStoreItemClicked): void
  onStudioChannelArenaChanged(ctx: C, ev: AnalyticsEventStudioChannelArenaChanged): void
  onClientAvatarEditorOpened(ctx: C, ev: AnalyticsEventClientAvatarEditorOpened): void
  onClientAvatarEditorClosed(ctx: C, ev: AnalyticsEventClientAvatarEditorClosed): void
  onClientAvatarEditorItemSelected(ctx: C, ev: AnalyticsEventClientAvatarEditorItemSelected): void
  onClientChatSettings(ctx: C, ev: AnalyticsEventClientChatSettings): void
  onClientAvatarEmoteClicked(ctx: C, ev: AnalyticsEventClientAvatarEmoteClicked): void
  onClientAvatarEmojiClicked(ctx: C, ev: AnalyticsEventClientAvatarEmojiClicked): void
  onClientCardSelectCanceled(ctx: C, ev: AnalyticsEventClientCardSelectCanceled): void
  onClientAvatarEditorColorCustomisationSelected(ctx: C, ev: AnalyticsEventClientAvatarEditorColorCustomisationSelected): void
  onClientSignupCookiesConsentLoaded(ctx: C, ev: AnalyticsEventClientSignupCookiesConsentLoaded): void
  onClientSignupCookiesConsentActioned(ctx: C, ev: AnalyticsEventClientSignupCookiesConsentActioned): void
  onClientStreamPlayback(ctx: C, ev: AnalyticsEventClientStreamPlayback): void
  onClientUpSellingDialog(ctx: C, ev: AnalyticsEventClientUpSellingDialog): void
  onClientMatchEndSequenceCompleted(ctx: C, ev: AnalyticsEventClientMatchEndSequenceCompleted): void
  onClientSignupButtonClick(ctx: C, ev: AnalyticsEventClientSignupButtonClick): void
  onClientMicroSurveyShown(ctx: C, ev: AnalyticsEventClientMicroSurveyShown): void
  onClientMicroSurveyDismissed(ctx: C, ev: AnalyticsEventClientMicroSurveyDismissed): void
  onClientMicroSurveyCompleted(ctx: C, ev: AnalyticsEventClientMicroSurveyCompleted): void
  onClientChannelListClick(ctx: C, ev: AnalyticsEventClientChannelListClick): void
  onClientRankUpDialogShown(ctx: C, ev: AnalyticsEventClientRankUpDialogShown): void
  onClientRankUpDialogRewardsCollected(ctx: C, ev: AnalyticsEventClientRankUpDialogRewardsCollected): void
  onClientGuestCreationInvisibleCaptcha(ctx: C, ev: AnalyticsEventClientGuestCreationInvisibleCaptcha): void
  onClientWebrtcMetricsSample(ctx: C, ev: AnalyticsEventWebRTCMetricsSample): void
  onClientWebrtcMetricsTotal(ctx: C, ev: AnalyticsEventWebRTCMetricsTotal): void
  onClientGameViewRendered(ctx: C, ev: AnalyticsEventClientGameViewRendered): void
  onClientChannelPageRendered(ctx: C, ev: AnalyticsEventClientChannelPageRendered): void
  onClientStreamerCardVideoHoverPlayStarted(ctx: C, ev: AnalyticsEventClientStreamerCardVideoHoverPlayStarted): void
  onClientStreamerCardVideoHoverPlayEnded(ctx: C, ev: AnalyticsEventClientStreamerCardVideoHoverPlayEnded): void
  onClientStreamerCardVideoModalPlayStarted(ctx: C, ev: AnalyticsEventClientStreamerCardVideoModalPlayStarted): void
  onClientStreamerCardVideoModalPlayEnded(ctx: C, ev: AnalyticsEventClientStreamerCardVideoModalPlayEnded): void
  onClientFirstMatchStart(ctx: C, ev: AnalyticsEventClientFirstMatchStart): void
  onKeyContentLoaded(ctx: C, ev: AnalyticsEventKeyContentLoaded): void
  onClientImplicitAccountLoginFailed(ctx: C, ev: AnalyticsEventClientImplicitAccountLoginFailed): void
  onClientStreamVideoEvent(ctx: C, ev: AnalyticsEventClientStreamVideoEvent): void
  onClientChallengeDialogOpened(ctx: C, ev: AnalyticsEventClientChallengeDialogOpened): void
  onClientChallengeDialogClosed(ctx: C, ev: AnalyticsEventClientChallengeDialogClosed): void
  onClientChallengeSelected(ctx: C, ev: AnalyticsEventClientChallengeSelected): void
  onClientReactError(ctx: C, ev: AnalyticsEventClientReactError): void
  onClientImplicitAccountLogin(ctx: C, ev: AnalyticsEventClientImplicitAccountLogin): void
  onClientChannelOverlayShown(ctx: C, ev: AnalyticsEventClientChannelOverlayShown): void
  onClientRoundStarted(ctx: C, ev: AnalyticsEventClientRoundStarted): void
  onClientSwitchOutButtonClicked(ctx: C, ev: AnalyticsEventClientSwitchOutButtonClicked): void
  onClientEmptyCardClicked(ctx: C, ev: AnalyticsEventClientEmptyCardClicked): void
  onClientAppStateChanged(ctx: C, ev: AnalyticsEventClientAppStateChanged): void
  onClientMobileAppLaunch(ctx: C, ev: AnalyticsEventClientMobileAppLaunch): void
  onClientCardHighlightClicked(ctx: C, ev: AnalyticsEventClientCardHighlightClicked): void
  onClientStudioWidgetActivityFeedFilter(ctx: C, ev: AnalyticsEventStudioActivityFeedFilters): void
  onClientInsufficientCredits(ctx: C, ev: AnalyticsEventClientInsufficientCredits): void
  onClientMatchStarted(ctx: C, ev: AnalyticsEventClientMatchStarted): void
  onClientOrientationChanged(ctx: C, ev: AnalyticsEventClientOrientationChanged): void
  onClientWebPushNotificationAction(ctx: C, ev: AnalyticsEventClientWebPushNotificationAction): void
  onClientWebMobileAppBannerAction(ctx: C, ev: AnalyticsEventClientWebMobileAppBannerAction): void
  onClientAvatarCosmeticsPurchaseDialog(ctx: C, ev: AnalyticsEventClientAvatarCosmeticsPurchaseDialog): void
  onStreamAlertLoading(ctx: C, ev: AnalyticsEventStreamAlertLoading): void
  onStreamAlertShown(ctx: C, ev: AnalyticsEventStreamAlertShown): void
  onStreamAlertItemShown(ctx: C, ev: AnalyticsEventStreamAlertItemShown): void
  onStreamAlertApolloError(ctx: C, ev: AnalyticsEventStreamAlertApolloError): void
  onClientStudioWidgetAudienceInsightsFilter(ctx: C, ev: AnalyticsEventStudioAudienceInsightsFilters): void
  onClientStoreAvatarCosmeticsPurchaseDialog(ctx: C, ev: AnalyticsEventClientStoreAvatarCosmeticsPurchaseDialog): void
  onStudioSettingsChannelVisibility(ctx: C, ev: AnalyticsEventStudioSettingsChannelVisibility): void
  onClientStudioWidgetActions(ctx: C, ev: AnalyticsEventStudioWidgetActions): void
  onClientMobilePushNotificationAction(ctx: C, ev: AnalyticsEventClientMobilePushNotificationAction): void
  onClientSessionRefreshFailure(ctx: C, ev: AnalyticsEventClientSessionRefreshFailure): void
  onClientContentSearch(ctx: C, ev: AnalyticsEventClientContentSearch): void
  onClientIdleState(ctx: C, ev: AnalyticsEventClientIdleState): void
  onClientSidebarChannelClick(ctx: C, ev: AnalyticsEventClientSidebarChannelClick): void
  onClientCategoryListClick(ctx: C, ev: AnalyticsEventClientCategoryListClick): void
  onClientMatchEndResultsDialogShown(ctx: C, ev: AnalyticsEventClientMatchEndResultsDialogShown): void
  onClientMatchEndResultsSummaryDetailsClicked(ctx: C, ev: AnalyticsEventClientMatchEndResultsSummaryDetailsClicked): void
  onClientMatchEndResultsSummaryCountdownEnded(ctx: C, ev: AnalyticsEventClientMatchEndResultsSummaryCountdownEnded): void
  onClientMatchEndResultsSummaryCloseClicked(ctx: C, ev: AnalyticsEventClientMatchEndResultsSummaryCloseClicked): void
  onClientAnchorClick(ctx: C, ev: AnalyticsEventClientAnchorClick): void
  onClientOnboardingVideoPlay(ctx: C, ev: AnalyticsEventClientOnboardingVideoPlay): void
}

export function routeAnalyticsEventEventDelegate<C>(ctx: C, val: AnalyticsEvent, delegate: IAnalyticsEventEventDelegate<C>) {
  val?.clientNavigate && delegate.onClientNavigate(ctx, val.clientNavigate)
  val?.clientConsoleError && delegate.onClientConsoleError(ctx, val.clientConsoleError)
  val?.clientUnhandledPromiseRejection && delegate.onClientUnhandledPromiseRejection(ctx, val.clientUnhandledPromiseRejection)
  val?.clientJavascriptError && delegate.onClientJavascriptError(ctx, val.clientJavascriptError)
  val?.clientStorePage && delegate.onClientStorePage(ctx, val.clientStorePage)
  val?.clientButtonClick && delegate.onClientButtonClick(ctx, val.clientButtonClick)
  val?.clientFtueDisplayed && delegate.onClientFtueDisplayed(ctx, val.clientFtueDisplayed)
  val?.clientCardSelectOpened && delegate.onClientCardSelectOpened(ctx, val.clientCardSelectOpened)
  val?.clientBoosterClicked && delegate.onClientBoosterClicked(ctx, val.clientBoosterClicked)
  val?.clientShuffleUsed && delegate.onClientShuffleUsed(ctx, val.clientShuffleUsed)
  val?.clientStoreBundleClicked && delegate.onClientStoreBundleClicked(ctx, val.clientStoreBundleClicked)
  val?.clientStoreRevealAllCards && delegate.onClientStoreRevealAllCards(ctx, val.clientStoreRevealAllCards)
  val?.clientStoreRevealCard && delegate.onClientStoreRevealCard(ctx, val.clientStoreRevealCard)
  val?.clientSwitchStore && delegate.onClientSwitchStore(ctx, val.clientSwitchStore)
  val?.clientAdAvailable && delegate.onClientAdAvailable(ctx, val.clientAdAvailable)
  val?.clientWatchingAd && delegate.onClientWatchingAd(ctx, val.clientWatchingAd)
  val?.clientSkippedAd && delegate.onClientSkippedAd(ctx, val.clientSkippedAd)
  val?.clientOpenMiniProfile && delegate.onClientOpenMiniProfile(ctx, val.clientOpenMiniProfile)
  val?.clientAddFriendFormViewed && delegate.onClientAddFriendFormViewed(ctx, val.clientAddFriendFormViewed)
  val?.clientToggleSeasons && delegate.onClientToggleSeasons(ctx, val.clientToggleSeasons)
  val?.clientCollectionCardClicked && delegate.onClientCollectionCardClicked(ctx, val.clientCollectionCardClicked)
  val?.clientToggleCollections && delegate.onClientToggleCollections(ctx, val.clientToggleCollections)
  val?.clientSelectAvatar && delegate.onClientSelectAvatar(ctx, val.clientSelectAvatar)
  val?.clientBrowseAvatarPages && delegate.onClientBrowseAvatarPages(ctx, val.clientBrowseAvatarPages)
  val?.clientViewFriends && delegate.onClientViewFriends(ctx, val.clientViewFriends)
  val?.clientFriendMenuOpened && delegate.onClientFriendMenuOpened(ctx, val.clientFriendMenuOpened)
  val?.clientDailyGoalCardSlotClicked && delegate.onClientDailyGoalCardSlotClicked(ctx, val.clientDailyGoalCardSlotClicked)
  val?.clientEnvironmentCheck && delegate.onClientEnvironmentCheck(ctx, val.clientEnvironmentCheck)
  val?.clientSignupStep && delegate.onClientSignupStep(ctx, val.clientSignupStep)
  val?.clientRenderingStats && delegate.onClientRenderingStats(ctx, val.clientRenderingStats)
  val?.clientMatchEndCta && delegate.onClientMatchEndCta(ctx, val.clientMatchEndCta)
  val?.clientPerformanceProfileChanged && delegate.onClientPerformanceProfileChanged(ctx, val.clientPerformanceProfileChanged)
  val?.clientStreamQualityChanged && delegate.onClientStreamQualityChanged(ctx, val.clientStreamQualityChanged)
  val?.clientWebrtcMetrics && delegate.onClientWebrtcMetrics(ctx, val.clientWebrtcMetrics)
  val?.clientInactivityKickPromptShown && delegate.onClientInactivityKickPromptShown(ctx, val.clientInactivityKickPromptShown)
  val?.clientBestPlaysOpened && delegate.onClientBestPlaysOpened(ctx, val.clientBestPlaysOpened)
  val?.clientSoloPlayToggle && delegate.onClientSoloPlayToggle(ctx, val.clientSoloPlayToggle)
  val?.clientTimedAdsOpened && delegate.onClientTimedAdsOpened(ctx, val.clientTimedAdsOpened)
  val?.clientTimedAdsWatchingAd && delegate.onClientTimedAdsWatchingAd(ctx, val.clientTimedAdsWatchingAd)
  val?.clientTimedAdsRewardsClaimed && delegate.onClientTimedAdsRewardsClaimed(ctx, val.clientTimedAdsRewardsClaimed)
  val?.clientTimedAdsClosed && delegate.onClientTimedAdsClosed(ctx, val.clientTimedAdsClosed)
  val?.clientFirstPageLoad && delegate.onClientFirstPageLoad(ctx, val.clientFirstPageLoad)
  val?.studioWidgets && delegate.onStudioWidgets(ctx, val.studioWidgets)
  val?.clientAvatarEditorSaveStarted && delegate.onClientAvatarEditorSaveStarted(ctx, val.clientAvatarEditorSaveStarted)
  val?.clientAvatarEditorSaveCompleted && delegate.onClientAvatarEditorSaveCompleted(ctx, val.clientAvatarEditorSaveCompleted)
  val?.clientAvatarSelectorAvatarViewed && delegate.onClientAvatarSelectorAvatarViewed(ctx, val.clientAvatarSelectorAvatarViewed)
  val?.clientAvatarSelectorAvatarSelected && delegate.onClientAvatarSelectorAvatarSelected(ctx, val.clientAvatarSelectorAvatarSelected)
  val?.clientSpotlightsEmoteClicked && delegate.onClientSpotlightsEmoteClicked(ctx, val.clientSpotlightsEmoteClicked)
  val?.clientStreamConnectionRetry && delegate.onClientStreamConnectionRetry(ctx, val.clientStreamConnectionRetry)
  val?.clientStreamConnectionMediaStream && delegate.onClientStreamConnectionMediaStream(ctx, val.clientStreamConnectionMediaStream)
  val?.clientLoadFinished && delegate.onClientLoadFinished(ctx, val.clientLoadFinished)
  val?.clientStreamConnectionWatch && delegate.onClientStreamConnectionWatch(ctx, val.clientStreamConnectionWatch)
  val?.clientStoreItemClicked && delegate.onClientStoreItemClicked(ctx, val.clientStoreItemClicked)
  val?.studioChannelArenaChanged && delegate.onStudioChannelArenaChanged(ctx, val.studioChannelArenaChanged)
  val?.clientAvatarEditorOpened && delegate.onClientAvatarEditorOpened(ctx, val.clientAvatarEditorOpened)
  val?.clientAvatarEditorClosed && delegate.onClientAvatarEditorClosed(ctx, val.clientAvatarEditorClosed)
  val?.clientAvatarEditorItemSelected && delegate.onClientAvatarEditorItemSelected(ctx, val.clientAvatarEditorItemSelected)
  val?.clientChatSettings && delegate.onClientChatSettings(ctx, val.clientChatSettings)
  val?.clientAvatarEmoteClicked && delegate.onClientAvatarEmoteClicked(ctx, val.clientAvatarEmoteClicked)
  val?.clientAvatarEmojiClicked && delegate.onClientAvatarEmojiClicked(ctx, val.clientAvatarEmojiClicked)
  val?.clientCardSelectCanceled && delegate.onClientCardSelectCanceled(ctx, val.clientCardSelectCanceled)
  val?.clientAvatarEditorColorCustomisationSelected && delegate.onClientAvatarEditorColorCustomisationSelected(ctx, val.clientAvatarEditorColorCustomisationSelected)
  val?.clientSignupCookiesConsentLoaded && delegate.onClientSignupCookiesConsentLoaded(ctx, val.clientSignupCookiesConsentLoaded)
  val?.clientSignupCookiesConsentActioned && delegate.onClientSignupCookiesConsentActioned(ctx, val.clientSignupCookiesConsentActioned)
  val?.clientStreamPlayback && delegate.onClientStreamPlayback(ctx, val.clientStreamPlayback)
  val?.clientUpSellingDialog && delegate.onClientUpSellingDialog(ctx, val.clientUpSellingDialog)
  val?.clientMatchEndSequenceCompleted && delegate.onClientMatchEndSequenceCompleted(ctx, val.clientMatchEndSequenceCompleted)
  val?.clientSignupButtonClick && delegate.onClientSignupButtonClick(ctx, val.clientSignupButtonClick)
  val?.clientMicroSurveyShown && delegate.onClientMicroSurveyShown(ctx, val.clientMicroSurveyShown)
  val?.clientMicroSurveyDismissed && delegate.onClientMicroSurveyDismissed(ctx, val.clientMicroSurveyDismissed)
  val?.clientMicroSurveyCompleted && delegate.onClientMicroSurveyCompleted(ctx, val.clientMicroSurveyCompleted)
  val?.clientChannelListClick && delegate.onClientChannelListClick(ctx, val.clientChannelListClick)
  val?.clientRankUpDialogShown && delegate.onClientRankUpDialogShown(ctx, val.clientRankUpDialogShown)
  val?.clientRankUpDialogRewardsCollected && delegate.onClientRankUpDialogRewardsCollected(ctx, val.clientRankUpDialogRewardsCollected)
  val?.clientGuestCreationInvisibleCaptcha && delegate.onClientGuestCreationInvisibleCaptcha(ctx, val.clientGuestCreationInvisibleCaptcha)
  val?.clientWebrtcMetricsSample && delegate.onClientWebrtcMetricsSample(ctx, val.clientWebrtcMetricsSample)
  val?.clientWebrtcMetricsTotal && delegate.onClientWebrtcMetricsTotal(ctx, val.clientWebrtcMetricsTotal)
  val?.clientGameViewRendered && delegate.onClientGameViewRendered(ctx, val.clientGameViewRendered)
  val?.clientChannelPageRendered && delegate.onClientChannelPageRendered(ctx, val.clientChannelPageRendered)
  val?.clientStreamerCardVideoHoverPlayStarted && delegate.onClientStreamerCardVideoHoverPlayStarted(ctx, val.clientStreamerCardVideoHoverPlayStarted)
  val?.clientStreamerCardVideoHoverPlayEnded && delegate.onClientStreamerCardVideoHoverPlayEnded(ctx, val.clientStreamerCardVideoHoverPlayEnded)
  val?.clientStreamerCardVideoModalPlayStarted && delegate.onClientStreamerCardVideoModalPlayStarted(ctx, val.clientStreamerCardVideoModalPlayStarted)
  val?.clientStreamerCardVideoModalPlayEnded && delegate.onClientStreamerCardVideoModalPlayEnded(ctx, val.clientStreamerCardVideoModalPlayEnded)
  val?.clientFirstMatchStart && delegate.onClientFirstMatchStart(ctx, val.clientFirstMatchStart)
  val?.keyContentLoaded && delegate.onKeyContentLoaded(ctx, val.keyContentLoaded)
  val?.clientImplicitAccountLoginFailed && delegate.onClientImplicitAccountLoginFailed(ctx, val.clientImplicitAccountLoginFailed)
  val?.clientStreamVideoEvent && delegate.onClientStreamVideoEvent(ctx, val.clientStreamVideoEvent)
  val?.clientChallengeDialogOpened && delegate.onClientChallengeDialogOpened(ctx, val.clientChallengeDialogOpened)
  val?.clientChallengeDialogClosed && delegate.onClientChallengeDialogClosed(ctx, val.clientChallengeDialogClosed)
  val?.clientChallengeSelected && delegate.onClientChallengeSelected(ctx, val.clientChallengeSelected)
  val?.clientReactError && delegate.onClientReactError(ctx, val.clientReactError)
  val?.clientImplicitAccountLogin && delegate.onClientImplicitAccountLogin(ctx, val.clientImplicitAccountLogin)
  val?.clientChannelOverlayShown && delegate.onClientChannelOverlayShown(ctx, val.clientChannelOverlayShown)
  val?.clientRoundStarted && delegate.onClientRoundStarted(ctx, val.clientRoundStarted)
  val?.clientSwitchOutButtonClicked && delegate.onClientSwitchOutButtonClicked(ctx, val.clientSwitchOutButtonClicked)
  val?.clientEmptyCardClicked && delegate.onClientEmptyCardClicked(ctx, val.clientEmptyCardClicked)
  val?.clientAppStateChanged && delegate.onClientAppStateChanged(ctx, val.clientAppStateChanged)
  val?.clientMobileAppLaunch && delegate.onClientMobileAppLaunch(ctx, val.clientMobileAppLaunch)
  val?.clientCardHighlightClicked && delegate.onClientCardHighlightClicked(ctx, val.clientCardHighlightClicked)
  val?.clientStudioWidgetActivityFeedFilter && delegate.onClientStudioWidgetActivityFeedFilter(ctx, val.clientStudioWidgetActivityFeedFilter)
  val?.clientInsufficientCredits && delegate.onClientInsufficientCredits(ctx, val.clientInsufficientCredits)
  val?.clientMatchStarted && delegate.onClientMatchStarted(ctx, val.clientMatchStarted)
  val?.clientOrientationChanged && delegate.onClientOrientationChanged(ctx, val.clientOrientationChanged)
  val?.clientWebPushNotificationAction && delegate.onClientWebPushNotificationAction(ctx, val.clientWebPushNotificationAction)
  val?.clientWebMobileAppBannerAction && delegate.onClientWebMobileAppBannerAction(ctx, val.clientWebMobileAppBannerAction)
  val?.clientAvatarCosmeticsPurchaseDialog && delegate.onClientAvatarCosmeticsPurchaseDialog(ctx, val.clientAvatarCosmeticsPurchaseDialog)
  val?.streamAlertLoading && delegate.onStreamAlertLoading(ctx, val.streamAlertLoading)
  val?.streamAlertShown && delegate.onStreamAlertShown(ctx, val.streamAlertShown)
  val?.streamAlertItemShown && delegate.onStreamAlertItemShown(ctx, val.streamAlertItemShown)
  val?.streamAlertApolloError && delegate.onStreamAlertApolloError(ctx, val.streamAlertApolloError)
  val?.clientStudioWidgetAudienceInsightsFilter && delegate.onClientStudioWidgetAudienceInsightsFilter(ctx, val.clientStudioWidgetAudienceInsightsFilter)
  val?.clientStoreAvatarCosmeticsPurchaseDialog && delegate.onClientStoreAvatarCosmeticsPurchaseDialog(ctx, val.clientStoreAvatarCosmeticsPurchaseDialog)
  val?.studioSettingsChannelVisibility && delegate.onStudioSettingsChannelVisibility(ctx, val.studioSettingsChannelVisibility)
  val?.clientStudioWidgetActions && delegate.onClientStudioWidgetActions(ctx, val.clientStudioWidgetActions)
  val?.clientMobilePushNotificationAction && delegate.onClientMobilePushNotificationAction(ctx, val.clientMobilePushNotificationAction)
  val?.clientSessionRefreshFailure && delegate.onClientSessionRefreshFailure(ctx, val.clientSessionRefreshFailure)
  val?.clientContentSearch && delegate.onClientContentSearch(ctx, val.clientContentSearch)
  val?.clientIdleState && delegate.onClientIdleState(ctx, val.clientIdleState)
  val?.clientSidebarChannelClick && delegate.onClientSidebarChannelClick(ctx, val.clientSidebarChannelClick)
  val?.clientCategoryListClick && delegate.onClientCategoryListClick(ctx, val.clientCategoryListClick)
  val?.clientMatchEndResultsDialogShown && delegate.onClientMatchEndResultsDialogShown(ctx, val.clientMatchEndResultsDialogShown)
  val?.clientMatchEndResultsSummaryDetailsClicked && delegate.onClientMatchEndResultsSummaryDetailsClicked(ctx, val.clientMatchEndResultsSummaryDetailsClicked)
  val?.clientMatchEndResultsSummaryCountdownEnded && delegate.onClientMatchEndResultsSummaryCountdownEnded(ctx, val.clientMatchEndResultsSummaryCountdownEnded)
  val?.clientMatchEndResultsSummaryCloseClicked && delegate.onClientMatchEndResultsSummaryCloseClicked(ctx, val.clientMatchEndResultsSummaryCloseClicked)
  val?.clientAnchorClick && delegate.onClientAnchorClick(ctx, val.clientAnchorClick)
  val?.clientOnboardingVideoPlay && delegate.onClientOnboardingVideoPlay(ctx, val.clientOnboardingVideoPlay)
}

export class AnalyticsService {
  static SendAnalytics(req: SendAnalyticsRequest, initReq?: fm.InitReq): Promise<SendAnalyticsResponse> {
    return fm.fetchReq<SendAnalyticsRequest, SendAnalyticsResponse>(`/analytics.AnalyticsService/SendAnalytics`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
  static SetIdentity(req: SetIdentityRequest, initReq?: fm.InitReq): Promise<SetIdentityResponse> {
    return fm.fetchReq<SetIdentityRequest, SetIdentityResponse>(`/analytics.AnalyticsService/SetIdentity`, {...initReq, method: "POST", body: JSON.stringify(req)})
  }
}