"use strict";
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
exports.InvitationInvitationCodeUpdateEventUpdateType = exports.GoalCardGoalCardTargetType = exports.GameStateStringComparisonOperator = exports.GameStateIntComparisonOperator = exports.GameStateCalModuleUnaryOp = exports.GameStateCalModuleBinaryOp = exports.GameLogicStreamStateMatchState = exports.GameLogicMatchBonusType = exports.GameLogicContextualTeamActionType = exports.GameLogicContextualTeamActionStatus = exports.GameCardHighScoringCardTimingsSpeed = exports.GameCardAssetType = exports.FtueDismissalType = exports.FriendsFriendshipStatusStatus = exports.FriendsFriendStatusUpdateEventUpdateType = exports.ClassificationTrustLevel = exports.ClassificationTopic = exports.ClassificationTextRisk = exports.ChatUserLabel = exports.ChatReason = exports.ChatModerationStatus = exports.ChatModerationItemStatus = exports.ChatChatRole = exports.ChatAutomodLevel = exports.ChatAutomodDecision = exports.ChannelViolation = exports.ChannelSuspensionReason = exports.ChannelModerationEventType = exports.ChannelLiveStatus = exports.ChannelChannelRole = exports.ChannelChannelLinkLinkType = exports.ChannelChannelFeature = exports.ChannelAssetType = exports.ChannelAppealStatus = exports.BadgeBadgeType = exports.AvatarValidateAvatarCompositionResponseChangeReason = exports.AvatarGender = exports.AvatarAvatarPartCategory = exports.AvatarAnimationHandedness = exports.AvatarAnimationCategory = exports.AuthPlatformRole = exports.AuthIdentityType = exports.AuthConsentStatus = exports.AuthAccountStatusFlag = exports.ApiEntityState = exports.AnnouncementAnnouncementTarget = exports.AnnouncementAnnouncementStatus = exports.AnnouncementAnnouncementCategory = exports.AdsRewardDescriptionPrizeDescriptionKind = exports.AdsPlacementState = void 0;
exports.FriendsSidebarFriendPanelProfileFragmentDoc = exports.BlockUserProfileFragmentDoc = exports.ActiveFriendsListProfileFragmentDoc = exports.WalletCurrencyFragmentDoc = exports.AssetUploadEmojiEmojiFragmentDoc = exports.BannerUpdateChannelChannelFragmentDoc = exports.LogoUpdateChannelChannelFragmentDoc = exports.PlatformAnnouncementFragmentDoc = exports.ChannelBannerChannelFragmentDoc = exports.UserInventoryEmojisChannelFragmentDoc = exports.EmojiDrawerChannelFragmentDoc = exports.ChannelLogoChannelFragmentDoc = exports.UserInventoryEmojisEmojiFragmentDoc = exports.ChatMessageWithSenderFragmentDoc = exports.ChatMessageSenderProfileFragmentDoc = exports.ChatMessageFragmentDoc = exports.UseChatEmojisAndMentionsAttachmentFragmentDoc = exports.OtherPlayerBoosterProfileFragmentDoc = exports.ProfileImageProfileFragmentDoc = exports.LocalPlayerBoosterRequestProfileFragmentDoc = exports.ChatMessagesProfileFragmentDoc = exports.EmoteAvatarAnimationFragmentDoc = exports.WalletOperationType = exports.SupportReportReason = exports.SupportReportContextUserTarget = exports.SupportReportContextChannelTarget = exports.SupportReportCaseStatus = exports.SupportReportCaseResolution = exports.SubscriptionSubscriptionPricePeriod = exports.SubscriptionChannelSubscriptionUpdateEventUpdateType = exports.SubscriptionChannelSubscriptionState = exports.StreamerStreamEventFilterEventType = exports.StreamIngestConfigStreamingStatus = exports.StreamDeploymentStreamDeploymentStatusComponentStatus = exports.StoreV2StoreType = exports.StoreV2ItemType = exports.SearchEntityType = exports.RenderingCameraTransitionRequestTransitionTarget = exports.ReasonRevenueRecipientKind = exports.RarityRarity = exports.ProfileProfileVisibility = exports.ProfilePrivacySettingsVisibility = exports.ProfilePresenceStatus = exports.PaymentPaymentStatus = exports.PaymentCurrency = exports.PartyPartyInvitationUpdateEventUpdateType = exports.ModerationViolation = exports.ModerationBanStatus = exports.ModerationAppealStatus = exports.ItemItemType = void 0;
exports.useUserInventoryEmojisChannelsQuery = exports.UserInventoryEmojisChannelsDocument = exports.useUserInventoryEmojisLazyQuery = exports.useUserInventoryEmojisQuery = exports.UserInventoryEmojisDocument = exports.useChatChannelEventsSubscriptionSubscription = exports.ChatChannelEventsSubscriptionDocument = exports.useSendChatMessageMutation = exports.SendChatMessageDocument = exports.useChatSubscriptionSubscription = exports.ChatSubscriptionDocument = exports.useChatHistoryLazyQuery = exports.useChatHistoryQuery = exports.ChatHistoryDocument = exports.useChatModerationStatusLazyQuery = exports.useChatModerationStatusQuery = exports.ChatModerationStatusDocument = exports.useChatProfilesLazyQuery = exports.useChatProfilesQuery = exports.ChatProfilesDocument = exports.useLocalBoosterRequestOtherProfileLazyQuery = exports.useLocalBoosterRequestOtherProfileQuery = exports.LocalBoosterRequestOtherProfileDocument = exports.useOtherBoosterRequestOtherProfileLazyQuery = exports.useOtherBoosterRequestOtherProfileQuery = exports.OtherBoosterRequestOtherProfileDocument = exports.useChatMessageSenderProfileLazyQuery = exports.useChatMessageSenderProfileQuery = exports.ChatMessageSenderProfileDocument = exports.useAvatarMovementsLazyQuery = exports.useAvatarMovementsQuery = exports.AvatarMovementsDocument = exports.NewFriendRequestUserFragmentDoc = exports.FriendStatusUpdateProfileFragmentDoc = exports.PartyInviteLeaderProfileFragmentDoc = exports.PartyInvitePartyFragmentDoc = exports.MiniProfileBadgeFragmentDoc = exports.UserBadgeFragmentDoc = exports.MiniProfileFragmentDoc = exports.FriendRequestButtonProfileFragmentDoc = exports.FriendsSidebarPartyProfileFragmentDoc = exports.FriendsSidebarPartyFriendFragmentDoc = exports.FriendsSidebarFriendListProfileFragmentDoc = exports.FriendsSidebarFriendListFriendFragmentDoc = exports.FriendsSidebarFriendFragmentDoc = exports.FriendsSidebarFriendPanelFriendFragmentDoc = exports.FriendsSidebarFriendActionsFriendsUserFragmentDoc = exports.FriendsSidebarFriendStatusFriendsUserFragmentDoc = exports.FriendsSidebarFriendProfileFragmentDoc = exports.FriendsSidebarFriendButtonsProfileFragmentDoc = void 0;
exports.useMiniProfileLazyQuery = exports.useMiniProfileQuery = exports.MiniProfileDocument = exports.useFriendsSidebarPendingViewDataLazyQuery = exports.useFriendsSidebarPendingViewDataQuery = exports.FriendsSidebarPendingViewDataDocument = exports.useFriendsSidebarMenuPendingRequestsLazyQuery = exports.useFriendsSidebarMenuPendingRequestsQuery = exports.FriendsSidebarMenuPendingRequestsDocument = exports.useFriendsSidebarInviteFriendsLazyQuery = exports.useFriendsSidebarInviteFriendsQuery = exports.FriendsSidebarInviteFriendsDocument = exports.usePartyStreamChannelLazyQuery = exports.usePartyStreamChannelQuery = exports.PartyStreamChannelDocument = exports.useFriendsSidebarFriendsViewDataLazyQuery = exports.useFriendsSidebarFriendsViewDataQuery = exports.FriendsSidebarFriendsViewDataDocument = exports.useFriendSidebarFriendsLazyQuery = exports.useFriendSidebarFriendsQuery = exports.FriendSidebarFriendsDocument = exports.useResolvedAddFriendUserTagLazyQuery = exports.useResolvedAddFriendUserTagQuery = exports.ResolvedAddFriendUserTagDocument = exports.useBlockedUserProfileLazyQuery = exports.useBlockedUserProfileQuery = exports.BlockedUserProfileDocument = exports.useWalletLazyQuery = exports.useWalletQuery = exports.WalletDocument = exports.useUpdateAvatarMutation = exports.UpdateAvatarDocument = exports.useStreamSpectatorCoordinationSubscribeSubscription = exports.StreamSpectatorCoordinationSubscribeDocument = exports.useEmojiAssetCreateTokenMutation = exports.EmojiAssetCreateTokenDocument = exports.useChannelAssetCreateTokenMutation = exports.ChannelAssetCreateTokenDocument = exports.useReportUserMutation = exports.ReportUserDocument = exports.useReportStreamTimestampLazyQuery = exports.useReportStreamTimestampQuery = exports.ReportStreamTimestampDocument = exports.useReportedUserProfileLazyQuery = exports.useReportedUserProfileQuery = exports.ReportedUserProfileDocument = exports.useReportedStreamerProfileLazyQuery = exports.useReportedStreamerProfileQuery = exports.ReportedStreamerProfileDocument = exports.useUserInventoryEmojisChannelsLazyQuery = void 0;
exports.useSocialUnblockUserMutation = exports.SocialUnblockUserDocument = exports.useSocialSendFriendRequestMutation = exports.SocialSendFriendRequestDocument = exports.useSocialRemoveSentFriendRequestMutation = exports.SocialRemoveSentFriendRequestDocument = exports.useSocialRemoveReceivedFriendRequestMutation = exports.SocialRemoveReceivedFriendRequestDocument = exports.useSocialRemoveFriendMutation = exports.SocialRemoveFriendDocument = exports.useSocialBlockUserMutation = exports.SocialBlockUserDocument = exports.useSocialAcceptFriendRequestMutation = exports.SocialAcceptFriendRequestDocument = exports.usePartyInvitesPartyUpdatesSubscription = exports.PartyInvitesPartyUpdatesDocument = exports.usePartyInvitesCurrentPartyLazyQuery = exports.usePartyInvitesCurrentPartyQuery = exports.PartyInvitesCurrentPartyDocument = exports.usePartyInvitesDeletePartyInviteMutation = exports.PartyInvitesDeletePartyInviteDocument = exports.usePartyInvitesCreatePartyMemberMutation = exports.PartyInvitesCreatePartyMemberDocument = exports.useCreatePartyInvitationMutation = exports.CreatePartyInvitationDocument = exports.useCreatePartyMutation = exports.CreatePartyDocument = exports.useLeavePartyMutation = exports.LeavePartyDocument = exports.usePartyInviterPartyLazyQuery = exports.usePartyInviterPartyQuery = exports.PartyInviterPartyDocument = exports.usePartyInviterProfileLazyQuery = exports.usePartyInviterProfileQuery = exports.PartyInviterProfileDocument = void 0;
// THIS FILE IS GENERATED BY graphql-codegen, DO NOT EDIT!
const client_1 = require("@apollo/client");
const Apollo = __importStar(require("@apollo/client"));
const defaultOptions = {};
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
    AuthIdentityType["IdentityTypeDiscord"] = "IDENTITY_TYPE_DISCORD";
    AuthIdentityType["IdentityTypeEmail"] = "IDENTITY_TYPE_EMAIL";
    AuthIdentityType["IdentityTypeUnspecified"] = "IDENTITY_TYPE_UNSPECIFIED";
})(AuthIdentityType || (exports.AuthIdentityType = AuthIdentityType = {}));
var AuthPlatformRole;
(function (AuthPlatformRole) {
    AuthPlatformRole["PlatformRoleAdmin"] = "PLATFORM_ROLE_ADMIN";
    AuthPlatformRole["PlatformRoleBot"] = "PLATFORM_ROLE_BOT";
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
    BadgeBadgeType["TypeNoiceStaff"] = "TYPE_NOICE_STAFF";
    BadgeBadgeType["TypeStreamer"] = "TYPE_STREAMER";
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
    StoreV2ItemType["ItemTypePremiumCardBundle"] = "ITEM_TYPE_PREMIUM_CARD_BUNDLE";
    StoreV2ItemType["ItemTypeStandardCardBundle"] = "ITEM_TYPE_STANDARD_CARD_BUNDLE";
    StoreV2ItemType["ItemTypeStreamerCard"] = "ITEM_TYPE_STREAMER_CARD";
    StoreV2ItemType["ItemTypeUnspecified"] = "ITEM_TYPE_UNSPECIFIED";
})(StoreV2ItemType || (exports.StoreV2ItemType = StoreV2ItemType = {}));
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
    StreamerStreamEventFilterEventType["EventTypeHighScoringCardPromoted"] = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED";
    StreamerStreamEventFilterEventType["EventTypePlayerJoined"] = "EVENT_TYPE_PLAYER_JOINED";
    StreamerStreamEventFilterEventType["EventTypeUnspecified"] = "EVENT_TYPE_UNSPECIFIED";
})(StreamerStreamEventFilterEventType || (exports.StreamerStreamEventFilterEventType = StreamerStreamEventFilterEventType = {}));
var SubscriptionChannelSubscriptionState;
(function (SubscriptionChannelSubscriptionState) {
    SubscriptionChannelSubscriptionState["StateActive"] = "STATE_ACTIVE";
    SubscriptionChannelSubscriptionState["StateCancelled"] = "STATE_CANCELLED";
    SubscriptionChannelSubscriptionState["StateExpired"] = "STATE_EXPIRED";
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
exports.EmoteAvatarAnimationFragmentDoc = (0, client_1.gql) `
    fragment EmoteAvatarAnimation on AvatarAnimation {
  name
  chatCommand
  iconUrl
  id
}
    `;
exports.ChatMessagesProfileFragmentDoc = (0, client_1.gql) `
    fragment ChatMessagesProfile on ProfileProfile {
  userId
  userTag
}
    `;
exports.LocalPlayerBoosterRequestProfileFragmentDoc = (0, client_1.gql) `
    fragment LocalPlayerBoosterRequestProfile on ProfileProfile {
  userTag
}
    `;
exports.ProfileImageProfileFragmentDoc = (0, client_1.gql) `
    fragment ProfileImageProfile on ProfileProfile {
  avatars {
    avatar2D
  }
  userTag
  onlineStatus
  settings {
    privacy {
      hideOnlineStatus
    }
  }
}
    `;
exports.OtherPlayerBoosterProfileFragmentDoc = (0, client_1.gql) `
    fragment OtherPlayerBoosterProfile on ProfileProfile {
  userTag
  avatars {
    avatar2D
  }
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.UseChatEmojisAndMentionsAttachmentFragmentDoc = (0, client_1.gql) `
    fragment UseChatEmojisAndMentionsAttachment on ChatTextMessageAttachment {
  label
  source
  startIndex
  endIndex
}
    `;
exports.ChatMessageFragmentDoc = (0, client_1.gql) `
    fragment ChatMessage on ChatChatMessage {
  senderId
  chatId
  state
  messageId
  createdAt
  moderationStatus
  content {
    content {
      ... on ChatTextMessage {
        text
        attachments {
          ...UseChatEmojisAndMentionsAttachment
        }
      }
      ... on ChatTombstone {
        emptyTypeWorkaround
      }
    }
  }
}
    ${exports.UseChatEmojisAndMentionsAttachmentFragmentDoc}`;
exports.ChatMessageSenderProfileFragmentDoc = (0, client_1.gql) `
    fragment ChatMessageSenderProfile on ProfileProfile {
  userId
  userTag
  avatars {
    avatar2D
  }
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.ChatMessageWithSenderFragmentDoc = (0, client_1.gql) `
    fragment ChatMessageWithSender on ChatChatMessage {
  ...ChatMessage
  sender {
    ...ChatMessageSenderProfile
  }
}
    ${exports.ChatMessageFragmentDoc}
${exports.ChatMessageSenderProfileFragmentDoc}`;
exports.UserInventoryEmojisEmojiFragmentDoc = (0, client_1.gql) `
    fragment UserInventoryEmojisEmoji on EmojiEmoji {
  id
  label
  image
  channelId
}
    `;
exports.ChannelLogoChannelFragmentDoc = (0, client_1.gql) `
    fragment ChannelLogoChannel on ChannelChannel {
  liveStatus
  logo
  name
}
    `;
exports.EmojiDrawerChannelFragmentDoc = (0, client_1.gql) `
    fragment EmojiDrawerChannel on ChannelChannel {
  id
  ...ChannelLogoChannel
}
    ${exports.ChannelLogoChannelFragmentDoc}`;
exports.UserInventoryEmojisChannelFragmentDoc = (0, client_1.gql) `
    fragment UserInventoryEmojisChannel on ChannelChannel {
  id
  ...EmojiDrawerChannel
}
    ${exports.EmojiDrawerChannelFragmentDoc}`;
exports.ChannelBannerChannelFragmentDoc = (0, client_1.gql) `
    fragment ChannelBannerChannel on ChannelChannel {
  offlineBanner
}
    `;
exports.PlatformAnnouncementFragmentDoc = (0, client_1.gql) `
    fragment PlatformAnnouncement on AnnouncementAnnouncement {
  id
  title
  text
  category
  startTime
  image
}
    `;
exports.LogoUpdateChannelChannelFragmentDoc = (0, client_1.gql) `
    fragment LogoUpdateChannelChannel on ChannelChannel {
  id
  logo
}
    `;
exports.BannerUpdateChannelChannelFragmentDoc = (0, client_1.gql) `
    fragment BannerUpdateChannelChannel on ChannelChannel {
  id
  offlineBanner
}
    `;
exports.AssetUploadEmojiEmojiFragmentDoc = (0, client_1.gql) `
    fragment AssetUploadEmojiEmoji on EmojiEmoji {
  id
  image
}
    `;
exports.WalletCurrencyFragmentDoc = (0, client_1.gql) `
    fragment WalletCurrency on WalletWalletCurrency {
  currencyId
  currencyAmount
}
    `;
exports.ActiveFriendsListProfileFragmentDoc = (0, client_1.gql) `
    fragment ActiveFriendsListProfile on ProfileProfile {
  userTag
  avatars {
    avatar2D
  }
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.BlockUserProfileFragmentDoc = (0, client_1.gql) `
    fragment BlockUserProfile on ProfileProfile {
  avatars {
    avatar2D
  }
  userTag
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.FriendsSidebarFriendPanelProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendPanelProfile on ProfileProfile {
  userId
  userTag
  avatars {
    avatar2D
  }
  onlineStatus
  userTag
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.FriendsSidebarFriendButtonsProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendButtonsProfile on ProfileProfile {
  userId
  friendshipStatus {
    status
  }
}
    `;
exports.FriendsSidebarFriendProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendProfile on ProfileProfile {
  userId
  userTag
  avatars {
    avatar2D
  }
  onlineStatus
  ...FriendsSidebarFriendPanelProfile
  ...FriendsSidebarFriendButtonsProfile
  ...ProfileImageProfile
}
    ${exports.FriendsSidebarFriendPanelProfileFragmentDoc}
${exports.FriendsSidebarFriendButtonsProfileFragmentDoc}
${exports.ProfileImageProfileFragmentDoc}`;
exports.FriendsSidebarFriendStatusFriendsUserFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendStatusFriendsUser on FriendsUser {
  activity {
    isOnline
    channel {
      id
      name
      game {
        id
        name
      }
    }
  }
  profile {
    userId
    onlineStatus
  }
}
    `;
exports.FriendsSidebarFriendActionsFriendsUserFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendActionsFriendsUser on FriendsUser {
  userId
  activity {
    isOnline
    channel {
      id
      name
    }
  }
  profile {
    userId
    userTag
    friendshipStatus {
      status
    }
  }
}
    `;
exports.FriendsSidebarFriendPanelFriendFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendPanelFriend on FriendsUser {
  lastStatusChange
  profile {
    ...FriendsSidebarFriendPanelProfile
  }
  ...FriendsSidebarFriendStatusFriendsUser
  ...FriendsSidebarFriendActionsFriendsUser
}
    ${exports.FriendsSidebarFriendPanelProfileFragmentDoc}
${exports.FriendsSidebarFriendStatusFriendsUserFragmentDoc}
${exports.FriendsSidebarFriendActionsFriendsUserFragmentDoc}`;
exports.FriendsSidebarFriendFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriend on FriendsUser {
  userId
  profile {
    ...FriendsSidebarFriendProfile
  }
  ...FriendsSidebarFriendPanelFriend
  ...FriendsSidebarFriendStatusFriendsUser
}
    ${exports.FriendsSidebarFriendProfileFragmentDoc}
${exports.FriendsSidebarFriendPanelFriendFragmentDoc}
${exports.FriendsSidebarFriendStatusFriendsUserFragmentDoc}`;
exports.FriendsSidebarFriendListFriendFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendListFriend on FriendsUser {
  ...FriendsSidebarFriend
}
    ${exports.FriendsSidebarFriendFragmentDoc}`;
exports.FriendsSidebarFriendListProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarFriendListProfile on ProfileProfile {
  ...FriendsSidebarFriendProfile
}
    ${exports.FriendsSidebarFriendProfileFragmentDoc}`;
exports.FriendsSidebarPartyFriendFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarPartyFriend on FriendsUser {
  ...FriendsSidebarFriend
}
    ${exports.FriendsSidebarFriendFragmentDoc}`;
exports.FriendsSidebarPartyProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendsSidebarPartyProfile on ProfileProfile {
  ...FriendsSidebarFriendProfile
}
    ${exports.FriendsSidebarFriendProfileFragmentDoc}`;
exports.FriendRequestButtonProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendRequestButtonProfile on ProfileProfile {
  userId
  userTag
  friendshipStatus {
    status
    lastStatusChange
  }
}
    `;
exports.MiniProfileFragmentDoc = (0, client_1.gql) `
    fragment MiniProfile on ProfileProfile {
  avatars {
    avatarFullbody
    avatar2D
  }
  userId
  userTag
  ...FriendRequestButtonProfile
  ...ProfileImageProfile
}
    ${exports.FriendRequestButtonProfileFragmentDoc}
${exports.ProfileImageProfileFragmentDoc}`;
exports.UserBadgeFragmentDoc = (0, client_1.gql) `
    fragment UserBadge on BadgeBadge {
  type
  level
}
    `;
exports.MiniProfileBadgeFragmentDoc = (0, client_1.gql) `
    fragment MiniProfileBadge on BadgeBadge {
  ...UserBadge
}
    ${exports.UserBadgeFragmentDoc}`;
exports.PartyInvitePartyFragmentDoc = (0, client_1.gql) `
    fragment PartyInviteParty on PartyParty {
  id
  streamId
  channel {
    id
    name
  }
}
    `;
exports.PartyInviteLeaderProfileFragmentDoc = (0, client_1.gql) `
    fragment PartyInviteLeaderProfile on ProfileProfile {
  userId
  userTag
  avatars {
    avatar2D
  }
  ...ProfileImageProfile
}
    ${exports.ProfileImageProfileFragmentDoc}`;
exports.FriendStatusUpdateProfileFragmentDoc = (0, client_1.gql) `
    fragment FriendStatusUpdateProfile on ProfileProfile {
  userId
  friendshipStatus {
    status
  }
}
    `;
exports.NewFriendRequestUserFragmentDoc = (0, client_1.gql) `
    fragment NewFriendRequestUser on FriendsUser {
  userId
}
    `;
exports.AvatarMovementsDocument = (0, client_1.gql) `
    query AvatarMovements($userId: ID) {
  inventory(userId: $userId, filters: {itemType: TYPE_EMOTE}) {
    items {
      itemId
      item {
        id
        details {
          ... on AvatarAnimation {
            ...EmoteAvatarAnimation
          }
        }
      }
    }
  }
}
    ${exports.EmoteAvatarAnimationFragmentDoc}`;
/**
 * __useAvatarMovementsQuery__
 *
 * To run a query within a React component, call `useAvatarMovementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvatarMovementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvatarMovementsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useAvatarMovementsQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.AvatarMovementsDocument, options);
}
exports.useAvatarMovementsQuery = useAvatarMovementsQuery;
function useAvatarMovementsLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.AvatarMovementsDocument, options);
}
exports.useAvatarMovementsLazyQuery = useAvatarMovementsLazyQuery;
exports.ChatMessageSenderProfileDocument = (0, client_1.gql) `
    query ChatMessageSenderProfile($userId: ID!, $channelId: ID) {
  profile(userId: $userId) {
    userId
    ...ChatMessageSenderProfile
    badges(channel_id: $channelId) {
      ...UserBadge
    }
  }
}
    ${exports.ChatMessageSenderProfileFragmentDoc}
${exports.UserBadgeFragmentDoc}`;
/**
 * __useChatMessageSenderProfileQuery__
 *
 * To run a query within a React component, call `useChatMessageSenderProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatMessageSenderProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatMessageSenderProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function useChatMessageSenderProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ChatMessageSenderProfileDocument, options);
}
exports.useChatMessageSenderProfileQuery = useChatMessageSenderProfileQuery;
function useChatMessageSenderProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ChatMessageSenderProfileDocument, options);
}
exports.useChatMessageSenderProfileLazyQuery = useChatMessageSenderProfileLazyQuery;
exports.OtherBoosterRequestOtherProfileDocument = (0, client_1.gql) `
    query OtherBoosterRequestOtherProfile($userId: ID!) {
  profile(userId: $userId) {
    userId
    ...OtherPlayerBoosterProfile
  }
}
    ${exports.OtherPlayerBoosterProfileFragmentDoc}`;
/**
 * __useOtherBoosterRequestOtherProfileQuery__
 *
 * To run a query within a React component, call `useOtherBoosterRequestOtherProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useOtherBoosterRequestOtherProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOtherBoosterRequestOtherProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useOtherBoosterRequestOtherProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.OtherBoosterRequestOtherProfileDocument, options);
}
exports.useOtherBoosterRequestOtherProfileQuery = useOtherBoosterRequestOtherProfileQuery;
function useOtherBoosterRequestOtherProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.OtherBoosterRequestOtherProfileDocument, options);
}
exports.useOtherBoosterRequestOtherProfileLazyQuery = useOtherBoosterRequestOtherProfileLazyQuery;
exports.LocalBoosterRequestOtherProfileDocument = (0, client_1.gql) `
    query LocalBoosterRequestOtherProfile($userId: ID!) {
  profile(userId: $userId) {
    userId
    ...LocalPlayerBoosterRequestProfile
  }
}
    ${exports.LocalPlayerBoosterRequestProfileFragmentDoc}`;
/**
 * __useLocalBoosterRequestOtherProfileQuery__
 *
 * To run a query within a React component, call `useLocalBoosterRequestOtherProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useLocalBoosterRequestOtherProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLocalBoosterRequestOtherProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useLocalBoosterRequestOtherProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.LocalBoosterRequestOtherProfileDocument, options);
}
exports.useLocalBoosterRequestOtherProfileQuery = useLocalBoosterRequestOtherProfileQuery;
function useLocalBoosterRequestOtherProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.LocalBoosterRequestOtherProfileDocument, options);
}
exports.useLocalBoosterRequestOtherProfileLazyQuery = useLocalBoosterRequestOtherProfileLazyQuery;
exports.ChatProfilesDocument = (0, client_1.gql) `
    query ChatProfiles($userIds: [String!]!, $channelId: ID!) {
  profileBatch(userIds: $userIds) {
    profiles {
      userId
      ...ChatMessageSenderProfile
      badges(channel_id: $channelId) {
        ...UserBadge
      }
    }
  }
}
    ${exports.ChatMessageSenderProfileFragmentDoc}
${exports.UserBadgeFragmentDoc}`;
/**
 * __useChatProfilesQuery__
 *
 * To run a query within a React component, call `useChatProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatProfilesQuery({
 *   variables: {
 *      userIds: // value for 'userIds'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function useChatProfilesQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ChatProfilesDocument, options);
}
exports.useChatProfilesQuery = useChatProfilesQuery;
function useChatProfilesLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ChatProfilesDocument, options);
}
exports.useChatProfilesLazyQuery = useChatProfilesLazyQuery;
exports.ChatModerationStatusDocument = (0, client_1.gql) `
    query ChatModerationStatus($chatId: ID!, $userId: ID!) {
  chatUserStatus(chatId: $chatId, userId: $userId) {
    muted
    muteDuration
  }
}
    `;
/**
 * __useChatModerationStatusQuery__
 *
 * To run a query within a React component, call `useChatModerationStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatModerationStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatModerationStatusQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useChatModerationStatusQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ChatModerationStatusDocument, options);
}
exports.useChatModerationStatusQuery = useChatModerationStatusQuery;
function useChatModerationStatusLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ChatModerationStatusDocument, options);
}
exports.useChatModerationStatusLazyQuery = useChatModerationStatusLazyQuery;
exports.ChatHistoryDocument = (0, client_1.gql) `
    query ChatHistory($chatId: ID!, $channelId: ID, $cursor: APICursorInput) {
  chatMessages(chatId: $chatId, cursor: $cursor) {
    messages {
      ... on ChatChatMessage {
        ...ChatMessageWithSender
        sender {
          badges(channel_id: $channelId) {
            ...UserBadge
          }
        }
      }
    }
  }
}
    ${exports.ChatMessageWithSenderFragmentDoc}
${exports.UserBadgeFragmentDoc}`;
/**
 * __useChatHistoryQuery__
 *
 * To run a query within a React component, call `useChatHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatHistoryQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      channelId: // value for 'channelId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
function useChatHistoryQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ChatHistoryDocument, options);
}
exports.useChatHistoryQuery = useChatHistoryQuery;
function useChatHistoryLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ChatHistoryDocument, options);
}
exports.useChatHistoryLazyQuery = useChatHistoryLazyQuery;
exports.ChatSubscriptionDocument = (0, client_1.gql) `
    subscription ChatSubscription($chatId: ID!) {
  chatMessageSubscribe(chatId: $chatId) {
    event {
      ... on ChatChatMessage {
        ...ChatMessage
      }
      ... on ChatHideMessage {
        messageId
      }
      ... on ChatUserMuted {
        userId
        duration
      }
      ... on ChatUserBanned {
        userId
      }
      ... on ChatMessageDenied {
        userId
      }
    }
  }
}
    ${exports.ChatMessageFragmentDoc}`;
/**
 * __useChatSubscriptionSubscription__
 *
 * To run a query within a React component, call `useChatSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatSubscriptionSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
function useChatSubscriptionSubscription(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useSubscription(exports.ChatSubscriptionDocument, options);
}
exports.useChatSubscriptionSubscription = useChatSubscriptionSubscription;
exports.SendChatMessageDocument = (0, client_1.gql) `
    mutation SendChatMessage($chatId: ID!, $content: ChatTextMessageInput!, $consentToModeration: Boolean) {
  sendChatMessage(
    chatId: $chatId
    content: {textContent: $content}
    consentToModeration: $consentToModeration
  ) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useSendChatMessageMutation__
 *
 * To run a mutation, you first call `useSendChatMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendChatMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendChatMessageMutation, { data, loading, error }] = useSendChatMessageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      content: // value for 'content'
 *      consentToModeration: // value for 'consentToModeration'
 *   },
 * });
 */
function useSendChatMessageMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SendChatMessageDocument, options);
}
exports.useSendChatMessageMutation = useSendChatMessageMutation;
exports.ChatChannelEventsSubscriptionDocument = (0, client_1.gql) `
    subscription ChatChannelEventsSubscription($channelId: ID!) {
  channelEventsSubscribe(channelId: $channelId) {
    channelId
    createdAt
    id
    content {
      content {
        ... on ChannelSubscriptionPurchase {
          userId
          tier
          user {
            badges(channel_id: $channelId) {
              ...MiniProfileBadge
            }
            userId
            userTag
            ...MiniProfile
          }
        }
      }
      content {
        ... on ChannelBundlePurchase {
          bundleName
          userId
          streamerCards {
            id
            channelId
            name
          }
          user {
            badges(channel_id: $channelId) {
              ...MiniProfileBadge
            }
            userId
            userTag
            ...MiniProfile
          }
        }
      }
      content {
        ... on ChannelStreamerCardPurchase {
          streamerCard {
            id
            name
            channelId
          }
          userId
          user {
            badges(channel_id: $channelId) {
              ...MiniProfileBadge
            }
            userId
            userTag
            ...MiniProfile
          }
        }
      }
    }
  }
}
    ${exports.MiniProfileBadgeFragmentDoc}
${exports.MiniProfileFragmentDoc}`;
/**
 * __useChatChannelEventsSubscriptionSubscription__
 *
 * To run a query within a React component, call `useChatChannelEventsSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChatChannelEventsSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatChannelEventsSubscriptionSubscription({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function useChatChannelEventsSubscriptionSubscription(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useSubscription(exports.ChatChannelEventsSubscriptionDocument, options);
}
exports.useChatChannelEventsSubscriptionSubscription = useChatChannelEventsSubscriptionSubscription;
exports.UserInventoryEmojisDocument = (0, client_1.gql) `
    query UserInventoryEmojis($userId: ID) {
  inventory(userId: $userId, filters: {itemType: TYPE_EMOJI}) {
    items {
      itemId
      item {
        id
        details {
          ...UserInventoryEmojisEmoji
        }
      }
    }
  }
}
    ${exports.UserInventoryEmojisEmojiFragmentDoc}`;
/**
 * __useUserInventoryEmojisQuery__
 *
 * To run a query within a React component, call `useUserInventoryEmojisQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserInventoryEmojisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserInventoryEmojisQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useUserInventoryEmojisQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.UserInventoryEmojisDocument, options);
}
exports.useUserInventoryEmojisQuery = useUserInventoryEmojisQuery;
function useUserInventoryEmojisLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.UserInventoryEmojisDocument, options);
}
exports.useUserInventoryEmojisLazyQuery = useUserInventoryEmojisLazyQuery;
exports.UserInventoryEmojisChannelsDocument = (0, client_1.gql) `
    query UserInventoryEmojisChannels($channelIds: [String!]) {
  getChannels(channelIds: $channelIds) {
    channels {
      ...UserInventoryEmojisChannel
    }
  }
}
    ${exports.UserInventoryEmojisChannelFragmentDoc}`;
/**
 * __useUserInventoryEmojisChannelsQuery__
 *
 * To run a query within a React component, call `useUserInventoryEmojisChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserInventoryEmojisChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserInventoryEmojisChannelsQuery({
 *   variables: {
 *      channelIds: // value for 'channelIds'
 *   },
 * });
 */
function useUserInventoryEmojisChannelsQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.UserInventoryEmojisChannelsDocument, options);
}
exports.useUserInventoryEmojisChannelsQuery = useUserInventoryEmojisChannelsQuery;
function useUserInventoryEmojisChannelsLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.UserInventoryEmojisChannelsDocument, options);
}
exports.useUserInventoryEmojisChannelsLazyQuery = useUserInventoryEmojisChannelsLazyQuery;
exports.ReportedStreamerProfileDocument = (0, client_1.gql) `
    query ReportedStreamerProfile($channelId: ID!) {
  channel(id: $channelId) {
    id
    name
    logo
    ...ChannelLogoChannel
  }
}
    ${exports.ChannelLogoChannelFragmentDoc}`;
/**
 * __useReportedStreamerProfileQuery__
 *
 * To run a query within a React component, call `useReportedStreamerProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportedStreamerProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportedStreamerProfileQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function useReportedStreamerProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ReportedStreamerProfileDocument, options);
}
exports.useReportedStreamerProfileQuery = useReportedStreamerProfileQuery;
function useReportedStreamerProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ReportedStreamerProfileDocument, options);
}
exports.useReportedStreamerProfileLazyQuery = useReportedStreamerProfileLazyQuery;
exports.ReportedUserProfileDocument = (0, client_1.gql) `
    query ReportedUserProfile($userId: ID!) {
  profile(userId: $userId) {
    avatars {
      avatar2D
    }
    userTag
    userId
    ...ProfileImageProfile
  }
}
    ${exports.ProfileImageProfileFragmentDoc}`;
/**
 * __useReportedUserProfileQuery__
 *
 * To run a query within a React component, call `useReportedUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportedUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportedUserProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useReportedUserProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ReportedUserProfileDocument, options);
}
exports.useReportedUserProfileQuery = useReportedUserProfileQuery;
function useReportedUserProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ReportedUserProfileDocument, options);
}
exports.useReportedUserProfileLazyQuery = useReportedUserProfileLazyQuery;
exports.ReportStreamTimestampDocument = (0, client_1.gql) `
    query ReportStreamTimestamp($streamId: ID!) {
  stream(id: $streamId) {
    streamId
    segments {
      startTime
    }
  }
}
    `;
/**
 * __useReportStreamTimestampQuery__
 *
 * To run a query within a React component, call `useReportStreamTimestampQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportStreamTimestampQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportStreamTimestampQuery({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
function useReportStreamTimestampQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ReportStreamTimestampDocument, options);
}
exports.useReportStreamTimestampQuery = useReportStreamTimestampQuery;
function useReportStreamTimestampLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ReportStreamTimestampDocument, options);
}
exports.useReportStreamTimestampLazyQuery = useReportStreamTimestampLazyQuery;
exports.ReportUserDocument = (0, client_1.gql) `
    mutation ReportUser($reason: SupportReportReason!, $description: String, $context: SupportReportContextInput!) {
  createReport(reason: $reason, description: $description, context: $context) {
    createdAt
  }
}
    `;
/**
 * __useReportUserMutation__
 *
 * To run a mutation, you first call `useReportUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportUserMutation, { data, loading, error }] = useReportUserMutation({
 *   variables: {
 *      reason: // value for 'reason'
 *      description: // value for 'description'
 *      context: // value for 'context'
 *   },
 * });
 */
function useReportUserMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.ReportUserDocument, options);
}
exports.useReportUserMutation = useReportUserMutation;
exports.ChannelAssetCreateTokenDocument = (0, client_1.gql) `
    mutation ChannelAssetCreateToken($channelId: ID, $assetType: ChannelAssetType) {
  createChannelAssetUploadToken(channelId: $channelId, assetType: $assetType) {
    token
  }
}
    `;
/**
 * __useChannelAssetCreateTokenMutation__
 *
 * To run a mutation, you first call `useChannelAssetCreateTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChannelAssetCreateTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [channelAssetCreateTokenMutation, { data, loading, error }] = useChannelAssetCreateTokenMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      assetType: // value for 'assetType'
 *   },
 * });
 */
function useChannelAssetCreateTokenMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.ChannelAssetCreateTokenDocument, options);
}
exports.useChannelAssetCreateTokenMutation = useChannelAssetCreateTokenMutation;
exports.EmojiAssetCreateTokenDocument = (0, client_1.gql) `
    mutation EmojiAssetCreateToken($itemId: ID!) {
  createEmojiUploadToken(itemId: $itemId) {
    token
  }
}
    `;
/**
 * __useEmojiAssetCreateTokenMutation__
 *
 * To run a mutation, you first call `useEmojiAssetCreateTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmojiAssetCreateTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emojiAssetCreateTokenMutation, { data, loading, error }] = useEmojiAssetCreateTokenMutation({
 *   variables: {
 *      itemId: // value for 'itemId'
 *   },
 * });
 */
function useEmojiAssetCreateTokenMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.EmojiAssetCreateTokenDocument, options);
}
exports.useEmojiAssetCreateTokenMutation = useEmojiAssetCreateTokenMutation;
exports.StreamSpectatorCoordinationSubscribeDocument = (0, client_1.gql) `
    subscription StreamSpectatorCoordinationSubscribe($streamId: ID!) {
  streamSpectatorCoordinationEventsSubscribe(streamId: $streamId) {
    event {
      ... on MatchStreamSpectatorChangeGroupEvent {
        groupId
      }
    }
  }
}
    `;
/**
 * __useStreamSpectatorCoordinationSubscribeSubscription__
 *
 * To run a query within a React component, call `useStreamSpectatorCoordinationSubscribeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStreamSpectatorCoordinationSubscribeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStreamSpectatorCoordinationSubscribeSubscription({
 *   variables: {
 *      streamId: // value for 'streamId'
 *   },
 * });
 */
function useStreamSpectatorCoordinationSubscribeSubscription(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useSubscription(exports.StreamSpectatorCoordinationSubscribeDocument, options);
}
exports.useStreamSpectatorCoordinationSubscribeSubscription = useStreamSpectatorCoordinationSubscribeSubscription;
exports.UpdateAvatarDocument = (0, client_1.gql) `
    mutation UpdateAvatar($avatarId: ID!) {
  updateProfileAvatar(modelId: $avatarId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useUpdateAvatarMutation__
 *
 * To run a mutation, you first call `useUpdateAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAvatarMutation, { data, loading, error }] = useUpdateAvatarMutation({
 *   variables: {
 *      avatarId: // value for 'avatarId'
 *   },
 * });
 */
function useUpdateAvatarMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.UpdateAvatarDocument, options);
}
exports.useUpdateAvatarMutation = useUpdateAvatarMutation;
exports.WalletDocument = (0, client_1.gql) `
    query Wallet($userId: ID!) {
  wallet(userId: $userId) {
    wallet {
      currencies {
        ...WalletCurrency
      }
    }
  }
}
    ${exports.WalletCurrencyFragmentDoc}`;
/**
 * __useWalletQuery__
 *
 * To run a query within a React component, call `useWalletQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalletQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalletQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useWalletQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.WalletDocument, options);
}
exports.useWalletQuery = useWalletQuery;
function useWalletLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.WalletDocument, options);
}
exports.useWalletLazyQuery = useWalletLazyQuery;
exports.BlockedUserProfileDocument = (0, client_1.gql) `
    query BlockedUserProfile($userId: ID!) {
  profile(userId: $userId) {
    ...BlockUserProfile
    userId
  }
}
    ${exports.BlockUserProfileFragmentDoc}`;
/**
 * __useBlockedUserProfileQuery__
 *
 * To run a query within a React component, call `useBlockedUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockedUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockedUserProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useBlockedUserProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.BlockedUserProfileDocument, options);
}
exports.useBlockedUserProfileQuery = useBlockedUserProfileQuery;
function useBlockedUserProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.BlockedUserProfileDocument, options);
}
exports.useBlockedUserProfileLazyQuery = useBlockedUserProfileLazyQuery;
exports.ResolvedAddFriendUserTagDocument = (0, client_1.gql) `
    query ResolvedAddFriendUserTag($userTag: String!) {
  resolveUserTags(userTags: [$userTag]) {
    userIds {
      key
      value
    }
  }
}
    `;
/**
 * __useResolvedAddFriendUserTagQuery__
 *
 * To run a query within a React component, call `useResolvedAddFriendUserTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useResolvedAddFriendUserTagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResolvedAddFriendUserTagQuery({
 *   variables: {
 *      userTag: // value for 'userTag'
 *   },
 * });
 */
function useResolvedAddFriendUserTagQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.ResolvedAddFriendUserTagDocument, options);
}
exports.useResolvedAddFriendUserTagQuery = useResolvedAddFriendUserTagQuery;
function useResolvedAddFriendUserTagLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.ResolvedAddFriendUserTagDocument, options);
}
exports.useResolvedAddFriendUserTagLazyQuery = useResolvedAddFriendUserTagLazyQuery;
exports.FriendSidebarFriendsDocument = (0, client_1.gql) `
    query FriendSidebarFriends($userId: ID!, $cursor: String, $pageSize: Int! = 25) {
  friends(
    userId: $userId
    cursor: {first: $pageSize, after: $cursor}
    priorityOrder: true
  ) {
    pageInfo {
      endCursor
      hasNextPage
    }
    users {
      userId
      ...FriendsSidebarFriendListFriend
      ...FriendsSidebarPartyFriend
    }
  }
}
    ${exports.FriendsSidebarFriendListFriendFragmentDoc}
${exports.FriendsSidebarPartyFriendFragmentDoc}`;
/**
 * __useFriendSidebarFriendsQuery__
 *
 * To run a query within a React component, call `useFriendSidebarFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendSidebarFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendSidebarFriendsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      cursor: // value for 'cursor'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
function useFriendSidebarFriendsQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.FriendSidebarFriendsDocument, options);
}
exports.useFriendSidebarFriendsQuery = useFriendSidebarFriendsQuery;
function useFriendSidebarFriendsLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.FriendSidebarFriendsDocument, options);
}
exports.useFriendSidebarFriendsLazyQuery = useFriendSidebarFriendsLazyQuery;
exports.FriendsSidebarFriendsViewDataDocument = (0, client_1.gql) `
    query FriendsSidebarFriendsViewData($userId: ID!) {
  userParty(userId: $userId) {
    leaderId
    members {
      userId
      profile {
        ...FriendsSidebarFriendListProfile
        ...FriendsSidebarPartyProfile
      }
    }
  }
  receivedFriendRequests(userId: $userId) {
    users {
      userId
      profile {
        userId
      }
    }
  }
}
    ${exports.FriendsSidebarFriendListProfileFragmentDoc}
${exports.FriendsSidebarPartyProfileFragmentDoc}`;
/**
 * __useFriendsSidebarFriendsViewDataQuery__
 *
 * To run a query within a React component, call `useFriendsSidebarFriendsViewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendsSidebarFriendsViewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendsSidebarFriendsViewDataQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useFriendsSidebarFriendsViewDataQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.FriendsSidebarFriendsViewDataDocument, options);
}
exports.useFriendsSidebarFriendsViewDataQuery = useFriendsSidebarFriendsViewDataQuery;
function useFriendsSidebarFriendsViewDataLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.FriendsSidebarFriendsViewDataDocument, options);
}
exports.useFriendsSidebarFriendsViewDataLazyQuery = useFriendsSidebarFriendsViewDataLazyQuery;
exports.PartyStreamChannelDocument = (0, client_1.gql) `
    query PartyStreamChannel($channelId: ID!) {
  channel(id: $channelId) {
    id
    currentStreamId
    name
    game {
      id
      name
    }
  }
}
    `;
/**
 * __usePartyStreamChannelQuery__
 *
 * To run a query within a React component, call `usePartyStreamChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartyStreamChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartyStreamChannelQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function usePartyStreamChannelQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.PartyStreamChannelDocument, options);
}
exports.usePartyStreamChannelQuery = usePartyStreamChannelQuery;
function usePartyStreamChannelLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.PartyStreamChannelDocument, options);
}
exports.usePartyStreamChannelLazyQuery = usePartyStreamChannelLazyQuery;
exports.FriendsSidebarInviteFriendsDocument = (0, client_1.gql) `
    query FriendsSidebarInviteFriends($userId: ID) {
  invitationCodes(userId: $userId) {
    codes {
      code
    }
  }
}
    `;
/**
 * __useFriendsSidebarInviteFriendsQuery__
 *
 * To run a query within a React component, call `useFriendsSidebarInviteFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendsSidebarInviteFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendsSidebarInviteFriendsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useFriendsSidebarInviteFriendsQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.FriendsSidebarInviteFriendsDocument, options);
}
exports.useFriendsSidebarInviteFriendsQuery = useFriendsSidebarInviteFriendsQuery;
function useFriendsSidebarInviteFriendsLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.FriendsSidebarInviteFriendsDocument, options);
}
exports.useFriendsSidebarInviteFriendsLazyQuery = useFriendsSidebarInviteFriendsLazyQuery;
exports.FriendsSidebarMenuPendingRequestsDocument = (0, client_1.gql) `
    query FriendsSidebarMenuPendingRequests($userId: ID!) {
  receivedFriendRequests(userId: $userId) {
    users {
      userId
    }
  }
}
    `;
/**
 * __useFriendsSidebarMenuPendingRequestsQuery__
 *
 * To run a query within a React component, call `useFriendsSidebarMenuPendingRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendsSidebarMenuPendingRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendsSidebarMenuPendingRequestsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useFriendsSidebarMenuPendingRequestsQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.FriendsSidebarMenuPendingRequestsDocument, options);
}
exports.useFriendsSidebarMenuPendingRequestsQuery = useFriendsSidebarMenuPendingRequestsQuery;
function useFriendsSidebarMenuPendingRequestsLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.FriendsSidebarMenuPendingRequestsDocument, options);
}
exports.useFriendsSidebarMenuPendingRequestsLazyQuery = useFriendsSidebarMenuPendingRequestsLazyQuery;
exports.FriendsSidebarPendingViewDataDocument = (0, client_1.gql) `
    query FriendsSidebarPendingViewData($userId: ID!) {
  receivedFriendRequests(userId: $userId) {
    users {
      userId
      ...FriendsSidebarFriendListFriend
    }
  }
  sentFriendRequests(userId: $userId) {
    users {
      userId
      ...FriendsSidebarFriendListFriend
    }
  }
}
    ${exports.FriendsSidebarFriendListFriendFragmentDoc}`;
/**
 * __useFriendsSidebarPendingViewDataQuery__
 *
 * To run a query within a React component, call `useFriendsSidebarPendingViewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useFriendsSidebarPendingViewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFriendsSidebarPendingViewDataQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function useFriendsSidebarPendingViewDataQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.FriendsSidebarPendingViewDataDocument, options);
}
exports.useFriendsSidebarPendingViewDataQuery = useFriendsSidebarPendingViewDataQuery;
function useFriendsSidebarPendingViewDataLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.FriendsSidebarPendingViewDataDocument, options);
}
exports.useFriendsSidebarPendingViewDataLazyQuery = useFriendsSidebarPendingViewDataLazyQuery;
exports.MiniProfileDocument = (0, client_1.gql) `
    query MiniProfile($userId: ID!, $channelId: ID) {
  profile(userId: $userId) {
    userId
    friendshipStatus {
      status
    }
    badges(channel_id: $channelId) {
      ...MiniProfileBadge
    }
    ...MiniProfile
  }
}
    ${exports.MiniProfileBadgeFragmentDoc}
${exports.MiniProfileFragmentDoc}`;
/**
 * __useMiniProfileQuery__
 *
 * To run a query within a React component, call `useMiniProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMiniProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMiniProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
function useMiniProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.MiniProfileDocument, options);
}
exports.useMiniProfileQuery = useMiniProfileQuery;
function useMiniProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.MiniProfileDocument, options);
}
exports.useMiniProfileLazyQuery = useMiniProfileLazyQuery;
exports.PartyInviterProfileDocument = (0, client_1.gql) `
    query PartyInviterProfile($userId: ID!) {
  profile(userId: $userId) {
    ...PartyInviteLeaderProfile
  }
}
    ${exports.PartyInviteLeaderProfileFragmentDoc}`;
/**
 * __usePartyInviterProfileQuery__
 *
 * To run a query within a React component, call `usePartyInviterProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartyInviterProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartyInviterProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function usePartyInviterProfileQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.PartyInviterProfileDocument, options);
}
exports.usePartyInviterProfileQuery = usePartyInviterProfileQuery;
function usePartyInviterProfileLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.PartyInviterProfileDocument, options);
}
exports.usePartyInviterProfileLazyQuery = usePartyInviterProfileLazyQuery;
exports.PartyInviterPartyDocument = (0, client_1.gql) `
    query PartyInviterParty($partyId: ID!) {
  party(partyId: $partyId) {
    ...PartyInviteParty
  }
}
    ${exports.PartyInvitePartyFragmentDoc}`;
/**
 * __usePartyInviterPartyQuery__
 *
 * To run a query within a React component, call `usePartyInviterPartyQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartyInviterPartyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartyInviterPartyQuery({
 *   variables: {
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function usePartyInviterPartyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.PartyInviterPartyDocument, options);
}
exports.usePartyInviterPartyQuery = usePartyInviterPartyQuery;
function usePartyInviterPartyLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.PartyInviterPartyDocument, options);
}
exports.usePartyInviterPartyLazyQuery = usePartyInviterPartyLazyQuery;
exports.LeavePartyDocument = (0, client_1.gql) `
    mutation LeaveParty($userId: ID!, $partyId: ID!) {
  deletePartyMember(userId: $userId, partyId: $partyId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useLeavePartyMutation__
 *
 * To run a mutation, you first call `useLeavePartyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeavePartyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leavePartyMutation, { data, loading, error }] = useLeavePartyMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function useLeavePartyMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.LeavePartyDocument, options);
}
exports.useLeavePartyMutation = useLeavePartyMutation;
exports.CreatePartyDocument = (0, client_1.gql) `
    mutation CreateParty($leaderId: ID!) {
  createParty(leaderId: $leaderId) {
    id
  }
}
    `;
/**
 * __useCreatePartyMutation__
 *
 * To run a mutation, you first call `useCreatePartyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePartyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPartyMutation, { data, loading, error }] = useCreatePartyMutation({
 *   variables: {
 *      leaderId: // value for 'leaderId'
 *   },
 * });
 */
function useCreatePartyMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.CreatePartyDocument, options);
}
exports.useCreatePartyMutation = useCreatePartyMutation;
exports.CreatePartyInvitationDocument = (0, client_1.gql) `
    mutation CreatePartyInvitation($inviterId: ID!, $inviteeId: ID!, $partyId: ID!) {
  createPartyInvitation(
    inviterId: $inviterId
    inviteeId: $inviteeId
    partyId: $partyId
  ) {
    partyId
  }
}
    `;
/**
 * __useCreatePartyInvitationMutation__
 *
 * To run a mutation, you first call `useCreatePartyInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePartyInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPartyInvitationMutation, { data, loading, error }] = useCreatePartyInvitationMutation({
 *   variables: {
 *      inviterId: // value for 'inviterId'
 *      inviteeId: // value for 'inviteeId'
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function useCreatePartyInvitationMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.CreatePartyInvitationDocument, options);
}
exports.useCreatePartyInvitationMutation = useCreatePartyInvitationMutation;
exports.PartyInvitesCreatePartyMemberDocument = (0, client_1.gql) `
    mutation PartyInvitesCreatePartyMember($userId: ID!, $partyId: ID!) {
  createPartyMember(userId: $userId, partyId: $partyId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __usePartyInvitesCreatePartyMemberMutation__
 *
 * To run a mutation, you first call `usePartyInvitesCreatePartyMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePartyInvitesCreatePartyMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [partyInvitesCreatePartyMemberMutation, { data, loading, error }] = usePartyInvitesCreatePartyMemberMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function usePartyInvitesCreatePartyMemberMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.PartyInvitesCreatePartyMemberDocument, options);
}
exports.usePartyInvitesCreatePartyMemberMutation = usePartyInvitesCreatePartyMemberMutation;
exports.PartyInvitesDeletePartyInviteDocument = (0, client_1.gql) `
    mutation PartyInvitesDeletePartyInvite($userId: ID!, $partyId: ID!) {
  deletePartyInvitation(userId: $userId, partyId: $partyId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __usePartyInvitesDeletePartyInviteMutation__
 *
 * To run a mutation, you first call `usePartyInvitesDeletePartyInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePartyInvitesDeletePartyInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [partyInvitesDeletePartyInviteMutation, { data, loading, error }] = usePartyInvitesDeletePartyInviteMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function usePartyInvitesDeletePartyInviteMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.PartyInvitesDeletePartyInviteDocument, options);
}
exports.usePartyInvitesDeletePartyInviteMutation = usePartyInvitesDeletePartyInviteMutation;
exports.PartyInvitesCurrentPartyDocument = (0, client_1.gql) `
    query PartyInvitesCurrentParty($userId: ID!) {
  userParty(userId: $userId) {
    id
    leaderId
    streamId
    members {
      userId
    }
  }
}
    `;
/**
 * __usePartyInvitesCurrentPartyQuery__
 *
 * To run a query within a React component, call `usePartyInvitesCurrentPartyQuery` and pass it any options that fit your needs.
 * When your component renders, `usePartyInvitesCurrentPartyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartyInvitesCurrentPartyQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
function usePartyInvitesCurrentPartyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useQuery(exports.PartyInvitesCurrentPartyDocument, options);
}
exports.usePartyInvitesCurrentPartyQuery = usePartyInvitesCurrentPartyQuery;
function usePartyInvitesCurrentPartyLazyQuery(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useLazyQuery(exports.PartyInvitesCurrentPartyDocument, options);
}
exports.usePartyInvitesCurrentPartyLazyQuery = usePartyInvitesCurrentPartyLazyQuery;
exports.PartyInvitesPartyUpdatesDocument = (0, client_1.gql) `
    subscription PartyInvitesPartyUpdates($partyId: ID!) {
  partyUpdateSubscribe(partyId: $partyId) {
    party {
      id
      streamId
      leaderId
      members {
        userId
        profile {
          userId
        }
      }
    }
  }
}
    `;
/**
 * __usePartyInvitesPartyUpdatesSubscription__
 *
 * To run a query within a React component, call `usePartyInvitesPartyUpdatesSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePartyInvitesPartyUpdatesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePartyInvitesPartyUpdatesSubscription({
 *   variables: {
 *      partyId: // value for 'partyId'
 *   },
 * });
 */
function usePartyInvitesPartyUpdatesSubscription(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useSubscription(exports.PartyInvitesPartyUpdatesDocument, options);
}
exports.usePartyInvitesPartyUpdatesSubscription = usePartyInvitesPartyUpdatesSubscription;
exports.SocialAcceptFriendRequestDocument = (0, client_1.gql) `
    mutation SocialAcceptFriendRequest($userId: ID!, $friendId: ID!) {
  acceptFriendRequest(userId: $userId, friendId: $friendId) {
    friendId
    friend {
      ...FriendStatusUpdateProfile
    }
  }
}
    ${exports.FriendStatusUpdateProfileFragmentDoc}`;
/**
 * __useSocialAcceptFriendRequestMutation__
 *
 * To run a mutation, you first call `useSocialAcceptFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialAcceptFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialAcceptFriendRequestMutation, { data, loading, error }] = useSocialAcceptFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
function useSocialAcceptFriendRequestMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialAcceptFriendRequestDocument, options);
}
exports.useSocialAcceptFriendRequestMutation = useSocialAcceptFriendRequestMutation;
exports.SocialBlockUserDocument = (0, client_1.gql) `
    mutation SocialBlockUser($userId: ID!, $blockedUserId: ID!) {
  blockUser(userId: $userId, blockedUserId: $blockedUserId) {
    blockedUserId
    blockedUser {
      ...FriendStatusUpdateProfile
    }
  }
}
    ${exports.FriendStatusUpdateProfileFragmentDoc}`;
/**
 * __useSocialBlockUserMutation__
 *
 * To run a mutation, you first call `useSocialBlockUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialBlockUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialBlockUserMutation, { data, loading, error }] = useSocialBlockUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      blockedUserId: // value for 'blockedUserId'
 *   },
 * });
 */
function useSocialBlockUserMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialBlockUserDocument, options);
}
exports.useSocialBlockUserMutation = useSocialBlockUserMutation;
exports.SocialRemoveFriendDocument = (0, client_1.gql) `
    mutation SocialRemoveFriend($userId: ID!, $friendId: ID!) {
  removeFriend(userId: $userId, friendId: $friendId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useSocialRemoveFriendMutation__
 *
 * To run a mutation, you first call `useSocialRemoveFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialRemoveFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialRemoveFriendMutation, { data, loading, error }] = useSocialRemoveFriendMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
function useSocialRemoveFriendMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialRemoveFriendDocument, options);
}
exports.useSocialRemoveFriendMutation = useSocialRemoveFriendMutation;
exports.SocialRemoveReceivedFriendRequestDocument = (0, client_1.gql) `
    mutation SocialRemoveReceivedFriendRequest($userId: ID!, $friendId: ID!) {
  removeFriendRequest(userId: $userId, friendId: $friendId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useSocialRemoveReceivedFriendRequestMutation__
 *
 * To run a mutation, you first call `useSocialRemoveReceivedFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialRemoveReceivedFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialRemoveReceivedFriendRequestMutation, { data, loading, error }] = useSocialRemoveReceivedFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
function useSocialRemoveReceivedFriendRequestMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialRemoveReceivedFriendRequestDocument, options);
}
exports.useSocialRemoveReceivedFriendRequestMutation = useSocialRemoveReceivedFriendRequestMutation;
exports.SocialRemoveSentFriendRequestDocument = (0, client_1.gql) `
    mutation SocialRemoveSentFriendRequest($userId: ID!, $friendId: ID!) {
  removeFriendRequest(userId: $friendId, friendId: $userId) {
    emptyTypeWorkaround
  }
}
    `;
/**
 * __useSocialRemoveSentFriendRequestMutation__
 *
 * To run a mutation, you first call `useSocialRemoveSentFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialRemoveSentFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialRemoveSentFriendRequestMutation, { data, loading, error }] = useSocialRemoveSentFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
function useSocialRemoveSentFriendRequestMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialRemoveSentFriendRequestDocument, options);
}
exports.useSocialRemoveSentFriendRequestMutation = useSocialRemoveSentFriendRequestMutation;
exports.SocialSendFriendRequestDocument = (0, client_1.gql) `
    mutation SocialSendFriendRequest($userId: ID!, $friendId: ID!) {
  sendFriendRequest(userId: $userId, friendId: $friendId) {
    friendId
    friend {
      ...FriendStatusUpdateProfile
    }
  }
}
    ${exports.FriendStatusUpdateProfileFragmentDoc}`;
/**
 * __useSocialSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSocialSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialSendFriendRequestMutation, { data, loading, error }] = useSocialSendFriendRequestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
function useSocialSendFriendRequestMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialSendFriendRequestDocument, options);
}
exports.useSocialSendFriendRequestMutation = useSocialSendFriendRequestMutation;
exports.SocialUnblockUserDocument = (0, client_1.gql) `
    mutation SocialUnblockUser($userId: ID!, $blockedUserId: ID!) {
  unblockUser(userId: $userId, blockedUserId: $blockedUserId) {
    unblockedUserId
    unblockedUser {
      ...FriendStatusUpdateProfile
    }
  }
}
    ${exports.FriendStatusUpdateProfileFragmentDoc}`;
/**
 * __useSocialUnblockUserMutation__
 *
 * To run a mutation, you first call `useSocialUnblockUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSocialUnblockUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [socialUnblockUserMutation, { data, loading, error }] = useSocialUnblockUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      blockedUserId: // value for 'blockedUserId'
 *   },
 * });
 */
function useSocialUnblockUserMutation(baseOptions) {
    const options = Object.assign(Object.assign({}, defaultOptions), baseOptions);
    return Apollo.useMutation(exports.SocialUnblockUserDocument, options);
}
exports.useSocialUnblockUserMutation = useSocialUnblockUserMutation;
//# sourceMappingURL=graphql.js.map