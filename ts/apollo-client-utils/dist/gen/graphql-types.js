"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateStringComparisonOperator = exports.GameStateIntComparisonOperator = exports.GameStateCalModuleUnaryOp = exports.GameStateCalModuleBinaryOp = exports.GameLogicStreamStateRoundPhase = exports.GameLogicStreamStateMatchType = exports.GameLogicStreamStateMatchState = exports.GameLogicMatchBonusType = exports.GameLogicContextualTeamActionType = exports.GameLogicContextualTeamActionStatus = exports.GameCardHighScoringCardTimingsSpeed = exports.GameCardAssetType = exports.FtueDismissalType = exports.FriendsFriendshipStatusStatus = exports.FriendsFriendStatusUpdateEventUpdateType = exports.ClassificationTrustLevel = exports.ClassificationTopic = exports.ClassificationTextRisk = exports.ChatUserLabel = exports.ChatReason = exports.ChatModerationStatus = exports.ChatModerationItemStatus = exports.ChatChatRole = exports.ChatAutomodLevel = exports.ChatAutomodDecision = exports.ChannelViolation = exports.ChannelSuspensionReason = exports.ChannelModerationEventType = exports.ChannelLiveStatus = exports.ChannelChannelRole = exports.ChannelChannelLinkLinkType = exports.ChannelChannelFeature = exports.ChannelAssetType = exports.ChannelAppealStatus = exports.BadgeBadgeType = exports.AvatarValidateAvatarCompositionResponseChangeReason = exports.AvatarGender = exports.AvatarAvatarPartCategory = exports.AvatarAnimationHandedness = exports.AvatarAnimationCategory = exports.AuthPlatformRole = exports.AuthIdentityType = exports.AuthConsentStatus = exports.AuthAccountStatusFlag = exports.ApiEntityState = exports.AnnouncementAnnouncementTarget = exports.AnnouncementAnnouncementStatus = exports.AnnouncementAnnouncementCategory = exports.AdsRewardDescriptionPrizeDescriptionKind = exports.AdsPlacementState = void 0;
exports.WalletTransactionReason = exports.WalletOperationType = exports.SupportReportReason = exports.SupportReportContextUserTarget = exports.SupportReportContextChannelTarget = exports.SupportReportCaseStatus = exports.SupportReportCaseResolution = exports.SubscriptionSubscriptionPricePeriod = exports.SubscriptionChannelSubscriptionUpdateEventUpdateType = exports.SubscriptionChannelSubscriptionState = exports.SubscriptionChannelSubscriptionProvider = exports.SubscriptionChannelSubscriptionCancelReason = exports.StreamerStreamEventFilterEventType = exports.StreamIngestConfigStreamingStatus = exports.StreamDeploymentStreamDeploymentStatusComponentStatus = exports.StoreV2StoreType = exports.StoreV2RecipientRestriction = exports.StoreV2ItemType = exports.SearchEntityType = exports.RenderingCameraTransitionRequestTransitionTarget = exports.ReasonRevenueRecipientKind = exports.RarityRarity = exports.ProfileProfileVisibility = exports.ProfilePrivacySettingsVisibility = exports.ProfilePresenceStatus = exports.PaymentPaymentStatus = exports.PaymentCurrency = exports.PartyPartyInvitationUpdateEventUpdateType = exports.ModerationViolation = exports.ModerationBanStatus = exports.ModerationAppealStatus = exports.ItemItemType = exports.InvitationInvitationCodeUpdateEventUpdateType = exports.GoalCardGoalCardTargetType = void 0;
var AdsPlacementState;
(function (AdsPlacementState) {
    AdsPlacementState["PlacementStateNotReady"] = "PLACEMENT_STATE_NOT_READY";
    AdsPlacementState["PlacementStateReady"] = "PLACEMENT_STATE_READY";
    AdsPlacementState["PlacementStateUnspecified"] = "PLACEMENT_STATE_UNSPECIFIED";
})(AdsPlacementState || (exports.AdsPlacementState = AdsPlacementState = {}));
var AdsRewardDescriptionPrizeDescriptionKind;
(function (AdsRewardDescriptionPrizeDescriptionKind) {
    AdsRewardDescriptionPrizeDescriptionKind["KindCurrency"] = "KIND_CURRENCY";
    AdsRewardDescriptionPrizeDescriptionKind["KindExperiencePoints"] = "KIND_EXPERIENCE_POINTS";
    AdsRewardDescriptionPrizeDescriptionKind["KindUnspecified"] = "KIND_UNSPECIFIED";
})(AdsRewardDescriptionPrizeDescriptionKind || (exports.AdsRewardDescriptionPrizeDescriptionKind = AdsRewardDescriptionPrizeDescriptionKind = {}));
var AnnouncementAnnouncementCategory;
(function (AnnouncementAnnouncementCategory) {
    AnnouncementAnnouncementCategory["AnnouncementCategoryGameApexLegends"] = "ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS";
    AnnouncementAnnouncementCategory["AnnouncementCategoryGameDbd"] = "ANNOUNCEMENT_CATEGORY_GAME_DBD";
    AnnouncementAnnouncementCategory["AnnouncementCategoryGameDota2"] = "ANNOUNCEMENT_CATEGORY_GAME_DOTA2";
    AnnouncementAnnouncementCategory["AnnouncementCategoryGameFortnite"] = "ANNOUNCEMENT_CATEGORY_GAME_FORTNITE";
    AnnouncementAnnouncementCategory["AnnouncementCategoryGameLeagueOfLegends"] = "ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS";
    AnnouncementAnnouncementCategory["AnnouncementCategoryPlatform"] = "ANNOUNCEMENT_CATEGORY_PLATFORM";
    AnnouncementAnnouncementCategory["AnnouncementCategorySystem"] = "ANNOUNCEMENT_CATEGORY_SYSTEM";
    AnnouncementAnnouncementCategory["AnnouncementCategoryUnspecified"] = "ANNOUNCEMENT_CATEGORY_UNSPECIFIED";
})(AnnouncementAnnouncementCategory || (exports.AnnouncementAnnouncementCategory = AnnouncementAnnouncementCategory = {}));
var AnnouncementAnnouncementStatus;
(function (AnnouncementAnnouncementStatus) {
    AnnouncementAnnouncementStatus["AnnouncementStatusActive"] = "ANNOUNCEMENT_STATUS_ACTIVE";
    AnnouncementAnnouncementStatus["AnnouncementStatusDraft"] = "ANNOUNCEMENT_STATUS_DRAFT";
    AnnouncementAnnouncementStatus["AnnouncementStatusPast"] = "ANNOUNCEMENT_STATUS_PAST";
    AnnouncementAnnouncementStatus["AnnouncementStatusScheduled"] = "ANNOUNCEMENT_STATUS_SCHEDULED";
    AnnouncementAnnouncementStatus["AnnouncementStatusUnspecified"] = "ANNOUNCEMENT_STATUS_UNSPECIFIED";
})(AnnouncementAnnouncementStatus || (exports.AnnouncementAnnouncementStatus = AnnouncementAnnouncementStatus = {}));
var AnnouncementAnnouncementTarget;
(function (AnnouncementAnnouncementTarget) {
    AnnouncementAnnouncementTarget["AnnouncementTargetMobile"] = "ANNOUNCEMENT_TARGET_MOBILE";
    AnnouncementAnnouncementTarget["AnnouncementTargetStudio"] = "ANNOUNCEMENT_TARGET_STUDIO";
    AnnouncementAnnouncementTarget["AnnouncementTargetUnspecified"] = "ANNOUNCEMENT_TARGET_UNSPECIFIED";
    AnnouncementAnnouncementTarget["AnnouncementTargetWeb"] = "ANNOUNCEMENT_TARGET_WEB";
})(AnnouncementAnnouncementTarget || (exports.AnnouncementAnnouncementTarget = AnnouncementAnnouncementTarget = {}));
var ApiEntityState;
(function (ApiEntityState) {
    ApiEntityState["EntityStateBlocked"] = "ENTITY_STATE_BLOCKED";
    ApiEntityState["EntityStateDeleted"] = "ENTITY_STATE_DELETED";
    ApiEntityState["EntityStateUnspecified"] = "ENTITY_STATE_UNSPECIFIED";
})(ApiEntityState || (exports.ApiEntityState = ApiEntityState = {}));
var AuthAccountStatusFlag;
(function (AuthAccountStatusFlag) {
    AuthAccountStatusFlag["StatusFlagBanned"] = "STATUS_FLAG_BANNED";
    AuthAccountStatusFlag["StatusFlagDeletionScheduled"] = "STATUS_FLAG_DELETION_SCHEDULED";
    AuthAccountStatusFlag["StatusFlagUnspecified"] = "STATUS_FLAG_UNSPECIFIED";
    AuthAccountStatusFlag["StatusFlagWaitlist"] = "STATUS_FLAG_WAITLIST";
})(AuthAccountStatusFlag || (exports.AuthAccountStatusFlag = AuthAccountStatusFlag = {}));
var AuthConsentStatus;
(function (AuthConsentStatus) {
    AuthConsentStatus["ConsentStatusAccepted"] = "CONSENT_STATUS_ACCEPTED";
    AuthConsentStatus["ConsentStatusDeclined"] = "CONSENT_STATUS_DECLINED";
    AuthConsentStatus["ConsentStatusUnspecified"] = "CONSENT_STATUS_UNSPECIFIED";
})(AuthConsentStatus || (exports.AuthConsentStatus = AuthConsentStatus = {}));
var AuthIdentityType;
(function (AuthIdentityType) {
    AuthIdentityType["IdentityTypeApple"] = "IDENTITY_TYPE_APPLE";
    AuthIdentityType["IdentityTypeDiscord"] = "IDENTITY_TYPE_DISCORD";
    AuthIdentityType["IdentityTypeEmail"] = "IDENTITY_TYPE_EMAIL";
    AuthIdentityType["IdentityTypeUnspecified"] = "IDENTITY_TYPE_UNSPECIFIED";
})(AuthIdentityType || (exports.AuthIdentityType = AuthIdentityType = {}));
var AuthPlatformRole;
(function (AuthPlatformRole) {
    AuthPlatformRole["PlatformRoleAdmin"] = "PLATFORM_ROLE_ADMIN";
    AuthPlatformRole["PlatformRoleBot"] = "PLATFORM_ROLE_BOT";
    AuthPlatformRole["PlatformRoleFullUser"] = "PLATFORM_ROLE_FULL_USER";
    AuthPlatformRole["PlatformRoleGuest"] = "PLATFORM_ROLE_GUEST";
    AuthPlatformRole["PlatformRoleModerator"] = "PLATFORM_ROLE_MODERATOR";
    AuthPlatformRole["PlatformRolePxAgent"] = "PLATFORM_ROLE_PX_AGENT";
    AuthPlatformRole["PlatformRoleRoot"] = "PLATFORM_ROLE_ROOT";
    AuthPlatformRole["PlatformRoleUnspecified"] = "PLATFORM_ROLE_UNSPECIFIED";
    AuthPlatformRole["PlatformRoleUser"] = "PLATFORM_ROLE_USER";
})(AuthPlatformRole || (exports.AuthPlatformRole = AuthPlatformRole = {}));
var AvatarAnimationCategory;
(function (AvatarAnimationCategory) {
    AvatarAnimationCategory["CategoryAngry"] = "CATEGORY_ANGRY";
    AvatarAnimationCategory["CategoryBoosterReceived"] = "CATEGORY_BOOSTER_RECEIVED";
    AvatarAnimationCategory["CategoryBoosterRequested"] = "CATEGORY_BOOSTER_REQUESTED";
    AvatarAnimationCategory["CategoryBoosterSent"] = "CATEGORY_BOOSTER_SENT";
    AvatarAnimationCategory["CategoryCameraDrive"] = "CATEGORY_CAMERA_DRIVE";
    AvatarAnimationCategory["CategoryCameraDriveExcited"] = "CATEGORY_CAMERA_DRIVE_EXCITED";
    AvatarAnimationCategory["CategoryCardFailure"] = "CATEGORY_CARD_FAILURE";
    AvatarAnimationCategory["CategoryCardMaxedOut"] = "CATEGORY_CARD_MAXED_OUT";
    AvatarAnimationCategory["CategoryCardSuccess"] = "CATEGORY_CARD_SUCCESS";
    AvatarAnimationCategory["CategoryChatMessage"] = "CATEGORY_CHAT_MESSAGE";
    AvatarAnimationCategory["CategoryCheer"] = "CATEGORY_CHEER";
    AvatarAnimationCategory["CategoryDance"] = "CATEGORY_DANCE";
    AvatarAnimationCategory["CategoryDefeat"] = "CATEGORY_DEFEAT";
    AvatarAnimationCategory["CategoryEditorIdle"] = "CATEGORY_EDITOR_IDLE";
    AvatarAnimationCategory["CategoryEditorPickBody"] = "CATEGORY_EDITOR_PICK_BODY";
    AvatarAnimationCategory["CategoryEditorPickFace"] = "CATEGORY_EDITOR_PICK_FACE";
    AvatarAnimationCategory["CategoryEditorPickGloves"] = "CATEGORY_EDITOR_PICK_GLOVES";
    AvatarAnimationCategory["CategoryEditorPickHat"] = "CATEGORY_EDITOR_PICK_HAT";
    AvatarAnimationCategory["CategoryEditorPickJacket"] = "CATEGORY_EDITOR_PICK_JACKET";
    AvatarAnimationCategory["CategoryEditorPickPants"] = "CATEGORY_EDITOR_PICK_PANTS";
    AvatarAnimationCategory["CategoryEditorPickShoes"] = "CATEGORY_EDITOR_PICK_SHOES";
    AvatarAnimationCategory["CategoryEmoji"] = "CATEGORY_EMOJI";
    AvatarAnimationCategory["CategoryEmote"] = "CATEGORY_EMOTE";
    AvatarAnimationCategory["CategoryExcited"] = "CATEGORY_EXCITED";
    AvatarAnimationCategory["CategoryFsInChat"] = "CATEGORY_FS_IN_CHAT";
    AvatarAnimationCategory["CategoryIdle"] = "CATEGORY_IDLE";
    AvatarAnimationCategory["CategoryMessage"] = "CATEGORY_MESSAGE";
    AvatarAnimationCategory["CategoryPhotoPoses"] = "CATEGORY_PHOTO_POSES";
    AvatarAnimationCategory["CategoryPlayerExit"] = "CATEGORY_PLAYER_EXIT";
    AvatarAnimationCategory["CategoryPlayerJoin"] = "CATEGORY_PLAYER_JOIN";
    AvatarAnimationCategory["CategoryPlayerPickCard"] = "CATEGORY_PLAYER_PICK_CARD";
    AvatarAnimationCategory["CategoryPlayerSwapCard"] = "CATEGORY_PLAYER_SWAP_CARD";
    AvatarAnimationCategory["CategorySad"] = "CATEGORY_SAD";
    AvatarAnimationCategory["CategorySpotlightCrowd"] = "CATEGORY_SPOTLIGHT_CROWD";
    AvatarAnimationCategory["CategorySpotlightPodium"] = "CATEGORY_SPOTLIGHT_PODIUM";
    AvatarAnimationCategory["CategoryUnspecified"] = "CATEGORY_UNSPECIFIED";
    AvatarAnimationCategory["CategoryVictory"] = "CATEGORY_VICTORY";
    AvatarAnimationCategory["CategoryWsInChat"] = "CATEGORY_WS_IN_CHAT";
})(AvatarAnimationCategory || (exports.AvatarAnimationCategory = AvatarAnimationCategory = {}));
var AvatarAnimationHandedness;
(function (AvatarAnimationHandedness) {
    AvatarAnimationHandedness["HandednessBoth"] = "HANDEDNESS_BOTH";
    AvatarAnimationHandedness["HandednessLeft"] = "HANDEDNESS_LEFT";
    AvatarAnimationHandedness["HandednessRight"] = "HANDEDNESS_RIGHT";
    AvatarAnimationHandedness["HandednessUnspecified"] = "HANDEDNESS_UNSPECIFIED";
})(AvatarAnimationHandedness || (exports.AvatarAnimationHandedness = AvatarAnimationHandedness = {}));
var AvatarAvatarPartCategory;
(function (AvatarAvatarPartCategory) {
    AvatarAvatarPartCategory["CategoryBody"] = "CATEGORY_BODY";
    AvatarAvatarPartCategory["CategoryColorPreset"] = "CATEGORY_COLOR_PRESET";
    AvatarAvatarPartCategory["CategoryEyebrows"] = "CATEGORY_EYEBROWS";
    AvatarAvatarPartCategory["CategoryEyebrowsColor"] = "CATEGORY_EYEBROWS_COLOR";
    AvatarAvatarPartCategory["CategoryEyelashes"] = "CATEGORY_EYELASHES";
    AvatarAvatarPartCategory["CategoryEyelashesColor"] = "CATEGORY_EYELASHES_COLOR";
    AvatarAvatarPartCategory["CategoryEyes"] = "CATEGORY_EYES";
    AvatarAvatarPartCategory["CategoryFaceItem"] = "CATEGORY_FACE_ITEM";
    AvatarAvatarPartCategory["CategoryHair"] = "CATEGORY_HAIR";
    AvatarAvatarPartCategory["CategoryHairColor"] = "CATEGORY_HAIR_COLOR";
    AvatarAvatarPartCategory["CategoryHands"] = "CATEGORY_HANDS";
    AvatarAvatarPartCategory["CategoryHead"] = "CATEGORY_HEAD";
    AvatarAvatarPartCategory["CategoryHeadItem"] = "CATEGORY_HEAD_ITEM";
    AvatarAvatarPartCategory["CategoryLegs"] = "CATEGORY_LEGS";
    AvatarAvatarPartCategory["CategoryShoes"] = "CATEGORY_SHOES";
    AvatarAvatarPartCategory["CategorySkinColor"] = "CATEGORY_SKIN_COLOR";
    AvatarAvatarPartCategory["CategoryTeeth"] = "CATEGORY_TEETH";
    AvatarAvatarPartCategory["CategoryTorso"] = "CATEGORY_TORSO";
    AvatarAvatarPartCategory["CategoryUnspecified"] = "CATEGORY_UNSPECIFIED";
})(AvatarAvatarPartCategory || (exports.AvatarAvatarPartCategory = AvatarAvatarPartCategory = {}));
var AvatarGender;
(function (AvatarGender) {
    AvatarGender["GenderFemale"] = "GENDER_FEMALE";
    AvatarGender["GenderMale"] = "GENDER_MALE";
    AvatarGender["GenderUnspecified"] = "GENDER_UNSPECIFIED";
})(AvatarGender || (exports.AvatarGender = AvatarGender = {}));
var AvatarValidateAvatarCompositionResponseChangeReason;
(function (AvatarValidateAvatarCompositionResponseChangeReason) {
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartBodyRequired"] = "REASON_AVATAR_PART_BODY_REQUIRED";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartEyesRequired"] = "REASON_AVATAR_PART_EYES_REQUIRED";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartHeadRequired"] = "REASON_AVATAR_PART_HEAD_REQUIRED";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartLegsRequired"] = "REASON_AVATAR_PART_LEGS_REQUIRED";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartTorsoRequired"] = "REASON_AVATAR_PART_TORSO_REQUIRED";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartUnavailable"] = "REASON_AVATAR_PART_UNAVAILABLE";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonAvatarPartUnknown"] = "REASON_AVATAR_PART_UNKNOWN";
    AvatarValidateAvatarCompositionResponseChangeReason["ReasonUnspecified"] = "REASON_UNSPECIFIED";
})(AvatarValidateAvatarCompositionResponseChangeReason || (exports.AvatarValidateAvatarCompositionResponseChangeReason = AvatarValidateAvatarCompositionResponseChangeReason = {}));
var BadgeBadgeType;
(function (BadgeBadgeType) {
    BadgeBadgeType["TypeChannelModerator"] = "TYPE_CHANNEL_MODERATOR";
    BadgeBadgeType["TypeChannelSubscriber"] = "TYPE_CHANNEL_SUBSCRIBER";
    BadgeBadgeType["TypeClosedBetaCreator"] = "TYPE_CLOSED_BETA_CREATOR";
    BadgeBadgeType["TypeNoiceStaff"] = "TYPE_NOICE_STAFF";
    BadgeBadgeType["TypeStreamer"] = "TYPE_STREAMER";
    BadgeBadgeType["TypeSubsGifter"] = "TYPE_SUBS_GIFTER";
    BadgeBadgeType["TypeUnspecified"] = "TYPE_UNSPECIFIED";
})(BadgeBadgeType || (exports.BadgeBadgeType = BadgeBadgeType = {}));
var ChannelAppealStatus;
(function (ChannelAppealStatus) {
    ChannelAppealStatus["AppealStatusAccepted"] = "APPEAL_STATUS_ACCEPTED";
    ChannelAppealStatus["AppealStatusDeclined"] = "APPEAL_STATUS_DECLINED";
    ChannelAppealStatus["AppealStatusPending"] = "APPEAL_STATUS_PENDING";
    ChannelAppealStatus["AppealStatusUnspecified"] = "APPEAL_STATUS_UNSPECIFIED";
})(ChannelAppealStatus || (exports.ChannelAppealStatus = ChannelAppealStatus = {}));
var ChannelAssetType;
(function (ChannelAssetType) {
    ChannelAssetType["AssetTypeBanner"] = "ASSET_TYPE_BANNER";
    ChannelAssetType["AssetTypeLogo"] = "ASSET_TYPE_LOGO";
    ChannelAssetType["AssetTypeUnspecified"] = "ASSET_TYPE_UNSPECIFIED";
})(ChannelAssetType || (exports.ChannelAssetType = ChannelAssetType = {}));
var ChannelChannelFeature;
(function (ChannelChannelFeature) {
    ChannelChannelFeature["ChannelFeatureNoicePredictions"] = "CHANNEL_FEATURE_NOICE_PREDICTIONS";
    ChannelChannelFeature["ChannelFeatureStreaming"] = "CHANNEL_FEATURE_STREAMING";
    ChannelChannelFeature["ChannelFeatureUnspecified"] = "CHANNEL_FEATURE_UNSPECIFIED";
})(ChannelChannelFeature || (exports.ChannelChannelFeature = ChannelChannelFeature = {}));
var ChannelChannelLinkLinkType;
(function (ChannelChannelLinkLinkType) {
    ChannelChannelLinkLinkType["LinkTypeCustom"] = "LINK_TYPE_CUSTOM";
    ChannelChannelLinkLinkType["LinkTypeDiscord"] = "LINK_TYPE_DISCORD";
    ChannelChannelLinkLinkType["LinkTypeFacebook"] = "LINK_TYPE_FACEBOOK";
    ChannelChannelLinkLinkType["LinkTypeInstagram"] = "LINK_TYPE_INSTAGRAM";
    ChannelChannelLinkLinkType["LinkTypeTiktok"] = "LINK_TYPE_TIKTOK";
    ChannelChannelLinkLinkType["LinkTypeTwitter"] = "LINK_TYPE_TWITTER";
    ChannelChannelLinkLinkType["LinkTypeUnspecified"] = "LINK_TYPE_UNSPECIFIED";
    ChannelChannelLinkLinkType["LinkTypeYoutube"] = "LINK_TYPE_YOUTUBE";
})(ChannelChannelLinkLinkType || (exports.ChannelChannelLinkLinkType = ChannelChannelLinkLinkType = {}));
var ChannelChannelRole;
(function (ChannelChannelRole) {
    ChannelChannelRole["ChannelRoleModerator"] = "CHANNEL_ROLE_MODERATOR";
    ChannelChannelRole["ChannelRolePlatformModerator"] = "CHANNEL_ROLE_PLATFORM_MODERATOR";
    ChannelChannelRole["ChannelRoleStreamer"] = "CHANNEL_ROLE_STREAMER";
    ChannelChannelRole["ChannelRoleUnspecified"] = "CHANNEL_ROLE_UNSPECIFIED";
})(ChannelChannelRole || (exports.ChannelChannelRole = ChannelChannelRole = {}));
var ChannelLiveStatus;
(function (ChannelLiveStatus) {
    ChannelLiveStatus["LiveStatusLive"] = "LIVE_STATUS_LIVE";
    ChannelLiveStatus["LiveStatusOffline"] = "LIVE_STATUS_OFFLINE";
    ChannelLiveStatus["LiveStatusUnlisted"] = "LIVE_STATUS_UNLISTED";
    ChannelLiveStatus["LiveStatusUnspecified"] = "LIVE_STATUS_UNSPECIFIED";
})(ChannelLiveStatus || (exports.ChannelLiveStatus = ChannelLiveStatus = {}));
var ChannelModerationEventType;
(function (ChannelModerationEventType) {
    ChannelModerationEventType["ModerationEventTypeAutomodItemAccepted"] = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED";
    ChannelModerationEventType["ModerationEventTypeAutomodItemRejected"] = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED";
    ChannelModerationEventType["ModerationEventTypeBanAppealAccepted"] = "MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED";
    ChannelModerationEventType["ModerationEventTypeBanAppealRejected"] = "MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED";
    ChannelModerationEventType["ModerationEventTypeUnspecified"] = "MODERATION_EVENT_TYPE_UNSPECIFIED";
    ChannelModerationEventType["ModerationEventTypeUserBanned"] = "MODERATION_EVENT_TYPE_USER_BANNED";
    ChannelModerationEventType["ModerationEventTypeUserMuted"] = "MODERATION_EVENT_TYPE_USER_MUTED";
    ChannelModerationEventType["ModerationEventTypeUserUnbanned"] = "MODERATION_EVENT_TYPE_USER_UNBANNED";
})(ChannelModerationEventType || (exports.ChannelModerationEventType = ChannelModerationEventType = {}));
var ChannelSuspensionReason;
(function (ChannelSuspensionReason) {
    ChannelSuspensionReason["ReasonChannelDeleted"] = "REASON_CHANNEL_DELETED";
    ChannelSuspensionReason["ReasonUnspecified"] = "REASON_UNSPECIFIED";
})(ChannelSuspensionReason || (exports.ChannelSuspensionReason = ChannelSuspensionReason = {}));
var ChannelViolation;
(function (ChannelViolation) {
    ChannelViolation["ViolationOther"] = "VIOLATION_OTHER";
    ChannelViolation["ViolationSpam"] = "VIOLATION_SPAM";
    ChannelViolation["ViolationUnspecified"] = "VIOLATION_UNSPECIFIED";
})(ChannelViolation || (exports.ChannelViolation = ChannelViolation = {}));
var ChatAutomodDecision;
(function (ChatAutomodDecision) {
    ChatAutomodDecision["AutomodDecisionAccepted"] = "AUTOMOD_DECISION_ACCEPTED";
    ChatAutomodDecision["AutomodDecisionRejected"] = "AUTOMOD_DECISION_REJECTED";
    ChatAutomodDecision["AutomodDecisionUnspecified"] = "AUTOMOD_DECISION_UNSPECIFIED";
})(ChatAutomodDecision || (exports.ChatAutomodDecision = ChatAutomodDecision = {}));
var ChatAutomodLevel;
(function (ChatAutomodLevel) {
    ChatAutomodLevel["AutomodLevelHigh"] = "AUTOMOD_LEVEL_HIGH";
    ChatAutomodLevel["AutomodLevelLow"] = "AUTOMOD_LEVEL_LOW";
    ChatAutomodLevel["AutomodLevelUnspecified"] = "AUTOMOD_LEVEL_UNSPECIFIED";
})(ChatAutomodLevel || (exports.ChatAutomodLevel = ChatAutomodLevel = {}));
var ChatChatRole;
(function (ChatChatRole) {
    ChatChatRole["ChatRoleMember"] = "CHAT_ROLE_MEMBER";
    ChatChatRole["ChatRoleModerator"] = "CHAT_ROLE_MODERATOR";
    ChatChatRole["ChatRolePlatformModerator"] = "CHAT_ROLE_PLATFORM_MODERATOR";
    ChatChatRole["ChatRoleStreamer"] = "CHAT_ROLE_STREAMER";
    ChatChatRole["ChatRoleUnspecified"] = "CHAT_ROLE_UNSPECIFIED";
})(ChatChatRole || (exports.ChatChatRole = ChatChatRole = {}));
var ChatModerationItemStatus;
(function (ChatModerationItemStatus) {
    ChatModerationItemStatus["StatusAllowed"] = "STATUS_ALLOWED";
    ChatModerationItemStatus["StatusDenied"] = "STATUS_DENIED";
    ChatModerationItemStatus["StatusPending"] = "STATUS_PENDING";
    ChatModerationItemStatus["StatusUnspecified"] = "STATUS_UNSPECIFIED";
})(ChatModerationItemStatus || (exports.ChatModerationItemStatus = ChatModerationItemStatus = {}));
var ChatModerationStatus;
(function (ChatModerationStatus) {
    ChatModerationStatus["ModerationStatusApproved"] = "MODERATION_STATUS_APPROVED";
    ChatModerationStatus["ModerationStatusUnspecified"] = "MODERATION_STATUS_UNSPECIFIED";
})(ChatModerationStatus || (exports.ChatModerationStatus = ChatModerationStatus = {}));
var ChatReason;
(function (ChatReason) {
    ChatReason["ReasonOther"] = "REASON_OTHER";
    ChatReason["ReasonSpam"] = "REASON_SPAM";
    ChatReason["ReasonUnspecified"] = "REASON_UNSPECIFIED";
})(ChatReason || (exports.ChatReason = ChatReason = {}));
var ChatUserLabel;
(function (ChatUserLabel) {
    ChatUserLabel["UserLabelModerator"] = "USER_LABEL_MODERATOR";
    ChatUserLabel["UserLabelStaff"] = "USER_LABEL_STAFF";
    ChatUserLabel["UserLabelStreamer"] = "USER_LABEL_STREAMER";
    ChatUserLabel["UserLabelUnspecified"] = "USER_LABEL_UNSPECIFIED";
    ChatUserLabel["UserLabelViewer"] = "USER_LABEL_VIEWER";
})(ChatUserLabel || (exports.ChatUserLabel = ChatUserLabel = {}));
var ClassificationTextRisk;
(function (ClassificationTextRisk) {
    ClassificationTextRisk["TextRiskDangerous"] = "TEXT_RISK_DANGEROUS";
    ClassificationTextRisk["TextRiskExplicit"] = "TEXT_RISK_EXPLICIT";
    ClassificationTextRisk["TextRiskLow"] = "TEXT_RISK_LOW";
    ClassificationTextRisk["TextRiskMature"] = "TEXT_RISK_MATURE";
    ClassificationTextRisk["TextRiskNotable"] = "TEXT_RISK_NOTABLE";
    ClassificationTextRisk["TextRiskQuestionable"] = "TEXT_RISK_QUESTIONABLE";
    ClassificationTextRisk["TextRiskSafe"] = "TEXT_RISK_SAFE";
    ClassificationTextRisk["TextRiskUnknown"] = "TEXT_RISK_UNKNOWN";
    ClassificationTextRisk["TextRiskUnspecified"] = "TEXT_RISK_UNSPECIFIED";
})(ClassificationTextRisk || (exports.ClassificationTextRisk = ClassificationTextRisk = {}));
var ClassificationTopic;
(function (ClassificationTopic) {
    ClassificationTopic["TopicAlarm"] = "TOPIC_ALARM";
    ClassificationTopic["TopicBullying"] = "TOPIC_BULLYING";
    ClassificationTopic["TopicChildGrooming"] = "TOPIC_CHILD_GROOMING";
    ClassificationTopic["TopicDrugsAndAlcohol"] = "TOPIC_DRUGS_AND_ALCOHOL";
    ClassificationTopic["TopicExtremism"] = "TOPIC_EXTREMISM";
    ClassificationTopic["TopicFraud"] = "TOPIC_FRAUD";
    ClassificationTopic["TopicGeneralRisk"] = "TOPIC_GENERAL_RISK";
    ClassificationTopic["TopicHateSpeech"] = "TOPIC_HATE_SPEECH";
    ClassificationTopic["TopicInApp"] = "TOPIC_IN_APP";
    ClassificationTopic["TopicJunk"] = "TOPIC_JUNK";
    ClassificationTopic["TopicPersonalIdentifyingInfo"] = "TOPIC_PERSONAL_IDENTIFYING_INFO";
    ClassificationTopic["TopicPolitics"] = "TOPIC_POLITICS";
    ClassificationTopic["TopicPublicThreat"] = "TOPIC_PUBLIC_THREAT";
    ClassificationTopic["TopicRealName"] = "TOPIC_REAL_NAME";
    ClassificationTopic["TopicRelationshipAndSexualContent"] = "TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT";
    ClassificationTopic["TopicReligious"] = "TOPIC_RELIGIOUS";
    ClassificationTopic["TopicSentiment"] = "TOPIC_SENTIMENT";
    ClassificationTopic["TopicSubversive"] = "TOPIC_SUBVERSIVE";
    ClassificationTopic["TopicUnspecified"] = "TOPIC_UNSPECIFIED";
    ClassificationTopic["TopicViolence"] = "TOPIC_VIOLENCE";
    ClassificationTopic["TopicVulgarity"] = "TOPIC_VULGARITY";
    ClassificationTopic["TopicWebsite"] = "TOPIC_WEBSITE";
})(ClassificationTopic || (exports.ClassificationTopic = ClassificationTopic = {}));
var ClassificationTrustLevel;
(function (ClassificationTrustLevel) {
    ClassificationTrustLevel["TrustLevelDefault"] = "TRUST_LEVEL_DEFAULT";
    ClassificationTrustLevel["TrustLevelMute"] = "TRUST_LEVEL_MUTE";
    ClassificationTrustLevel["TrustLevelNotTrusted"] = "TRUST_LEVEL_NOT_TRUSTED";
    ClassificationTrustLevel["TrustLevelSuperuser"] = "TRUST_LEVEL_SUPERUSER";
    ClassificationTrustLevel["TrustLevelTrusted"] = "TRUST_LEVEL_TRUSTED";
    ClassificationTrustLevel["TrustLevelUnspecified"] = "TRUST_LEVEL_UNSPECIFIED";
})(ClassificationTrustLevel || (exports.ClassificationTrustLevel = ClassificationTrustLevel = {}));
var FriendsFriendStatusUpdateEventUpdateType;
(function (FriendsFriendStatusUpdateEventUpdateType) {
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeFriendInvitation"] = "UPDATE_TYPE_FRIEND_INVITATION";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeInvitationAccepted"] = "UPDATE_TYPE_INVITATION_ACCEPTED";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeInvitationCancelled"] = "UPDATE_TYPE_INVITATION_CANCELLED";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeUnspecified"] = "UPDATE_TYPE_UNSPECIFIED";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeUserBlocked"] = "UPDATE_TYPE_USER_BLOCKED";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeUserUnblocked"] = "UPDATE_TYPE_USER_UNBLOCKED";
    FriendsFriendStatusUpdateEventUpdateType["UpdateTypeUserUnfriended"] = "UPDATE_TYPE_USER_UNFRIENDED";
})(FriendsFriendStatusUpdateEventUpdateType || (exports.FriendsFriendStatusUpdateEventUpdateType = FriendsFriendStatusUpdateEventUpdateType = {}));
var FriendsFriendshipStatusStatus;
(function (FriendsFriendshipStatusStatus) {
    FriendsFriendshipStatusStatus["StatusBlocked"] = "STATUS_BLOCKED";
    FriendsFriendshipStatusStatus["StatusBlockedBy"] = "STATUS_BLOCKED_BY";
    FriendsFriendshipStatusStatus["StatusFriend"] = "STATUS_FRIEND";
    FriendsFriendshipStatusStatus["StatusFriendRequestReceived"] = "STATUS_FRIEND_REQUEST_RECEIVED";
    FriendsFriendshipStatusStatus["StatusFriendRequestSent"] = "STATUS_FRIEND_REQUEST_SENT";
    FriendsFriendshipStatusStatus["StatusUnspecified"] = "STATUS_UNSPECIFIED";
})(FriendsFriendshipStatusStatus || (exports.FriendsFriendshipStatusStatus = FriendsFriendshipStatusStatus = {}));
var FtueDismissalType;
(function (FtueDismissalType) {
    FtueDismissalType["DismissalTypeActionTaken"] = "DISMISSAL_TYPE_ACTION_TAKEN";
    FtueDismissalType["DismissalTypeClosed"] = "DISMISSAL_TYPE_CLOSED";
    FtueDismissalType["DismissalTypeUnspecified"] = "DISMISSAL_TYPE_UNSPECIFIED";
})(FtueDismissalType || (exports.FtueDismissalType = FtueDismissalType = {}));
var GameCardAssetType;
(function (GameCardAssetType) {
    GameCardAssetType["AssetTypeThumbnail"] = "ASSET_TYPE_THUMBNAIL";
    GameCardAssetType["AssetTypeUnspecified"] = "ASSET_TYPE_UNSPECIFIED";
    GameCardAssetType["AssetTypeVideo"] = "ASSET_TYPE_VIDEO";
})(GameCardAssetType || (exports.GameCardAssetType = GameCardAssetType = {}));
var GameCardHighScoringCardTimingsSpeed;
(function (GameCardHighScoringCardTimingsSpeed) {
    GameCardHighScoringCardTimingsSpeed["SpeedDefault"] = "SPEED_DEFAULT";
    GameCardHighScoringCardTimingsSpeed["SpeedFast"] = "SPEED_FAST";
    GameCardHighScoringCardTimingsSpeed["SpeedFastest"] = "SPEED_FASTEST";
    GameCardHighScoringCardTimingsSpeed["SpeedSlow"] = "SPEED_SLOW";
    GameCardHighScoringCardTimingsSpeed["SpeedSlowest"] = "SPEED_SLOWEST";
    GameCardHighScoringCardTimingsSpeed["SpeedUnspecified"] = "SPEED_UNSPECIFIED";
})(GameCardHighScoringCardTimingsSpeed || (exports.GameCardHighScoringCardTimingsSpeed = GameCardHighScoringCardTimingsSpeed = {}));
var GameLogicContextualTeamActionStatus;
(function (GameLogicContextualTeamActionStatus) {
    GameLogicContextualTeamActionStatus["ContextualTeamActionStatusFailed"] = "CONTEXTUAL_TEAM_ACTION_STATUS_FAILED";
    GameLogicContextualTeamActionStatus["ContextualTeamActionStatusOngoing"] = "CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING";
    GameLogicContextualTeamActionStatus["ContextualTeamActionStatusSucceeded"] = "CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED";
    GameLogicContextualTeamActionStatus["ContextualTeamActionStatusUnspecified"] = "CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED";
})(GameLogicContextualTeamActionStatus || (exports.GameLogicContextualTeamActionStatus = GameLogicContextualTeamActionStatus = {}));
var GameLogicContextualTeamActionType;
(function (GameLogicContextualTeamActionType) {
    GameLogicContextualTeamActionType["ContextualTeamActionTypeHighScoringCardPromoted"] = "CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED";
    GameLogicContextualTeamActionType["ContextualTeamActionTypeStreamerActivated"] = "CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED";
    GameLogicContextualTeamActionType["ContextualTeamActionTypeUnspecified"] = "CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED";
})(GameLogicContextualTeamActionType || (exports.GameLogicContextualTeamActionType = GameLogicContextualTeamActionType = {}));
var GameLogicMatchBonusType;
(function (GameLogicMatchBonusType) {
    GameLogicMatchBonusType["MatchBonusTypeUnspecified"] = "MATCH_BONUS_TYPE_UNSPECIFIED";
    GameLogicMatchBonusType["MatchBonusTypeVictoryRoyal"] = "MATCH_BONUS_TYPE_VICTORY_ROYAL";
})(GameLogicMatchBonusType || (exports.GameLogicMatchBonusType = GameLogicMatchBonusType = {}));
var GameLogicStreamStateMatchState;
(function (GameLogicStreamStateMatchState) {
    GameLogicStreamStateMatchState["MatchStateActive"] = "MATCH_STATE_ACTIVE";
    GameLogicStreamStateMatchState["MatchStateEnded"] = "MATCH_STATE_ENDED";
    GameLogicStreamStateMatchState["MatchStatePaused"] = "MATCH_STATE_PAUSED";
    GameLogicStreamStateMatchState["MatchStateUnspecified"] = "MATCH_STATE_UNSPECIFIED";
})(GameLogicStreamStateMatchState || (exports.GameLogicStreamStateMatchState = GameLogicStreamStateMatchState = {}));
var GameLogicStreamStateMatchType;
(function (GameLogicStreamStateMatchType) {
    GameLogicStreamStateMatchType["MatchTypeMultiRound"] = "MATCH_TYPE_MULTI_ROUND";
    GameLogicStreamStateMatchType["MatchTypeSingleRound"] = "MATCH_TYPE_SINGLE_ROUND";
    GameLogicStreamStateMatchType["MatchTypeUnspecified"] = "MATCH_TYPE_UNSPECIFIED";
})(GameLogicStreamStateMatchType || (exports.GameLogicStreamStateMatchType = GameLogicStreamStateMatchType = {}));
var GameLogicStreamStateRoundPhase;
(function (GameLogicStreamStateRoundPhase) {
    GameLogicStreamStateRoundPhase["RoundPhaseBuying"] = "ROUND_PHASE_BUYING";
    GameLogicStreamStateRoundPhase["RoundPhaseCompeting"] = "ROUND_PHASE_COMPETING";
    GameLogicStreamStateRoundPhase["RoundPhaseEnded"] = "ROUND_PHASE_ENDED";
    GameLogicStreamStateRoundPhase["RoundPhaseUnspecified"] = "ROUND_PHASE_UNSPECIFIED";
})(GameLogicStreamStateRoundPhase || (exports.GameLogicStreamStateRoundPhase = GameLogicStreamStateRoundPhase = {}));
var GameStateCalModuleBinaryOp;
(function (GameStateCalModuleBinaryOp) {
    GameStateCalModuleBinaryOp["BinaryOpAnd"] = "BINARY_OP_AND";
    GameStateCalModuleBinaryOp["BinaryOpOr"] = "BINARY_OP_OR";
    GameStateCalModuleBinaryOp["BinaryOpUnspecified"] = "BINARY_OP_UNSPECIFIED";
})(GameStateCalModuleBinaryOp || (exports.GameStateCalModuleBinaryOp = GameStateCalModuleBinaryOp = {}));
var GameStateCalModuleUnaryOp;
(function (GameStateCalModuleUnaryOp) {
    GameStateCalModuleUnaryOp["UnaryOpNot"] = "UNARY_OP_NOT";
    GameStateCalModuleUnaryOp["UnaryOpUnspecified"] = "UNARY_OP_UNSPECIFIED";
})(GameStateCalModuleUnaryOp || (exports.GameStateCalModuleUnaryOp = GameStateCalModuleUnaryOp = {}));
var GameStateIntComparisonOperator;
(function (GameStateIntComparisonOperator) {
    GameStateIntComparisonOperator["IntComparisonOperatorEqual"] = "INT_COMPARISON_OPERATOR_EQUAL";
    GameStateIntComparisonOperator["IntComparisonOperatorGreater"] = "INT_COMPARISON_OPERATOR_GREATER";
    GameStateIntComparisonOperator["IntComparisonOperatorGreaterOrEqual"] = "INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL";
    GameStateIntComparisonOperator["IntComparisonOperatorLess"] = "INT_COMPARISON_OPERATOR_LESS";
    GameStateIntComparisonOperator["IntComparisonOperatorLessOrEqual"] = "INT_COMPARISON_OPERATOR_LESS_OR_EQUAL";
    GameStateIntComparisonOperator["IntComparisonOperatorNotEqual"] = "INT_COMPARISON_OPERATOR_NOT_EQUAL";
    GameStateIntComparisonOperator["IntComparisonOperatorUnspecified"] = "INT_COMPARISON_OPERATOR_UNSPECIFIED";
})(GameStateIntComparisonOperator || (exports.GameStateIntComparisonOperator = GameStateIntComparisonOperator = {}));
var GameStateStringComparisonOperator;
(function (GameStateStringComparisonOperator) {
    GameStateStringComparisonOperator["StringComparisonOperatorEqual"] = "STRING_COMPARISON_OPERATOR_EQUAL";
    GameStateStringComparisonOperator["StringComparisonOperatorIn"] = "STRING_COMPARISON_OPERATOR_IN";
    GameStateStringComparisonOperator["StringComparisonOperatorNotEqual"] = "STRING_COMPARISON_OPERATOR_NOT_EQUAL";
    GameStateStringComparisonOperator["StringComparisonOperatorNotIn"] = "STRING_COMPARISON_OPERATOR_NOT_IN";
    GameStateStringComparisonOperator["StringComparisonOperatorUnspecified"] = "STRING_COMPARISON_OPERATOR_UNSPECIFIED";
})(GameStateStringComparisonOperator || (exports.GameStateStringComparisonOperator = GameStateStringComparisonOperator = {}));
var GoalCardGoalCardTargetType;
(function (GoalCardGoalCardTargetType) {
    GoalCardGoalCardTargetType["TargetTypeSingleUpdate"] = "TARGET_TYPE_SINGLE_UPDATE";
    GoalCardGoalCardTargetType["TargetTypeTotal"] = "TARGET_TYPE_TOTAL";
    GoalCardGoalCardTargetType["TargetTypeUnspecified"] = "TARGET_TYPE_UNSPECIFIED";
    GoalCardGoalCardTargetType["TargetTypeUpdateCount"] = "TARGET_TYPE_UPDATE_COUNT";
})(GoalCardGoalCardTargetType || (exports.GoalCardGoalCardTargetType = GoalCardGoalCardTargetType = {}));
var InvitationInvitationCodeUpdateEventUpdateType;
(function (InvitationInvitationCodeUpdateEventUpdateType) {
    InvitationInvitationCodeUpdateEventUpdateType["UpdateTypeCreated"] = "UPDATE_TYPE_CREATED";
    InvitationInvitationCodeUpdateEventUpdateType["UpdateTypeUnspecified"] = "UPDATE_TYPE_UNSPECIFIED";
    InvitationInvitationCodeUpdateEventUpdateType["UpdateTypeUsed"] = "UPDATE_TYPE_USED";
})(InvitationInvitationCodeUpdateEventUpdateType || (exports.InvitationInvitationCodeUpdateEventUpdateType = InvitationInvitationCodeUpdateEventUpdateType = {}));
var ItemItemType;
(function (ItemItemType) {
    ItemItemType["TypeAvatarItem"] = "TYPE_AVATAR_ITEM";
    ItemItemType["TypeBootstrap"] = "TYPE_BOOTSTRAP";
    ItemItemType["TypeDailyGoalCardSlot"] = "TYPE_DAILY_GOAL_CARD_SLOT";
    ItemItemType["TypeEmoji"] = "TYPE_EMOJI";
    ItemItemType["TypeEmote"] = "TYPE_EMOTE";
    ItemItemType["TypeGameCard"] = "TYPE_GAME_CARD";
    ItemItemType["TypeStreamerCard"] = "TYPE_STREAMER_CARD";
    ItemItemType["TypeSubscription"] = "TYPE_SUBSCRIPTION";
    ItemItemType["TypeUnlock"] = "TYPE_UNLOCK";
    ItemItemType["TypeUnspecified"] = "TYPE_UNSPECIFIED";
})(ItemItemType || (exports.ItemItemType = ItemItemType = {}));
var ModerationAppealStatus;
(function (ModerationAppealStatus) {
    ModerationAppealStatus["AppealStatusAccepted"] = "APPEAL_STATUS_ACCEPTED";
    ModerationAppealStatus["AppealStatusDeclined"] = "APPEAL_STATUS_DECLINED";
    ModerationAppealStatus["AppealStatusPending"] = "APPEAL_STATUS_PENDING";
    ModerationAppealStatus["AppealStatusUnspecified"] = "APPEAL_STATUS_UNSPECIFIED";
})(ModerationAppealStatus || (exports.ModerationAppealStatus = ModerationAppealStatus = {}));
var ModerationBanStatus;
(function (ModerationBanStatus) {
    ModerationBanStatus["BanStatusActive"] = "BAN_STATUS_ACTIVE";
    ModerationBanStatus["BanStatusInactive"] = "BAN_STATUS_INACTIVE";
    ModerationBanStatus["BanStatusUnspecified"] = "BAN_STATUS_UNSPECIFIED";
})(ModerationBanStatus || (exports.ModerationBanStatus = ModerationBanStatus = {}));
var ModerationViolation;
(function (ModerationViolation) {
    ModerationViolation["ViolationChildSafety"] = "VIOLATION_CHILD_SAFETY";
    ModerationViolation["ViolationCircumventionEvasion"] = "VIOLATION_CIRCUMVENTION_EVASION";
    ModerationViolation["ViolationExtremism"] = "VIOLATION_EXTREMISM";
    ModerationViolation["ViolationGraphicRealWorldMedia"] = "VIOLATION_GRAPHIC_REAL_WORLD_MEDIA";
    ModerationViolation["ViolationHarassmentTargetedAbuse"] = "VIOLATION_HARASSMENT_TARGETED_ABUSE";
    ModerationViolation["ViolationHatefulBehavior"] = "VIOLATION_HATEFUL_BEHAVIOR";
    ModerationViolation["ViolationIllegalHarmfulAndRestrictedActivity"] = "VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY";
    ModerationViolation["ViolationOffPlatformBehavior"] = "VIOLATION_OFF_PLATFORM_BEHAVIOR";
    ModerationViolation["ViolationOther"] = "VIOLATION_OTHER";
    ModerationViolation["ViolationPlatformManipulation"] = "VIOLATION_PLATFORM_MANIPULATION";
    ModerationViolation["ViolationRepeatedCopyrightInfringement"] = "VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT";
    ModerationViolation["ViolationResponsibleStreaming"] = "VIOLATION_RESPONSIBLE_STREAMING";
    ModerationViolation["ViolationRestrictedGamesAndGamesWithGraphicFootage"] = "VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE";
    ModerationViolation["ViolationSelfHarm"] = "VIOLATION_SELF_HARM";
    ModerationViolation["ViolationSexualBehavior"] = "VIOLATION_SEXUAL_BEHAVIOR";
    ModerationViolation["ViolationSpam"] = "VIOLATION_SPAM";
    ModerationViolation["ViolationUnspecified"] = "VIOLATION_UNSPECIFIED";
    ModerationViolation["ViolationViolence"] = "VIOLATION_VIOLENCE";
})(ModerationViolation || (exports.ModerationViolation = ModerationViolation = {}));
var PartyPartyInvitationUpdateEventUpdateType;
(function (PartyPartyInvitationUpdateEventUpdateType) {
    PartyPartyInvitationUpdateEventUpdateType["UpdateTypeInvitationAccepted"] = "UPDATE_TYPE_INVITATION_ACCEPTED";
    PartyPartyInvitationUpdateEventUpdateType["UpdateTypeInvitationCreated"] = "UPDATE_TYPE_INVITATION_CREATED";
    PartyPartyInvitationUpdateEventUpdateType["UpdateTypeInvitationDeclined"] = "UPDATE_TYPE_INVITATION_DECLINED";
    PartyPartyInvitationUpdateEventUpdateType["UpdateTypeInvitationDeleted"] = "UPDATE_TYPE_INVITATION_DELETED";
    PartyPartyInvitationUpdateEventUpdateType["UpdateTypeUnspecified"] = "UPDATE_TYPE_UNSPECIFIED";
})(PartyPartyInvitationUpdateEventUpdateType || (exports.PartyPartyInvitationUpdateEventUpdateType = PartyPartyInvitationUpdateEventUpdateType = {}));
var PaymentCurrency;
(function (PaymentCurrency) {
    PaymentCurrency["CurrencyEur"] = "CURRENCY_EUR";
    PaymentCurrency["CurrencyGbp"] = "CURRENCY_GBP";
    PaymentCurrency["CurrencyUnspecified"] = "CURRENCY_UNSPECIFIED";
    PaymentCurrency["CurrencyUsd"] = "CURRENCY_USD";
})(PaymentCurrency || (exports.PaymentCurrency = PaymentCurrency = {}));
var PaymentPaymentStatus;
(function (PaymentPaymentStatus) {
    PaymentPaymentStatus["PaymentStatusExpired"] = "PAYMENT_STATUS_EXPIRED";
    PaymentPaymentStatus["PaymentStatusFailed"] = "PAYMENT_STATUS_FAILED";
    PaymentPaymentStatus["PaymentStatusPending"] = "PAYMENT_STATUS_PENDING";
    PaymentPaymentStatus["PaymentStatusReversed"] = "PAYMENT_STATUS_REVERSED";
    PaymentPaymentStatus["PaymentStatusSuccess"] = "PAYMENT_STATUS_SUCCESS";
    PaymentPaymentStatus["PaymentStatusUnspecified"] = "PAYMENT_STATUS_UNSPECIFIED";
})(PaymentPaymentStatus || (exports.PaymentPaymentStatus = PaymentPaymentStatus = {}));
var ProfilePresenceStatus;
(function (ProfilePresenceStatus) {
    ProfilePresenceStatus["PresenceStatusOffline"] = "PRESENCE_STATUS_OFFLINE";
    ProfilePresenceStatus["PresenceStatusOnline"] = "PRESENCE_STATUS_ONLINE";
    ProfilePresenceStatus["PresenceStatusUnspecified"] = "PRESENCE_STATUS_UNSPECIFIED";
})(ProfilePresenceStatus || (exports.ProfilePresenceStatus = ProfilePresenceStatus = {}));
var ProfilePrivacySettingsVisibility;
(function (ProfilePrivacySettingsVisibility) {
    ProfilePrivacySettingsVisibility["VisibilityAll"] = "VISIBILITY_ALL";
    ProfilePrivacySettingsVisibility["VisibilityFriends"] = "VISIBILITY_FRIENDS";
    ProfilePrivacySettingsVisibility["VisibilityOnlyMe"] = "VISIBILITY_ONLY_ME";
    ProfilePrivacySettingsVisibility["VisibilityUnspecified"] = "VISIBILITY_UNSPECIFIED";
})(ProfilePrivacySettingsVisibility || (exports.ProfilePrivacySettingsVisibility = ProfilePrivacySettingsVisibility = {}));
var ProfileProfileVisibility;
(function (ProfileProfileVisibility) {
    ProfileProfileVisibility["ProfileVisibilityPrivate"] = "PROFILE_VISIBILITY_PRIVATE";
    ProfileProfileVisibility["ProfileVisibilityPublic"] = "PROFILE_VISIBILITY_PUBLIC";
    ProfileProfileVisibility["ProfileVisibilityUnspecified"] = "PROFILE_VISIBILITY_UNSPECIFIED";
})(ProfileProfileVisibility || (exports.ProfileProfileVisibility = ProfileProfileVisibility = {}));
var RarityRarity;
(function (RarityRarity) {
    RarityRarity["RarityCommon"] = "RARITY_COMMON";
    RarityRarity["RarityEpic"] = "RARITY_EPIC";
    RarityRarity["RarityLegendary"] = "RARITY_LEGENDARY";
    RarityRarity["RarityRare"] = "RARITY_RARE";
    RarityRarity["RarityUncommon"] = "RARITY_UNCOMMON";
    RarityRarity["RarityUnspecified"] = "RARITY_UNSPECIFIED";
})(RarityRarity || (exports.RarityRarity = RarityRarity = {}));
var ReasonRevenueRecipientKind;
(function (ReasonRevenueRecipientKind) {
    ReasonRevenueRecipientKind["KindChannel"] = "KIND_CHANNEL";
    ReasonRevenueRecipientKind["KindPlatform"] = "KIND_PLATFORM";
    ReasonRevenueRecipientKind["KindUnspecified"] = "KIND_UNSPECIFIED";
})(ReasonRevenueRecipientKind || (exports.ReasonRevenueRecipientKind = ReasonRevenueRecipientKind = {}));
var RenderingCameraTransitionRequestTransitionTarget;
(function (RenderingCameraTransitionRequestTransitionTarget) {
    RenderingCameraTransitionRequestTransitionTarget["TransitionTargetArena"] = "TRANSITION_TARGET_ARENA";
    RenderingCameraTransitionRequestTransitionTarget["TransitionTargetCameraDrive1"] = "TRANSITION_TARGET_CAMERA_DRIVE1";
    RenderingCameraTransitionRequestTransitionTarget["TransitionTargetSpotlight"] = "TRANSITION_TARGET_SPOTLIGHT";
    RenderingCameraTransitionRequestTransitionTarget["TransitionTargetUnspecified"] = "TRANSITION_TARGET_UNSPECIFIED";
})(RenderingCameraTransitionRequestTransitionTarget || (exports.RenderingCameraTransitionRequestTransitionTarget = RenderingCameraTransitionRequestTransitionTarget = {}));
var SearchEntityType;
(function (SearchEntityType) {
    SearchEntityType["EntityTypeChannel"] = "ENTITY_TYPE_CHANNEL";
    SearchEntityType["EntityTypeUnspecified"] = "ENTITY_TYPE_UNSPECIFIED";
    SearchEntityType["EntityTypeUser"] = "ENTITY_TYPE_USER";
})(SearchEntityType || (exports.SearchEntityType = SearchEntityType = {}));
var StoreV2ItemType;
(function (StoreV2ItemType) {
    StoreV2ItemType["ItemTypeCurrencyPack"] = "ITEM_TYPE_CURRENCY_PACK";
    StoreV2ItemType["ItemTypeGiftSubscription"] = "ITEM_TYPE_GIFT_SUBSCRIPTION";
    StoreV2ItemType["ItemTypePremiumCardBundle"] = "ITEM_TYPE_PREMIUM_CARD_BUNDLE";
    StoreV2ItemType["ItemTypeStandardCardBundle"] = "ITEM_TYPE_STANDARD_CARD_BUNDLE";
    StoreV2ItemType["ItemTypeStreamerCard"] = "ITEM_TYPE_STREAMER_CARD";
    StoreV2ItemType["ItemTypeUnspecified"] = "ITEM_TYPE_UNSPECIFIED";
})(StoreV2ItemType || (exports.StoreV2ItemType = StoreV2ItemType = {}));
var StoreV2RecipientRestriction;
(function (StoreV2RecipientRestriction) {
    StoreV2RecipientRestriction["RecipientRestrictionGiftOnly"] = "RECIPIENT_RESTRICTION_GIFT_ONLY";
    StoreV2RecipientRestriction["RecipientRestrictionSelfOnly"] = "RECIPIENT_RESTRICTION_SELF_ONLY";
    StoreV2RecipientRestriction["RecipientRestrictionUnspecified"] = "RECIPIENT_RESTRICTION_UNSPECIFIED";
})(StoreV2RecipientRestriction || (exports.StoreV2RecipientRestriction = StoreV2RecipientRestriction = {}));
var StoreV2StoreType;
(function (StoreV2StoreType) {
    StoreV2StoreType["StoreTypeChannel"] = "STORE_TYPE_CHANNEL";
    StoreV2StoreType["StoreTypePlatform"] = "STORE_TYPE_PLATFORM";
    StoreV2StoreType["StoreTypeUnspecified"] = "STORE_TYPE_UNSPECIFIED";
})(StoreV2StoreType || (exports.StoreV2StoreType = StoreV2StoreType = {}));
var StreamDeploymentStreamDeploymentStatusComponentStatus;
(function (StreamDeploymentStreamDeploymentStatusComponentStatus) {
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusContainersUnready"] = "COMPONENT_STATUS_CONTAINERS_UNREADY";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusDeployingContainers"] = "COMPONENT_STATUS_DEPLOYING_CONTAINERS";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusDeployingPod"] = "COMPONENT_STATUS_DEPLOYING_POD";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusDeploymentStarted"] = "COMPONENT_STATUS_DEPLOYMENT_STARTED";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusDisabled"] = "COMPONENT_STATUS_DISABLED";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusOffline"] = "COMPONENT_STATUS_OFFLINE";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusProvisioningNode"] = "COMPONENT_STATUS_PROVISIONING_NODE";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusReady"] = "COMPONENT_STATUS_READY";
    StreamDeploymentStreamDeploymentStatusComponentStatus["ComponentStatusUnspecified"] = "COMPONENT_STATUS_UNSPECIFIED";
})(StreamDeploymentStreamDeploymentStatusComponentStatus || (exports.StreamDeploymentStreamDeploymentStatusComponentStatus = StreamDeploymentStreamDeploymentStatusComponentStatus = {}));
var StreamIngestConfigStreamingStatus;
(function (StreamIngestConfigStreamingStatus) {
    StreamIngestConfigStreamingStatus["StreamingStatusStreamingDisabled"] = "STREAMING_STATUS_STREAMING_DISABLED";
    StreamIngestConfigStreamingStatus["StreamingStatusUnspecified"] = "STREAMING_STATUS_UNSPECIFIED";
    StreamIngestConfigStreamingStatus["StreamingStatusUserSuspended"] = "STREAMING_STATUS_USER_SUSPENDED";
})(StreamIngestConfigStreamingStatus || (exports.StreamIngestConfigStreamingStatus = StreamIngestConfigStreamingStatus = {}));
var StreamerStreamEventFilterEventType;
(function (StreamerStreamEventFilterEventType) {
    StreamerStreamEventFilterEventType["EventTypeActiveCardSucceeded"] = "EVENT_TYPE_ACTIVE_CARD_SUCCEEDED";
    StreamerStreamEventFilterEventType["EventTypeChannelFollowed"] = "EVENT_TYPE_CHANNEL_FOLLOWED";
    StreamerStreamEventFilterEventType["EventTypeChannelSubscribed"] = "EVENT_TYPE_CHANNEL_SUBSCRIBED";
    StreamerStreamEventFilterEventType["EventTypeChannelSubscriptionGifted"] = "EVENT_TYPE_CHANNEL_SUBSCRIPTION_GIFTED";
    StreamerStreamEventFilterEventType["EventTypeHighScoringCardPromoted"] = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED";
    StreamerStreamEventFilterEventType["EventTypePlayerJoined"] = "EVENT_TYPE_PLAYER_JOINED";
    StreamerStreamEventFilterEventType["EventTypeUnspecified"] = "EVENT_TYPE_UNSPECIFIED";
})(StreamerStreamEventFilterEventType || (exports.StreamerStreamEventFilterEventType = StreamerStreamEventFilterEventType = {}));
var SubscriptionChannelSubscriptionCancelReason;
(function (SubscriptionChannelSubscriptionCancelReason) {
    SubscriptionChannelSubscriptionCancelReason["CancelReasonCurrencyIncompatibleWithGateway"] = "CANCEL_REASON_CURRENCY_INCOMPATIBLE_WITH_GATEWAY";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonFraudReviewFailed"] = "CANCEL_REASON_FRAUD_REVIEW_FAILED";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonNonCompliantCustomer"] = "CANCEL_REASON_NON_COMPLIANT_CUSTOMER";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonNonCompliantEuCustomer"] = "CANCEL_REASON_NON_COMPLIANT_EU_CUSTOMER";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonNotPaid"] = "CANCEL_REASON_NOT_PAID";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonNoCard"] = "CANCEL_REASON_NO_CARD";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonTaxCalculationFailed"] = "CANCEL_REASON_TAX_CALCULATION_FAILED";
    SubscriptionChannelSubscriptionCancelReason["CancelReasonUnspecified"] = "CANCEL_REASON_UNSPECIFIED";
})(SubscriptionChannelSubscriptionCancelReason || (exports.SubscriptionChannelSubscriptionCancelReason = SubscriptionChannelSubscriptionCancelReason = {}));
var SubscriptionChannelSubscriptionProvider;
(function (SubscriptionChannelSubscriptionProvider) {
    SubscriptionChannelSubscriptionProvider["ProviderApple"] = "PROVIDER_APPLE";
    SubscriptionChannelSubscriptionProvider["ProviderChargebee"] = "PROVIDER_CHARGEBEE";
    SubscriptionChannelSubscriptionProvider["ProviderUnspecified"] = "PROVIDER_UNSPECIFIED";
})(SubscriptionChannelSubscriptionProvider || (exports.SubscriptionChannelSubscriptionProvider = SubscriptionChannelSubscriptionProvider = {}));
var SubscriptionChannelSubscriptionState;
(function (SubscriptionChannelSubscriptionState) {
    SubscriptionChannelSubscriptionState["StateActive"] = "STATE_ACTIVE";
    SubscriptionChannelSubscriptionState["StateCancelled"] = "STATE_CANCELLED";
    SubscriptionChannelSubscriptionState["StateExpired"] = "STATE_EXPIRED";
    SubscriptionChannelSubscriptionState["StateLocked"] = "STATE_LOCKED";
    SubscriptionChannelSubscriptionState["StatePending"] = "STATE_PENDING";
    SubscriptionChannelSubscriptionState["StateTerminated"] = "STATE_TERMINATED";
    SubscriptionChannelSubscriptionState["StateUnspecified"] = "STATE_UNSPECIFIED";
})(SubscriptionChannelSubscriptionState || (exports.SubscriptionChannelSubscriptionState = SubscriptionChannelSubscriptionState = {}));
var SubscriptionChannelSubscriptionUpdateEventUpdateType;
(function (SubscriptionChannelSubscriptionUpdateEventUpdateType) {
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeActivated"] = "UPDATE_TYPE_ACTIVATED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeCancellationRequested"] = "UPDATE_TYPE_CANCELLATION_REQUESTED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeCancelled"] = "UPDATE_TYPE_CANCELLED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeCreated"] = "UPDATE_TYPE_CREATED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeExpired"] = "UPDATE_TYPE_EXPIRED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypePaymentFailed"] = "UPDATE_TYPE_PAYMENT_FAILED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeRenewed"] = "UPDATE_TYPE_RENEWED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeTerminated"] = "UPDATE_TYPE_TERMINATED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeUnspecified"] = "UPDATE_TYPE_UNSPECIFIED";
    SubscriptionChannelSubscriptionUpdateEventUpdateType["UpdateTypeUpgraded"] = "UPDATE_TYPE_UPGRADED";
})(SubscriptionChannelSubscriptionUpdateEventUpdateType || (exports.SubscriptionChannelSubscriptionUpdateEventUpdateType = SubscriptionChannelSubscriptionUpdateEventUpdateType = {}));
var SubscriptionSubscriptionPricePeriod;
(function (SubscriptionSubscriptionPricePeriod) {
    SubscriptionSubscriptionPricePeriod["PeriodMonth"] = "PERIOD_MONTH";
    SubscriptionSubscriptionPricePeriod["PeriodUnspecified"] = "PERIOD_UNSPECIFIED";
    SubscriptionSubscriptionPricePeriod["PeriodYear"] = "PERIOD_YEAR";
})(SubscriptionSubscriptionPricePeriod || (exports.SubscriptionSubscriptionPricePeriod = SubscriptionSubscriptionPricePeriod = {}));
var SupportReportCaseResolution;
(function (SupportReportCaseResolution) {
    SupportReportCaseResolution["ReportCaseResolutionAllowContent"] = "REPORT_CASE_RESOLUTION_ALLOW_CONTENT";
    SupportReportCaseResolution["ReportCaseResolutionRemoveContent"] = "REPORT_CASE_RESOLUTION_REMOVE_CONTENT";
    SupportReportCaseResolution["ReportCaseResolutionUnspecified"] = "REPORT_CASE_RESOLUTION_UNSPECIFIED";
})(SupportReportCaseResolution || (exports.SupportReportCaseResolution = SupportReportCaseResolution = {}));
var SupportReportCaseStatus;
(function (SupportReportCaseStatus) {
    SupportReportCaseStatus["ReportCaseStatusClosed"] = "REPORT_CASE_STATUS_CLOSED";
    SupportReportCaseStatus["ReportCaseStatusOpen"] = "REPORT_CASE_STATUS_OPEN";
    SupportReportCaseStatus["ReportCaseStatusUnspecified"] = "REPORT_CASE_STATUS_UNSPECIFIED";
})(SupportReportCaseStatus || (exports.SupportReportCaseStatus = SupportReportCaseStatus = {}));
var SupportReportContextChannelTarget;
(function (SupportReportContextChannelTarget) {
    SupportReportContextChannelTarget["TargetDescription"] = "TARGET_DESCRIPTION";
    SupportReportContextChannelTarget["TargetName"] = "TARGET_NAME";
    SupportReportContextChannelTarget["TargetUnspecified"] = "TARGET_UNSPECIFIED";
})(SupportReportContextChannelTarget || (exports.SupportReportContextChannelTarget = SupportReportContextChannelTarget = {}));
var SupportReportContextUserTarget;
(function (SupportReportContextUserTarget) {
    SupportReportContextUserTarget["TargetName"] = "TARGET_NAME";
    SupportReportContextUserTarget["TargetUnspecified"] = "TARGET_UNSPECIFIED";
})(SupportReportContextUserTarget || (exports.SupportReportContextUserTarget = SupportReportContextUserTarget = {}));
var SupportReportReason;
(function (SupportReportReason) {
    SupportReportReason["ReportReasonChildSafetyChildAbuse"] = "REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE";
    SupportReportReason["ReportReasonChildSafetyCse"] = "REPORT_REASON_CHILD_SAFETY_CSE";
    SupportReportReason["ReportReasonChildSafetyDangerous"] = "REPORT_REASON_CHILD_SAFETY_DANGEROUS";
    SupportReportReason["ReportReasonChildSafetyUnderageUser"] = "REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER";
    SupportReportReason["ReportReasonGraphicMediaAnimalAbuse"] = "REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE";
    SupportReportReason["ReportReasonGraphicMediaGore"] = "REPORT_REASON_GRAPHIC_MEDIA_GORE";
    SupportReportReason["ReportReasonGraphicMediaViolence"] = "REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE";
    SupportReportReason["ReportReasonHarassment"] = "REPORT_REASON_HARASSMENT";
    SupportReportReason["ReportReasonHarassmentBlackmail"] = "REPORT_REASON_HARASSMENT_BLACKMAIL";
    SupportReportReason["ReportReasonHarassmentIncitement"] = "REPORT_REASON_HARASSMENT_INCITEMENT";
    SupportReportReason["ReportReasonHarassmentNonConsensualIntimateImages"] = "REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES";
    SupportReportReason["ReportReasonHarassmentSexualNonConsensual"] = "REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL";
    SupportReportReason["ReportReasonHarassmentStalking"] = "REPORT_REASON_HARASSMENT_STALKING";
    SupportReportReason["ReportReasonHatefulBehavior"] = "REPORT_REASON_HATEFUL_BEHAVIOR";
    SupportReportReason["ReportReasonIllegalActivitySale"] = "REPORT_REASON_ILLEGAL_ACTIVITY_SALE";
    SupportReportReason["ReportReasonIllegalActivityWeapons"] = "REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS";
    SupportReportReason["ReportReasonIllegalAlcoholNicotine"] = "REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE";
    SupportReportReason["ReportReasonIllegalDrugs"] = "REPORT_REASON_ILLEGAL_DRUGS";
    SupportReportReason["ReportReasonIllegalManipulation"] = "REPORT_REASON_ILLEGAL_MANIPULATION";
    SupportReportReason["ReportReasonIllegalSpam"] = "REPORT_REASON_ILLEGAL_SPAM";
    SupportReportReason["ReportReasonImpersonation"] = "REPORT_REASON_IMPERSONATION";
    SupportReportReason["ReportReasonInauthenticGameplay"] = "REPORT_REASON_INAUTHENTIC_GAMEPLAY";
    SupportReportReason["ReportReasonOffPlatform"] = "REPORT_REASON_OFF_PLATFORM";
    SupportReportReason["ReportReasonPlatformRulesViolation"] = "REPORT_REASON_PLATFORM_RULES_VIOLATION";
    SupportReportReason["ReportReasonPossibleIllegalActivity"] = "REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY";
    SupportReportReason["ReportReasonRestrictedGamesInherentlyViolative"] = "REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE";
    SupportReportReason["ReportReasonRestrictedGamesMature"] = "REPORT_REASON_RESTRICTED_GAMES_MATURE";
    SupportReportReason["ReportReasonSelfHarm"] = "REPORT_REASON_SELF_HARM";
    SupportReportReason["ReportReasonSexualBehaviorExplicit"] = "REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT";
    SupportReportReason["ReportReasonSexualBehaviorSuggestive"] = "REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE";
    SupportReportReason["ReportReasonSpam"] = "REPORT_REASON_SPAM";
    SupportReportReason["ReportReasonSpamSuspensionEvasion"] = "REPORT_REASON_SPAM_SUSPENSION_EVASION";
    SupportReportReason["ReportReasonUnknown"] = "REPORT_REASON_UNKNOWN";
    SupportReportReason["ReportReasonUnspecified"] = "REPORT_REASON_UNSPECIFIED";
    SupportReportReason["ReportReasonViolenceExtremism"] = "REPORT_REASON_VIOLENCE_EXTREMISM";
})(SupportReportReason || (exports.SupportReportReason = SupportReportReason = {}));
var WalletOperationType;
(function (WalletOperationType) {
    WalletOperationType["TypeAdd"] = "TYPE_ADD";
    WalletOperationType["TypeSubtract"] = "TYPE_SUBTRACT";
    WalletOperationType["TypeUnspecified"] = "TYPE_UNSPECIFIED";
})(WalletOperationType || (exports.WalletOperationType = WalletOperationType = {}));
var WalletTransactionReason;
(function (WalletTransactionReason) {
    WalletTransactionReason["TransactionReasonAdministrative"] = "TRANSACTION_REASON_ADMINISTRATIVE";
    WalletTransactionReason["TransactionReasonAdWatched"] = "TRANSACTION_REASON_AD_WATCHED";
    WalletTransactionReason["TransactionReasonChannelSubscription"] = "TRANSACTION_REASON_CHANNEL_SUBSCRIPTION";
    WalletTransactionReason["TransactionReasonGoalCardComplete"] = "TRANSACTION_REASON_GOAL_CARD_COMPLETE";
    WalletTransactionReason["TransactionReasonGoalCardSlotReshuffle"] = "TRANSACTION_REASON_GOAL_CARD_SLOT_RESHUFFLE";
    WalletTransactionReason["TransactionReasonLevelUp"] = "TRANSACTION_REASON_LEVEL_UP";
    WalletTransactionReason["TransactionReasonMatchEnd"] = "TRANSACTION_REASON_MATCH_END";
    WalletTransactionReason["TransactionReasonProvision"] = "TRANSACTION_REASON_PROVISION";
    WalletTransactionReason["TransactionReasonPurchaseWithInGameCurrency"] = "TRANSACTION_REASON_PURCHASE_WITH_IN_GAME_CURRENCY";
    WalletTransactionReason["TransactionReasonPurchaseWithPayment"] = "TRANSACTION_REASON_PURCHASE_WITH_PAYMENT";
    WalletTransactionReason["TransactionReasonReshuffle"] = "TRANSACTION_REASON_RESHUFFLE";
    WalletTransactionReason["TransactionReasonRewardClaimed"] = "TRANSACTION_REASON_REWARD_CLAIMED";
    WalletTransactionReason["TransactionReasonStoreOrderPayment"] = "TRANSACTION_REASON_STORE_ORDER_PAYMENT";
    WalletTransactionReason["TransactionReasonUnspecified"] = "TRANSACTION_REASON_UNSPECIFIED";
})(WalletTransactionReason || (exports.WalletTransactionReason = WalletTransactionReason = {}));
//# sourceMappingURL=graphql-types.js.map