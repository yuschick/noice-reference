import * as AdsAds from "../ads/ads.pb";
import * as ApiClient from "../api/client.pb";
import * as AvatarAvatar from "../avatar/avatar.pb";
import * as fm from "../fetch.pb";
import * as FriendsFriends from "../friends/friends.pb";
import * as FtueFtue from "../ftue/ftue.pb";
import * as Game_logicGame_logic from "../game-logic/game_logic.pb";
import * as RarityRarity from "../rarity/rarity.pb";
import * as StoreV2Storev2 from "../store/storev2.pb";
import * as WalletWallet from "../wallet/wallet.pb";
type Absent<T, K extends keyof T> = {
    [k in Exclude<keyof T, K>]?: undefined;
};
type OneOf<T> = {
    [k in keyof T]?: undefined;
} | (keyof T extends infer K ? (K extends string & keyof T ? {
    [k in K]: T[K];
} & Absent<T, K> : never) : never);
export declare enum AnalyticsCrowdDetailType {
    ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED = "ANALYTICS_CROWD_DETAIL_TYPE_UNSPECIFIED",
    ANALYTICS_CROWD_DETAIL_TYPE_HIGH = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH",
    ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP = "ANALYTICS_CROWD_DETAIL_TYPE_HIGH_OWN_GROUP",
    ANALYTICS_CROWD_DETAIL_TYPE_LOW = "ANALYTICS_CROWD_DETAIL_TYPE_LOW"
}
export declare enum AnalyticsShadowType {
    ANALYTICS_SHADOW_TYPE_UNSPECIFIED = "ANALYTICS_SHADOW_TYPE_UNSPECIFIED",
    ANALYTICS_SHADOW_TYPE_DISABLED = "ANALYTICS_SHADOW_TYPE_DISABLED",
    ANALYTICS_SHADOW_TYPE_UNFILTERED = "ANALYTICS_SHADOW_TYPE_UNFILTERED",
    ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED = "ANALYTICS_SHADOW_TYPE_PERCENTAGE_CLOSE_FILTERED",
    ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED = "ANALYTICS_SHADOW_TYPE_SOFT_PERCENTAGE_CLOSE_FILTERED",
    ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED = "ANALYTICS_SHADOW_TYPE_VARIANCE_PREFILTERED"
}
export declare enum AnalyticsShadowQuality {
    ANALYTICS_SHADOW_QUALITY_UNSPECIFIED = "ANALYTICS_SHADOW_QUALITY_UNSPECIFIED",
    ANALYTICS_SHADOW_QUALITY_LOW = "ANALYTICS_SHADOW_QUALITY_LOW",
    ANALYTICS_SHADOW_QUALITY_MEDIUM = "ANALYTICS_SHADOW_QUALITY_MEDIUM",
    ANALYTICS_SHADOW_QUALITY_HIGH = "ANALYTICS_SHADOW_QUALITY_HIGH"
}
export declare enum AnalyticsLightingType {
    ANALYTICS_LIGHTING_TYPE_UNSPECIFIED = "ANALYTICS_LIGHTING_TYPE_UNSPECIFIED",
    ANALYTICS_LIGHTING_TYPE_FULL = "ANALYTICS_LIGHTING_TYPE_FULL",
    ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY = "ANALYTICS_LIGHTING_TYPE_HIGH_PRIORITY",
    ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY = "ANALYTICS_LIGHTING_TYPE_DIRECTIONAL_ONLY",
    ANALYTICS_LIGHTING_TYPE_NONE = "ANALYTICS_LIGHTING_TYPE_NONE"
}
export declare enum AnalyticsCrowdMode {
    ANALYTICS_CROWD_MODE_UNSPECIFIED = "ANALYTICS_CROWD_MODE_UNSPECIFIED",
    ANALYTICS_CROWD_MODE_NONE = "ANALYTICS_CROWD_MODE_NONE",
    ANALYTICS_CROWD_MODE_LOCAL_GROUP = "ANALYTICS_CROWD_MODE_LOCAL_GROUP",
    ANALYTICS_CROWD_MODE_ALL = "ANALYTICS_CROWD_MODE_ALL"
}
export declare enum AnalyticsAntiAliasingType {
    ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED = "ANALYTICS_ANTI_ALIASING_TYPE_UNSPECIFIED",
    ANALYTICS_ANTI_ALIASING_TYPE_SMAA = "ANALYTICS_ANTI_ALIASING_TYPE_SMAA",
    ANALYTICS_ANTI_ALIASING_TYPE_FXAA = "ANALYTICS_ANTI_ALIASING_TYPE_FXAA",
    ANALYTICS_ANTI_ALIASING_TYPE_NONE = "ANALYTICS_ANTI_ALIASING_TYPE_NONE"
}
export declare enum AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext {
    SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED = "SOLO_PLAY_TOGGLE_CONTEXT_UNSPECIFIED",
    SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW = "SOLO_PLAY_TOGGLE_CONTEXT_CHANNEL_FLOW",
    SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU = "SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU",
    SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK = "SOLO_PLAY_TOGGLE_CONTEXT_AFK_KICK",
    SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU = "SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU"
}
export declare enum AnalyticsEventClientShuffleUsedShuffleContext {
    SHUFFLE_CONTEXT_UNSPECIFIED = "SHUFFLE_CONTEXT_UNSPECIFIED",
    SHUFFLE_CONTEXT_GAME = "SHUFFLE_CONTEXT_GAME",
    SHUFFLE_CONTEXT_DGC = "SHUFFLE_CONTEXT_DGC"
}
export declare enum AnalyticsEventClientTimedAdsOpenedTimedAdsContext {
    TIMED_ADS_CONTEXT_UNSPECIFIED = "TIMED_ADS_CONTEXT_UNSPECIFIED",
    TIMED_ADS_CONTEXT_NAV_SIDEBAR = "TIMED_ADS_CONTEXT_NAV_SIDEBAR",
    TIMED_ADS_CONTEXT_APP_HEADER = "TIMED_ADS_CONTEXT_APP_HEADER",
    TIMED_ADS_CONTEXT_STORE = "TIMED_ADS_CONTEXT_STORE",
    TIMED_ADS_CONTEXT_MATCH_END = "TIMED_ADS_CONTEXT_MATCH_END"
}
export declare enum AnalyticsEventClientAdAvailableAdAvailableContext {
    AD_AVAILABLE_CONTEXT_UNSPECIFIED = "AD_AVAILABLE_CONTEXT_UNSPECIFIED",
    AD_AVAILABLE_CONTEXT_GAME = "AD_AVAILABLE_CONTEXT_GAME",
    AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION = "AD_AVAILABLE_CONTEXT_SIDEBAR_NAVIGATION",
    AD_AVAILABLE_CONTEXT_STORE_PAGE = "AD_AVAILABLE_CONTEXT_STORE_PAGE"
}
export declare enum AnalyticsEventClientSignupStepSignupStep {
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
    SIGNUP_STEP_AVATAR_EDITOR_COMPLETED = "SIGNUP_STEP_AVATAR_EDITOR_COMPLETED"
}
export declare enum AnalyticsEventClientSignupStepSignupMode {
    SIGNUP_MODE_UNSPECIFIED = "SIGNUP_MODE_UNSPECIFIED",
    SIGNUP_MODE_SIGNIN = "SIGNUP_MODE_SIGNIN",
    SIGNUP_MODE_SIGNUP = "SIGNUP_MODE_SIGNUP"
}
export declare enum AnalyticsEventClientRenderingStatsRendererType {
    RENDERER_TYPE_UNSPECIFIED = "RENDERER_TYPE_UNSPECIFIED",
    RENDERER_TYPE_WEBGL = "RENDERER_TYPE_WEBGL",
    RENDERER_TYPE_VIDEO = "RENDERER_TYPE_VIDEO"
}
export declare enum AnalyticsEventClientRenderingStatsRendererClass {
    RENDERER_CLASS_UNSPECIFIED = "RENDERER_CLASS_UNSPECIFIED",
    RENDERER_CLASS_COMPOSITOR = "RENDERER_CLASS_COMPOSITOR",
    RENDERER_CLASS_DIRECT = "RENDERER_CLASS_DIRECT"
}
export declare enum AnalyticsEventMatchEndCtaMatchEndCtaType {
    MATCH_END_CTA_TYPE_UNSPECIFIED = "MATCH_END_CTA_TYPE_UNSPECIFIED",
    MATCH_END_CTA_TYPE_SEASONS = "MATCH_END_CTA_TYPE_SEASONS"
}
export declare enum AnalyticsEventWebRTCMetricsStreamType {
    STREAM_TYPE_UNSPECIFIED = "STREAM_TYPE_UNSPECIFIED",
    STREAM_TYPE_RAW_STREAM = "STREAM_TYPE_RAW_STREAM",
    STREAM_TYPE_ARENA = "STREAM_TYPE_ARENA"
}
export declare enum AnalyticsEventStudioWidgetStudioWidgetEvent {
    STUDIO_WIDGET_EVENT_UNSPECIFIED = "STUDIO_WIDGET_EVENT_UNSPECIFIED",
    STUDIO_WIDGET_EVENT_INIT = "STUDIO_WIDGET_EVENT_INIT",
    STUDIO_WIDGET_EVENT_ADD = "STUDIO_WIDGET_EVENT_ADD",
    STUDIO_WIDGET_EVENT_REMOVE = "STUDIO_WIDGET_EVENT_REMOVE",
    STUDIO_WIDGET_EVENT_SETTINGS_CHANGE = "STUDIO_WIDGET_EVENT_SETTINGS_CHANGE",
    STUDIO_WIDGET_EVENT_POPOUT = "STUDIO_WIDGET_EVENT_POPOUT",
    STUDIO_WIDGET_EVENT_RESTORE_SAVED = "STUDIO_WIDGET_EVENT_RESTORE_SAVED",
    STUDIO_WIDGET_EVENT_SAVE_LAYOUT = "STUDIO_WIDGET_EVENT_SAVE_LAYOUT",
    STUDIO_WIDGET_EVENT_RESET_LAYOUT = "STUDIO_WIDGET_EVENT_RESET_LAYOUT"
}
export declare enum AnalyticsEventClientChatSettingsChatSettingType {
    CHAT_SETTING_TYPE_UNSPECIFIED = "CHAT_SETTING_TYPE_UNSPECIFIED",
    CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS = "CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS",
    CHAT_SETTING_TYPE_FONT_SIZE = "CHAT_SETTING_TYPE_FONT_SIZE",
    CHAT_SETTING_TYPE_AVATAR_VISIBILITY = "CHAT_SETTING_TYPE_AVATAR_VISIBILITY"
}
export declare enum AnalyticsEventClientSignupCookiesConsentActionedUserDecision {
    USER_DECISION_UNSPECIFIED = "USER_DECISION_UNSPECIFIED",
    USER_DECISION_SAVE_SETTINGS = "USER_DECISION_SAVE_SETTINGS",
    USER_DECISION_ACCEPT_ALL = "USER_DECISION_ACCEPT_ALL",
    USER_DECISION_DENY_ALL = "USER_DECISION_DENY_ALL"
}
export declare enum AnalyticsEventClientUpSellingDialogUpSellingDialogActionType {
    UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED = "UP_SELLING_DIALOG_ACTION_TYPE_UNSPECIFIED",
    UP_SELLING_DIALOG_ACTION_TYPE_OPEN = "UP_SELLING_DIALOG_ACTION_TYPE_OPEN",
    UP_SELLING_DIALOG_ACTION_TYPE_LOGIN = "UP_SELLING_DIALOG_ACTION_TYPE_LOGIN",
    UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP = "UP_SELLING_DIALOG_ACTION_TYPE_SIGNUP",
    UP_SELLING_DIALOG_ACTION_TYPE_CLOSE = "UP_SELLING_DIALOG_ACTION_TYPE_CLOSE"
}
export declare enum AnalyticsEventClientUpSellingDialogUpSellingDialogSource {
    UP_SELLING_DIALOG_SOURCE_UNSPECIFIED = "UP_SELLING_DIALOG_SOURCE_UNSPECIFIED",
    UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE = "UP_SELLING_DIALOG_SOURCE_CARD_BUNDLE",
    UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE = "UP_SELLING_DIALOG_SOURCE_IN_GAME_CURRENCY_BUNDLE",
    UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE = "UP_SELLING_DIALOG_SOURCE_PAYMENT_CURRENCY_BUNDLE",
    UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL = "UP_SELLING_DIALOG_SOURCE_FOLLOW_CHANNEL",
    UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL = "UP_SELLING_DIALOG_SOURCE_SUBSCRIBE_CHANNEL",
    UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR = "UP_SELLING_DIALOG_SOURCE_CUSTOMIZE_AVATAR",
    UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD_BUNDLE",
    UP_SELLING_DIALOG_SOURCE_CREATOR_CARD = "UP_SELLING_DIALOG_SOURCE_CREATOR_CARD"
}
export declare enum AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType {
    ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_UNSPECIFIED",
    ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_SIGNUP",
    ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN = "ANALYTICS_EVENT_CLIENT_SIGNUP_BUTTON_CLICK_ACTION_TYPE_LOGIN"
}
export type AnalyticsEventClientNavigate = {
    pathname?: string;
    buildHash?: string;
};
export type AnalyticsEventClientLoadFinished = {
    loadtimeMs?: string;
    buildHash?: string;
    buildTime?: string;
};
export type AnalyticsEventClientFirstPageLoad = {
    pathname?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    utmCreator?: string;
    utmFormat?: string;
};
export type AnalyticsEventClientSpotlightsEmoteClicked = {
    emoteId?: string;
    name?: string;
    icon?: string;
};
export type AnalyticsEventClientAvatarEmoteClicked = {
    emoteId?: string;
    name?: string;
    icon?: string;
};
export type AnalyticsEventClientAvatarEmojiClicked = {
    emojiId?: string;
    name?: string;
    icon?: string;
};
export type AnalyticsEventClientAvatarSelectorAvatarViewed = {
    avatarId?: string;
};
export type AnalyticsEventClientAvatarSelectorAvatarSelected = {
    avatarId?: string;
};
export type AnalyticsEventClientAvatarEditorSaveStarted = {
    avatarParts?: AvatarAvatar.AvatarPart[];
    avatarEditorSessionId?: string;
    customisations?: AvatarAvatar.AvatarPartCustomization[];
};
export type AnalyticsEventClientAvatarEditorSaveCompleted = {
    avatarParts?: AvatarAvatar.AvatarPart[];
    avatarId?: string;
    avatarEditorSessionId?: string;
    customisations?: AvatarAvatar.AvatarPartCustomization[];
};
export type AnalyticsEventClientAvatarEditorOpened = {
    avatarEditorSessionId?: string;
};
export type AnalyticsEventClientAvatarEditorClosed = {
    avatarEditorSessionId?: string;
};
export type AnalyticsEventClientAvatarEditorItemSelected = {
    part?: AvatarAvatar.AvatarPart;
    avatarEditorSessionId?: string;
};
export type AnalyticsEventClientAvatarEditorColorCustomisationSelected = {
    part?: AvatarAvatar.AvatarPart;
    customisation?: AvatarAvatar.AvatarPartCustomization;
    avatarEditorSessionId?: string;
};
export type AnalyticsEventClientConsoleError = {
    message?: string;
};
export type AnalyticsEventClientUnhandledPromiseRejection = {
    message?: string;
};
export type AnalyticsEventClientJavaScriptError = {
    message?: string;
};
export type BundleItem = {
    itemId?: string;
    revealed?: boolean;
};
export type Bundle = {
    id?: string;
    revealed?: boolean;
    items?: BundleItem[];
};
export type AnalyticsEventClientInactivityKickPromptShown = {};
export type AnalyticsEventClientBestPlaysOpened = {};
export type AnalyticsEventClientSoloPlayToggle = {
    enabled?: boolean;
    context?: AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext;
};
export type AnalyticsEventClientStorePage = {
    standardBundles?: Bundle[];
    premiumBundles?: Bundle[];
    gameId?: string;
    wallet?: WalletWallet.WalletCurrency[];
    channelId?: string;
};
export type AnalyticsEventClientFTUEDisplayed = {
    ftueId?: string;
    ftueMessageType?: FtueFtue.ConfigItemMessageType;
};
export type AnalyticsEventClientButtonClick = {
    action?: string;
    pathname?: string;
    section?: string;
};
export type AnalyticsEventClientCardSelectOpened = {
    currentCardId?: string;
    reshufflePrice?: number;
    teamSize?: number;
    isPlayingSolo?: boolean;
    isCardMaxedOut?: boolean;
};
export type AnalyticsEventClientCardSelectCanceled = {
    currentCardId?: string;
    reshufflePrice?: number;
    teamSize?: number;
    isPlayingSolo?: boolean;
    isCardMaxedOut?: boolean;
};
export type AnalyticsEventClientBoosterClicked = {
    boosterId?: number;
    teamSize?: number;
    currentCardId?: string;
    isCardMaxedOut?: boolean;
};
export type AnalyticsEventClientShuffleUsed = {
    context?: AnalyticsEventClientShuffleUsedShuffleContext;
    reshufflePrice?: number;
};
export type AnalyticsEventClientStoreBundleClicked = {
    bundle?: Bundle;
    cost?: WalletWallet.WalletCurrency;
    wallet?: WalletWallet.WalletCurrency[];
    itemType?: StoreV2Storev2.ItemType;
};
export type AnalyticsEventClientStoreRevealAllCards = {
    bundle?: Bundle;
    cost?: WalletWallet.WalletCurrency;
    wallet?: WalletWallet.WalletCurrency[];
    itemType?: StoreV2Storev2.ItemType;
};
export type AnalyticsEventClientStoreRevealCard = {
    cardId?: string;
    bundle?: Bundle;
    cost?: WalletWallet.WalletCurrency;
    wallet?: WalletWallet.WalletCurrency[];
    itemType?: StoreV2Storev2.ItemType;
};
type BaseAnalyticsEventClientStoreItemClicked = {
    action?: string;
    cost?: WalletWallet.WalletCurrency;
    wallet?: WalletWallet.WalletCurrency[];
    itemType?: StoreV2Storev2.ItemType;
    targetAttributes?: {
        [key: string]: string;
    };
};
export type AnalyticsEventClientStoreItemClicked = BaseAnalyticsEventClientStoreItemClicked & OneOf<{
    bundle: Bundle;
    card: Game_logicGame_logic.StreamerCard;
}>;
export type AnalyticsEventClientSwitchStore = {
    gameId?: string;
    channelId?: string;
};
export type AnalyticsEventClientTimedAdsOpened = {
    pathname?: string;
    placementId?: string;
    context?: AnalyticsEventClientTimedAdsOpenedTimedAdsContext;
};
export type AnalyticsEventClientTimedAdsWatchingAd = {
    pathname?: string;
    placementId?: string;
    rarity?: RarityRarity.Rarity;
    possibleRewards?: AdsAds.RewardDescriptionPrizeDescription[];
};
export type AnalyticsEventClientTimedAdsRewardsClaimed = {
    pathname?: string;
    placementId?: string;
    rarity?: RarityRarity.Rarity;
    possibleRewards?: AdsAds.RewardDescriptionPrizeDescription[];
    actualRewards?: WalletWallet.WalletCurrency[];
    adWatched?: boolean;
};
export type AnalyticsEventClientTimedAdsClosed = {
    pathname?: string;
    placementId?: string;
};
export type AnalyticsEventClientAdAvailable = {
    context?: AnalyticsEventClientAdAvailableAdAvailableContext;
    pathname?: string;
    placementId?: string;
};
export type AnalyticsEventClientWatchingAd = {
    pathname?: string;
    placementId?: string;
};
export type AnalyticsEventClientSkippedAd = {
    pathname?: string;
    placementId?: string;
};
export type AnalyticsEventClientOpenMiniProfile = {
    friendshipStatus?: FriendsFriends.FriendshipStatusStatus;
};
export type AnalyticsEventClientAddFriendFormViewed = {
    pathname?: string;
};
export type AnalyticsEventClientToggleSeasons = {
    gameId?: string;
};
export type AnalyticsEventClientCollectionCardClicked = {
    cardId?: string;
};
export type AnalyticsEventClientToggleCollections = {
    gameId?: string;
    channelId?: string;
};
export type AnalyticsEventClientSelectAvatar = {
    avatarId?: string;
};
export type AnalyticsEventClientBrowseAvatarPages = {
    page?: number;
};
export type AnalyticsEventClientFriendMenuOpened = {
    friendCount?: number;
};
export type AnalyticsEventClientViewFriends = {
    friendCount?: number;
};
export type AnalyticsEventClientDailyGoalCardSlotClicked = {
    selectedCardId?: string;
};
export type AnalyticsEventClientSignupStep = {
    step?: AnalyticsEventClientSignupStepSignupStep;
    mode?: AnalyticsEventClientSignupStepSignupMode;
    discordTokenExists?: boolean;
    captchaTokenExists?: boolean;
    verifyEmailTokenExists?: boolean;
    from?: string;
    error?: string;
};
export type AnalyticsEventClientEnvironmentCheck = {
    browserGpu?: string;
    browserIsMobile?: boolean;
    browserIsSupported?: boolean;
    browserPlatform?: string;
    browserUserAgent?: string;
    browserViewport?: number;
    browserGpuTier?: number;
    browserName?: string;
    browserOsName?: string;
    environmentCheckFailed?: boolean;
};
export type AnalyticsEventClientRenderingStats = {
    frameTimeAvgMs?: number;
    frameTimeP50Ms?: number;
    frameTimeP75Ms?: number;
    frameTimeP90Ms?: number;
    frameTimeP99Ms?: number;
    frameJankCount?: number;
    textures?: number;
    geometries?: number;
    memoryJsMb?: number;
    sampleLengthMs?: number;
    emoteCount?: number;
    emojiCount?: number;
    avatarCount?: number;
    totalLengthMs?: number;
    type?: AnalyticsEventClientRenderingStatsRendererType;
    crowdMode?: AnalyticsCrowdMode;
    crowdAnimationRate?: number;
    crowdDetail?: AnalyticsCrowdDetailType;
    frameRate?: number;
    shadowType?: AnalyticsShadowType;
    lightingType?: AnalyticsLightingType;
    crowdResolution?: number;
    antiAliasingType?: AnalyticsAntiAliasingType;
    gpuTier?: number;
    renderQualityLevel?: number;
    frameSampleCount?: number;
    frameStaticLimiterCount?: number;
    frameDynamicLimiterCount?: number;
    frameUnderLimiterCount?: number;
    frameRenderThread60Count?: number;
    frameRenderThread30Count?: number;
    frameRenderThreadUnder30Count?: number;
    rendererClass?: AnalyticsEventClientRenderingStatsRendererClass;
};
export type AnalyticsEventMatchEndCta = {
    type?: AnalyticsEventMatchEndCtaMatchEndCtaType;
};
export type AnalyticsEventPerformanceProfileChanged = {
    profileName?: string;
    profileIndex?: number;
    crowdAnimationRate?: number;
    crowdDetail?: AnalyticsCrowdDetailType;
    frameRate?: number;
    shadowType?: AnalyticsShadowType;
    lightingType?: AnalyticsLightingType;
    crowdResolution?: number;
    crowdMode?: AnalyticsCrowdMode;
    antiAliasingType?: AnalyticsAntiAliasingType;
    shadowQuality?: AnalyticsShadowQuality;
};
export type AnalyticsEventStreamQualityChanged = {
    layerName?: string;
};
export type AnalyticsEventWebRTCMetrics = {
    streamId?: string;
    streamType?: AnalyticsEventWebRTCMetricsStreamType;
    timeTotalMs?: number;
    sampleLengthMs?: number;
    currentRoundTripTimeSec?: number;
    totalRoundTripTimeSec?: number;
    roundTripTimesAvailable?: boolean;
    channelId?: string;
    egressType?: string;
    videoPacketsReceivedTotal?: number;
    videoPacketsLostTotal?: number;
    videoPacketsDiscardedTotal?: number;
    videoNackCountTotal?: number;
    videoFirCountTotal?: number;
    videoPliCountTotal?: number;
    sampleVideoPacketsReceived?: number;
    sampleVideoPacketsLost?: number;
    sampleVideoPacketsDiscarded?: number;
    sampleVideoNackCount?: number;
    sampleVideoFirCountTotal?: number;
    sampleVideoPliCountTotal?: number;
    videoJitterSec?: number;
    videoJitterBufferDelaySec?: number;
    videoJitterBufferEmittedCount?: number;
    videoFrameWidth?: number;
    videoFrameHeight?: number;
    videoMebibytesReceivedTotal?: number;
    sampleVideoMebibytesReceived?: number;
    videoFreezeCountTotal?: number;
    videoFreezeDurationSecTotal?: number;
    videoPauseCountTotal?: number;
    videoPauseDurationSecTotal?: number;
    sampleVideoFreezeCount?: number;
    sampleVideoFreezeDurationSec?: number;
    sampleVideoPauseCount?: number;
    sampleVideoPauseDurationSec?: number;
    audioPacketsReceivedTotal?: number;
    audioPacketsLostTotal?: number;
    audioPacketsDiscardedTotal?: number;
    audioNackCountTotal?: number;
    sampleAudioMebibytesReceived?: number;
    sampleAudioPacketsReceived?: number;
    sampleAudioPacketsLost?: number;
    sampleAudioPacketsDiscarded?: number;
    sampleAudioNackCount?: number;
    audioJitterSec?: number;
    audioJitterBufferDelaySec?: number;
    audioJitterBufferEmittedCount?: number;
    audioMebibytesReceivedTotal?: number;
};
export type AnalyticsEventStudioWidgetStudioWidget = {
    widgetName?: string;
    settings?: string;
};
export type AnalyticsEventStudioWidget = {
    channelId?: string;
    userId?: string;
    event?: AnalyticsEventStudioWidgetStudioWidgetEvent;
    widgets?: AnalyticsEventStudioWidgetStudioWidget[];
};
export type AnalyticsEventStudioChannelArenaChanged = {
    arenaId?: string;
    arenaName?: string;
};
export type AnalyticsEventClientStreamConnectionRetry = {
    streamId?: string;
    rawVideo?: boolean;
    reconnectAttempt?: number;
    reason?: string;
};
export type AnalyticsEventClientStreamConnectionMediaStream = {
    streamId?: string;
    rawVideo?: boolean;
    audioTracks?: number;
    videoTracks?: number;
};
export type AnalyticsEventClientStreamConnectionWatch = {
    streamId?: string;
    rawVideo?: boolean;
    reconnectAttempt?: number;
};
export type AnalyticsEventClientChatSettings = {
    settingType?: AnalyticsEventClientChatSettingsChatSettingType;
    value?: string;
    chatId?: string;
};
export type AnalyticsEventClientSignupCookiesConsentLoaded = {
    isShown?: boolean;
};
export type AnalyticsEventClientSignupCookiesConsentActioned = {
    userDecision?: AnalyticsEventClientSignupCookiesConsentActionedUserDecision;
};
export type AnalyticsEventClientStreamPlayback = {
    isIntentionallyMutedPlayback?: boolean;
    wasAutoUnmuteSuccessful?: boolean;
    wasVideoAutoplaySuccessful?: boolean;
};
export type AnalyticsEventClientMatchEndSequenceCompleted = {
    hideContent?: boolean;
};
export type AnalyticsEventClientUpSellingDialog = {
    action?: AnalyticsEventClientUpSellingDialogUpSellingDialogActionType;
    source?: AnalyticsEventClientUpSellingDialogUpSellingDialogSource;
};
export type AnalyticsEventClientSignupButtonClick = {
    action?: AnalyticsEventClientSignupButtonClickAnalyticsEventClientSignupButtonClickActionType;
    section?: string;
};
export type AnalyticsMicroSurveyTraitType = {
    name?: string;
    value?: string;
};
export type AnalyticsMicroSurveyResponseType = {
    question?: string;
    response?: string;
};
export type AnalyticsEventClientMicroSurveyShown = {
    formId?: string;
    traits?: AnalyticsMicroSurveyTraitType[];
};
export type AnalyticsEventClientMicroSurveyDismissed = {
    formId?: string;
    traits?: AnalyticsMicroSurveyTraitType[];
};
export type AnalyticsEventClientMicroSurveyCompleted = {
    formId?: string;
    traits?: AnalyticsMicroSurveyTraitType[];
    responses?: AnalyticsMicroSurveyResponseType[];
};
type BaseAnalyticsEvent = {
    eventName?: string;
    identity?: string;
    sequenceId?: number;
    clientTime?: string;
    clientType?: ApiClient.ClientType;
    batchOffsetMs?: number;
    windowWidth?: number;
    windowHeight?: number;
};
export type AnalyticsEvent = BaseAnalyticsEvent & OneOf<{
    clientNavigate: AnalyticsEventClientNavigate;
    clientConsoleError: AnalyticsEventClientConsoleError;
    clientUnhandledPromiseRejection: AnalyticsEventClientUnhandledPromiseRejection;
    clientJavascriptError: AnalyticsEventClientJavaScriptError;
    clientStorePage: AnalyticsEventClientStorePage;
    clientButtonClick: AnalyticsEventClientButtonClick;
    clientFtueDisplayed: AnalyticsEventClientFTUEDisplayed;
    clientCardSelectOpened: AnalyticsEventClientCardSelectOpened;
    clientBoosterClicked: AnalyticsEventClientBoosterClicked;
    clientShuffleUsed: AnalyticsEventClientShuffleUsed;
    clientStoreBundleClicked: AnalyticsEventClientStoreBundleClicked;
    clientStoreRevealAllCards: AnalyticsEventClientStoreRevealAllCards;
    clientStoreRevealCard: AnalyticsEventClientStoreRevealCard;
    clientSwitchStore: AnalyticsEventClientSwitchStore;
    clientAdAvailable: AnalyticsEventClientAdAvailable;
    clientWatchingAd: AnalyticsEventClientWatchingAd;
    clientSkippedAd: AnalyticsEventClientSkippedAd;
    clientOpenMiniProfile: AnalyticsEventClientOpenMiniProfile;
    clientAddFriendFormViewed: AnalyticsEventClientAddFriendFormViewed;
    clientToggleSeasons: AnalyticsEventClientToggleSeasons;
    clientCollectionCardClicked: AnalyticsEventClientCollectionCardClicked;
    clientToggleCollections: AnalyticsEventClientToggleCollections;
    clientSelectAvatar: AnalyticsEventClientSelectAvatar;
    clientBrowseAvatarPages: AnalyticsEventClientBrowseAvatarPages;
    clientViewFriends: AnalyticsEventClientViewFriends;
    clientFriendMenuOpened: AnalyticsEventClientFriendMenuOpened;
    clientDailyGoalCardSlotClicked: AnalyticsEventClientDailyGoalCardSlotClicked;
    clientEnvironmentCheck: AnalyticsEventClientEnvironmentCheck;
    clientSignupStep: AnalyticsEventClientSignupStep;
    clientRenderingStats: AnalyticsEventClientRenderingStats;
    clientMatchEndCta: AnalyticsEventMatchEndCta;
    clientPerformanceProfileChanged: AnalyticsEventPerformanceProfileChanged;
    clientStreamQualityChanged: AnalyticsEventStreamQualityChanged;
    clientWebrtcMetrics: AnalyticsEventWebRTCMetrics;
    clientInactivityKickPromptShown: AnalyticsEventClientInactivityKickPromptShown;
    clientBestPlaysOpened: AnalyticsEventClientBestPlaysOpened;
    clientSoloPlayToggle: AnalyticsEventClientSoloPlayToggle;
    clientTimedAdsOpened: AnalyticsEventClientTimedAdsOpened;
    clientTimedAdsWatchingAd: AnalyticsEventClientTimedAdsWatchingAd;
    clientTimedAdsRewardsClaimed: AnalyticsEventClientTimedAdsRewardsClaimed;
    clientTimedAdsClosed: AnalyticsEventClientTimedAdsClosed;
    clientFirstPageLoad: AnalyticsEventClientFirstPageLoad;
    studioWidgets: AnalyticsEventStudioWidget;
    clientAvatarEditorSaveStarted: AnalyticsEventClientAvatarEditorSaveStarted;
    clientAvatarEditorSaveCompleted: AnalyticsEventClientAvatarEditorSaveCompleted;
    clientAvatarSelectorAvatarViewed: AnalyticsEventClientAvatarSelectorAvatarViewed;
    clientAvatarSelectorAvatarSelected: AnalyticsEventClientAvatarSelectorAvatarSelected;
    clientSpotlightsEmoteClicked: AnalyticsEventClientSpotlightsEmoteClicked;
    clientStreamConnectionRetry: AnalyticsEventClientStreamConnectionRetry;
    clientStreamConnectionMediaStream: AnalyticsEventClientStreamConnectionMediaStream;
    clientLoadFinished: AnalyticsEventClientLoadFinished;
    clientStreamConnectionWatch: AnalyticsEventClientStreamConnectionWatch;
    clientStoreItemClicked: AnalyticsEventClientStoreItemClicked;
    studioChannelArenaChanged: AnalyticsEventStudioChannelArenaChanged;
    clientAvatarEditorOpened: AnalyticsEventClientAvatarEditorOpened;
    clientAvatarEditorClosed: AnalyticsEventClientAvatarEditorClosed;
    clientAvatarEditorItemSelected: AnalyticsEventClientAvatarEditorItemSelected;
    clientChatSettings: AnalyticsEventClientChatSettings;
    clientAvatarEmoteClicked: AnalyticsEventClientAvatarEmoteClicked;
    clientAvatarEmojiClicked: AnalyticsEventClientAvatarEmojiClicked;
    clientCardSelectCanceled: AnalyticsEventClientCardSelectCanceled;
    clientAvatarEditorColorCustomisationSelected: AnalyticsEventClientAvatarEditorColorCustomisationSelected;
    clientSignupCookiesConsentLoaded: AnalyticsEventClientSignupCookiesConsentLoaded;
    clientSignupCookiesConsentActioned: AnalyticsEventClientSignupCookiesConsentActioned;
    clientStreamPlayback: AnalyticsEventClientStreamPlayback;
    clientUpSellingDialog: AnalyticsEventClientUpSellingDialog;
    clientMatchEndSequenceCompleted: AnalyticsEventClientMatchEndSequenceCompleted;
    clientSignupButtonClick: AnalyticsEventClientSignupButtonClick;
    clientMicroSurveyShown: AnalyticsEventClientMicroSurveyShown;
    clientMicroSurveyDismissed: AnalyticsEventClientMicroSurveyDismissed;
    clientMicroSurveyCompleted: AnalyticsEventClientMicroSurveyCompleted;
}>;
export type IdentityMappingEvent = {
    identity?: string;
    userIdentity?: string;
};
export type SendAnalyticsRequest = {
    events?: AnalyticsEvent[];
};
export type SetIdentityRequest = {
    identity?: string;
    userIdentity?: string;
};
export type SendAnalyticsResponse = {};
export type SetIdentityResponse = {};
export interface IAnalyticsEventClientStoreItemClickedItemDelegate<C> {
    onBundle(ctx: C, ev: Bundle): void;
    onCard(ctx: C, ev: Game_logicGame_logic.StreamerCard): void;
}
export declare function routeAnalyticsEventClientStoreItemClickedItemDelegate<C>(ctx: C, val: AnalyticsEventClientStoreItemClicked, delegate: IAnalyticsEventClientStoreItemClickedItemDelegate<C>): void;
export interface IAnalyticsEventEventDelegate<C> {
    onClientNavigate(ctx: C, ev: AnalyticsEventClientNavigate): void;
    onClientConsoleError(ctx: C, ev: AnalyticsEventClientConsoleError): void;
    onClientUnhandledPromiseRejection(ctx: C, ev: AnalyticsEventClientUnhandledPromiseRejection): void;
    onClientJavascriptError(ctx: C, ev: AnalyticsEventClientJavaScriptError): void;
    onClientStorePage(ctx: C, ev: AnalyticsEventClientStorePage): void;
    onClientButtonClick(ctx: C, ev: AnalyticsEventClientButtonClick): void;
    onClientFtueDisplayed(ctx: C, ev: AnalyticsEventClientFTUEDisplayed): void;
    onClientCardSelectOpened(ctx: C, ev: AnalyticsEventClientCardSelectOpened): void;
    onClientBoosterClicked(ctx: C, ev: AnalyticsEventClientBoosterClicked): void;
    onClientShuffleUsed(ctx: C, ev: AnalyticsEventClientShuffleUsed): void;
    onClientStoreBundleClicked(ctx: C, ev: AnalyticsEventClientStoreBundleClicked): void;
    onClientStoreRevealAllCards(ctx: C, ev: AnalyticsEventClientStoreRevealAllCards): void;
    onClientStoreRevealCard(ctx: C, ev: AnalyticsEventClientStoreRevealCard): void;
    onClientSwitchStore(ctx: C, ev: AnalyticsEventClientSwitchStore): void;
    onClientAdAvailable(ctx: C, ev: AnalyticsEventClientAdAvailable): void;
    onClientWatchingAd(ctx: C, ev: AnalyticsEventClientWatchingAd): void;
    onClientSkippedAd(ctx: C, ev: AnalyticsEventClientSkippedAd): void;
    onClientOpenMiniProfile(ctx: C, ev: AnalyticsEventClientOpenMiniProfile): void;
    onClientAddFriendFormViewed(ctx: C, ev: AnalyticsEventClientAddFriendFormViewed): void;
    onClientToggleSeasons(ctx: C, ev: AnalyticsEventClientToggleSeasons): void;
    onClientCollectionCardClicked(ctx: C, ev: AnalyticsEventClientCollectionCardClicked): void;
    onClientToggleCollections(ctx: C, ev: AnalyticsEventClientToggleCollections): void;
    onClientSelectAvatar(ctx: C, ev: AnalyticsEventClientSelectAvatar): void;
    onClientBrowseAvatarPages(ctx: C, ev: AnalyticsEventClientBrowseAvatarPages): void;
    onClientViewFriends(ctx: C, ev: AnalyticsEventClientViewFriends): void;
    onClientFriendMenuOpened(ctx: C, ev: AnalyticsEventClientFriendMenuOpened): void;
    onClientDailyGoalCardSlotClicked(ctx: C, ev: AnalyticsEventClientDailyGoalCardSlotClicked): void;
    onClientEnvironmentCheck(ctx: C, ev: AnalyticsEventClientEnvironmentCheck): void;
    onClientSignupStep(ctx: C, ev: AnalyticsEventClientSignupStep): void;
    onClientRenderingStats(ctx: C, ev: AnalyticsEventClientRenderingStats): void;
    onClientMatchEndCta(ctx: C, ev: AnalyticsEventMatchEndCta): void;
    onClientPerformanceProfileChanged(ctx: C, ev: AnalyticsEventPerformanceProfileChanged): void;
    onClientStreamQualityChanged(ctx: C, ev: AnalyticsEventStreamQualityChanged): void;
    onClientWebrtcMetrics(ctx: C, ev: AnalyticsEventWebRTCMetrics): void;
    onClientInactivityKickPromptShown(ctx: C, ev: AnalyticsEventClientInactivityKickPromptShown): void;
    onClientBestPlaysOpened(ctx: C, ev: AnalyticsEventClientBestPlaysOpened): void;
    onClientSoloPlayToggle(ctx: C, ev: AnalyticsEventClientSoloPlayToggle): void;
    onClientTimedAdsOpened(ctx: C, ev: AnalyticsEventClientTimedAdsOpened): void;
    onClientTimedAdsWatchingAd(ctx: C, ev: AnalyticsEventClientTimedAdsWatchingAd): void;
    onClientTimedAdsRewardsClaimed(ctx: C, ev: AnalyticsEventClientTimedAdsRewardsClaimed): void;
    onClientTimedAdsClosed(ctx: C, ev: AnalyticsEventClientTimedAdsClosed): void;
    onClientFirstPageLoad(ctx: C, ev: AnalyticsEventClientFirstPageLoad): void;
    onStudioWidgets(ctx: C, ev: AnalyticsEventStudioWidget): void;
    onClientAvatarEditorSaveStarted(ctx: C, ev: AnalyticsEventClientAvatarEditorSaveStarted): void;
    onClientAvatarEditorSaveCompleted(ctx: C, ev: AnalyticsEventClientAvatarEditorSaveCompleted): void;
    onClientAvatarSelectorAvatarViewed(ctx: C, ev: AnalyticsEventClientAvatarSelectorAvatarViewed): void;
    onClientAvatarSelectorAvatarSelected(ctx: C, ev: AnalyticsEventClientAvatarSelectorAvatarSelected): void;
    onClientSpotlightsEmoteClicked(ctx: C, ev: AnalyticsEventClientSpotlightsEmoteClicked): void;
    onClientStreamConnectionRetry(ctx: C, ev: AnalyticsEventClientStreamConnectionRetry): void;
    onClientStreamConnectionMediaStream(ctx: C, ev: AnalyticsEventClientStreamConnectionMediaStream): void;
    onClientLoadFinished(ctx: C, ev: AnalyticsEventClientLoadFinished): void;
    onClientStreamConnectionWatch(ctx: C, ev: AnalyticsEventClientStreamConnectionWatch): void;
    onClientStoreItemClicked(ctx: C, ev: AnalyticsEventClientStoreItemClicked): void;
    onStudioChannelArenaChanged(ctx: C, ev: AnalyticsEventStudioChannelArenaChanged): void;
    onClientAvatarEditorOpened(ctx: C, ev: AnalyticsEventClientAvatarEditorOpened): void;
    onClientAvatarEditorClosed(ctx: C, ev: AnalyticsEventClientAvatarEditorClosed): void;
    onClientAvatarEditorItemSelected(ctx: C, ev: AnalyticsEventClientAvatarEditorItemSelected): void;
    onClientChatSettings(ctx: C, ev: AnalyticsEventClientChatSettings): void;
    onClientAvatarEmoteClicked(ctx: C, ev: AnalyticsEventClientAvatarEmoteClicked): void;
    onClientAvatarEmojiClicked(ctx: C, ev: AnalyticsEventClientAvatarEmojiClicked): void;
    onClientCardSelectCanceled(ctx: C, ev: AnalyticsEventClientCardSelectCanceled): void;
    onClientAvatarEditorColorCustomisationSelected(ctx: C, ev: AnalyticsEventClientAvatarEditorColorCustomisationSelected): void;
    onClientSignupCookiesConsentLoaded(ctx: C, ev: AnalyticsEventClientSignupCookiesConsentLoaded): void;
    onClientSignupCookiesConsentActioned(ctx: C, ev: AnalyticsEventClientSignupCookiesConsentActioned): void;
    onClientStreamPlayback(ctx: C, ev: AnalyticsEventClientStreamPlayback): void;
    onClientUpSellingDialog(ctx: C, ev: AnalyticsEventClientUpSellingDialog): void;
    onClientMatchEndSequenceCompleted(ctx: C, ev: AnalyticsEventClientMatchEndSequenceCompleted): void;
    onClientSignupButtonClick(ctx: C, ev: AnalyticsEventClientSignupButtonClick): void;
    onClientMicroSurveyShown(ctx: C, ev: AnalyticsEventClientMicroSurveyShown): void;
    onClientMicroSurveyDismissed(ctx: C, ev: AnalyticsEventClientMicroSurveyDismissed): void;
    onClientMicroSurveyCompleted(ctx: C, ev: AnalyticsEventClientMicroSurveyCompleted): void;
}
export declare function routeAnalyticsEventEventDelegate<C>(ctx: C, val: AnalyticsEvent, delegate: IAnalyticsEventEventDelegate<C>): void;
export declare class AnalyticsService {
    static SendAnalytics(req: SendAnalyticsRequest, initReq?: fm.InitReq): Promise<SendAnalyticsResponse>;
    static SetIdentity(req: SetIdentityRequest, initReq?: fm.InitReq): Promise<SetIdentityResponse>;
}
export {};
//# sourceMappingURL=analytics.pb.d.ts.map