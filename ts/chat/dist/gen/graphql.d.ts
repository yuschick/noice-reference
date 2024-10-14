import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends {
    [key: string]: unknown;
}, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> = T | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: {
        input: string;
        output: string;
    };
    String: {
        input: string;
        output: string;
    };
    Boolean: {
        input: boolean;
        output: boolean;
    };
    Int: {
        input: number;
        output: number;
    };
    Float: {
        input: number;
        output: number;
    };
    Duration: {
        input: string;
        output: string;
    };
    InputTimestamp: {
        input: any;
        output: any;
    };
    Timestamp: {
        input: string;
        output: string;
    };
};
export type ApiCursorInput = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
};
export type ApiPageInfo = {
    __typename?: 'APIPageInfo';
    endCursor: Scalars['String']['output'];
    hasNextPage: Scalars['Boolean']['output'];
    hasPreviousPage: Scalars['Boolean']['output'];
    startCursor: Scalars['String']['output'];
};
export type AdsGetPlacementResponse = {
    __typename?: 'AdsGetPlacementResponse';
    placementId: Scalars['ID']['output'];
    referenceId: Scalars['ID']['output'];
    /** TODO: Kept while migrating and set to the first item in rewards */
    reward: AdsRewardDescription;
    rewards: Array<AdsRewardDescription>;
    state: AdsPlacementState;
    updatesAt: Scalars['Timestamp']['output'];
};
export declare enum AdsPlacementState {
    PlacementStateNotReady = "PLACEMENT_STATE_NOT_READY",
    PlacementStateReady = "PLACEMENT_STATE_READY",
    PlacementStateUnspecified = "PLACEMENT_STATE_UNSPECIFIED"
}
export type AdsPlacementStateEvent = {
    __typename?: 'AdsPlacementStateEvent';
    placementId: Scalars['ID']['output'];
    referenceId: Scalars['ID']['output'];
    state: AdsPlacementState;
    userId: Scalars['ID']['output'];
};
export type AdsRewardDescription = {
    __typename?: 'AdsRewardDescription';
    prizes: Array<AdsRewardDescriptionPrizeDescription>;
    rarity: RarityRarity;
    readyAt: Scalars['Timestamp']['output'];
};
export type AdsRewardDescriptionPrizeDescription = {
    __typename?: 'AdsRewardDescriptionPrizeDescription';
    amount: Scalars['Int']['output'];
    kind: AdsRewardDescriptionPrizeDescriptionKind;
    max: Scalars['Int']['output'];
    min: Scalars['Int']['output'];
    value: Scalars['String']['output'];
};
export declare enum AdsRewardDescriptionPrizeDescriptionKind {
    KindCurrency = "KIND_CURRENCY",
    KindExperiencePoints = "KIND_EXPERIENCE_POINTS",
    KindUnspecified = "KIND_UNSPECIFIED"
}
export type AdyenAmount = {
    __typename?: 'AdyenAmount';
    currency: Scalars['String']['output'];
    value: Scalars['Int']['output'];
};
export type AdyenSession = {
    __typename?: 'AdyenSession';
    amount: AdyenAmount;
    id: Scalars['ID']['output'];
    reference: Scalars['String']['output'];
    returnUrl: Scalars['String']['output'];
    sessionData: Scalars['String']['output'];
};
export type AgreementAgreementRevision = {
    __typename?: 'AgreementAgreementRevision';
    name: Scalars['String']['output'];
    revision: Scalars['String']['output'];
    url: Scalars['String']['output'];
};
export type AgreementListAgreementResponse = {
    __typename?: 'AgreementListAgreementResponse';
    agreements: Array<AgreementAgreementRevision>;
};
export type AnnouncementAnnouncement = {
    __typename?: 'AnnouncementAnnouncement';
    category: AnnouncementAnnouncementCategory;
    createdAt: Scalars['Timestamp']['output'];
    creator: ProfileProfile;
    creatorId: Scalars['ID']['output'];
    endTime?: Maybe<Scalars['Timestamp']['output']>;
    id: Scalars['ID']['output'];
    image: Scalars['String']['output'];
    imageUrl: Scalars['String']['output'];
    published: Scalars['Boolean']['output'];
    startTime?: Maybe<Scalars['Timestamp']['output']>;
    status: AnnouncementAnnouncementStatus;
    targets: AnnouncementTargets;
    text: Scalars['String']['output'];
    title: Scalars['String']['output'];
};
export declare enum AnnouncementAnnouncementCategory {
    AnnouncementCategoryGameApexLegends = "ANNOUNCEMENT_CATEGORY_GAME_APEX_LEGENDS",
    AnnouncementCategoryGameDbd = "ANNOUNCEMENT_CATEGORY_GAME_DBD",
    AnnouncementCategoryGameDota2 = "ANNOUNCEMENT_CATEGORY_GAME_DOTA2",
    AnnouncementCategoryGameFortnite = "ANNOUNCEMENT_CATEGORY_GAME_FORTNITE",
    AnnouncementCategoryGameLeagueOfLegends = "ANNOUNCEMENT_CATEGORY_GAME_LEAGUE_OF_LEGENDS",
    AnnouncementCategoryPlatform = "ANNOUNCEMENT_CATEGORY_PLATFORM",
    AnnouncementCategorySystem = "ANNOUNCEMENT_CATEGORY_SYSTEM",
    AnnouncementCategoryUnspecified = "ANNOUNCEMENT_CATEGORY_UNSPECIFIED"
}
export type AnnouncementAnnouncementFilterInput = {
    statuses?: InputMaybe<Array<AnnouncementAnnouncementStatus>>;
    targets?: InputMaybe<Array<AnnouncementAnnouncementTarget>>;
};
export type AnnouncementAnnouncementInput = {
    category?: InputMaybe<AnnouncementAnnouncementCategory>;
    createdAt?: InputMaybe<Scalars['InputTimestamp']['input']>;
    creatorId?: InputMaybe<Scalars['ID']['input']>;
    endTime?: InputMaybe<Scalars['InputTimestamp']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    published?: InputMaybe<Scalars['Boolean']['input']>;
    startTime?: InputMaybe<Scalars['InputTimestamp']['input']>;
    status?: InputMaybe<AnnouncementAnnouncementStatus>;
    targets?: InputMaybe<AnnouncementTargetsInput>;
    text?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};
export declare enum AnnouncementAnnouncementStatus {
    AnnouncementStatusActive = "ANNOUNCEMENT_STATUS_ACTIVE",
    AnnouncementStatusDraft = "ANNOUNCEMENT_STATUS_DRAFT",
    AnnouncementStatusPast = "ANNOUNCEMENT_STATUS_PAST",
    AnnouncementStatusScheduled = "ANNOUNCEMENT_STATUS_SCHEDULED",
    AnnouncementStatusUnspecified = "ANNOUNCEMENT_STATUS_UNSPECIFIED"
}
export declare enum AnnouncementAnnouncementTarget {
    AnnouncementTargetMobile = "ANNOUNCEMENT_TARGET_MOBILE",
    AnnouncementTargetStudio = "ANNOUNCEMENT_TARGET_STUDIO",
    AnnouncementTargetUnspecified = "ANNOUNCEMENT_TARGET_UNSPECIFIED",
    AnnouncementTargetWeb = "ANNOUNCEMENT_TARGET_WEB"
}
export type AnnouncementCreateAnnouncementImageUploadTokenResponse = {
    __typename?: 'AnnouncementCreateAnnouncementImageUploadTokenResponse';
    token: Scalars['String']['output'];
};
export type AnnouncementListAnnouncementsResponse = {
    __typename?: 'AnnouncementListAnnouncementsResponse';
    announcements: Array<AnnouncementAnnouncement>;
    pageInfo: ApiPageInfo;
    totalCount: Scalars['Int']['output'];
};
export type AnnouncementListUserAnnouncementsResponse = {
    __typename?: 'AnnouncementListUserAnnouncementsResponse';
    announcements: Array<AnnouncementAnnouncement>;
    pageInfo: ApiPageInfo;
};
export type AnnouncementTargets = {
    __typename?: 'AnnouncementTargets';
    mobile: Scalars['Boolean']['output'];
    studio: Scalars['Boolean']['output'];
    web: Scalars['Boolean']['output'];
};
export type AnnouncementTargetsInput = {
    mobile?: InputMaybe<Scalars['Boolean']['input']>;
    studio?: InputMaybe<Scalars['Boolean']['input']>;
    web?: InputMaybe<Scalars['Boolean']['input']>;
};
export declare enum ApiEntityState {
    EntityStateBlocked = "ENTITY_STATE_BLOCKED",
    EntityStateDeleted = "ENTITY_STATE_DELETED",
    EntityStateUnspecified = "ENTITY_STATE_UNSPECIFIED"
}
export type ArenaArena = {
    __typename?: 'ArenaArena';
    config?: Maybe<ArenaArenaConfigUnion>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    thumbnailUrl: Scalars['String']['output'];
};
export type ArenaArenaConfigUnion = ArenaServerSideArenaConfig;
export type ArenaListArenasResponse = {
    __typename?: 'ArenaListArenasResponse';
    arenas: Array<ArenaArena>;
    pageInfo: ApiPageInfo;
};
export type ArenaServerSideArenaConfig = {
    __typename?: 'ArenaServerSideArenaConfig';
    arenaConfigUrl: Scalars['String']['output'];
    contentCatalogUrl: Scalars['String']['output'];
    gameViewScreenshotUrl: Scalars['String']['output'];
};
export type AttributeAttribute = {
    __typename?: 'AttributeAttribute';
    value?: Maybe<AttributeAttributeValueUnion>;
};
export type AttributeAttributeBoolArray = {
    __typename?: 'AttributeAttributeBoolArray';
    value: Array<Scalars['Boolean']['output']>;
};
export type AttributeAttributeBoolArrayInput = {
    value?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};
export type AttributeAttributeFloatArray = {
    __typename?: 'AttributeAttributeFloatArray';
    value: Array<Scalars['Float']['output']>;
};
export type AttributeAttributeFloatArrayInput = {
    value?: InputMaybe<Array<Scalars['Float']['input']>>;
};
export type AttributeAttributeInput = {
    boolArrayValue?: InputMaybe<AttributeAttributeBoolArrayInput>;
    boolValue?: InputMaybe<Scalars['Boolean']['input']>;
    floatArrayValue?: InputMaybe<AttributeAttributeFloatArrayInput>;
    floatValue?: InputMaybe<Scalars['Float']['input']>;
    intArrayValue?: InputMaybe<AttributeAttributeIntArrayInput>;
    intValue?: InputMaybe<Scalars['Int']['input']>;
    mapValue?: InputMaybe<AttributeAttributeMapInput>;
    stringArrayValue?: InputMaybe<AttributeAttributeStringArrayInput>;
    stringValue?: InputMaybe<Scalars['String']['input']>;
};
export type AttributeAttributeIntArray = {
    __typename?: 'AttributeAttributeIntArray';
    value: Array<Scalars['Int']['output']>;
};
export type AttributeAttributeIntArrayInput = {
    value?: InputMaybe<Array<Scalars['Int']['input']>>;
};
export type AttributeAttributeMap = {
    __typename?: 'AttributeAttributeMap';
    value: Array<AttributeAttributeMapValueEntry>;
};
export type AttributeAttributeMapInput = {
    value?: InputMaybe<Array<AttributeAttributeMapValueEntryInput>>;
};
export type AttributeAttributeMapValueEntry = {
    __typename?: 'AttributeAttributeMapValueEntry';
    key: Scalars['String']['output'];
    value: AttributeAttribute;
};
export type AttributeAttributeMapValueEntryInput = {
    key?: InputMaybe<Scalars['String']['input']>;
    value?: InputMaybe<AttributeAttributeInput>;
};
export type AttributeAttributeStringArray = {
    __typename?: 'AttributeAttributeStringArray';
    value: Array<Scalars['String']['output']>;
};
export type AttributeAttributeStringArrayInput = {
    value?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type AttributeAttributeValueUnion = AttributeAttributeBoolArray | AttributeAttributeFloatArray | AttributeAttributeIntArray | AttributeAttributeMap | AttributeAttributeStringArray | BooleanType | FloatType | IntType | StringType;
export type AuthAccount = {
    __typename?: 'AuthAccount';
    acceptedTerms: Array<AuthTermsVersion>;
    birthday?: Maybe<AuthDate>;
    createdAt: Scalars['Timestamp']['output'];
    email: Scalars['String']['output'];
    emailVerifiedAt?: Maybe<Scalars['Timestamp']['output']>;
    externalIds: Array<AuthIdentity>;
    flags: Array<AuthAccountStatusFlag>;
    isBot: Scalars['Boolean']['output'];
    marketingConsent: AuthConsentStatus;
    matureRatedContentAllowed: Scalars['Boolean']['output'];
    pendingAgreements: Array<AgreementAgreementRevision>;
    roles: Array<AuthPlatformRole>;
    signupOrigin?: Maybe<AuthSignupOrigin>;
    state: ApiEntityState;
    uid: Scalars['String']['output'];
};
export declare enum AuthAccountStatusFlag {
    StatusFlagBanned = "STATUS_FLAG_BANNED",
    StatusFlagUnspecified = "STATUS_FLAG_UNSPECIFIED",
    StatusFlagWaitlist = "STATUS_FLAG_WAITLIST"
}
export type AuthAccountUpdateInput = {
    roles?: InputMaybe<Array<AuthPlatformRole>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export declare enum AuthConsentStatus {
    ConsentStatusAccepted = "CONSENT_STATUS_ACCEPTED",
    ConsentStatusDeclined = "CONSENT_STATUS_DECLINED",
    ConsentStatusUnspecified = "CONSENT_STATUS_UNSPECIFIED"
}
export type AuthDate = {
    __typename?: 'AuthDate';
    day: Scalars['Int']['output'];
    month: Scalars['Int']['output'];
    year: Scalars['Int']['output'];
};
export type AuthDateInput = {
    day?: InputMaybe<Scalars['Int']['input']>;
    month?: InputMaybe<Scalars['Int']['input']>;
    year?: InputMaybe<Scalars['Int']['input']>;
};
export type AuthIdentity = {
    __typename?: 'AuthIdentity';
    id: Scalars['ID']['output'];
    type: AuthIdentityType;
};
export declare enum AuthIdentityType {
    IdentityTypeDiscord = "IDENTITY_TYPE_DISCORD",
    IdentityTypeEmail = "IDENTITY_TYPE_EMAIL",
    IdentityTypeUnspecified = "IDENTITY_TYPE_UNSPECIFIED"
}
export declare enum AuthPlatformRole {
    PlatformRoleAdmin = "PLATFORM_ROLE_ADMIN",
    PlatformRoleBot = "PLATFORM_ROLE_BOT",
    PlatformRoleGuest = "PLATFORM_ROLE_GUEST",
    PlatformRoleModerator = "PLATFORM_ROLE_MODERATOR",
    PlatformRolePxAgent = "PLATFORM_ROLE_PX_AGENT",
    PlatformRoleRoot = "PLATFORM_ROLE_ROOT",
    PlatformRoleUnspecified = "PLATFORM_ROLE_UNSPECIFIED",
    PlatformRoleUser = "PLATFORM_ROLE_USER"
}
export type AuthSignupOrigin = {
    __typename?: 'AuthSignupOrigin';
    origin?: Maybe<AuthSignupOriginOriginUnion>;
};
export type AuthSignupOriginCampaign = {
    __typename?: 'AuthSignupOriginCampaign';
    campaign: Scalars['String']['output'];
    content: Scalars['String']['output'];
    creator: Scalars['String']['output'];
    format: Scalars['String']['output'];
    medium: Scalars['String']['output'];
    source: Scalars['String']['output'];
    term: Scalars['String']['output'];
};
export type AuthSignupOriginChannel = {
    __typename?: 'AuthSignupOriginChannel';
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
};
export type AuthSignupOriginOriginUnion = AuthSignupOriginCampaign | AuthSignupOriginChannel | AuthSignupOriginPage;
export type AuthSignupOriginPage = {
    __typename?: 'AuthSignupOriginPage';
    url: Scalars['String']['output'];
};
export type AuthTermsVersion = {
    __typename?: 'AuthTermsVersion';
    name: Scalars['String']['output'];
    revision: Scalars['String']['output'];
    signature: Scalars['String']['output'];
};
export type AuthTermsVersionInput = {
    name?: InputMaybe<Scalars['String']['input']>;
    revision?: InputMaybe<Scalars['String']['input']>;
    signature?: InputMaybe<Scalars['String']['input']>;
};
export type AuthV4GetOAuth2ConsentResponse = {
    __typename?: 'AuthV4GetOAuth2ConsentResponse';
    clientId: Scalars['ID']['output'];
    clientName: Scalars['String']['output'];
    scopes: Array<Scalars['String']['output']>;
};
export type AvatarAnimation = {
    __typename?: 'AvatarAnimation';
    category: Array<AvatarAnimationCategory>;
    chatCommand: Scalars['String']['output'];
    config: AvatarAnimationConfig;
    enabled: Scalars['Boolean']['output'];
    glbUrl: Scalars['String']['output'];
    iconUrl: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    mirroredGlbUrl: Scalars['String']['output'];
    name: Scalars['String']['output'];
};
export declare enum AvatarAnimationCategory {
    CategoryAngry = "CATEGORY_ANGRY",
    CategoryBoosterReceived = "CATEGORY_BOOSTER_RECEIVED",
    CategoryBoosterRequested = "CATEGORY_BOOSTER_REQUESTED",
    CategoryBoosterSent = "CATEGORY_BOOSTER_SENT",
    CategoryCameraDrive = "CATEGORY_CAMERA_DRIVE",
    CategoryCameraDriveExcited = "CATEGORY_CAMERA_DRIVE_EXCITED",
    CategoryCardFailure = "CATEGORY_CARD_FAILURE",
    CategoryCardMaxedOut = "CATEGORY_CARD_MAXED_OUT",
    CategoryCardSuccess = "CATEGORY_CARD_SUCCESS",
    CategoryChatMessage = "CATEGORY_CHAT_MESSAGE",
    CategoryCheer = "CATEGORY_CHEER",
    CategoryDance = "CATEGORY_DANCE",
    CategoryDefeat = "CATEGORY_DEFEAT",
    CategoryEditorIdle = "CATEGORY_EDITOR_IDLE",
    CategoryEditorPickBody = "CATEGORY_EDITOR_PICK_BODY",
    CategoryEditorPickFace = "CATEGORY_EDITOR_PICK_FACE",
    CategoryEditorPickGloves = "CATEGORY_EDITOR_PICK_GLOVES",
    CategoryEditorPickHat = "CATEGORY_EDITOR_PICK_HAT",
    CategoryEditorPickJacket = "CATEGORY_EDITOR_PICK_JACKET",
    CategoryEditorPickPants = "CATEGORY_EDITOR_PICK_PANTS",
    CategoryEditorPickShoes = "CATEGORY_EDITOR_PICK_SHOES",
    CategoryEmoji = "CATEGORY_EMOJI",
    CategoryEmote = "CATEGORY_EMOTE",
    CategoryExcited = "CATEGORY_EXCITED",
    CategoryFsInChat = "CATEGORY_FS_IN_CHAT",
    CategoryIdle = "CATEGORY_IDLE",
    CategoryMessage = "CATEGORY_MESSAGE",
    CategoryPhotoPoses = "CATEGORY_PHOTO_POSES",
    CategoryPlayerExit = "CATEGORY_PLAYER_EXIT",
    CategoryPlayerJoin = "CATEGORY_PLAYER_JOIN",
    CategoryPlayerPickCard = "CATEGORY_PLAYER_PICK_CARD",
    CategoryPlayerSwapCard = "CATEGORY_PLAYER_SWAP_CARD",
    CategorySad = "CATEGORY_SAD",
    CategorySpotlightCrowd = "CATEGORY_SPOTLIGHT_CROWD",
    CategorySpotlightPodium = "CATEGORY_SPOTLIGHT_PODIUM",
    CategoryUnspecified = "CATEGORY_UNSPECIFIED",
    CategoryVictory = "CATEGORY_VICTORY",
    CategoryWsInChat = "CATEGORY_WS_IN_CHAT"
}
export type AvatarAnimationConfig = {
    __typename?: 'AvatarAnimationConfig';
    clamp: Scalars['Boolean']['output'];
    fadeInTimeSec: Scalars['Float']['output'];
    handedness: AvatarAnimationHandedness;
    interruptible: Scalars['Boolean']['output'];
    maxLoops: Scalars['Int']['output'];
    randomizeLoops: Scalars['Boolean']['output'];
};
export declare enum AvatarAnimationHandedness {
    HandednessBoth = "HANDEDNESS_BOTH",
    HandednessLeft = "HANDEDNESS_LEFT",
    HandednessRight = "HANDEDNESS_RIGHT",
    HandednessUnspecified = "HANDEDNESS_UNSPECIFIED"
}
export type AvatarAvatar = {
    __typename?: 'AvatarAvatar';
    avatar3D: Scalars['String']['output'];
    avatarComposition: AvatarAvatarComposition;
    avatarLods: Array<Scalars['String']['output']>;
    body: Scalars['String']['output'];
    face: Scalars['String']['output'];
    /** todo: remove or use Gender instead */
    gender: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** selectable is used to determine if the avatar is shown in the avatar picker */
    selectable: Scalars['Boolean']['output'];
};
export type AvatarAvatarComposition = {
    __typename?: 'AvatarAvatarComposition';
    generatorVersion: Scalars['String']['output'];
    partCustomizations: Array<AvatarAvatarPartCustomization>;
    partIds: Array<Scalars['String']['output']>;
};
export type AvatarAvatarCompositionInput = {
    generatorVersion?: InputMaybe<Scalars['String']['input']>;
    partCustomizations?: InputMaybe<Array<AvatarAvatarPartCustomizationInput>>;
    partIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type AvatarAvatarInput = {
    avatar3D?: InputMaybe<Scalars['String']['input']>;
    avatarComposition?: InputMaybe<AvatarAvatarCompositionInput>;
    avatarLods?: InputMaybe<Array<Scalars['String']['input']>>;
    body?: InputMaybe<Scalars['String']['input']>;
    face?: InputMaybe<Scalars['String']['input']>;
    /** todo: remove or use Gender instead */
    gender?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    /** selectable is used to determine if the avatar is shown in the avatar picker */
    selectable?: InputMaybe<Scalars['Boolean']['input']>;
};
export type AvatarAvatarPart = {
    __typename?: 'AvatarAvatarPart';
    category: AvatarAvatarPartCategory;
    categoryOverride: Array<AvatarAvatarPartCategory>;
    clothingSet: Scalars['String']['output'];
    color: Scalars['String']['output'];
    colorOptions: Array<AvatarAvatarPartColorGroup>;
    colors: Array<Scalars['String']['output']>;
    default: Scalars['Boolean']['output'];
    defaultColorOption: Scalars['Int']['output'];
    enabled: Scalars['Boolean']['output'];
    gender: AvatarGender;
    glbUrl: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    previewImgUrl: Scalars['String']['output'];
    url: Scalars['String']['output'];
};
export declare enum AvatarAvatarPartCategory {
    CategoryBody = "CATEGORY_BODY",
    CategoryColorPreset = "CATEGORY_COLOR_PRESET",
    CategoryEyebrows = "CATEGORY_EYEBROWS",
    CategoryEyebrowsColor = "CATEGORY_EYEBROWS_COLOR",
    CategoryEyelashes = "CATEGORY_EYELASHES",
    CategoryEyelashesColor = "CATEGORY_EYELASHES_COLOR",
    CategoryEyes = "CATEGORY_EYES",
    CategoryFaceItem = "CATEGORY_FACE_ITEM",
    CategoryHair = "CATEGORY_HAIR",
    CategoryHairColor = "CATEGORY_HAIR_COLOR",
    CategoryHands = "CATEGORY_HANDS",
    CategoryHead = "CATEGORY_HEAD",
    CategoryHeadItem = "CATEGORY_HEAD_ITEM",
    CategoryLegs = "CATEGORY_LEGS",
    CategoryShoes = "CATEGORY_SHOES",
    CategorySkinColor = "CATEGORY_SKIN_COLOR",
    CategoryTeeth = "CATEGORY_TEETH",
    CategoryTorso = "CATEGORY_TORSO",
    CategoryUnspecified = "CATEGORY_UNSPECIFIED"
}
export type AvatarAvatarPartColorGroup = {
    __typename?: 'AvatarAvatarPartColorGroup';
    colors: Array<Scalars['String']['output']>;
};
export type AvatarAvatarPartCustomization = {
    __typename?: 'AvatarAvatarPartCustomization';
    colors: Array<Scalars['String']['output']>;
    lutUrl: Scalars['String']['output'];
    partId: Scalars['ID']['output'];
};
export type AvatarAvatarPartCustomizationInput = {
    colors?: InputMaybe<Array<Scalars['String']['input']>>;
    lutUrl?: InputMaybe<Scalars['String']['input']>;
    partId?: InputMaybe<Scalars['ID']['input']>;
};
export type AvatarBatchGetAnimationsResponse = {
    __typename?: 'AvatarBatchGetAnimationsResponse';
    animations: Array<AvatarAnimation>;
};
export type AvatarBatchGetAvatarPartsResponse = {
    __typename?: 'AvatarBatchGetAvatarPartsResponse';
    avatarParts: Array<AvatarAvatarPart>;
};
export type AvatarBatchGetAvatarsResponse = {
    __typename?: 'AvatarBatchGetAvatarsResponse';
    avatars: Array<AvatarAvatar>;
};
export declare enum AvatarGender {
    GenderFemale = "GENDER_FEMALE",
    GenderMale = "GENDER_MALE",
    GenderUnspecified = "GENDER_UNSPECIFIED"
}
export type AvatarListAnimationsResponse = {
    __typename?: 'AvatarListAnimationsResponse';
    animations: Array<AvatarAnimation>;
};
export type AvatarListAvatarPartsResponse = {
    __typename?: 'AvatarListAvatarPartsResponse';
    avatarParts: Array<AvatarAvatarPart>;
};
export type AvatarListAvatarsResponse = {
    __typename?: 'AvatarListAvatarsResponse';
    avatars: Array<AvatarAvatar>;
    pageInfo: ApiPageInfo;
};
export type AvatarValidateAvatarCompositionResponse = {
    __typename?: 'AvatarValidateAvatarCompositionResponse';
    changes: Array<AvatarValidateAvatarCompositionResponseChange>;
    composition: AvatarAvatarComposition;
    /** @deprecated field is deprecated */
    duplicatePartIds: Array<Scalars['String']['output']>;
    isDefault: Scalars['Boolean']['output'];
    /** @deprecated field is deprecated */
    missingPartCategories: Array<AvatarAvatarPartCategory>;
    /** @deprecated field is deprecated */
    missingPartIds: Array<Scalars['String']['output']>;
};
export type AvatarValidateAvatarCompositionResponseChange = {
    __typename?: 'AvatarValidateAvatarCompositionResponseChange';
    action?: Maybe<AvatarValidateAvatarCompositionResponseChangeActionUnion>;
};
export type AvatarValidateAvatarCompositionResponseChangeActionUnion = AvatarValidateAvatarCompositionResponseChangeAvatarPartAdded | AvatarValidateAvatarCompositionResponseChangeAvatarPartRemoved | AvatarValidateAvatarCompositionResponseChangeAvatarPartReplaced;
export type AvatarValidateAvatarCompositionResponseChangeAvatarPartAdded = {
    __typename?: 'AvatarValidateAvatarCompositionResponseChangeAvatarPartAdded';
    id: Scalars['ID']['output'];
    reason: AvatarValidateAvatarCompositionResponseChangeReason;
};
export type AvatarValidateAvatarCompositionResponseChangeAvatarPartRemoved = {
    __typename?: 'AvatarValidateAvatarCompositionResponseChangeAvatarPartRemoved';
    id: Scalars['ID']['output'];
    reason: AvatarValidateAvatarCompositionResponseChangeReason;
};
export type AvatarValidateAvatarCompositionResponseChangeAvatarPartReplaced = {
    __typename?: 'AvatarValidateAvatarCompositionResponseChangeAvatarPartReplaced';
    id: Scalars['ID']['output'];
    reason: AvatarValidateAvatarCompositionResponseChangeReason;
    replacementId: Scalars['ID']['output'];
};
export declare enum AvatarValidateAvatarCompositionResponseChangeReason {
    ReasonAvatarPartBodyRequired = "REASON_AVATAR_PART_BODY_REQUIRED",
    ReasonAvatarPartEyesRequired = "REASON_AVATAR_PART_EYES_REQUIRED",
    ReasonAvatarPartHeadRequired = "REASON_AVATAR_PART_HEAD_REQUIRED",
    ReasonAvatarPartLegsRequired = "REASON_AVATAR_PART_LEGS_REQUIRED",
    ReasonAvatarPartTorsoRequired = "REASON_AVATAR_PART_TORSO_REQUIRED",
    ReasonAvatarPartUnavailable = "REASON_AVATAR_PART_UNAVAILABLE",
    ReasonAvatarPartUnknown = "REASON_AVATAR_PART_UNKNOWN",
    ReasonUnspecified = "REASON_UNSPECIFIED"
}
export type BadgeBadge = {
    __typename?: 'BadgeBadge';
    level: Scalars['Int']['output'];
    nextLevelAt: Scalars['Timestamp']['output'];
    type: BadgeBadgeType;
};
export declare enum BadgeBadgeType {
    TypeChannelModerator = "TYPE_CHANNEL_MODERATOR",
    TypeChannelSubscriber = "TYPE_CHANNEL_SUBSCRIBER",
    TypeNoiceStaff = "TYPE_NOICE_STAFF",
    TypeStreamer = "TYPE_STREAMER",
    TypeUnspecified = "TYPE_UNSPECIFIED"
}
export type BooleanType = {
    __typename?: 'BooleanType';
    /** The wrapped value of type Boolean */
    value: Scalars['Boolean']['output'];
};
export declare enum ChannelAppealStatus {
    AppealStatusAccepted = "APPEAL_STATUS_ACCEPTED",
    AppealStatusDeclined = "APPEAL_STATUS_DECLINED",
    AppealStatusPending = "APPEAL_STATUS_PENDING",
    AppealStatusUnspecified = "APPEAL_STATUS_UNSPECIFIED"
}
export declare enum ChannelAssetType {
    AssetTypeBanner = "ASSET_TYPE_BANNER",
    AssetTypeLogo = "ASSET_TYPE_LOGO",
    AssetTypeUnspecified = "ASSET_TYPE_UNSPECIFIED"
}
export type ChannelAutomodItemAccepted = {
    __typename?: 'ChannelAutomodItemAccepted';
    message: ChatMessageContent;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelAutomodItemRejected = {
    __typename?: 'ChannelAutomodItemRejected';
    message: ChatMessageContent;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelAutomodSettings = {
    __typename?: 'ChannelAutomodSettings';
    defaultDecision: ChatAutomodDecision;
    level: ChatAutomodLevel;
};
export type ChannelAutomodSettingsInput = {
    defaultDecision?: InputMaybe<ChatAutomodDecision>;
    level?: InputMaybe<ChatAutomodLevel>;
};
export type ChannelBanAppeal = {
    __typename?: 'ChannelBanAppeal';
    appealText: Scalars['String']['output'];
    bannedAt: Scalars['Timestamp']['output'];
    channelId: Scalars['ID']['output'];
    createdAt: Scalars['Timestamp']['output'];
    description: Scalars['String']['output'];
    moderatorId: Scalars['ID']['output'];
    reviewerComment: Scalars['String']['output'];
    reviewerId: Scalars['ID']['output'];
    status: ChannelAppealStatus;
    userId: Scalars['ID']['output'];
    violation: ChannelViolation;
};
export type ChannelBanAppealAccepted = {
    __typename?: 'ChannelBanAppealAccepted';
    comment: Scalars['String']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelBanAppealInfo = {
    __typename?: 'ChannelBanAppealInfo';
    appealText: Scalars['String']['output'];
    createdAt: Scalars['Timestamp']['output'];
    reviewer: ProfileProfile;
    reviewerComment: Scalars['String']['output'];
    reviewerId: Scalars['ID']['output'];
    status: ChannelAppealStatus;
};
export type ChannelBanAppealRejected = {
    __typename?: 'ChannelBanAppealRejected';
    comment: Scalars['String']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelBannedUser = {
    __typename?: 'ChannelBannedUser';
    appeal?: Maybe<ChannelBanAppealInfo>;
    bannedAt: Scalars['Timestamp']['output'];
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    description: Scalars['String']['output'];
    keepRecentMessages: Scalars['Boolean']['output'];
    moderator: ProfileProfile;
    moderatorId: Scalars['ID']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
    violation: ChannelViolation;
};
export type ChannelBatchGetChannelsResponse = {
    __typename?: 'ChannelBatchGetChannelsResponse';
    channels: Array<ChannelChannel>;
};
export type ChannelBatchGetUserBanStatusResponse = {
    __typename?: 'ChannelBatchGetUserBanStatusResponse';
    statuses: Array<ChannelUserBanStatus>;
};
export type ChannelBatchStreamGetChannelResponse = {
    __typename?: 'ChannelBatchStreamGetChannelResponse';
    channels: Array<ChannelChannel>;
};
export type ChannelBundlePurchase = {
    __typename?: 'ChannelBundlePurchase';
    bundleName: Scalars['String']['output'];
    streamerCardIds: Array<Scalars['String']['output']>;
    streamerCards?: Maybe<Array<GameLogicStreamerCard>>;
    user?: Maybe<ProfileProfile>;
    userId: Scalars['ID']['output'];
};
/** Public channel information */
export type ChannelChannel = {
    __typename?: 'ChannelChannel';
    channelFriends: FriendsChannelFriends;
    currentChatId?: Maybe<Scalars['String']['output']>;
    currentStreamId: Scalars['ID']['output'];
    description: Scalars['String']['output'];
    features: ChannelChannelFeatures;
    followerCount: Scalars['Int']['output'];
    following: Scalars['Boolean']['output'];
    game: GameGame;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    isPublic: Scalars['Boolean']['output'];
    itemStats: Array<ItemItemStat>;
    links: Array<ChannelChannelLink>;
    liveStatus: ChannelLiveStatus;
    logo: Scalars['String']['output'];
    logoUrl: Scalars['String']['output'];
    matureRatedContent: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    offlineBanner: Scalars['String']['output'];
    offlineBannerUrl: Scalars['String']['output'];
    playedGameIds: Array<Scalars['String']['output']>;
    state: ApiEntityState;
    streamedGames?: Maybe<Array<GameGame>>;
    streamer: ProfileProfile;
    streamerId: Scalars['ID']['output'];
    subscriberCount: Scalars['Int']['output'];
    subscription?: Maybe<SubscriptionChannelSubscription>;
    subscriptionConfig?: Maybe<SubscriptionChannelSubscriptionConfig>;
    suspension: ChannelSuspension;
    thumbnail: Scalars['String']['output'];
    thumbnailUrl: Scalars['String']['output'];
    title: Scalars['String']['output'];
    userBanStatus: ChannelUserBanStatus;
    viewerCount: Scalars['Int']['output'];
};
export type ChannelChannelDetailsUpdateInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    featureNoicePredictionsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    isPublic?: InputMaybe<Scalars['Boolean']['input']>;
    links?: InputMaybe<Array<ChannelChannelLinkInput>>;
    logoUrl?: InputMaybe<Scalars['String']['input']>;
    matureRatedContent?: InputMaybe<Scalars['Boolean']['input']>;
    offlineBannerUrl?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};
export type ChannelChannelEvent = {
    __typename?: 'ChannelChannelEvent';
    channelId: Scalars['ID']['output'];
    content: ChannelChannelEventContent;
    createdAt: Scalars['Timestamp']['output'];
    id: Scalars['ID']['output'];
};
export type ChannelChannelEventContent = {
    __typename?: 'ChannelChannelEventContent';
    content?: Maybe<ChannelChannelEventContentContentUnion>;
};
export type ChannelChannelEventContentContentUnion = ChannelBundlePurchase | ChannelStreamerCardPurchase | ChannelSubscriptionPurchase;
export declare enum ChannelChannelFeature {
    ChannelFeatureNoicePredictions = "CHANNEL_FEATURE_NOICE_PREDICTIONS",
    ChannelFeatureStreaming = "CHANNEL_FEATURE_STREAMING",
    ChannelFeatureUnspecified = "CHANNEL_FEATURE_UNSPECIFIED"
}
export type ChannelChannelFeatures = {
    __typename?: 'ChannelChannelFeatures';
    noicePredictions: ChannelNoicePredictionsFeatureStatus;
    streaming: ChannelStreamingFeatureStatus;
};
export type ChannelChannelLink = {
    __typename?: 'ChannelChannelLink';
    name: Scalars['String']['output'];
    type: ChannelChannelLinkLinkType;
    url: Scalars['String']['output'];
};
export type ChannelChannelLinkInput = {
    name?: InputMaybe<Scalars['String']['input']>;
    type?: InputMaybe<ChannelChannelLinkLinkType>;
    url?: InputMaybe<Scalars['String']['input']>;
};
export declare enum ChannelChannelLinkLinkType {
    LinkTypeCustom = "LINK_TYPE_CUSTOM",
    LinkTypeDiscord = "LINK_TYPE_DISCORD",
    LinkTypeFacebook = "LINK_TYPE_FACEBOOK",
    LinkTypeInstagram = "LINK_TYPE_INSTAGRAM",
    LinkTypeTiktok = "LINK_TYPE_TIKTOK",
    LinkTypeTwitter = "LINK_TYPE_TWITTER",
    LinkTypeUnspecified = "LINK_TYPE_UNSPECIFIED",
    LinkTypeYoutube = "LINK_TYPE_YOUTUBE"
}
export declare enum ChannelChannelRole {
    ChannelRoleModerator = "CHANNEL_ROLE_MODERATOR",
    ChannelRolePlatformModerator = "CHANNEL_ROLE_PLATFORM_MODERATOR",
    ChannelRoleStreamer = "CHANNEL_ROLE_STREAMER",
    ChannelRoleUnspecified = "CHANNEL_ROLE_UNSPECIFIED"
}
export type ChannelChannelRoles = {
    __typename?: 'ChannelChannelRoles';
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    roles: Array<ChannelChannelRole>;
};
export type ChannelChannelStreamDetailEvent = {
    __typename?: 'ChannelChannelStreamDetailEvent';
    channelId: Scalars['ID']['output'];
    gameId: Scalars['ID']['output'];
    liveStatus: ChannelLiveStatus;
    matureRatedContent: Scalars['Boolean']['output'];
    noicePredictionsEnabled: Scalars['Boolean']['output'];
    streamId: Scalars['ID']['output'];
};
export type ChannelContentRendererConfig = {
    __typename?: 'ChannelContentRendererConfig';
    arenaId: Scalars['ID']['output'];
    containerImage: Scalars['String']['output'];
    controllerContainerImage: Scalars['String']['output'];
};
export type ChannelContentRendererConfigInput = {
    arenaId?: InputMaybe<Scalars['ID']['input']>;
    containerImage?: InputMaybe<Scalars['String']['input']>;
    controllerContainerImage?: InputMaybe<Scalars['String']['input']>;
};
export type ChannelCreateChannelAssetUploadTokenResponse = {
    __typename?: 'ChannelCreateChannelAssetUploadTokenResponse';
    token: Scalars['String']['output'];
};
export type ChannelGetFollowStatusResponse = {
    __typename?: 'ChannelGetFollowStatusResponse';
    following: Array<Scalars['Boolean']['output']>;
};
export type ChannelGetUserFollowedChannelsResponse = {
    __typename?: 'ChannelGetUserFollowedChannelsResponse';
    channels: Array<ChannelChannel>;
};
export type ChannelIngestStatsEvent = {
    __typename?: 'ChannelIngestStatsEvent';
    bitrate: Scalars['Int']['output'];
    channelId: Scalars['ID']['output'];
    framerate: Scalars['Int']['output'];
    height: Scalars['Int']['output'];
    streamId: Scalars['ID']['output'];
    width: Scalars['Int']['output'];
};
export type ChannelListBanAppealsResponse = {
    __typename?: 'ChannelListBanAppealsResponse';
    appeals: Array<ChannelBanAppeal>;
    pageInfo: ApiPageInfo;
};
export type ChannelListBannedUsersResponse = {
    __typename?: 'ChannelListBannedUsersResponse';
    pageInfo: ApiPageInfo;
    users: Array<ChannelBannedUser>;
};
export type ChannelListChannelPrivilegedUsersResponse = {
    __typename?: 'ChannelListChannelPrivilegedUsersResponse';
    pageInfo: ApiPageInfo;
    users: Array<ChannelPrivilegedUser>;
};
export type ChannelListChannelsResponse = {
    __typename?: 'ChannelListChannelsResponse';
    channels: Array<ChannelChannel>;
    pageInfo: ApiPageInfo;
};
export type ChannelListModerationEventsResponse = {
    __typename?: 'ChannelListModerationEventsResponse';
    events: Array<ChannelModerationEvent>;
    pageInfo: ApiPageInfo;
};
export type ChannelListStreamBackendConfigsResponse = {
    __typename?: 'ChannelListStreamBackendConfigsResponse';
    configs: Array<ChannelStreamBackendConfig>;
};
export type ChannelListStreamsResponse = {
    __typename?: 'ChannelListStreamsResponse';
    pageInfo: ApiPageInfo;
    streams: Array<ChannelStream>;
};
export type ChannelListUserChannelBansResponse = {
    __typename?: 'ChannelListUserChannelBansResponse';
    bans: Array<ChannelBannedUser>;
    pageInfo: ApiPageInfo;
};
export type ChannelListUserChannelRolesResponse = {
    __typename?: 'ChannelListUserChannelRolesResponse';
    roles: Array<ChannelChannelRole>;
};
export type ChannelListUserPrivilegedChannelsResponse = {
    __typename?: 'ChannelListUserPrivilegedChannelsResponse';
    channels: Array<ChannelChannelRoles>;
};
export declare enum ChannelLiveStatus {
    LiveStatusLive = "LIVE_STATUS_LIVE",
    LiveStatusOffline = "LIVE_STATUS_OFFLINE",
    LiveStatusUnlisted = "LIVE_STATUS_UNLISTED",
    LiveStatusUnspecified = "LIVE_STATUS_UNSPECIFIED"
}
export type ChannelLiveStatusEvent = {
    __typename?: 'ChannelLiveStatusEvent';
    channelId: Scalars['ID']['output'];
    liveStatus: ChannelLiveStatus;
    streamId: Scalars['ID']['output'];
};
export type ChannelMachineLearningConfig = {
    __typename?: 'ChannelMachineLearningConfig';
    containerImage: Scalars['String']['output'];
};
export type ChannelMachineLearningConfigInput = {
    containerImage?: InputMaybe<Scalars['String']['input']>;
};
export type ChannelModerationEvent = {
    __typename?: 'ChannelModerationEvent';
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    content: ChannelModerationEventContent;
    id: Scalars['ID']['output'];
    moderator?: Maybe<ProfileProfile>;
    moderatorId: Scalars['ID']['output'];
    timestamp: Scalars['Timestamp']['output'];
};
export type ChannelModerationEventContent = {
    __typename?: 'ChannelModerationEventContent';
    content?: Maybe<ChannelModerationEventContentContentUnion>;
};
export type ChannelModerationEventContentContentUnion = ChannelAutomodItemAccepted | ChannelAutomodItemRejected | ChannelBanAppealAccepted | ChannelBanAppealRejected | ChannelUserBanned | ChannelUserMuted | ChannelUserUnbanned;
export declare enum ChannelModerationEventType {
    ModerationEventTypeAutomodItemAccepted = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_ACCEPTED",
    ModerationEventTypeAutomodItemRejected = "MODERATION_EVENT_TYPE_AUTOMOD_ITEM_REJECTED",
    ModerationEventTypeBanAppealAccepted = "MODERATION_EVENT_TYPE_BAN_APPEAL_ACCEPTED",
    ModerationEventTypeBanAppealRejected = "MODERATION_EVENT_TYPE_BAN_APPEAL_REJECTED",
    ModerationEventTypeUnspecified = "MODERATION_EVENT_TYPE_UNSPECIFIED",
    ModerationEventTypeUserBanned = "MODERATION_EVENT_TYPE_USER_BANNED",
    ModerationEventTypeUserMuted = "MODERATION_EVENT_TYPE_USER_MUTED",
    ModerationEventTypeUserUnbanned = "MODERATION_EVENT_TYPE_USER_UNBANNED"
}
export type ChannelModerationEventsFilterInput = {
    eventTypes?: InputMaybe<Array<ChannelModerationEventType>>;
};
export type ChannelModerationSettings = {
    __typename?: 'ChannelModerationSettings';
    automod: ChannelAutomodSettings;
    banAppealsEnabled: Scalars['Boolean']['output'];
    channelId: Scalars['ID']['output'];
    nightbotActive: Scalars['Boolean']['output'];
    nightbotEnabled: Scalars['Boolean']['output'];
};
export type ChannelModerationSettingsInput = {
    automod?: InputMaybe<ChannelAutomodSettingsInput>;
    banAppealsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    nightbotActive?: InputMaybe<Scalars['Boolean']['input']>;
    nightbotEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};
export type ChannelNoicePredictionsFeatureStatus = {
    __typename?: 'ChannelNoicePredictionsFeatureStatus';
    enabled: Scalars['Boolean']['output'];
};
export type ChannelPrivilegedUser = {
    __typename?: 'ChannelPrivilegedUser';
    roles: Array<ChannelChannelRole>;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelRestreamingConfig = {
    __typename?: 'ChannelRestreamingConfig';
    bitrate: Scalars['Int']['output'];
    channelId: Scalars['ID']['output'];
    enabled: Scalars['Boolean']['output'];
    rtmpEndpoint: Scalars['String']['output'];
    rtmpKey: Scalars['String']['output'];
};
export type ChannelRestreamingConfigInput = {
    bitrate?: InputMaybe<Scalars['Int']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    enabled?: InputMaybe<Scalars['Boolean']['input']>;
    rtmpEndpoint?: InputMaybe<Scalars['String']['input']>;
    rtmpKey?: InputMaybe<Scalars['String']['input']>;
};
export type ChannelStream = {
    __typename?: 'ChannelStream';
    channelId: Scalars['ID']['output'];
    matureRatedContent: Scalars['Boolean']['output'];
    noicePredictionsEnabled: Scalars['Boolean']['output'];
    segments: Array<ChannelStreamSegment>;
    streamId: Scalars['ID']['output'];
};
export type ChannelStreamBackendConfig = {
    __typename?: 'ChannelStreamBackendConfig';
    channelId: Scalars['ID']['output'];
    crConfig?: Maybe<ChannelContentRendererConfig>;
    game: GameGame;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    mlConfig?: Maybe<ChannelMachineLearningConfig>;
    recConfig?: Maybe<ChannelStreamRecorderConfig>;
};
export type ChannelStreamBackendConfigInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    crConfig?: InputMaybe<ChannelContentRendererConfigInput>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    mlConfig?: InputMaybe<ChannelMachineLearningConfigInput>;
    recConfig?: InputMaybe<ChannelStreamRecorderConfigInput>;
};
export type ChannelStreamRecorderConfig = {
    __typename?: 'ChannelStreamRecorderConfig';
    containerImage: Scalars['String']['output'];
};
export type ChannelStreamRecorderConfigInput = {
    containerImage?: InputMaybe<Scalars['String']['input']>;
};
export type ChannelStreamSegment = {
    __typename?: 'ChannelStreamSegment';
    crConfig: ChannelContentRendererConfig;
    endTime?: Maybe<Scalars['Timestamp']['output']>;
    gameId: Scalars['ID']['output'];
    mlConfig: ChannelMachineLearningConfig;
    segmentId: Scalars['ID']['output'];
    startTime: Scalars['Timestamp']['output'];
    title: Scalars['String']['output'];
};
export type ChannelStreamStatusEvent = {
    __typename?: 'ChannelStreamStatusEvent';
    channelId: Scalars['ID']['output'];
    crStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    egressStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    gameRunnerStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    liveStatus: ChannelLiveStatus;
    mlStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    recStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    restreamingStatus: StreamDeploymentStreamDeploymentStatusComponentStatus;
    streamId: Scalars['ID']['output'];
};
export type ChannelStreamerCardPurchase = {
    __typename?: 'ChannelStreamerCardPurchase';
    streamerCard: GameLogicStreamerCard;
    streamerCardId: Scalars['ID']['output'];
    user?: Maybe<ProfileProfile>;
    userId: Scalars['ID']['output'];
};
export type ChannelStreamingFeatureStatus = {
    __typename?: 'ChannelStreamingFeatureStatus';
    enabled: Scalars['Boolean']['output'];
    suspension?: Maybe<ChannelSuspension>;
};
export type ChannelSubscriptionPurchase = {
    __typename?: 'ChannelSubscriptionPurchase';
    tier: Scalars['Int']['output'];
    user?: Maybe<ProfileProfile>;
    userId: Scalars['ID']['output'];
};
export type ChannelSuspension = {
    __typename?: 'ChannelSuspension';
    description: Scalars['String']['output'];
    moderator?: Maybe<ProfileProfile>;
    reason: ChannelSuspensionReason;
    suspendedAt: Scalars['Timestamp']['output'];
    suspendedBy: Scalars['String']['output'];
    until?: Maybe<Scalars['Timestamp']['output']>;
};
export declare enum ChannelSuspensionReason {
    ReasonChannelDeleted = "REASON_CHANNEL_DELETED",
    ReasonUnspecified = "REASON_UNSPECIFIED"
}
export type ChannelUserBanStatus = {
    __typename?: 'ChannelUserBanStatus';
    appeal?: Maybe<ChannelBanAppealInfo>;
    banned: Scalars['Boolean']['output'];
    bannedAt?: Maybe<Scalars['Timestamp']['output']>;
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    description: Scalars['String']['output'];
    moderator?: Maybe<ProfileProfile>;
    moderatorId: Scalars['ID']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
    violation: ChannelViolation;
};
export type ChannelUserBanned = {
    __typename?: 'ChannelUserBanned';
    description: Scalars['String']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
    violation: ChannelViolation;
};
export type ChannelUserBannedNotification = {
    __typename?: 'ChannelUserBannedNotification';
    channelId: Scalars['ID']['output'];
    description: Scalars['String']['output'];
    moderatorId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
    violation: ChannelViolation;
};
export type ChannelUserMuted = {
    __typename?: 'ChannelUserMuted';
    description: Scalars['String']['output'];
    duration: Scalars['Duration']['output'];
    reason: ChatReason;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelUserUnbanned = {
    __typename?: 'ChannelUserUnbanned';
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChannelViewerCountEvent = {
    __typename?: 'ChannelViewerCountEvent';
    channelId: Scalars['ID']['output'];
    viewerCount: Scalars['Int']['output'];
};
export declare enum ChannelViolation {
    ViolationOther = "VIOLATION_OTHER",
    ViolationSpam = "VIOLATION_SPAM",
    ViolationUnspecified = "VIOLATION_UNSPECIFIED"
}
export type ChatAutoModQueueEvent = {
    __typename?: 'ChatAutoModQueueEvent';
    event?: Maybe<ChatAutoModQueueEventEventUnion>;
};
export type ChatAutoModQueueEventAdd = {
    __typename?: 'ChatAutoModQueueEventAdd';
    item: ChatModerationItem;
};
export type ChatAutoModQueueEventEventUnion = ChatAutoModQueueEventAdd | ChatAutoModQueueEventRemove | ChatAutoModQueueEventUpdate;
export type ChatAutoModQueueEventRemove = {
    __typename?: 'ChatAutoModQueueEventRemove';
    id: Scalars['ID']['output'];
};
export type ChatAutoModQueueEventUpdate = {
    __typename?: 'ChatAutoModQueueEventUpdate';
    item: ChatModerationItem;
};
export declare enum ChatAutomodDecision {
    AutomodDecisionAccepted = "AUTOMOD_DECISION_ACCEPTED",
    AutomodDecisionRejected = "AUTOMOD_DECISION_REJECTED",
    AutomodDecisionUnspecified = "AUTOMOD_DECISION_UNSPECIFIED"
}
export declare enum ChatAutomodLevel {
    AutomodLevelHigh = "AUTOMOD_LEVEL_HIGH",
    AutomodLevelLow = "AUTOMOD_LEVEL_LOW",
    AutomodLevelUnspecified = "AUTOMOD_LEVEL_UNSPECIFIED"
}
export type ChatChatDetails = {
    __typename?: 'ChatChatDetails';
    chatId: Scalars['ID']['output'];
    roles: Array<ChatChatRole>;
};
export type ChatChatEvent = {
    __typename?: 'ChatChatEvent';
    chatId: Scalars['ID']['output'];
    cid: Scalars['Int']['output'];
    event?: Maybe<ChatChatEventEventUnion>;
};
export type ChatChatEventEventUnion = ChatChatDetails | ChatChatMessage | ChatHideMessage | ChatMessageDenied | ChatUserBanned | ChatUserMuted;
export type ChatChatMessage = {
    __typename?: 'ChatChatMessage';
    chatId: Scalars['ID']['output'];
    content: ChatMessageContent;
    createdAt: Scalars['Timestamp']['output'];
    messageId: Scalars['ID']['output'];
    moderationStatus: ChatModerationStatus;
    sender: ProfileProfile;
    senderId: Scalars['ID']['output'];
    state: ApiEntityState;
    textClassification: ClassificationTextClassification;
    username: Scalars['String']['output'];
};
export declare enum ChatChatRole {
    ChatRoleMember = "CHAT_ROLE_MEMBER",
    ChatRoleModerator = "CHAT_ROLE_MODERATOR",
    ChatRolePlatformModerator = "CHAT_ROLE_PLATFORM_MODERATOR",
    ChatRoleStreamer = "CHAT_ROLE_STREAMER",
    ChatRoleUnspecified = "CHAT_ROLE_UNSPECIFIED"
}
export type ChatChatUser = {
    __typename?: 'ChatChatUser';
    label: ChatUserLabel;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ChatGetChatUserStatusResponse = {
    __typename?: 'ChatGetChatUserStatusResponse';
    muteDuration?: Maybe<Scalars['Duration']['output']>;
    muted: Scalars['Boolean']['output'];
};
export type ChatHideMessage = {
    __typename?: 'ChatHideMessage';
    chatId: Scalars['ID']['output'];
    messageId: Scalars['ID']['output'];
};
export type ChatListChatUsersResponse = {
    __typename?: 'ChatListChatUsersResponse';
    users: Array<ChatChatUser>;
};
export type ChatListMessagesResponse = {
    __typename?: 'ChatListMessagesResponse';
    messages: Array<ChatChatMessage>;
    pageInfo: ApiPageInfo;
};
export type ChatMessageContent = {
    __typename?: 'ChatMessageContent';
    content?: Maybe<ChatMessageContentContentUnion>;
};
export type ChatMessageContentContentUnion = ChatTextMessage | ChatTombstone;
export type ChatMessageContentInput = {
    textContent?: InputMaybe<ChatTextMessageInput>;
    tombstone?: InputMaybe<ChatTombstoneInput>;
};
export type ChatMessageDenied = {
    __typename?: 'ChatMessageDenied';
    chatId: Scalars['ID']['output'];
    messageId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type ChatModerationItem = {
    __typename?: 'ChatModerationItem';
    chatMessage: ChatChatMessage;
    expired: Scalars['Boolean']['output'];
    expiresAt: Scalars['Timestamp']['output'];
    id: Scalars['ID']['output'];
    reviewer?: Maybe<ProfileProfile>;
    reviewerId?: Maybe<Scalars['ID']['output']>;
    status: ChatModerationItemStatus;
};
export declare enum ChatModerationItemStatus {
    StatusAllowed = "STATUS_ALLOWED",
    StatusDenied = "STATUS_DENIED",
    StatusPending = "STATUS_PENDING",
    StatusUnspecified = "STATUS_UNSPECIFIED"
}
export declare enum ChatModerationStatus {
    ModerationStatusApproved = "MODERATION_STATUS_APPROVED",
    ModerationStatusUnspecified = "MODERATION_STATUS_UNSPECIFIED"
}
export declare enum ChatReason {
    ReasonOther = "REASON_OTHER",
    ReasonSpam = "REASON_SPAM",
    ReasonUnspecified = "REASON_UNSPECIFIED"
}
export type ChatSendMessageResponse = {
    __typename?: 'ChatSendMessageResponse';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type ChatTextMessage = {
    __typename?: 'ChatTextMessage';
    attachments: Array<ChatTextMessageAttachment>;
    text: Scalars['String']['output'];
};
export type ChatTextMessageAttachment = {
    __typename?: 'ChatTextMessageAttachment';
    endIndex: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    source: Scalars['String']['output'];
    startIndex: Scalars['Int']['output'];
};
export type ChatTextMessageAttachmentInput = {
    endIndex?: InputMaybe<Scalars['Int']['input']>;
    itemId?: InputMaybe<Scalars['ID']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
    source?: InputMaybe<Scalars['String']['input']>;
    startIndex?: InputMaybe<Scalars['Int']['input']>;
};
export type ChatTextMessageInput = {
    attachments?: InputMaybe<Array<ChatTextMessageAttachmentInput>>;
    text?: InputMaybe<Scalars['String']['input']>;
};
export type ChatTombstone = {
    __typename?: 'ChatTombstone';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type ChatTombstoneInput = {
    emptyTypeWorkaround: Scalars['Boolean']['input'];
};
export type ChatUserBanned = {
    __typename?: 'ChatUserBanned';
    chatId: Scalars['ID']['output'];
    moderatorId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export declare enum ChatUserLabel {
    UserLabelModerator = "USER_LABEL_MODERATOR",
    UserLabelStaff = "USER_LABEL_STAFF",
    UserLabelStreamer = "USER_LABEL_STREAMER",
    UserLabelUnspecified = "USER_LABEL_UNSPECIFIED",
    UserLabelViewer = "USER_LABEL_VIEWER"
}
export type ChatUserMuted = {
    __typename?: 'ChatUserMuted';
    chatId: Scalars['ID']['output'];
    description: Scalars['String']['output'];
    duration: Scalars['Duration']['output'];
    moderatorId: Scalars['ID']['output'];
    reason: ChatReason;
    userId: Scalars['ID']['output'];
};
export type ClassificationEvent = {
    __typename?: 'ClassificationEvent';
    event?: Maybe<ClassificationEventEventUnion>;
};
export type ClassificationEventCustomEvent = {
    __typename?: 'ClassificationEventCustomEvent';
    id: Scalars['ID']['output'];
    message: Scalars['String']['output'];
};
export type ClassificationEventEventFlooding = {
    __typename?: 'ClassificationEventEventFlooding';
    count: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    limit: Scalars['Int']['output'];
};
export type ClassificationEventEventTrustChanged = {
    __typename?: 'ClassificationEventEventTrustChanged';
    id: Scalars['ID']['output'];
    message: Scalars['String']['output'];
    oldTrustLevel: ClassificationTrustLevel;
    trustLevel: ClassificationTrustLevel;
};
export type ClassificationEventEventUnion = ClassificationEventCustomEvent | ClassificationEventEventFlooding | ClassificationEventEventTrustChanged;
export type ClassificationTextClassification = {
    __typename?: 'ClassificationTextClassification';
    escalations: Array<Scalars['String']['output']>;
    events: Array<ClassificationEvent>;
    hashed: Scalars['String']['output'];
    hashes: Array<Scalars['Int']['output']>;
    highRiskLanguage: Scalars['String']['output'];
    notableIndexes: Array<Scalars['Int']['output']>;
    response: Scalars['Boolean']['output'];
    risk: ClassificationTextRisk;
    topics: Array<ClassificationTextClassificationTopicTextRiskLevel>;
    trust: ClassificationTrustLevel;
};
export type ClassificationTextClassificationTopicTextRiskLevel = {
    __typename?: 'ClassificationTextClassificationTopicTextRiskLevel';
    risk: ClassificationTextRisk;
    topic: ClassificationTopic;
};
export declare enum ClassificationTextRisk {
    TextRiskDangerous = "TEXT_RISK_DANGEROUS",
    TextRiskExplicit = "TEXT_RISK_EXPLICIT",
    TextRiskLow = "TEXT_RISK_LOW",
    TextRiskMature = "TEXT_RISK_MATURE",
    TextRiskNotable = "TEXT_RISK_NOTABLE",
    TextRiskQuestionable = "TEXT_RISK_QUESTIONABLE",
    TextRiskSafe = "TEXT_RISK_SAFE",
    TextRiskUnknown = "TEXT_RISK_UNKNOWN",
    TextRiskUnspecified = "TEXT_RISK_UNSPECIFIED"
}
export declare enum ClassificationTopic {
    TopicAlarm = "TOPIC_ALARM",
    TopicBullying = "TOPIC_BULLYING",
    TopicChildGrooming = "TOPIC_CHILD_GROOMING",
    TopicDrugsAndAlcohol = "TOPIC_DRUGS_AND_ALCOHOL",
    TopicExtremism = "TOPIC_EXTREMISM",
    TopicFraud = "TOPIC_FRAUD",
    TopicGeneralRisk = "TOPIC_GENERAL_RISK",
    TopicHateSpeech = "TOPIC_HATE_SPEECH",
    TopicInApp = "TOPIC_IN_APP",
    TopicJunk = "TOPIC_JUNK",
    TopicPersonalIdentifyingInfo = "TOPIC_PERSONAL_IDENTIFYING_INFO",
    TopicPolitics = "TOPIC_POLITICS",
    TopicPublicThreat = "TOPIC_PUBLIC_THREAT",
    TopicRealName = "TOPIC_REAL_NAME",
    TopicRelationshipAndSexualContent = "TOPIC_RELATIONSHIP_AND_SEXUAL_CONTENT",
    TopicReligious = "TOPIC_RELIGIOUS",
    TopicSentiment = "TOPIC_SENTIMENT",
    TopicSubversive = "TOPIC_SUBVERSIVE",
    TopicUnspecified = "TOPIC_UNSPECIFIED",
    TopicViolence = "TOPIC_VIOLENCE",
    TopicVulgarity = "TOPIC_VULGARITY",
    TopicWebsite = "TOPIC_WEBSITE"
}
export declare enum ClassificationTrustLevel {
    TrustLevelDefault = "TRUST_LEVEL_DEFAULT",
    TrustLevelMute = "TRUST_LEVEL_MUTE",
    TrustLevelNotTrusted = "TRUST_LEVEL_NOT_TRUSTED",
    TrustLevelSuperuser = "TRUST_LEVEL_SUPERUSER",
    TrustLevelTrusted = "TRUST_LEVEL_TRUSTED",
    TrustLevelUnspecified = "TRUST_LEVEL_UNSPECIFIED"
}
export type ConfigMetagameConfigInactivityTimeouts = {
    __typename?: 'ConfigMetagameConfigInactivityTimeouts';
    enabled: Scalars['Boolean']['output'];
    idleTimeoutSec: Scalars['Int']['output'];
    offlineTimeoutSec: Scalars['Int']['output'];
};
export type ConfigMetagameConfigUiTimings = {
    __typename?: 'ConfigMetagameConfigUITimings';
    teamActionTimeout: Scalars['Int']['output'];
};
export type EmojiBatchGetEmojisResponse = {
    __typename?: 'EmojiBatchGetEmojisResponse';
    emojis: Array<EmojiEmoji>;
};
export type EmojiCreateEmojiUploadTokenResponse = {
    __typename?: 'EmojiCreateEmojiUploadTokenResponse';
    token: Scalars['String']['output'];
};
export type EmojiEmoji = {
    __typename?: 'EmojiEmoji';
    channelId: Scalars['ID']['output'];
    disabled: Scalars['Boolean']['output'];
    id: Scalars['ID']['output'];
    image: Scalars['String']['output'];
    imageUrl: Scalars['String']['output'];
    label: Scalars['String']['output'];
    name: Scalars['String']['output'];
    prefabName: Scalars['String']['output'];
};
export type EmojiEmojiInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    disabled?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    prefabName?: InputMaybe<Scalars['String']['input']>;
};
export type EmojiListChannelEmojisResponse = {
    __typename?: 'EmojiListChannelEmojisResponse';
    count?: Maybe<ItemItemTotalCount>;
    emojis: Array<EmojiEmoji>;
    pageInfo: ApiPageInfo;
};
export type EmojiListEmojisRequestFilterInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    platformOnly?: InputMaybe<Scalars['Boolean']['input']>;
};
export type EmojiListEmojisResponse = {
    __typename?: 'EmojiListEmojisResponse';
    count?: Maybe<ItemItemTotalCount>;
    emojis: Array<EmojiEmoji>;
    pageInfo: ApiPageInfo;
};
export type EmojiListPlatformEmojisResponse = {
    __typename?: 'EmojiListPlatformEmojisResponse';
    count?: Maybe<ItemItemTotalCount>;
    emojis: Array<EmojiEmoji>;
    pageInfo: ApiPageInfo;
};
export type EmojiUpdateChannelEmojiParamsInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    disabled?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
};
export type EmojiUpdatePlatformEmojiParamsInput = {
    disabled?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
};
export type FlagFeatureFlag = {
    __typename?: 'FlagFeatureFlag';
    description: Scalars['String']['output'];
    enabled: Scalars['Boolean']['output'];
    groups: Array<FlagFeatureFlagGroup>;
    name: Scalars['String']['output'];
};
export type FlagFeatureFlagConfig = {
    __typename?: 'FlagFeatureFlagConfig';
    channelFlags: FlagFeatureFlagList;
    createdAt: Scalars['Timestamp']['output'];
    revision: Scalars['String']['output'];
    userFlags: FlagFeatureFlagList;
};
export type FlagFeatureFlagConfigInput = {
    channelFlags?: InputMaybe<FlagFeatureFlagListInput>;
    createdAt?: InputMaybe<Scalars['InputTimestamp']['input']>;
    revision?: InputMaybe<Scalars['String']['input']>;
    userFlags?: InputMaybe<FlagFeatureFlagListInput>;
};
export type FlagFeatureFlagGroup = {
    __typename?: 'FlagFeatureFlagGroup';
    conditions: Array<FlagFeatureFlagGroupCondition>;
    default: Scalars['Boolean']['output'];
    enabled: Scalars['Boolean']['output'];
    id: Scalars['ID']['output'];
    values: Array<FlagFeatureFlagGroupValue>;
};
export type FlagFeatureFlagGroupCondition = {
    __typename?: 'FlagFeatureFlagGroupCondition';
    rule?: Maybe<FlagFeatureFlagGroupConditionRuleUnion>;
};
export type FlagFeatureFlagGroupConditionAny = {
    __typename?: 'FlagFeatureFlagGroupConditionAny';
    field: Scalars['String']['output'];
    values: Array<Scalars['String']['output']>;
};
export type FlagFeatureFlagGroupConditionAnyInput = {
    field?: InputMaybe<Scalars['String']['input']>;
    values?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type FlagFeatureFlagGroupConditionEq = {
    __typename?: 'FlagFeatureFlagGroupConditionEq';
    field: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type FlagFeatureFlagGroupConditionEqInput = {
    field?: InputMaybe<Scalars['String']['input']>;
    value?: InputMaybe<Scalars['String']['input']>;
};
export type FlagFeatureFlagGroupConditionInput = {
    any?: InputMaybe<FlagFeatureFlagGroupConditionAnyInput>;
    eq?: InputMaybe<FlagFeatureFlagGroupConditionEqInput>;
};
export type FlagFeatureFlagGroupConditionRuleUnion = FlagFeatureFlagGroupConditionAny | FlagFeatureFlagGroupConditionEq;
export type FlagFeatureFlagGroupInput = {
    conditions?: InputMaybe<Array<FlagFeatureFlagGroupConditionInput>>;
    default?: InputMaybe<Scalars['Boolean']['input']>;
    enabled?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    values?: InputMaybe<Array<FlagFeatureFlagGroupValueInput>>;
};
export type FlagFeatureFlagGroupValue = {
    __typename?: 'FlagFeatureFlagGroupValue';
    value: Scalars['String']['output'];
    weight: Scalars['Int']['output'];
};
export type FlagFeatureFlagGroupValueInput = {
    value?: InputMaybe<Scalars['String']['input']>;
    weight?: InputMaybe<Scalars['Int']['input']>;
};
export type FlagFeatureFlagInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    enabled?: InputMaybe<Scalars['Boolean']['input']>;
    groups?: InputMaybe<Array<FlagFeatureFlagGroupInput>>;
    name?: InputMaybe<Scalars['String']['input']>;
};
export type FlagFeatureFlagList = {
    __typename?: 'FlagFeatureFlagList';
    flags: Array<FlagFeatureFlag>;
};
export type FlagFeatureFlagListInput = {
    flags?: InputMaybe<Array<FlagFeatureFlagInput>>;
};
export type FlagFeatureFlagSchema = {
    __typename?: 'FlagFeatureFlagSchema';
    flags: Array<FlagFeatureFlagSchemaFlagsEntry>;
};
export type FlagFeatureFlagSchemaFlagsEntry = {
    __typename?: 'FlagFeatureFlagSchemaFlagsEntry';
    key: Scalars['String']['output'];
    value: FlagJsonSchema;
};
export type FlagFeatureFlagState = {
    __typename?: 'FlagFeatureFlagState';
    name: Scalars['String']['output'];
    revision: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type FlagJsonSchema = {
    __typename?: 'FlagJSONSchema';
    description: Scalars['String']['output'];
    enum: Array<Scalars['String']['output']>;
    items: FlagJsonSchema;
    maximum: Scalars['Float']['output'];
    minimum: Scalars['Float']['output'];
    multipleOf: Scalars['Float']['output'];
    pattern: Scalars['String']['output'];
    patternProperties: Array<FlagJsonSchemaPatternPropertiesEntry>;
    properties: Array<FlagJsonSchemaPropertiesEntry>;
    type: Scalars['String']['output'];
};
export type FlagJsonSchemaPatternPropertiesEntry = {
    __typename?: 'FlagJSONSchemaPatternPropertiesEntry';
    key: Scalars['String']['output'];
    value: FlagJsonSchema;
};
export type FlagJsonSchemaPropertiesEntry = {
    __typename?: 'FlagJSONSchemaPropertiesEntry';
    key: Scalars['String']['output'];
    value: FlagJsonSchema;
};
export type FlagListChannelFeatureFlagsResponse = {
    __typename?: 'FlagListChannelFeatureFlagsResponse';
    flags: Array<FlagFeatureFlagState>;
};
export type FlagListUserFeatureFlagsResponse = {
    __typename?: 'FlagListUserFeatureFlagsResponse';
    flags: Array<FlagFeatureFlagState>;
};
export type FloatType = {
    __typename?: 'FloatType';
    /** The wrapped value of type Float */
    value: Scalars['Float']['output'];
};
export type FriendsAcceptFriendRequestResponse = {
    __typename?: 'FriendsAcceptFriendRequestResponse';
    friend: ProfileProfile;
    friendId: Scalars['ID']['output'];
};
export type FriendsActivity = {
    __typename?: 'FriendsActivity';
    channel?: Maybe<ChannelChannel>;
    channelId: Scalars['ID']['output'];
    isOnline: Scalars['Boolean']['output'];
    streamId: Scalars['ID']['output'];
};
export type FriendsBlockUserResponse = {
    __typename?: 'FriendsBlockUserResponse';
    blockedUser: ProfileProfile;
    blockedUserId: Scalars['ID']['output'];
};
export type FriendsChannelFriends = {
    __typename?: 'FriendsChannelFriends';
    channelId: Scalars['ID']['output'];
    totalCount: Scalars['Int']['output'];
    users: Array<FriendsUser>;
};
export type FriendsFriendStatusUpdateEvent = {
    __typename?: 'FriendsFriendStatusUpdateEvent';
    actorProfile: ProfileProfile;
    actorUserId: Scalars['ID']['output'];
    targetProfile: ProfileProfile;
    targetUserId: Scalars['ID']['output'];
    type: FriendsFriendStatusUpdateEventUpdateType;
};
export declare enum FriendsFriendStatusUpdateEventUpdateType {
    UpdateTypeFriendInvitation = "UPDATE_TYPE_FRIEND_INVITATION",
    UpdateTypeInvitationAccepted = "UPDATE_TYPE_INVITATION_ACCEPTED",
    UpdateTypeInvitationCancelled = "UPDATE_TYPE_INVITATION_CANCELLED",
    UpdateTypeUnspecified = "UPDATE_TYPE_UNSPECIFIED",
    UpdateTypeUserBlocked = "UPDATE_TYPE_USER_BLOCKED",
    UpdateTypeUserUnblocked = "UPDATE_TYPE_USER_UNBLOCKED",
    UpdateTypeUserUnfriended = "UPDATE_TYPE_USER_UNFRIENDED"
}
export type FriendsFriendsSettings = {
    __typename?: 'FriendsFriendsSettings';
    disableFriendRequests: Scalars['Boolean']['output'];
};
export type FriendsFriendsSettingsInput = {
    disableFriendRequests?: InputMaybe<Scalars['Boolean']['input']>;
};
export type FriendsFriendshipStatus = {
    __typename?: 'FriendsFriendshipStatus';
    activity?: Maybe<FriendsActivity>;
    lastStatusChange: Scalars['Timestamp']['output'];
    status: FriendsFriendshipStatusStatus;
};
export declare enum FriendsFriendshipStatusStatus {
    StatusBlocked = "STATUS_BLOCKED",
    StatusBlockedBy = "STATUS_BLOCKED_BY",
    StatusFriend = "STATUS_FRIEND",
    StatusFriendRequestReceived = "STATUS_FRIEND_REQUEST_RECEIVED",
    StatusFriendRequestSent = "STATUS_FRIEND_REQUEST_SENT",
    StatusUnspecified = "STATUS_UNSPECIFIED"
}
export type FriendsGetChannelActiveFriendsResponse = {
    __typename?: 'FriendsGetChannelActiveFriendsResponse';
    channelFriends: Array<FriendsChannelFriends>;
};
export type FriendsGetFriendshipStatusResponse = {
    __typename?: 'FriendsGetFriendshipStatusResponse';
    statuses: Array<FriendsFriendshipStatus>;
};
export type FriendsListBlockedUsersResponse = {
    __typename?: 'FriendsListBlockedUsersResponse';
    pageInfo: ApiPageInfo;
    users: Array<FriendsUser>;
};
export type FriendsListFriendsRequestFilterInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    isOnline?: InputMaybe<Scalars['Boolean']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type FriendsListFriendsResponse = {
    __typename?: 'FriendsListFriendsResponse';
    pageInfo: ApiPageInfo;
    users: Array<FriendsUser>;
};
export type FriendsListReceivedFriendRequestsResponse = {
    __typename?: 'FriendsListReceivedFriendRequestsResponse';
    pageInfo: ApiPageInfo;
    users: Array<FriendsUser>;
};
export type FriendsListSentFriendRequestsResponse = {
    __typename?: 'FriendsListSentFriendRequestsResponse';
    pageInfo: ApiPageInfo;
    users: Array<FriendsUser>;
};
export type FriendsSendFriendRequestResponse = {
    __typename?: 'FriendsSendFriendRequestResponse';
    friend: ProfileProfile;
    friendId: Scalars['ID']['output'];
};
export type FriendsUnblockUserResponse = {
    __typename?: 'FriendsUnblockUserResponse';
    unblockedUser: ProfileProfile;
    unblockedUserId: Scalars['ID']['output'];
};
export type FriendsUser = {
    __typename?: 'FriendsUser';
    activity?: Maybe<FriendsActivity>;
    lastStatusChange: Scalars['Timestamp']['output'];
    profile: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export declare enum FtueDismissalType {
    DismissalTypeActionTaken = "DISMISSAL_TYPE_ACTION_TAKEN",
    DismissalTypeClosed = "DISMISSAL_TYPE_CLOSED",
    DismissalTypeUnspecified = "DISMISSAL_TYPE_UNSPECIFIED"
}
export type FtueListDismissedTooltipsResponse = {
    __typename?: 'FtueListDismissedTooltipsResponse';
    tooltipIds: Array<Scalars['String']['output']>;
};
export type GameBatchGetGamesResponse = {
    __typename?: 'GameBatchGetGamesResponse';
    games: Array<GameGame>;
};
export type GameBatchGetSeasonsResponse = {
    __typename?: 'GameBatchGetSeasonsResponse';
    seasons: Array<GameSeason>;
};
export declare enum GameCardAssetType {
    AssetTypeThumbnail = "ASSET_TYPE_THUMBNAIL",
    AssetTypeUnspecified = "ASSET_TYPE_UNSPECIFIED",
    AssetTypeVideo = "ASSET_TYPE_VIDEO"
}
export type GameCardBatchGetGameCardsResponse = {
    __typename?: 'GameCardBatchGetGameCardsResponse';
    cards: Array<GameLogicCard>;
};
export type GameCardBatchGetStreamerCardsResponse = {
    __typename?: 'GameCardBatchGetStreamerCardsResponse';
    cards: Array<GameLogicStreamerCard>;
};
export type GameCardCreateStreamerCardAssetUploadTokenResponse = {
    __typename?: 'GameCardCreateStreamerCardAssetUploadTokenResponse';
    token: Scalars['String']['output'];
};
export type GameCardHighScoringCardConfig = {
    __typename?: 'GameCardHighScoringCardConfig';
    cardRarity: RarityRarity;
    percentageOfMaxRequired: Scalars['Float']['output'];
    soloMultiplier: Scalars['Float']['output'];
    streamerCardPercentageOfMaxRequired: Scalars['Float']['output'];
};
export type GameCardHighScoringCardTimings = {
    __typename?: 'GameCardHighScoringCardTimings';
    cooldownBetweenCardScores: Scalars['Int']['output'];
    ghostWaitTime: Scalars['Int']['output'];
    speed: GameCardHighScoringCardTimingsSpeed;
};
export declare enum GameCardHighScoringCardTimingsSpeed {
    SpeedDefault = "SPEED_DEFAULT",
    SpeedFast = "SPEED_FAST",
    SpeedFastest = "SPEED_FASTEST",
    SpeedSlow = "SPEED_SLOW",
    SpeedSlowest = "SPEED_SLOWEST",
    SpeedUnspecified = "SPEED_UNSPECIFIED"
}
export type GameCardListBoostersResponse = {
    __typename?: 'GameCardListBoostersResponse';
    boosters: Array<GameLogicBooster>;
};
/** TODO: add game/stream based filtering */
export type GameCardListGameCardsResponse = {
    __typename?: 'GameCardListGameCardsResponse';
    cards: Array<GameLogicCard>;
};
export type GameCardListStreamerCardDraftsRequestFilterInput = {
    familyId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
};
export type GameCardListStreamerCardDraftsResponse = {
    __typename?: 'GameCardListStreamerCardDraftsResponse';
    cards: Array<GameLogicStreamerCard>;
    pageInfo: ApiPageInfo;
};
export type GameCardListStreamerCardsRequestFilterInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    familyId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
};
export type GameCardListStreamerCardsResponse = {
    __typename?: 'GameCardListStreamerCardsResponse';
    cards: Array<GameLogicStreamerCard>;
    pageInfo: ApiPageInfo;
};
export type GameCardStreamerCardDraftUpdateInput = {
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    familyId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};
export type GameGame = {
    __typename?: 'GameGame';
    activeSeason: GameSeason;
    activeSeasonId: Scalars['ID']['output'];
    backdropUrl: Scalars['String']['output'];
    iconUrl: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    noicePredictionsEnabled: Scalars['Boolean']['output'];
    progression: GameUserProgression;
    publicAccess: Scalars['Boolean']['output'];
};
export type GameListGamesResponse = {
    __typename?: 'GameListGamesResponse';
    games: Array<GameGame>;
};
export type GameListSeasonsResponse = {
    __typename?: 'GameListSeasonsResponse';
    seasons: Array<GameSeason>;
};
export type GameLogicActiveBooster = {
    __typename?: 'GameLogicActiveBooster';
    activationTime: Scalars['Int']['output'];
    activatorUserId: Scalars['ID']['output'];
    boosterId: Scalars['Int']['output'];
};
export type GameLogicActiveCard = {
    __typename?: 'GameLogicActiveCard';
    activeBoosters: Array<GameLogicActiveCardActiveBoostersEntry>;
    cardId: Scalars['ID']['output'];
    failureTargetValue: Scalars['Int']['output'];
    points: Scalars['Int']['output'];
    pointsMax: Scalars['Int']['output'];
    pointsMin: Scalars['Int']['output'];
    pointsTimeTarget: Scalars['Int']['output'];
    pointsUpdateTime: Scalars['Int']['output'];
    pointsUpdateTimer: GameLogicTimer;
    setTime: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
    timerDuration: Scalars['Int']['output'];
};
export type GameLogicActiveCardActiveBoostersEntry = {
    __typename?: 'GameLogicActiveCardActiveBoostersEntry';
    key: Scalars['String']['output'];
    value: GameLogicActiveBooster;
};
export type GameLogicActiveCardSucceededMsg = {
    __typename?: 'GameLogicActiveCardSucceededMsg';
    allOrNothing: GameLogicAllOrNothing;
    bestPlay: GameLogicBestPlay;
    boosterPoints: Array<GameLogicPlayerBoosterPoints>;
    card: GameLogicCard;
    cardId: Scalars['ID']['output'];
    groupId: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
    streamId: Scalars['ID']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type GameLogicAllOrNothing = {
    __typename?: 'GameLogicAllOrNothing';
    bestPlay: GameLogicBestPlay;
    cardActivations: Array<GameLogicCardActivationResult>;
    cardId: Scalars['ID']['output'];
    nextPoints: Scalars['Int']['output'];
    round: Scalars['Int']['output'];
    totalPoints: Scalars['Int']['output'];
    totalRounds: Scalars['Int']['output'];
};
export type GameLogicBestPlay = {
    __typename?: 'GameLogicBestPlay';
    activeBoosters: Array<GameLogicActiveBooster>;
    cardId: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
};
export type GameLogicBooster = {
    __typename?: 'GameLogicBooster';
    canTargetSelf: Scalars['Boolean']['output'];
    description: Scalars['String']['output'];
    descriptionCondition: Scalars['String']['output'];
    descriptionDefaultBenefit: Scalars['String']['output'];
    descriptionOtherBenefit: Scalars['String']['output'];
    descriptionTargetNoneBenefit: Scalars['String']['output'];
    descriptionTargetSelf: Scalars['String']['output'];
    id: Scalars['Int']['output'];
    image: Scalars['String']['output'];
    isAvailableSolo: Scalars['Boolean']['output'];
    isSelfAndOtherEffect: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    removeOn: Array<Scalars['String']['output']>;
    timeActive: Scalars['Int']['output'];
    triggersOn: Array<Scalars['String']['output']>;
    valueOther: Scalars['Int']['output'];
    valueSelf: Scalars['Int']['output'];
};
export type GameLogicCard = {
    __typename?: 'GameLogicCard';
    activeStreamerCard?: Maybe<GameLogicStreamerCard>;
    activeStreamerCards: Array<GameLogicStreamerCard>;
    availableStreamerCards: Array<GameLogicStreamerCard>;
    backImage: Scalars['String']['output'];
    dealingModules: Array<Scalars['String']['output']>;
    description: Scalars['String']['output'];
    failureModules: Array<Scalars['String']['output']>;
    failureTargetValue: Scalars['Int']['output'];
    familyId: Scalars['ID']['output'];
    frontImage: Scalars['String']['output'];
    gameModes: Array<Scalars['String']['output']>;
    icon: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    isAllOrNothing: Scalars['Boolean']['output'];
    isDealtAtStart: Scalars['Boolean']['output'];
    isEnabled: Scalars['Boolean']['output'];
    isMatchCard: Scalars['Boolean']['output'];
    leveling: GameLogicCardLeveling;
    matchCardId: Scalars['Int']['output'];
    name: Scalars['String']['output'];
    pointsMax: Scalars['Int']['output'];
    pointsMin: Scalars['Int']['output'];
    pointsTimeTarget: Scalars['Int']['output'];
    rarity: RarityRarity;
    roleCharacters: Array<Scalars['String']['output']>;
    scoredCounterIds: Array<Scalars['String']['output']>;
    season: GameSeason;
    seasonId: Scalars['ID']['output'];
    sides: Array<Scalars['String']['output']>;
    successModules: Array<Scalars['String']['output']>;
    targetValue: Scalars['Int']['output'];
    timerDuration: Scalars['Int']['output'];
    unlockLevel: Scalars['Int']['output'];
};
export type GameLogicCardAvailableStreamerCardsArgs = {
    channel_id?: InputMaybe<Scalars['ID']['input']>;
};
export type GameLogicCardActivationResult = {
    __typename?: 'GameLogicCardActivationResult';
    boosterPoints: Array<GameLogicPlayerBoosterPoints>;
    cardId: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
};
export type GameLogicCardDetails = {
    __typename?: 'GameLogicCardDetails';
    groupName: Scalars['String']['output'];
    succeedingCard: GameLogicActiveCardSucceededMsg;
};
export type GameLogicCardLeveling = {
    __typename?: 'GameLogicCardLeveling';
    currentLevel: Scalars['Int']['output'];
    nextLevelLimit: Scalars['Int']['output'];
    progressToNextLevel: Scalars['Int']['output'];
};
export declare enum GameLogicContextualTeamActionStatus {
    ContextualTeamActionStatusFailed = "CONTEXTUAL_TEAM_ACTION_STATUS_FAILED",
    ContextualTeamActionStatusOngoing = "CONTEXTUAL_TEAM_ACTION_STATUS_ONGOING",
    ContextualTeamActionStatusSucceeded = "CONTEXTUAL_TEAM_ACTION_STATUS_SUCCEEDED",
    ContextualTeamActionStatusUnspecified = "CONTEXTUAL_TEAM_ACTION_STATUS_UNSPECIFIED"
}
export declare enum GameLogicContextualTeamActionType {
    ContextualTeamActionTypeHighScoringCardPromoted = "CONTEXTUAL_TEAM_ACTION_TYPE_HIGH_SCORING_CARD_PROMOTED",
    ContextualTeamActionTypeStreamerActivated = "CONTEXTUAL_TEAM_ACTION_TYPE_STREAMER_ACTIVATED",
    ContextualTeamActionTypeUnspecified = "CONTEXTUAL_TEAM_ACTION_TYPE_UNSPECIFIED"
}
export type GameLogicGroup = {
    __typename?: 'GameLogicGroup';
    id: Scalars['ID']['output'];
    isParty: Scalars['Boolean']['output'];
    isSolo: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    points: Scalars['Int']['output'];
};
export type GameLogicGroupDetails = {
    __typename?: 'GameLogicGroupDetails';
    group: GameLogicGroup;
    players: Array<GameLogicPlayerDetails>;
    streamId: Scalars['ID']['output'];
};
export type GameLogicHand = {
    __typename?: 'GameLogicHand';
    cardIds: Array<Scalars['String']['output']>;
    matchEndCardIds: Array<Scalars['String']['output']>;
    votes: Array<GameLogicVote>;
};
export type GameLogicHighScoringCard = {
    __typename?: 'GameLogicHighScoringCard';
    boosterPoints: Array<GameLogicPlayerBoosterPoints>;
    card: GameLogicCard;
    cardId: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
};
export type GameLogicHighScoringCardPromotedMsg = {
    __typename?: 'GameLogicHighScoringCardPromotedMsg';
    card: GameLogicHighScoringCard;
    groupId: Scalars['ID']['output'];
    groupName: Scalars['String']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export declare enum GameLogicMatchBonusType {
    MatchBonusTypeUnspecified = "MATCH_BONUS_TYPE_UNSPECIFIED",
    MatchBonusTypeVictoryRoyal = "MATCH_BONUS_TYPE_VICTORY_ROYAL"
}
export type GameLogicMatchConfiguration = {
    __typename?: 'GameLogicMatchConfiguration';
    aonPointMultipliers: Array<Scalars['Float']['output']>;
    boosterCooldowns: Array<Scalars['Int']['output']>;
    cardSwitchOutTimerDuration: Scalars['Int']['output'];
    gameId: Scalars['ID']['output'];
    handSize: Scalars['Int']['output'];
    matchBonusActivationRule: Scalars['String']['output'];
    matchBonusPoints: Scalars['Int']['output'];
    matchBonusType: GameLogicMatchBonusType;
    pointsGainTime: Scalars['Int']['output'];
    reshuffleBaseCost: Scalars['Int']['output'];
    reshuffleCostMultiplier: Scalars['Float']['output'];
    seasonId: Scalars['ID']['output'];
};
export type GameLogicMatchEndedMsg = {
    __typename?: 'GameLogicMatchEndedMsg';
    bestCard?: Maybe<GameLogicCardDetails>;
    bestGroup?: Maybe<GameLogicGroupDetails>;
    bestPlayer?: Maybe<GameLogicPlayerDetails>;
    group: GameLogicGroup;
    groupId: Scalars['ID']['output'];
    matchId: Scalars['ID']['output'];
    players: Array<GameLogicPlayer>;
    streamId: Scalars['ID']['output'];
};
export type GameLogicMatchStartedMsg = {
    __typename?: 'GameLogicMatchStartedMsg';
    groupId: Scalars['ID']['output'];
    matchId: Scalars['ID']['output'];
    streamId: Scalars['ID']['output'];
};
export type GameLogicPlayer = {
    __typename?: 'GameLogicPlayer';
    activeCard: GameLogicActiveCard;
    allOrNothing: GameLogicAllOrNothing;
    bestPlay: GameLogicBestPlay;
    boosterCooldownTimer: GameLogicTimer;
    cardSwitchOutTimer: GameLogicTimer;
    hand: GameLogicHand;
    heldBoosterId: Scalars['Int']['output'];
    isOnline: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    points: Scalars['Int']['output'];
    remainingInactiveSeconds: Scalars['Int']['output'];
    reshuffleCount: Scalars['Int']['output'];
    selfUsedBoosterCount: Scalars['Int']['output'];
    usedBoosterCount: Scalars['Int']['output'];
    usedMatchCards: Array<GameLogicPlayerUsedMatchCardsEntry>;
    userId: Scalars['ID']['output'];
    userName: Scalars['String']['output'];
};
export type GameLogicPlayerBoosterPoints = {
    __typename?: 'GameLogicPlayerBoosterPoints';
    boosterId: Scalars['Int']['output'];
    cardUserId: Scalars['ID']['output'];
    donatorUserId: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
    userId: Scalars['ID']['output'];
};
export type GameLogicPlayerDetails = {
    __typename?: 'GameLogicPlayerDetails';
    groupName: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    points: Scalars['Int']['output'];
    user: ProfileProfile;
};
export type GameLogicPlayerJoinedMsg = {
    __typename?: 'GameLogicPlayerJoinedMsg';
    groupId: Scalars['ID']['output'];
    player: GameLogicPlayer;
    playerCardIds: Array<Scalars['String']['output']>;
    serverTime: Scalars['Int']['output'];
    streamId: Scalars['ID']['output'];
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type GameLogicPlayerUsedMatchCardsEntry = {
    __typename?: 'GameLogicPlayerUsedMatchCardsEntry';
    key: Scalars['Int']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameLogicStreamState = {
    __typename?: 'GameLogicStreamState';
    matchSeqNum: Scalars['Int']['output'];
    matchState: GameLogicStreamStateMatchState;
};
export declare enum GameLogicStreamStateMatchState {
    MatchStateActive = "MATCH_STATE_ACTIVE",
    MatchStateEnded = "MATCH_STATE_ENDED",
    MatchStatePaused = "MATCH_STATE_PAUSED",
    MatchStateUnspecified = "MATCH_STATE_UNSPECIFIED"
}
export type GameLogicStreamerCard = {
    __typename?: 'GameLogicStreamerCard';
    baseCard: GameLogicCard;
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    draft: Scalars['Boolean']['output'];
    facecam: Scalars['String']['output'];
    facecamUrl: Scalars['String']['output'];
    familyId: Scalars['ID']['output'];
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    image: Scalars['String']['output'];
    imageUrl: Scalars['String']['output'];
    name: Scalars['String']['output'];
    saleConfig?: Maybe<StoreV2StreamerCardSaleConfig>;
    video: Scalars['String']['output'];
    videoUrl: Scalars['String']['output'];
};
export type GameLogicStreamerCardBaseCardArgs = {
    season_id?: InputMaybe<Scalars['String']['input']>;
};
export type GameLogicStreamerCardInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    draft?: InputMaybe<Scalars['Boolean']['input']>;
    facecamUrl?: InputMaybe<Scalars['String']['input']>;
    familyId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    videoUrl?: InputMaybe<Scalars['String']['input']>;
};
export type GameLogicTimer = {
    __typename?: 'GameLogicTimer';
    endTime: Scalars['Int']['output'];
    startTime: Scalars['Int']['output'];
};
export type GameLogicVote = {
    __typename?: 'GameLogicVote';
    cardId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type GameSeason = {
    __typename?: 'GameSeason';
    badgeUrl: Scalars['String']['output'];
    cardBackgroundUrls: Array<GameSeasonCardBackgroundAsset>;
    endTime: Scalars['Timestamp']['output'];
    game: GameGame;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    progression: ProgressionSeasonProgression;
    progressionPauseReason: Scalars['String']['output'];
    progressionPaused: Scalars['Boolean']['output'];
    seasonBreak: Scalars['Boolean']['output'];
    seasonBreakReason: Scalars['String']['output'];
    /** @deprecated field is deprecated */
    seasonPauseReason: Scalars['String']['output'];
    /** @deprecated field is deprecated */
    seasonPaused: Scalars['Boolean']['output'];
    startTime: Scalars['Timestamp']['output'];
};
export type GameSeasonProgressionArgs = {
    user_id?: InputMaybe<Scalars['String']['input']>;
};
export type GameSeasonCardBackgroundAsset = {
    __typename?: 'GameSeasonCardBackgroundAsset';
    rarity: RarityRarity;
    url: Scalars['String']['output'];
};
export type GameStateAttributesState = {
    __typename?: 'GameStateAttributesState';
    boolAttributes: Array<GameStateAttributesStateBoolAttributesEntry>;
    intAttributes: Array<GameStateAttributesStateIntAttributesEntry>;
    stringAttributes: Array<GameStateAttributesStateStringAttributesEntry>;
};
export type GameStateAttributesStateBoolAttributesEntry = {
    __typename?: 'GameStateAttributesStateBoolAttributesEntry';
    key: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateAttributesStateIntAttributesEntry = {
    __typename?: 'GameStateAttributesStateIntAttributesEntry';
    key: Scalars['String']['output'];
    value: Scalars['Int']['output'];
};
export type GameStateAttributesStateStringAttributesEntry = {
    __typename?: 'GameStateAttributesStateStringAttributesEntry';
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type GameStateBoosterState = {
    __typename?: 'GameStateBoosterState';
    activeBooster: GameLogicActiveBooster;
    booster: GameLogicBooster;
    sourcePlayerId: Scalars['ID']['output'];
    targetPlayerId: Scalars['ID']['output'];
};
export type GameStateCalModule = {
    __typename?: 'GameStateCALModule';
    expression: GameStateCalModuleExpression;
};
export type GameStateCalModuleBinaryExpression = {
    __typename?: 'GameStateCALModuleBinaryExpression';
    left: GameStateCalModuleExpression;
    op: GameStateCalModuleBinaryOp;
    right: GameStateCalModuleExpression;
};
export declare enum GameStateCalModuleBinaryOp {
    BinaryOpAnd = "BINARY_OP_AND",
    BinaryOpOr = "BINARY_OP_OR",
    BinaryOpUnspecified = "BINARY_OP_UNSPECIFIED"
}
export type GameStateCalModuleCheck = {
    __typename?: 'GameStateCALModuleCheck';
    check?: Maybe<GameStateCalModuleCheckCheckUnion>;
};
export type GameStateCalModuleCheckCheckUnion = GameStateCalModuleCountEventIntAttributeCheck | GameStateCalModuleEventBoolAttributeCheck | GameStateCalModuleEventIntAttributeCheck | GameStateCalModuleEventStringAttributeCheck | GameStateCalModuleEventTypeCheck | GameStateCalModuleEventTypeCheckAfterEventIntAttributeCheck | GameStateCalModuleGlobalAnyBoolAttributeCheck | GameStateCalModuleGlobalBoolAttributeCheck | GameStateCalModuleGlobalIntAttributeCheck | GameStateCalModuleGlobalIntAttributeSumCheck | GameStateCalModuleGlobalStringAttributeCheck | GameStateCalModuleRepeatedEventBoolAttributeCheck | GameStateCalModuleRepeatedEventIntAttributeCheck | GameStateCalModuleRepeatedEventStringAttributeCheck | GameStateCalModuleRepeatedEventTypeCheck | GameStateCalModuleTimeoutCheck;
export type GameStateCalModuleCheckSequence = {
    __typename?: 'GameStateCALModuleCheckSequence';
    activationTimes: Array<Scalars['Int']['output']>;
    expressions: Array<GameStateCalModuleExpression>;
    intervals: Array<Scalars['Int']['output']>;
};
export type GameStateCalModuleCountEventIntAttributeCheck = {
    __typename?: 'GameStateCALModuleCountEventIntAttributeCheck';
    attributes: Array<Scalars['String']['output']>;
    calculateNegative: Scalars['Boolean']['output'];
    eventName: Scalars['String']['output'];
    initialValue: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
};
export type GameStateCalModuleEventBoolAttributeCheck = {
    __typename?: 'GameStateCALModuleEventBoolAttributeCheck';
    attribute: Scalars['String']['output'];
    eventName: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateCalModuleEventIntAttributeCheck = {
    __typename?: 'GameStateCALModuleEventIntAttributeCheck';
    attribute: Scalars['String']['output'];
    eventName: Scalars['String']['output'];
    operator: GameStateIntComparisonOperator;
    value: Scalars['Int']['output'];
};
export type GameStateCalModuleEventStringAttributeCheck = {
    __typename?: 'GameStateCALModuleEventStringAttributeCheck';
    attribute: Scalars['String']['output'];
    eventName: Scalars['String']['output'];
    operator: GameStateStringComparisonOperator;
    values: Array<Scalars['String']['output']>;
};
export type GameStateCalModuleEventTypeCheck = {
    __typename?: 'GameStateCALModuleEventTypeCheck';
    eventNames: Array<Scalars['String']['output']>;
};
export type GameStateCalModuleEventTypeCheckAfterEventIntAttributeCheck = {
    __typename?: 'GameStateCALModuleEventTypeCheckAfterEventIntAttributeCheck';
    firstCheck: GameStateCalModuleEventIntAttributeCheck;
    firstCheckSuccessTime: Scalars['Int']['output'];
    secondCheck: GameStateCalModuleEventTypeCheck;
    timerDuration: Scalars['Int']['output'];
};
export type GameStateCalModuleExpression = {
    __typename?: 'GameStateCALModuleExpression';
    expression?: Maybe<GameStateCalModuleExpressionExpressionUnion>;
};
export type GameStateCalModuleExpressionExpressionUnion = GameStateCalModuleBinaryExpression | GameStateCalModuleCheck | GameStateCalModuleCheckSequence | GameStateCalModuleForDuration | GameStateCalModuleGroup | GameStateCalModuleUnaryExpression;
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type GameStateCalModuleForDuration = {
    __typename?: 'GameStateCALModuleForDuration';
    expression: GameStateCalModuleExpression;
    resetting: Scalars['Boolean']['output'];
    timeout: GameStateCalModuleExpression;
};
export type GameStateCalModuleGlobalAnyBoolAttributeCheck = {
    __typename?: 'GameStateCALModuleGlobalAnyBoolAttributeCheck';
    attributes: Array<Scalars['String']['output']>;
    value: Scalars['Boolean']['output'];
};
export type GameStateCalModuleGlobalBoolAttributeCheck = {
    __typename?: 'GameStateCALModuleGlobalBoolAttributeCheck';
    attribute: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateCalModuleGlobalIntAttributeCheck = {
    __typename?: 'GameStateCALModuleGlobalIntAttributeCheck';
    attribute: Scalars['String']['output'];
    operator: GameStateIntComparisonOperator;
    value: Scalars['Int']['output'];
};
export type GameStateCalModuleGlobalIntAttributeSumCheck = {
    __typename?: 'GameStateCALModuleGlobalIntAttributeSumCheck';
    attributes: Array<Scalars['String']['output']>;
    operator: GameStateIntComparisonOperator;
    value: Scalars['Int']['output'];
};
export type GameStateCalModuleGlobalStringAttributeCheck = {
    __typename?: 'GameStateCALModuleGlobalStringAttributeCheck';
    attribute: Scalars['String']['output'];
    operator: GameStateStringComparisonOperator;
    values: Array<Scalars['String']['output']>;
};
export type GameStateCalModuleGroup = {
    __typename?: 'GameStateCALModuleGroup';
    expression: GameStateCalModuleExpression;
};
export type GameStateCalModuleRepeatedEventBoolAttributeCheck = {
    __typename?: 'GameStateCALModuleRepeatedEventBoolAttributeCheck';
    check: GameStateCalModuleEventBoolAttributeCheck;
    initialValue: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
};
export type GameStateCalModuleRepeatedEventIntAttributeCheck = {
    __typename?: 'GameStateCALModuleRepeatedEventIntAttributeCheck';
    check: GameStateCalModuleEventIntAttributeCheck;
    initialValue: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
};
export type GameStateCalModuleRepeatedEventStringAttributeCheck = {
    __typename?: 'GameStateCALModuleRepeatedEventStringAttributeCheck';
    check: GameStateCalModuleEventStringAttributeCheck;
    initialValue: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
};
export type GameStateCalModuleRepeatedEventTypeCheck = {
    __typename?: 'GameStateCALModuleRepeatedEventTypeCheck';
    check: GameStateCalModuleEventTypeCheck;
    initialValue: Scalars['Int']['output'];
    targetValue: Scalars['Int']['output'];
};
export type GameStateCalModuleTimeoutCheck = {
    __typename?: 'GameStateCALModuleTimeoutCheck';
    duration: Scalars['Int']['output'];
    lastStateChangeTimestamp: Scalars['Int']['output'];
    lastTimestamp: Scalars['Int']['output'];
    timeLeft: Scalars['Int']['output'];
};
export type GameStateCalModuleUnaryExpression = {
    __typename?: 'GameStateCALModuleUnaryExpression';
    expression: GameStateCalModuleExpression;
    op: GameStateCalModuleUnaryOp;
};
export declare enum GameStateCalModuleUnaryOp {
    UnaryOpNot = "UNARY_OP_NOT",
    UnaryOpUnspecified = "UNARY_OP_UNSPECIFIED"
}
export type GameStateCardDealingState = {
    __typename?: 'GameStateCardDealingState';
    cardAvailability: Array<GameStateCardDealingStateCardAvailabilityEntry>;
    cardDealingModules: Array<GameStateCardDealingStateCardDealingModulesEntry>;
    cards: Array<GameStateCardDealingStateCardsEntry>;
};
export type GameStateCardDealingStateCalModulesList = {
    __typename?: 'GameStateCardDealingStateCALModulesList';
    modules: Array<GameStateCalModule>;
};
export type GameStateCardDealingStateCardAvailabilityEntry = {
    __typename?: 'GameStateCardDealingStateCardAvailabilityEntry';
    key: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateCardDealingStateCardDealingModulesEntry = {
    __typename?: 'GameStateCardDealingStateCardDealingModulesEntry';
    key: Scalars['String']['output'];
    value: GameStateCardDealingStateCalModulesList;
};
export type GameStateCardDealingStateCardsEntry = {
    __typename?: 'GameStateCardDealingStateCardsEntry';
    key: Scalars['String']['output'];
    value: GameLogicCard;
};
export type GameStateCardState = {
    __typename?: 'GameStateCardState';
    failureModules: Array<GameStateCalModule>;
    successModules: Array<GameStateCalModule>;
};
export type GameStateClientSession = {
    __typename?: 'GameStateClientSession';
    mailbox: Scalars['String']['output'];
    timestamp: Scalars['Int']['output'];
    token: Scalars['String']['output'];
};
export type GameStateClientSessionList = {
    __typename?: 'GameStateClientSessionList';
    sessions: Array<GameStateClientSession>;
};
export type GameStateContextualTeamActionState = {
    __typename?: 'GameStateContextualTeamActionState';
    deadlineMs: Scalars['Int']['output'];
    participants: Array<GameStateContextualTeamActionStateParticipantsEntry>;
    status: GameLogicContextualTeamActionStatus;
    type: GameLogicContextualTeamActionType;
};
export type GameStateContextualTeamActionStateParticipantsEntry = {
    __typename?: 'GameStateContextualTeamActionStateParticipantsEntry';
    key: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateGameConfig = {
    __typename?: 'GameStateGameConfig';
    boosters: Array<GameStateGameConfigBoostersEntry>;
    featureFlags: Array<GameStateGameConfigFeatureFlagsEntry>;
    highScoringCardConfig: GameStateGameConfigHighScoringCardConfig;
    inactivityTimeouts: ConfigMetagameConfigInactivityTimeouts;
    matchConfiguration: GameLogicMatchConfiguration;
    uiTimings: ConfigMetagameConfigUiTimings;
};
export type GameStateGameConfigBoostersEntry = {
    __typename?: 'GameStateGameConfigBoostersEntry';
    key: Scalars['Int']['output'];
    value: GameLogicBooster;
};
export type GameStateGameConfigFeatureFlagsEntry = {
    __typename?: 'GameStateGameConfigFeatureFlagsEntry';
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type GameStateGameConfigHighScoringCardConfig = {
    __typename?: 'GameStateGameConfigHighScoringCardConfig';
    highScoringCardConfigs: Array<GameCardHighScoringCardConfig>;
    highScoringCardTimings: Array<GameCardHighScoringCardTimings>;
};
export type GameStateGroupRunnerState = {
    __typename?: 'GameStateGroupRunnerState';
    gameConfig: GameStateGameConfig;
    groupStartTime: Scalars['Int']['output'];
    groupState: GameStateGroupState;
    matchEndTime: Scalars['Int']['output'];
    matchPauseStartTime: Scalars['Int']['output'];
    matchPauseTimeTotal: Scalars['Int']['output'];
    players: Array<GameStateGroupRunnerStatePlayersEntry>;
    randomState: GameStateRandomState;
    sessionTrackerState: GameStateSessionTrackerState;
    started: Scalars['Boolean']['output'];
    stepTimestamp: Scalars['Int']['output'];
    streamTrackerState: GameStateStreamTrackerState;
    timeOffset: Scalars['Int']['output'];
    timer: GameStateTimerState;
};
export type GameStateGroupRunnerStatePlayersEntry = {
    __typename?: 'GameStateGroupRunnerStatePlayersEntry';
    key: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export type GameStateGroupState = {
    __typename?: 'GameStateGroupState';
    boosterUsages: Array<GameStateGroupStateBoosterUsage>;
    contextualTeamActionState: GameStateContextualTeamActionState;
    group: GameLogicGroup;
    matchBonusActivationRule: GameStateCalModule;
    players: Array<GameStateGroupStatePlayersEntry>;
    removedPlayers: Array<GameStatePlayerState>;
    streamInfo: StreamInfoStreamInfo;
    timeTrackerState: GameStateTimeTrackerState;
};
export type GameStateGroupStateBoosterUsage = {
    __typename?: 'GameStateGroupStateBoosterUsage';
    boosterState: GameStateBoosterState;
    sourcePlayerId: Scalars['ID']['output'];
    targetPlayerId: Scalars['ID']['output'];
};
export type GameStateGroupStatePlayersEntry = {
    __typename?: 'GameStateGroupStatePlayersEntry';
    key: Scalars['String']['output'];
    value: GameStatePlayerState;
};
export type GameStateHighScoringCardState = {
    __typename?: 'GameStateHighScoringCardState';
    activeGroups: Array<GameStateHighScoringCardStateActiveGroupsEntry>;
    card: GameLogicHighScoringCard;
    deadline: Scalars['Int']['output'];
    groupId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type GameStateHighScoringCardStateActiveGroupsEntry = {
    __typename?: 'GameStateHighScoringCardStateActiveGroupsEntry';
    key: Scalars['String']['output'];
    value: Scalars['Boolean']['output'];
};
export declare enum GameStateIntComparisonOperator {
    IntComparisonOperatorEqual = "INT_COMPARISON_OPERATOR_EQUAL",
    IntComparisonOperatorGreater = "INT_COMPARISON_OPERATOR_GREATER",
    IntComparisonOperatorGreaterOrEqual = "INT_COMPARISON_OPERATOR_GREATER_OR_EQUAL",
    IntComparisonOperatorLess = "INT_COMPARISON_OPERATOR_LESS",
    IntComparisonOperatorLessOrEqual = "INT_COMPARISON_OPERATOR_LESS_OR_EQUAL",
    IntComparisonOperatorNotEqual = "INT_COMPARISON_OPERATOR_NOT_EQUAL",
    IntComparisonOperatorUnspecified = "INT_COMPARISON_OPERATOR_UNSPECIFIED"
}
export type GameStatePlayerState = {
    __typename?: 'GameStatePlayerState';
    cardDealingState: GameStateCardDealingState;
    cardState: GameStateCardState;
    debugEvents: Scalars['Boolean']['output'];
    groupId: Scalars['ID']['output'];
    lastHeldBoosterId: Scalars['Int']['output'];
    player: GameLogicPlayer;
    streamId: Scalars['ID']['output'];
};
export type GameStateRandomState = {
    __typename?: 'GameStateRandomState';
    seed: Scalars['Int']['output'];
};
export type GameStateSessionTrackerState = {
    __typename?: 'GameStateSessionTrackerState';
    playerSessions: Array<GameStateSessionTrackerStatePlayerSessionsEntry>;
    spectatorSessions: Array<GameStateSessionTrackerStateSpectatorSessionsEntry>;
};
export type GameStateSessionTrackerStatePlayerSessionsEntry = {
    __typename?: 'GameStateSessionTrackerStatePlayerSessionsEntry';
    key: Scalars['String']['output'];
    value: GameStateClientSessionList;
};
export type GameStateSessionTrackerStateSpectatorSessionsEntry = {
    __typename?: 'GameStateSessionTrackerStateSpectatorSessionsEntry';
    key: Scalars['String']['output'];
    value: GameStateClientSessionList;
};
export type GameStateStreamGroupsTrackerState = {
    __typename?: 'GameStateStreamGroupsTrackerState';
    bestCard: GameLogicCardDetails;
    bestGroup: GameLogicGroupDetails;
    bestPlayer: GameLogicPlayerDetails;
};
export type GameStateStreamState = {
    __typename?: 'GameStateStreamState';
    groups: Array<Scalars['String']['output']>;
    streamGroupsTracker: GameStateStreamGroupsTrackerState;
    streamInfo: StreamInfoStreamInfo;
    streamTracker: GameStateStreamTrackerState;
};
export type GameStateStreamTrackerState = {
    __typename?: 'GameStateStreamTrackerState';
    globalAttributes: GameStateAttributesState;
    matchEndTime: Scalars['Int']['output'];
    matchPauseStartTime: Scalars['Int']['output'];
    matchPauseTimeTotal: Scalars['Int']['output'];
    matchStartTime: Scalars['Int']['output'];
    matchStateChanged: Scalars['Boolean']['output'];
    previousMatchState: GameLogicStreamStateMatchState;
    streamState: GameLogicStreamState;
};
export declare enum GameStateStringComparisonOperator {
    StringComparisonOperatorEqual = "STRING_COMPARISON_OPERATOR_EQUAL",
    StringComparisonOperatorIn = "STRING_COMPARISON_OPERATOR_IN",
    StringComparisonOperatorNotEqual = "STRING_COMPARISON_OPERATOR_NOT_EQUAL",
    StringComparisonOperatorNotIn = "STRING_COMPARISON_OPERATOR_NOT_IN",
    StringComparisonOperatorUnspecified = "STRING_COMPARISON_OPERATOR_UNSPECIFIED"
}
export type GameStateTimeTrackerState = {
    __typename?: 'GameStateTimeTrackerState';
    entries: Array<GameStateTimeTrackerStateEntriesEntry>;
    matchActive: Scalars['Boolean']['output'];
};
export type GameStateTimeTrackerStateEntriesEntry = {
    __typename?: 'GameStateTimeTrackerStateEntriesEntry';
    key: Scalars['String']['output'];
    value: GameStateTimeTrackerStateTimeTrackerEntry;
};
export type GameStateTimeTrackerStateTimeTrackerEntry = {
    __typename?: 'GameStateTimeTrackerStateTimeTrackerEntry';
    disconnectedTimestamp: Scalars['Int']['output'];
    idle: Scalars['Boolean']['output'];
    idleTimestamp: Scalars['Int']['output'];
    lastOnlineTimestamp: Scalars['Int']['output'];
    online: Scalars['Boolean']['output'];
    totalIdleTime: Scalars['Int']['output'];
    totalTime: Scalars['Int']['output'];
};
export type GameStateTimerState = {
    __typename?: 'GameStateTimerState';
    activeTimeout: GameStateTimerStateTimeout;
    /** @deprecated field is deprecated */
    activeTimerDeadline: Scalars['Int']['output'];
    /** @deprecated field is deprecated */
    timeouts: Array<Scalars['Int']['output']>;
    timeoutsWithMetadata: Array<GameStateTimerStateTimeout>;
};
export type GameStateTimerStateMetadata = {
    __typename?: 'GameStateTimerStateMetadata';
    source: Scalars['String']['output'];
};
export type GameStateTimerStateTimeout = {
    __typename?: 'GameStateTimerStateTimeout';
    expirationTimestamp: Scalars['Int']['output'];
    metadata: GameStateTimerStateMetadata;
};
export type GameUserProgression = {
    __typename?: 'GameUserProgression';
    experiencePoints: Scalars['Int']['output'];
    level: Scalars['Int']['output'];
    userId: Scalars['ID']['output'];
};
export type GoalCardBatchGetGoalCardsResponse = {
    __typename?: 'GoalCardBatchGetGoalCardsResponse';
    goalCards: Array<GoalCardGoalCard>;
};
export type GoalCardGetSlotOptionsResponse = {
    __typename?: 'GoalCardGetSlotOptionsResponse';
    cardOptions: Array<GoalCardGoalCard>;
};
export type GoalCardGoalCard = {
    __typename?: 'GoalCardGoalCard';
    cardGoalGroup: Scalars['String']['output'];
    /** counter_config_ids defines which counters the goal card is tracking */
    counterConfigIds: Array<Scalars['String']['output']>;
    description: Scalars['String']['output'];
    disabled: Scalars['Boolean']['output'];
    game?: Maybe<GameGame>;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    rarity: RarityRarity;
    requiredItemIds: Array<Scalars['String']['output']>;
    requiresTeam: Scalars['Boolean']['output'];
    reward: RewardRewardType;
    /**
     * target is the target value for the counter where an award is awarded to
     *  the user
     */
    target: Scalars['Float']['output'];
    targetType: GoalCardGoalCardTargetType;
};
export type GoalCardGoalCardSlot = {
    __typename?: 'GoalCardGoalCardSlot';
    cardOptions?: Maybe<Array<GoalCardGoalCard>>;
    goalCard?: Maybe<GoalCardGoalCard>;
    goalCardId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    progress?: Maybe<GoalCardGoalCardSlotProgress>;
    resetTime?: Maybe<Scalars['Timestamp']['output']>;
    reward?: Maybe<RewardReward>;
};
export type GoalCardGoalCardSlotProgress = {
    __typename?: 'GoalCardGoalCardSlotProgress';
    completed: Scalars['Boolean']['output'];
    percentage: Scalars['Float']['output'];
    value: Scalars['Float']['output'];
};
export declare enum GoalCardGoalCardTargetType {
    TargetTypeSingleUpdate = "TARGET_TYPE_SINGLE_UPDATE",
    TargetTypeTotal = "TARGET_TYPE_TOTAL",
    TargetTypeUnspecified = "TARGET_TYPE_UNSPECIFIED",
    TargetTypeUpdateCount = "TARGET_TYPE_UPDATE_COUNT"
}
export type GoalCardListGoalCardSlotsResponse = {
    __typename?: 'GoalCardListGoalCardSlotsResponse';
    slots: Array<GoalCardGoalCardSlot>;
};
export type GoalCardReshuffleSlotResponse = {
    __typename?: 'GoalCardReshuffleSlotResponse';
    cardOptions: Array<GoalCardGoalCard>;
};
export type GoalCardSetGoalCardSlotResponse = {
    __typename?: 'GoalCardSetGoalCardSlotResponse';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
/**
 * A generic empty message that you can re-use to avoid defining duplicated
 *  empty messages in your APIs. A typical example is to use it as the request
 *  or the response type of an API method. For instance:
 *
 *      service Foo {
 *        rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty);
 *      }
 *
 *  The JSON representation for `Empty` is empty JSON object `{}`.
 */
export type GoogleProtobufEmpty = {
    __typename?: 'GoogleProtobufEmpty';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
/**
 * `FieldMask` represents a set of symbolic field paths, for example:
 *
 *      paths: "f.a"
 *      paths: "f.b.d"
 *
 *  Here `f` represents a field in some root message, `a` and `b`
 *  fields in the message found in `f`, and `d` a field found in the
 *  message in `f.b`.
 *
 *  Field masks are used to specify a subset of fields that should be
 *  returned by a get operation or modified by an update operation.
 *  Field masks also have a custom JSON encoding (see below).
 *
 *  # Field Masks in Projections
 *
 *  When used in the context of a projection, a response message or
 *  sub-message is filtered by the API to only contain those fields as
 *  specified in the mask. For example, if the mask in the previous
 *  example is applied to a response message as follows:
 *
 *      f {
 *        a : 22
 *        b {
 *          d : 1
 *          x : 2
 *        }
 *        y : 13
 *      }
 *      z: 8
 *
 *  The result will not contain specific values for fields x,y and z
 *  (their value will be set to the default, and omitted in proto text
 *  output):
 *
 *
 *      f {
 *        a : 22
 *        b {
 *          d : 1
 *        }
 *      }
 *
 *  A repeated field is not allowed except at the last position of a
 *  paths string.
 *
 *  If a FieldMask object is not present in a get operation, the
 *  operation applies to all fields (as if a FieldMask of all fields
 *  had been specified).
 *
 *  Note that a field mask does not necessarily apply to the
 *  top-level response message. In case of a REST get operation, the
 *  field mask applies directly to the response, but in case of a REST
 *  list operation, the mask instead applies to each individual message
 *  in the returned resource list. In case of a REST custom method,
 *  other definitions may be used. Where the mask applies will be
 *  clearly documented together with its declaration in the API.  In
 *  any case, the effect on the returned resource/resources is required
 *  behavior for APIs.
 *
 *  # Field Masks in Update Operations
 *
 *  A field mask in update operations specifies which fields of the
 *  targeted resource are going to be updated. The API is required
 *  to only change the values of the fields as specified in the mask
 *  and leave the others untouched. If a resource is passed in to
 *  describe the updated values, the API ignores the values of all
 *  fields not covered by the mask.
 *
 *  If a repeated field is specified for an update operation, new values will
 *  be appended to the existing repeated field in the target resource. Note that
 *  a repeated field is only allowed in the last position of a `paths` string.
 *
 *  If a sub-message is specified in the last position of the field mask for an
 *  update operation, then new value will be merged into the existing sub-message
 *  in the target resource.
 *
 *  For example, given the target message:
 *
 *      f {
 *        b {
 *          d: 1
 *          x: 2
 *        }
 *        c: [1]
 *      }
 *
 *  And an update message:
 *
 *      f {
 *        b {
 *          d: 10
 *        }
 *        c: [2]
 *      }
 *
 *  then if the field mask is:
 *
 *   paths: ["f.b", "f.c"]
 *
 *  then the result will be:
 *
 *      f {
 *        b {
 *          d: 10
 *          x: 2
 *        }
 *        c: [1, 2]
 *      }
 *
 *  An implementation may provide options to override this default behavior for
 *  repeated and message fields.
 *
 *  In order to reset a field's value to the default, the field must
 *  be in the mask and set to the default value in the provided resource.
 *  Hence, in order to reset all fields of a resource, provide a default
 *  instance of the resource and set all fields in the mask, or do
 *  not provide a mask as described below.
 *
 *  If a field mask is not present on update, the operation applies to
 *  all fields (as if a field mask of all fields has been specified).
 *  Note that in the presence of schema evolution, this may mean that
 *  fields the client does not know and has therefore not filled into
 *  the request will be reset to their default. If this is unwanted
 *  behavior, a specific service may require a client to always specify
 *  a field mask, producing an error if not.
 *
 *  As with get operations, the location of the resource which
 *  describes the updated values in the request message depends on the
 *  operation kind. In any case, the effect of the field mask is
 *  required to be honored by the API.
 *
 *  ## Considerations for HTTP REST
 *
 *  The HTTP kind of an update operation which uses a field mask must
 *  be set to PATCH instead of PUT in order to satisfy HTTP semantics
 *  (PUT must only be used for full updates).
 *
 *  # JSON Encoding of Field Masks
 *
 *  In JSON, a field mask is encoded as a single string where paths are
 *  separated by a comma. Fields name in each path are converted
 *  to/from lower-camel naming conventions.
 *
 *  As an example, consider the following message declarations:
 *
 *      message Profile {
 *        User user = 1;
 *        Photo photo = 2;
 *      }
 *      message User {
 *        string display_name = 1;
 *        string address = 2;
 *      }
 *
 *  In proto a field mask for `Profile` may look as such:
 *
 *      mask {
 *        paths: "user.display_name"
 *        paths: "photo"
 *      }
 *
 *  In JSON, the same mask is represented as below:
 *
 *      {
 *        mask: "user.displayName,photo"
 *      }
 *
 *  # Field Masks and Oneof Fields
 *
 *  Field masks treat fields in oneofs just as regular fields. Consider the
 *  following message:
 *
 *      message SampleMessage {
 *        oneof test_oneof {
 *          string name = 4;
 *          SubMessage sub_message = 9;
 *        }
 *      }
 *
 *  The field mask can be:
 *
 *      mask {
 *        paths: "name"
 *      }
 *
 *  Or:
 *
 *      mask {
 *        paths: "sub_message"
 *      }
 *
 *  Note that oneof type names ("test_oneof" in this case) cannot be used in
 *  paths.
 *
 *  ## Field Mask Verification
 *
 *  The implementation of any API method which has a FieldMask type field in the
 *  request should verify the included field paths, and return an
 *  `INVALID_ARGUMENT` error if any path is unmappable.
 */
export type GoogleProtobufFieldMaskInput = {
    /** The set of field mask paths. */
    paths?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type IntType = {
    __typename?: 'IntType';
    /** The wrapped value of type Int */
    value: Scalars['Int']['output'];
};
export type InventoryAddEntitlementsResponse = {
    __typename?: 'InventoryAddEntitlementsResponse';
    items: Array<InventoryInventoryItem>;
};
export type InventoryConsumeItemResponse = {
    __typename?: 'InventoryConsumeItemResponse';
    items: Array<InventoryInventoryItem>;
};
export type InventoryInventoryEvent = {
    __typename?: 'InventoryInventoryEvent';
    event?: Maybe<InventoryInventoryEventEventUnion>;
    id: Scalars['ID']['output'];
    reason: ReasonReason;
    userId: Scalars['ID']['output'];
};
export type InventoryInventoryEventEventUnion = InventoryItemConsumption | InventoryItemEntitlement;
export type InventoryInventoryItem = {
    __typename?: 'InventoryInventoryItem';
    item: ItemItem;
    itemCount: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
};
export type InventoryInventoryUpdateEvent = {
    __typename?: 'InventoryInventoryUpdateEvent';
    events: Array<InventoryInventoryEvent>;
};
export type InventoryItemConsumption = {
    __typename?: 'InventoryItemConsumption';
    item: ItemItem;
    itemCount: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
};
export type InventoryItemConsumptionInput = {
    itemCount?: InputMaybe<Scalars['Int']['input']>;
    itemId?: InputMaybe<Scalars['ID']['input']>;
};
export type InventoryItemEntitlement = {
    __typename?: 'InventoryItemEntitlement';
    item: ItemItem;
    itemCount: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
};
export type InventoryItemEntitlementInput = {
    itemCount?: InputMaybe<Scalars['Int']['input']>;
    itemId?: InputMaybe<Scalars['ID']['input']>;
};
export type InventoryListUserInventoryRequestFilterInput = {
    /** game_id optional game filter */
    gameId?: InputMaybe<Scalars['ID']['input']>;
    /** item_type optional item type filter */
    itemType?: InputMaybe<ItemItemType>;
    /** season_id optional season filter */
    seasonId?: InputMaybe<Scalars['ID']['input']>;
};
export type InventoryListUserInventoryResponse = {
    __typename?: 'InventoryListUserInventoryResponse';
    items: Array<InventoryInventoryItem>;
    pageInfo: ApiPageInfo;
};
export type InvitationCreateInvitationCodesResponse = {
    __typename?: 'InvitationCreateInvitationCodesResponse';
    codes: Array<InvitationInvitationCode>;
};
export type InvitationInvitationCode = {
    __typename?: 'InvitationInvitationCode';
    code: Scalars['String']['output'];
    createdAt: Scalars['Timestamp']['output'];
    ownerId: Scalars['ID']['output'];
    usedAt?: Maybe<Scalars['Timestamp']['output']>;
    usedBy?: Maybe<ProfileProfile>;
    usedById?: Maybe<Scalars['ID']['output']>;
};
export type InvitationInvitationCodeUpdateEvent = {
    __typename?: 'InvitationInvitationCodeUpdateEvent';
    codes: Array<InvitationInvitationCode>;
    updateType: InvitationInvitationCodeUpdateEventUpdateType;
    updatedAt: Scalars['Timestamp']['output'];
};
export declare enum InvitationInvitationCodeUpdateEventUpdateType {
    UpdateTypeCreated = "UPDATE_TYPE_CREATED",
    UpdateTypeUnspecified = "UPDATE_TYPE_UNSPECIFIED",
    UpdateTypeUsed = "UPDATE_TYPE_USED"
}
export type InvitationListInvitationCodesResponse = {
    __typename?: 'InvitationListInvitationCodesResponse';
    codes: Array<InvitationInvitationCode>;
};
export type ItemBatchGetItemsResponse = {
    __typename?: 'ItemBatchGetItemsResponse';
    items: Array<ItemItem>;
};
export type ItemGetItemResponse = {
    __typename?: 'ItemGetItemResponse';
    item: ItemItem;
};
export type ItemItem = {
    __typename?: 'ItemItem';
    attributes: AttributeAttributeMap;
    bootstraps?: Maybe<Array<ItemItemBootstrap>>;
    channelId: Scalars['ID']['output'];
    children?: Maybe<Array<ItemItem>>;
    consumable: Scalars['Boolean']['output'];
    details?: Maybe<ItemItemDetailsUnion>;
    disabled: Scalars['Boolean']['output'];
    game: GameGame;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    inventoryItem: InventoryInventoryItem;
    name: Scalars['String']['output'];
    /** if the parent item is owned, this item is owned as well */
    parentItemId: Scalars['ID']['output'];
    season?: Maybe<GameSeason>;
    seasonId: Scalars['ID']['output'];
    type: ItemItemType;
    /** unlock_item_id what if any item is required to unlock this item for bundles and other consumption */
    unlockItemId: Scalars['ID']['output'];
};
export type ItemItemInventoryItemArgs = {
    user_id: Scalars['ID']['input'];
};
export type ItemItemBootstrap = {
    __typename?: 'ItemItemBootstrap';
    itemCount: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
    revision: Scalars['String']['output'];
};
export type ItemItemBootstrapInput = {
    itemCount?: InputMaybe<Scalars['Int']['input']>;
    itemId?: InputMaybe<Scalars['ID']['input']>;
    revision?: InputMaybe<Scalars['String']['input']>;
};
export type ItemItemCount = {
    __typename?: 'ItemItemCount';
    count: Scalars['Int']['output'];
    type: ItemItemType;
};
export type ItemItemDetailsUnion = AvatarAnimation | EmojiEmoji | GameLogicCard | GameLogicStreamerCard;
export type ItemItemStat = {
    __typename?: 'ItemItemStat';
    counts: Array<ItemItemCount>;
    gameId: Scalars['ID']['output'];
};
export type ItemItemTotalCount = {
    __typename?: 'ItemItemTotalCount';
    disabled: Scalars['Int']['output'];
    total: Scalars['Int']['output'];
};
export declare enum ItemItemType {
    TypeDailyGoalCardSlot = "TYPE_DAILY_GOAL_CARD_SLOT",
    TypeEmoji = "TYPE_EMOJI",
    TypeEmote = "TYPE_EMOTE",
    TypeGameCard = "TYPE_GAME_CARD",
    TypeStreamerCard = "TYPE_STREAMER_CARD",
    TypeSubscription = "TYPE_SUBSCRIPTION",
    TypeUnlock = "TYPE_UNLOCK",
    TypeUnspecified = "TYPE_UNSPECIFIED"
}
export type ItemListItemsRequestFilterAttributeInput = {
    name?: InputMaybe<Scalars['String']['input']>;
    value?: InputMaybe<AttributeAttributeInput>;
};
export type ItemListItemsRequestFilterInput = {
    attribute?: InputMaybe<ItemListItemsRequestFilterAttributeInput>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    itemType?: InputMaybe<ItemItemType>;
    parentId?: InputMaybe<Scalars['ID']['input']>;
    seasonId?: InputMaybe<Scalars['ID']['input']>;
};
export type ItemListItemsResponse = {
    __typename?: 'ItemListItemsResponse';
    count?: Maybe<ItemItemTotalCount>;
    items: Array<ItemItem>;
    pageInfo: ApiPageInfo;
};
export type MatchGetGroupChatIdResponse = {
    __typename?: 'MatchGetGroupChatIDResponse';
    chatId: Scalars['ID']['output'];
};
export type MatchGetGroupStateResponse = {
    __typename?: 'MatchGetGroupStateResponse';
    runnerState: GameStateGroupRunnerState;
    /** @deprecated field is deprecated */
    state: GameStateGroupState;
};
export type MatchGetMatchStateResponse = {
    __typename?: 'MatchGetMatchStateResponse';
    matchState: GameLogicStreamStateMatchState;
};
export type MatchGetStreamStateResponse = {
    __typename?: 'MatchGetStreamStateResponse';
    gameConfig: GameStateGameConfig;
    groups: Array<Scalars['String']['output']>;
    highScoringCard: GameStateHighScoringCardState;
    started: Scalars['Boolean']['output'];
    streamGroupsTracker: GameStateStreamGroupsTrackerState;
    streamInfo: StreamInfoStreamInfo;
    streamTracker: GameStateStreamTrackerState;
};
export type MatchStreamSpectatorChangeGroupEvent = {
    __typename?: 'MatchStreamSpectatorChangeGroupEvent';
    groupId: Scalars['ID']['output'];
};
export type MatchStreamSpectatorCoordinationEvent = {
    __typename?: 'MatchStreamSpectatorCoordinationEvent';
    event?: Maybe<MatchStreamSpectatorCoordinationEventEventUnion>;
};
export type MatchStreamSpectatorCoordinationEventEventUnion = MatchStreamSpectatorChangeGroupEvent;
export type MediaBatchGetMediaUrlResponse = {
    __typename?: 'MediaBatchGetMediaURLResponse';
    urls: Array<Scalars['String']['output']>;
};
export type MediaMediaOptionsInput = {
    height?: InputMaybe<Scalars['Int']['input']>;
    width?: InputMaybe<Scalars['Int']['input']>;
};
export declare enum ModerationAppealStatus {
    AppealStatusAccepted = "APPEAL_STATUS_ACCEPTED",
    AppealStatusDeclined = "APPEAL_STATUS_DECLINED",
    AppealStatusPending = "APPEAL_STATUS_PENDING",
    AppealStatusUnspecified = "APPEAL_STATUS_UNSPECIFIED"
}
export declare enum ModerationBanStatus {
    BanStatusActive = "BAN_STATUS_ACTIVE",
    BanStatusInactive = "BAN_STATUS_INACTIVE",
    BanStatusUnspecified = "BAN_STATUS_UNSPECIFIED"
}
export type ModerationListPlatformBanAppealsResponse = {
    __typename?: 'ModerationListPlatformBanAppealsResponse';
    appeals: Array<ModerationPlatformBanAppeal>;
    pageInfo: ApiPageInfo;
};
export type ModerationPlatformBan = {
    __typename?: 'ModerationPlatformBan';
    appeal?: Maybe<ModerationPlatformBanAppeal>;
    appealApproved: Scalars['Boolean']['output'];
    banId: Scalars['ID']['output'];
    bannedAt: Scalars['Timestamp']['output'];
    description: Scalars['String']['output'];
    expiresAt?: Maybe<Scalars['Timestamp']['output']>;
    moderator: ProfileProfile;
    moderatorId: Scalars['ID']['output'];
    status: ModerationBanStatus;
    unbannedAt?: Maybe<Scalars['Timestamp']['output']>;
    unbannedBy: Scalars['String']['output'];
    userId: Scalars['ID']['output'];
    violation: ModerationViolation;
};
export type ModerationPlatformBanAppeal = {
    __typename?: 'ModerationPlatformBanAppeal';
    appealText: Scalars['String']['output'];
    ban: ModerationPlatformBan;
    banId: Scalars['ID']['output'];
    closedAt?: Maybe<Scalars['Timestamp']['output']>;
    createdAt: Scalars['Timestamp']['output'];
    reviewer?: Maybe<ProfileProfile>;
    reviewerComment: Scalars['String']['output'];
    reviewerId: Scalars['ID']['output'];
    status: ModerationAppealStatus;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type ModerationPlatformUserBannedNotification = {
    __typename?: 'ModerationPlatformUserBannedNotification';
    bannedAt: Scalars['Timestamp']['output'];
    description: Scalars['String']['output'];
    expiresAt?: Maybe<Scalars['Timestamp']['output']>;
    userId: Scalars['ID']['output'];
    violation: ModerationViolation;
};
export declare enum ModerationViolation {
    ViolationChildSafety = "VIOLATION_CHILD_SAFETY",
    ViolationCircumventionEvasion = "VIOLATION_CIRCUMVENTION_EVASION",
    ViolationExtremism = "VIOLATION_EXTREMISM",
    ViolationGraphicRealWorldMedia = "VIOLATION_GRAPHIC_REAL_WORLD_MEDIA",
    ViolationHarassmentTargetedAbuse = "VIOLATION_HARASSMENT_TARGETED_ABUSE",
    ViolationHatefulBehavior = "VIOLATION_HATEFUL_BEHAVIOR",
    ViolationIllegalHarmfulAndRestrictedActivity = "VIOLATION_ILLEGAL_HARMFUL_AND_RESTRICTED_ACTIVITY",
    ViolationOffPlatformBehavior = "VIOLATION_OFF_PLATFORM_BEHAVIOR",
    ViolationOther = "VIOLATION_OTHER",
    ViolationPlatformManipulation = "VIOLATION_PLATFORM_MANIPULATION",
    ViolationRepeatedCopyrightInfringement = "VIOLATION_REPEATED_COPYRIGHT_INFRINGEMENT",
    ViolationResponsibleStreaming = "VIOLATION_RESPONSIBLE_STREAMING",
    ViolationRestrictedGamesAndGamesWithGraphicFootage = "VIOLATION_RESTRICTED_GAMES_AND_GAMES_WITH_GRAPHIC_FOOTAGE",
    ViolationSelfHarm = "VIOLATION_SELF_HARM",
    ViolationSexualBehavior = "VIOLATION_SEXUAL_BEHAVIOR",
    ViolationSpam = "VIOLATION_SPAM",
    ViolationUnspecified = "VIOLATION_UNSPECIFIED",
    ViolationViolence = "VIOLATION_VIOLENCE"
}
export type Mutation = {
    __typename?: 'Mutation';
    /** FriendsService.AcceptFriendRequest */
    acceptFriendRequest?: Maybe<FriendsAcceptFriendRequestResponse>;
    /** AuthServiceV4.AddOAuth2Consent */
    addOAuth2Consent?: Maybe<GoogleProtobufEmpty>;
    /** StreamerCardService.AddStreamerCard */
    addStreamerCard?: Maybe<GameLogicStreamerCard>;
    /** UserInventoryAdminService.AddEntitlements */
    addUserEntitlements?: Maybe<InventoryAddEntitlementsResponse>;
    /** WalletAdminService.AddCurrencies */
    addWalletCurrencies?: Maybe<WalletAddCurrenciesResponse>;
    /** ChatModerationService.AllowModerationItem */
    allowChatModerationItem?: Maybe<GoogleProtobufEmpty>;
    /** ChannelModerationService.BanUser */
    banChannelUser?: Maybe<GoogleProtobufEmpty>;
    /** PlatformModerationService.BanUser */
    banPlatformUser?: Maybe<GoogleProtobufEmpty>;
    /** NotificationService.BatchDeleteNotifications */
    batchDeleteNotifications?: Maybe<GoogleProtobufEmpty>;
    /** NotificationService.BatchMarkNotificationsRead */
    batchMarkNotificationsRead?: Maybe<GoogleProtobufEmpty>;
    /** FriendsService.BlockUser */
    blockUser?: Maybe<FriendsBlockUserResponse>;
    /** StoreServiceV2.BuyWithInGameCurrency */
    buyWithInGameCurrency?: Maybe<StoreV2BuyWithInGameCurrencyResponse>;
    /** StoreServiceV2.BuyWithPayment */
    buyWithPayment?: Maybe<StoreV2BuyWithPaymentResponse>;
    /** ChannelSubscriptionService.CancelSubscription */
    cancelChannelSubscription?: Maybe<GoogleProtobufEmpty>;
    /** PrivacyService.CancelDeletion */
    cancelDataDeletion?: Maybe<GoogleProtobufEmpty>;
    /** StoreServiceV2.CancelOrder */
    cancelOrder?: Maybe<GoogleProtobufEmpty>;
    /** ChannelSubscriptionService.CheckoutExistingSubscription */
    checkoutExistingChannelSubscription?: Maybe<SubscriptionCheckoutExistingSubscriptionResponse>;
    /** ChannelSubscriptionService.CheckoutNewSubscription */
    checkoutNewChannelSubscription?: Maybe<SubscriptionCheckoutNewSubscriptionResponse>;
    /** RewardService.ClaimReward */
    claimReward?: Maybe<RewardClaimRewardResponse>;
    /** ChatModerationService.ClearModerationItem */
    clearChatModerationItem?: Maybe<GoogleProtobufEmpty>;
    /** UserInventoryAdminService.ConsumeItem */
    consumeUserItem?: Maybe<InventoryConsumeItemResponse>;
    /** AuthAdminService.CreateAccount */
    createAccount?: Maybe<AuthAccount>;
    /** AnnouncementService.CreateAnnouncement */
    createAnnouncement?: Maybe<AnnouncementAnnouncement>;
    /** AnnouncementService.CreateAnnouncementImageUploadToken */
    createAnnouncementImageUploadToken?: Maybe<AnnouncementCreateAnnouncementImageUploadTokenResponse>;
    /** ChannelService.CreateChannel */
    createChannel?: Maybe<ChannelChannel>;
    /** ChannelService.CreateChannelAssetUploadToken */
    createChannelAssetUploadToken?: Maybe<ChannelCreateChannelAssetUploadTokenResponse>;
    /** ChannelModerationService.CreateBanAppeal */
    createChannelBanAppeal?: Maybe<GoogleProtobufEmpty>;
    /** ChannelEmojiService.CreateChannelEmoji */
    createChannelEmoji?: Maybe<EmojiEmoji>;
    /**
     * EmojiService.CreateEmoji
     * @deprecated field is deprecated
     */
    createEmoji?: Maybe<EmojiEmoji>;
    /** EmojiService.CreateEmojiUploadToken */
    createEmojiUploadToken?: Maybe<EmojiCreateEmojiUploadTokenResponse>;
    /** StreamIngestConfigService.CreateIngestConfigs */
    createIngestConfigs?: Maybe<StreamIngestConfigChannelIngestConfigs>;
    /** InvitationService.CreateInvitationCodes */
    createInvitationCodes?: Maybe<InvitationCreateInvitationCodesResponse>;
    /** ItemService.CreateItemBootstrap */
    createItemBootstrap?: Maybe<GoogleProtobufEmpty>;
    /** PartyService.CreateParty */
    createParty?: Maybe<PartyParty>;
    /** PartyService.CreatePartyInvitation */
    createPartyInvitation?: Maybe<PartyPartyInvitation>;
    /** PartyService.CreatePartyMember */
    createPartyMember?: Maybe<GoogleProtobufEmpty>;
    /** PlatformModerationService.CreateUserPlatformBanAppeal */
    createPlatformBanAppeal?: Maybe<GoogleProtobufEmpty>;
    /** PlatformEmojiService.CreatePlatformEmoji */
    createPlatformEmoji?: Maybe<EmojiEmoji>;
    /** SupportService.CreateReport */
    createReport?: Maybe<SupportReport>;
    /** ChannelConfigService.CreateStreamBackendConfig */
    createStreamBackendConfig?: Maybe<ChannelStreamBackendConfig>;
    /** StreamerCardService.CreateStreamerCardAssetUploadToken */
    createStreamerCardAssetUploadToken?: Maybe<GameCardCreateStreamerCardAssetUploadTokenResponse>;
    /** StreamerCardService.CreateStreamerCardDraft */
    createStreamerCardDraft?: Maybe<GameLogicStreamerCard>;
    /** StoreServiceV2.CreateStreamerCardSaleConfig */
    createStreamerCardSaleConfig?: Maybe<StoreV2StreamerCardSaleConfig>;
    /** SupportService.CreateTicket */
    createSupportTicket?: Maybe<GoogleProtobufEmpty>;
    /** AnnouncementService.DeleteAnnouncement */
    deleteAnnouncement?: Maybe<GoogleProtobufEmpty>;
    /** AnnouncementService.DeleteAnnouncementImage */
    deleteAnnouncementImage?: Maybe<GoogleProtobufEmpty>;
    /** ChannelService.DeleteChannel */
    deleteChannel?: Maybe<GoogleProtobufEmpty>;
    /** ChannelService.DeleteChannelAsset */
    deleteChannelAsset?: Maybe<GoogleProtobufEmpty>;
    /** ChannelEmojiService.DeleteChannelEmoji */
    deleteChannelEmoji?: Maybe<GoogleProtobufEmpty>;
    /** FTUEService.DeleteDismissedTooltip */
    deleteDismissedTooltip?: Maybe<GoogleProtobufEmpty>;
    /**
     * EmojiService.DeleteEmoji
     * @deprecated field is deprecated
     */
    deleteEmoji?: Maybe<GoogleProtobufEmpty>;
    /** AuthServiceV4.DeleteExternalAccount */
    deleteExternalAccount?: Maybe<GoogleProtobufEmpty>;
    /** StreamIngestConfigService.DeleteIngestConfigs */
    deleteIngestConfigs?: Maybe<GoogleProtobufEmpty>;
    /** NotificationService.DeleteNotification */
    deleteNotification?: Maybe<GoogleProtobufEmpty>;
    /** AuthServiceV4.DeleteOAuth2Consent */
    deleteOAuth2Consent?: Maybe<GoogleProtobufEmpty>;
    /** PartyService.DeletePartyInvitation */
    deletePartyInvitation?: Maybe<GoogleProtobufEmpty>;
    /** PartyService.DeletePartyMember */
    deletePartyMember?: Maybe<GoogleProtobufEmpty>;
    /** PlatformEmojiService.DeletePlatformEmoji */
    deletePlatformEmoji?: Maybe<GoogleProtobufEmpty>;
    /** ChannelConfigService.DeleteStreamBackendConfig */
    deleteStreamBackendConfig?: Maybe<GoogleProtobufEmpty>;
    /** StreamerCardService.DeleteStreamerCardDraft */
    deleteStreamerCardDraft?: Maybe<GoogleProtobufEmpty>;
    /** PrivacyService.DeleteUserData */
    deleteUserData?: Maybe<PrivacyDeleteUserDataResponse>;
    /** WaitlistService.DeleteWaitlistUser */
    deleteWaitlistUser?: Maybe<GoogleProtobufEmpty>;
    /** ChatModerationService.DenyModerationItem */
    denyChatModerationItem?: Maybe<GoogleProtobufEmpty>;
    /** FTUEService.DismissTooltip */
    dismissTooltip?: Maybe<GoogleProtobufEmpty>;
    /** PrivacyService.ExportUserData */
    exportUserData?: Maybe<PrivacyExportUserDataResponse>;
    /** ChannelService.FollowChannel - Following APIs */
    followChannel?: Maybe<GoogleProtobufEmpty>;
    /** ChatModerationService.HideChatMessage */
    hideChatMessage?: Maybe<GoogleProtobufEmpty>;
    /** NotificationService.MarkNotificationRead */
    markNotificationRead?: Maybe<NotificationNotification>;
    /** MLControllerService.TriggerMatchEnd */
    mlTriggerMatchEnd?: Maybe<GoogleProtobufEmpty>;
    /** ChatModerationService.MuteChatUser */
    muteChatUser?: Maybe<GoogleProtobufEmpty>;
    /** StreamerCardService.PublishStreamerCardDraft */
    publishStreamerCardDraft?: Maybe<GoogleProtobufEmpty>;
    /** ChannelSubscriptionService.ReactivateSubscription */
    reactivateChannelSubscription?: Maybe<GoogleProtobufEmpty>;
    /** StreamIngestConfigService.RefreshIngestConfigs */
    refreshIngestConfigs?: Maybe<StreamIngestConfigChannelIngestConfigs>;
    /** FriendsService.DeleteFriend */
    removeFriend?: Maybe<GoogleProtobufEmpty>;
    /** FriendsService.DeleteFriendRequest */
    removeFriendRequest?: Maybe<GoogleProtobufEmpty>;
    /** GoalCardService.ReshuffleSlot */
    reshuffleGoalCardSlot?: Maybe<GoalCardReshuffleSlotResponse>;
    /** PlacementsService.RewardPlacement */
    rewardPlacement?: Maybe<GoogleProtobufEmpty>;
    /** ChannelConfigService.SelectStreamBackendConfig */
    selectStreamBackendConfig?: Maybe<GoogleProtobufEmpty>;
    /** ChatService.SendChatMessage */
    sendChatMessage?: Maybe<ChatSendMessageResponse>;
    /** FriendsService.SendFriendRequest */
    sendFriendRequest?: Maybe<FriendsSendFriendRequestResponse>;
    /** AuthServiceV4.SetBirthday */
    setBirthday?: Maybe<GoogleProtobufEmpty>;
    /** FeatureFlagService.SetFeatureFlagConfig */
    setFeatureFlagConfig?: Maybe<FlagFeatureFlagConfig>;
    /** GoalCardService.SetGoalCardSlot */
    setGoalCardSlot?: Maybe<GoalCardSetGoalCardSlotResponse>;
    /** ChannelService.SetUserChannelRoles */
    setUserChannelRoles?: Maybe<GoogleProtobufEmpty>;
    /** AuthServiceV4.SignAgreements */
    signAgreements?: Maybe<GoogleProtobufEmpty>;
    /** StreamerService.ActivateContextualTeamAction */
    streamerActivateContextualTeamAction?: Maybe<StreamerActivateContextualTeamActionResponse>;
    /** StreamerService.TriggerCameraTransition */
    streamerTriggerCameraTransition?: Maybe<StreamerTriggerCameraTransitionResponse>;
    /** WalletAdminService.SubtractCurrencies */
    subtractWalletCurrencies?: Maybe<WalletSubtractCurrenciesResponse>;
    /** ChannelModerationService.SuspendChannelFeature */
    suspendChannelFeature?: Maybe<GoogleProtobufEmpty>;
    /** ChannelModerationService.UnbanUser */
    unbanChannelUser?: Maybe<GoogleProtobufEmpty>;
    /** PlatformModerationService.UnbanUser */
    unbanPlatformUser?: Maybe<GoogleProtobufEmpty>;
    /** FriendsService.UnblockUser */
    unblockUser?: Maybe<FriendsUnblockUserResponse>;
    /** ChannelService.UnfollowChannel */
    unfollowChannel?: Maybe<GoogleProtobufEmpty>;
    /** ChannelModerationService.UnsuspendChannelFeature */
    unsuspendChannelFeature?: Maybe<GoogleProtobufEmpty>;
    /** AuthAdminService.UpdateAccount */
    updateAccount?: Maybe<AuthAccount>;
    /** AnnouncementService.UpdateAnnouncement */
    updateAnnouncement?: Maybe<AnnouncementAnnouncement>;
    /** AvatarService.UpdateAvatar */
    updateAvatar?: Maybe<AvatarAvatar>;
    /** ChannelModerationService.UpdateBanAppeal */
    updateChannelBanAppeal?: Maybe<GoogleProtobufEmpty>;
    /** ChannelService.UpdateChannelDetails */
    updateChannelDetails?: Maybe<ChannelChannel>;
    /** ChannelEmojiService.UpdateChannelEmoji */
    updateChannelEmoji?: Maybe<EmojiEmoji>;
    /** ChannelModerationService.UpdateModerationSettings */
    updateChannelModerationSettings?: Maybe<ChannelModerationSettings>;
    /** ChannelSubscriptionService.UpdateChannelSubscriptionConfig */
    updateChannelSubscriptionConfig?: Maybe<SubscriptionChannelSubscriptionConfig>;
    /** WaitlistService.UpdateChannelWaitlistSettings */
    updateChannelWaitlistSettings?: Maybe<GoogleProtobufEmpty>;
    /**
     * EmojiService.UpdateEmoji
     * @deprecated field is deprecated
     */
    updateEmoji?: Maybe<EmojiEmoji>;
    /** FriendsService.UpdateFriendsSettings */
    updateFriendsSettings?: Maybe<FriendsFriendsSettings>;
    /** ItemService.UpdateItemBootstrap */
    updateItemBootstrap?: Maybe<GoogleProtobufEmpty>;
    /** AuthServiceV4.UpdateMarketingConsent */
    updateMarketingConsent?: Maybe<GoogleProtobufEmpty>;
    /** PlatformModerationService.UpdatePlatformBanAppeal */
    updatePlatformBanAppeal?: Maybe<GoogleProtobufEmpty>;
    /** PlatformEmojiService.UpdatePlatformEmoji */
    updatePlatformEmoji?: Maybe<EmojiEmoji>;
    /** ProfileService.UpdatePrivacySettings */
    updatePrivacySettings?: Maybe<ProfilePrivacySettings>;
    /** ProfileService.UpdateProfile */
    updateProfile?: Maybe<ProfileProfile>;
    /** ProfileService.UpdateProfileAvatar */
    updateProfileAvatar?: Maybe<GoogleProtobufEmpty>;
    /** ProfileService.UpdateProfileAvatarV2 */
    updateProfileAvatarV2?: Maybe<AvatarAvatar>;
    /** ChannelConfigService.UpdateRestreamingConfig */
    updateRestreamingConfig?: Maybe<ChannelRestreamingConfig>;
    /** ChannelConfigService.UpdateStreamBackendConfig */
    updateStreamBackendConfig?: Maybe<ChannelStreamBackendConfig>;
    /** StreamerCardService.UpdateStreamerCardDraft */
    updateStreamerCardDraft?: Maybe<GameLogicStreamerCard>;
    /** StoreServiceV2.UpdateStreamerCardSaleConfig */
    updateStreamerCardSaleConfig?: Maybe<StoreV2StreamerCardSaleConfig>;
    /** ChannelSubscriptionService.UpdateSubscriptionPaymentMethod - protolint:disable:next MAX_LINE_LENGTH */
    updateSubscriptionPaymentMethod?: Maybe<SubscriptionUpdateSubscriptionPaymentMethodResponse>;
    /** InvitationService.UseInvitationCode */
    useInvitationCode?: Maybe<GoogleProtobufEmpty>;
    /** AvatarService.ValidateAvatarComposition */
    validateAvatarComposition?: Maybe<AvatarValidateAvatarCompositionResponse>;
};
export type MutationAcceptFriendRequestArgs = {
    friendId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationAddOAuth2ConsentArgs = {
    clientId?: InputMaybe<Scalars['ID']['input']>;
    scopes?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationAddStreamerCardArgs = {
    streamerCard?: InputMaybe<GameLogicStreamerCardInput>;
};
export type MutationAddUserEntitlementsArgs = {
    entitlements?: InputMaybe<Array<InventoryItemEntitlementInput>>;
    reason?: InputMaybe<ReasonReasonInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationAddWalletCurrenciesArgs = {
    currencies?: InputMaybe<Array<WalletWalletCurrencyInput>>;
    reason?: InputMaybe<ReasonReasonInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationAllowChatModerationItemArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    moderationItemId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationBanChannelUserArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    keepRecentMessages?: InputMaybe<Scalars['Boolean']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
    violation?: InputMaybe<ChannelViolation>;
};
export type MutationBanPlatformUserArgs = {
    description?: InputMaybe<Scalars['String']['input']>;
    duration?: InputMaybe<Scalars['Duration']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
    violation?: InputMaybe<ModerationViolation>;
};
export type MutationBatchDeleteNotificationsArgs = {
    notificationIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type MutationBatchMarkNotificationsReadArgs = {
    notificationIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type MutationBlockUserArgs = {
    blockedUserId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationBuyWithInGameCurrencyArgs = {
    currencyId?: InputMaybe<Scalars['ID']['input']>;
    itemId?: InputMaybe<Scalars['ID']['input']>;
    signature?: InputMaybe<Scalars['String']['input']>;
};
export type MutationBuyWithPaymentArgs = {
    itemId?: InputMaybe<Scalars['ID']['input']>;
    signature?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCancelChannelSubscriptionArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCancelDataDeletionArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCancelOrderArgs = {
    orderId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCheckoutExistingChannelSubscriptionArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCheckoutNewChannelSubscriptionArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    tier?: InputMaybe<Scalars['Int']['input']>;
};
export type MutationClaimRewardArgs = {
    rewardId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationClearChatModerationItemArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    moderationItemId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationConsumeUserItemArgs = {
    consumptions?: InputMaybe<Array<InventoryItemConsumptionInput>>;
    reason?: InputMaybe<ReasonReasonInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateAccountArgs = {
    displayName?: InputMaybe<Scalars['String']['input']>;
    email?: InputMaybe<Scalars['String']['input']>;
    isBot?: InputMaybe<Scalars['Boolean']['input']>;
    username?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateAnnouncementArgs = {
    category?: InputMaybe<AnnouncementAnnouncementCategory>;
    endTime?: InputMaybe<Scalars['Timestamp']['input']>;
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    published?: InputMaybe<Scalars['Boolean']['input']>;
    startTime?: InputMaybe<Scalars['Timestamp']['input']>;
    targets?: InputMaybe<AnnouncementTargetsInput>;
    text?: InputMaybe<Scalars['String']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateAnnouncementImageUploadTokenArgs = {
    announcementId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateChannelArgs = {
    name?: InputMaybe<Scalars['String']['input']>;
    streamerId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateChannelAssetUploadTokenArgs = {
    assetType?: InputMaybe<ChannelAssetType>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateChannelBanAppealArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    text?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateChannelEmojiArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateEmojiArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    label?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    prefabName?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateEmojiUploadTokenArgs = {
    itemId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateIngestConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateInvitationCodesArgs = {
    amount?: InputMaybe<Scalars['Int']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateItemBootstrapArgs = {
    bootstrap?: InputMaybe<ItemItemBootstrapInput>;
};
export type MutationCreatePartyArgs = {
    inviteeIds?: InputMaybe<Array<Scalars['String']['input']>>;
    leaderId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreatePartyInvitationArgs = {
    inviteeId?: InputMaybe<Scalars['ID']['input']>;
    inviterId?: InputMaybe<Scalars['ID']['input']>;
    partyId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreatePartyMemberArgs = {
    partyId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreatePlatformBanAppealArgs = {
    appealText?: InputMaybe<Scalars['String']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreatePlatformEmojiArgs = {
    label?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateReportArgs = {
    context?: InputMaybe<SupportReportContextInput>;
    description?: InputMaybe<Scalars['String']['input']>;
    reason?: InputMaybe<SupportReportReason>;
};
export type MutationCreateStreamBackendConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    crConfig?: InputMaybe<ChannelContentRendererConfigInput>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    mlConfig?: InputMaybe<ChannelMachineLearningConfigInput>;
    recConfig?: InputMaybe<ChannelStreamRecorderConfigInput>;
};
export type MutationCreateStreamerCardAssetUploadTokenArgs = {
    assetType?: InputMaybe<GameCardAssetType>;
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationCreateStreamerCardDraftArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    familyId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};
export type MutationCreateStreamerCardSaleConfigArgs = {
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    enabled?: InputMaybe<Scalars['Boolean']['input']>;
    excludeFromBundles?: InputMaybe<Scalars['Boolean']['input']>;
    period?: InputMaybe<StoreV2PeriodInput>;
};
export type MutationCreateSupportTicketArgs = {
    description?: InputMaybe<Scalars['String']['input']>;
    subject?: InputMaybe<Scalars['String']['input']>;
};
export type MutationDeleteAnnouncementArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteAnnouncementImageArgs = {
    announcementId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteChannelArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteChannelAssetArgs = {
    assetType?: InputMaybe<ChannelAssetType>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteChannelEmojiArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteDismissedTooltipArgs = {
    tooltipId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteEmojiArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteExternalAccountArgs = {
    idType?: InputMaybe<AuthIdentityType>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteIngestConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteNotificationArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteOAuth2ConsentArgs = {
    clientId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeletePartyInvitationArgs = {
    partyId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeletePartyMemberArgs = {
    partyId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeletePlatformEmojiArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteStreamBackendConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteStreamerCardDraftArgs = {
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteUserDataArgs = {
    gracePeriod?: InputMaybe<Scalars['Duration']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDeleteWaitlistUserArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDenyChatModerationItemArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    moderationItemId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationDismissTooltipArgs = {
    dismissalType?: InputMaybe<FtueDismissalType>;
    tooltipId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationFollowChannelArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationHideChatMessageArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    messageId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationMarkNotificationReadArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationMlTriggerMatchEndArgs = {
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationMuteChatUserArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    duration?: InputMaybe<Scalars['Duration']['input']>;
    reason?: InputMaybe<ChatReason>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationPublishStreamerCardDraftArgs = {
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationReactivateChannelSubscriptionArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationRefreshIngestConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationRemoveFriendArgs = {
    friendId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationRemoveFriendRequestArgs = {
    friendId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationReshuffleGoalCardSlotArgs = {
    slotId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationRewardPlacementArgs = {
    placementId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSelectStreamBackendConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    configId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSendChatMessageArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    consentToModeration?: InputMaybe<Scalars['Boolean']['input']>;
    content?: InputMaybe<ChatMessageContentInput>;
};
export type MutationSendFriendRequestArgs = {
    friendId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSetBirthdayArgs = {
    birthday?: InputMaybe<AuthDateInput>;
};
export type MutationSetFeatureFlagConfigArgs = {
    config?: InputMaybe<FlagFeatureFlagConfigInput>;
    previousRevision?: InputMaybe<Scalars['String']['input']>;
    validateSchema?: InputMaybe<Scalars['Boolean']['input']>;
};
export type MutationSetGoalCardSlotArgs = {
    goalCardId?: InputMaybe<Scalars['ID']['input']>;
    goalCardSlotId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSetUserChannelRolesArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    roles?: InputMaybe<Array<ChannelChannelRole>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSignAgreementsArgs = {
    agreements?: InputMaybe<Array<AuthTermsVersionInput>>;
};
export type MutationStreamerActivateContextualTeamActionArgs = {
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationStreamerTriggerCameraTransitionArgs = {
    cameraTransitionTarget?: InputMaybe<RenderingCameraTransitionRequestTransitionTarget>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSubtractWalletCurrenciesArgs = {
    currencies?: InputMaybe<Array<WalletWalletCurrencyInput>>;
    reason?: InputMaybe<ReasonReasonInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationSuspendChannelFeatureArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    duration?: InputMaybe<Scalars['Duration']['input']>;
    feature?: InputMaybe<ChannelChannelFeature>;
    reason?: InputMaybe<ChannelSuspensionReason>;
};
export type MutationUnbanChannelUserArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUnbanPlatformUserArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUnblockUserArgs = {
    blockedUserId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUnfollowChannelArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUnsuspendChannelFeatureArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    feature?: InputMaybe<ChannelChannelFeature>;
};
export type MutationUpdateAccountArgs = {
    body?: InputMaybe<AuthAccountUpdateInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateAnnouncementArgs = {
    body?: InputMaybe<AnnouncementAnnouncementInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateAvatarArgs = {
    body?: InputMaybe<AvatarAvatarInput>;
};
export type MutationUpdateChannelBanAppealArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    status?: InputMaybe<ChannelAppealStatus>;
    text?: InputMaybe<Scalars['String']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUpdateChannelDetailsArgs = {
    body?: InputMaybe<ChannelChannelDetailsUpdateInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateChannelEmojiArgs = {
    body?: InputMaybe<EmojiUpdateChannelEmojiParamsInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateChannelModerationSettingsArgs = {
    body?: InputMaybe<ChannelModerationSettingsInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateChannelSubscriptionConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    subscriptionsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};
export type MutationUpdateChannelWaitlistSettingsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    maxSignupsPerStream?: InputMaybe<Scalars['Int']['input']>;
    signupStreamDuration?: InputMaybe<Scalars['Duration']['input']>;
};
export type MutationUpdateEmojiArgs = {
    body?: InputMaybe<EmojiEmojiInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateFriendsSettingsArgs = {
    body?: InputMaybe<FriendsFriendsSettingsInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUpdateItemBootstrapArgs = {
    body?: InputMaybe<ItemItemBootstrapInput>;
};
export type MutationUpdateMarketingConsentArgs = {
    marketingConsent?: InputMaybe<AuthConsentStatus>;
};
export type MutationUpdatePlatformBanAppealArgs = {
    banId?: InputMaybe<Scalars['ID']['input']>;
    comment?: InputMaybe<Scalars['String']['input']>;
    status?: InputMaybe<ModerationAppealStatus>;
};
export type MutationUpdatePlatformEmojiArgs = {
    body?: InputMaybe<EmojiUpdatePlatformEmojiParamsInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdatePrivacySettingsArgs = {
    body?: InputMaybe<ProfilePrivacySettingsInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUpdateProfileArgs = {
    body?: InputMaybe<ProfileProfileUpdateInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateProfileAvatarArgs = {
    modelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUpdateProfileAvatarV2Args = {
    modelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type MutationUpdateRestreamingConfigArgs = {
    body?: InputMaybe<ChannelRestreamingConfigInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateStreamBackendConfigArgs = {
    body?: InputMaybe<ChannelStreamBackendConfigInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateStreamerCardDraftArgs = {
    body?: InputMaybe<GameCardStreamerCardDraftUpdateInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUpdateStreamerCardSaleConfigArgs = {
    body?: InputMaybe<StoreV2StreamerCardSaleConfigUpdateInput>;
    updateMask?: InputMaybe<GoogleProtobufFieldMaskInput>;
};
export type MutationUseInvitationCodeArgs = {
    code?: InputMaybe<Scalars['String']['input']>;
};
export type MutationValidateAvatarCompositionArgs = {
    composition?: InputMaybe<AvatarAvatarCompositionInput>;
};
export type NotificationForcedSignoutEvent = {
    __typename?: 'NotificationForcedSignoutEvent';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type NotificationListNotificationsResponse = {
    __typename?: 'NotificationListNotificationsResponse';
    notifications: Array<NotificationNotification>;
};
export type NotificationNotification = {
    __typename?: 'NotificationNotification';
    content: NotificationNotificationContent;
    createdAt: Scalars['Timestamp']['output'];
    id: Scalars['ID']['output'];
    new: Scalars['Boolean']['output'];
    persisted: Scalars['Boolean']['output'];
};
export type NotificationNotificationContent = {
    __typename?: 'NotificationNotificationContent';
    content?: Maybe<NotificationNotificationContentContentUnion>;
};
export type NotificationNotificationContentContentUnion = AdsPlacementStateEvent | ChannelUserBannedNotification | FriendsFriendStatusUpdateEvent | GoalCardGoalCardSlot | IntType | InventoryInventoryUpdateEvent | InvitationInvitationCodeUpdateEvent | ModerationPlatformUserBannedNotification | NotificationForcedSignoutEvent | PartyPartyInvitationUpdateEvent | PrivacyUserDataExportCompleteEvent | ProgressionProgressionUpdateEvent | RewardReward | SubscriptionChannelSubscriptionUpdateEvent | WalletTransactionEvent;
export type PartyParty = {
    __typename?: 'PartyParty';
    channel?: Maybe<ChannelChannel>;
    id: Scalars['ID']['output'];
    leaderId: Scalars['ID']['output'];
    members: Array<PartyPartyMember>;
    name: Scalars['String']['output'];
    public: Scalars['Boolean']['output'];
    streamId: Scalars['ID']['output'];
};
export type PartyPartyInvitation = {
    __typename?: 'PartyPartyInvitation';
    inviteeId: Scalars['ID']['output'];
    inviterId: Scalars['ID']['output'];
    partyId: Scalars['ID']['output'];
};
export type PartyPartyInvitationUpdateEvent = {
    __typename?: 'PartyPartyInvitationUpdateEvent';
    partyInvitation: PartyPartyInvitation;
    type: PartyPartyInvitationUpdateEventUpdateType;
};
export declare enum PartyPartyInvitationUpdateEventUpdateType {
    UpdateTypeInvitationAccepted = "UPDATE_TYPE_INVITATION_ACCEPTED",
    UpdateTypeInvitationCreated = "UPDATE_TYPE_INVITATION_CREATED",
    UpdateTypeInvitationDeclined = "UPDATE_TYPE_INVITATION_DECLINED",
    UpdateTypeInvitationDeleted = "UPDATE_TYPE_INVITATION_DELETED",
    UpdateTypeUnspecified = "UPDATE_TYPE_UNSPECIFIED"
}
export type PartyPartyMember = {
    __typename?: 'PartyPartyMember';
    profile: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type PartyPartyUpdateEvent = {
    __typename?: 'PartyPartyUpdateEvent';
    party: PartyParty;
};
export type PaymentAmount = {
    __typename?: 'PaymentAmount';
    currency: PaymentCurrency;
    value: Scalars['Int']['output'];
};
export type PaymentAmountInput = {
    currency?: InputMaybe<PaymentCurrency>;
    value?: InputMaybe<Scalars['Int']['input']>;
};
export declare enum PaymentCurrency {
    CurrencyEur = "CURRENCY_EUR",
    CurrencyGbp = "CURRENCY_GBP",
    CurrencyUnspecified = "CURRENCY_UNSPECIFIED",
    CurrencyUsd = "CURRENCY_USD"
}
export type PaymentLineItem = {
    __typename?: 'PaymentLineItem';
    currency: PaymentCurrency;
    description: Scalars['String']['output'];
    price: Scalars['Int']['output'];
    quantity: Scalars['Int']['output'];
};
export type PaymentListSuccessfulPaymentsRequestFilterInput = {
    from?: InputMaybe<Scalars['InputTimestamp']['input']>;
    to?: InputMaybe<Scalars['InputTimestamp']['input']>;
};
export type PaymentListSuccessfulPaymentsResponse = {
    __typename?: 'PaymentListSuccessfulPaymentsResponse';
    pageInfo: ApiPageInfo;
    payments: Array<PaymentPayment>;
};
export type PaymentPayment = {
    __typename?: 'PaymentPayment';
    amount: PaymentAmount;
    externalReference: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    info: PaymentPaymentInfo;
    items: Array<PaymentLineItem>;
    meta: PaymentSessionMeta;
    status: PaymentPaymentStatus;
    tax: PaymentTax;
    timestamp: Scalars['Timestamp']['output'];
    userId: Scalars['ID']['output'];
};
export type PaymentPaymentInfo = {
    __typename?: 'PaymentPaymentInfo';
    cardHolderName: Scalars['String']['output'];
    cardIssuingCountry: Scalars['String']['output'];
    cardSummary: Scalars['String']['output'];
};
export declare enum PaymentPaymentStatus {
    PaymentStatusExpired = "PAYMENT_STATUS_EXPIRED",
    PaymentStatusFailed = "PAYMENT_STATUS_FAILED",
    PaymentStatusPending = "PAYMENT_STATUS_PENDING",
    PaymentStatusReversed = "PAYMENT_STATUS_REVERSED",
    PaymentStatusSuccess = "PAYMENT_STATUS_SUCCESS",
    PaymentStatusUnspecified = "PAYMENT_STATUS_UNSPECIFIED"
}
export type PaymentSession = {
    __typename?: 'PaymentSession';
    session?: Maybe<PaymentSessionSessionUnion>;
};
export type PaymentSessionMeta = {
    __typename?: 'PaymentSessionMeta';
    attributes: Array<PaymentSessionMetaAttributesEntry>;
    namespace: Scalars['String']['output'];
};
export type PaymentSessionMetaAttributesEntry = {
    __typename?: 'PaymentSessionMetaAttributesEntry';
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type PaymentSessionSessionUnion = AdyenSession;
export type PaymentTax = {
    __typename?: 'PaymentTax';
    amount?: Maybe<PaymentAmount>;
    rate: Scalars['Int']['output'];
};
export type PlayerStatsPlayerStats = {
    __typename?: 'PlayerStatsPlayerStats';
    adsWatched: Scalars['Int']['output'];
    boosterUsage?: Maybe<PlayerStatsPlayerStatsBoosterUsage>;
    cardBundlesPurchased: Scalars['Int']['output'];
    cardLevelUps: Scalars['Int']['output'];
    cardsPlayed: Scalars['Int']['output'];
    cardsSucceeded: Scalars['Int']['output'];
    currencySpending?: Maybe<PlayerStatsPlayerStatsCurrencySpending>;
    dailyGoalCardsCompleted: Scalars['Int']['output'];
    dailyGoalCardsSet: Scalars['Int']['output'];
    matchesPlayed: Scalars['Int']['output'];
    partyMatchesPlayed: Scalars['Int']['output'];
    shufflesUsed: Scalars['Int']['output'];
    soloMatchesPlayed: Scalars['Int']['output'];
    timePlayed?: Maybe<Scalars['Duration']['output']>;
};
export type PlayerStatsPlayerStatsBoosterUsage = {
    __typename?: 'PlayerStatsPlayerStatsBoosterUsage';
    doubt: Scalars['Int']['output'];
    goodCall: Scalars['Int']['output'];
    letsGo: Scalars['Int']['output'];
    nextUp: Scalars['Int']['output'];
    scavenge: Scalars['Int']['output'];
    speedUp: Scalars['Int']['output'];
    total: Scalars['Int']['output'];
};
export type PlayerStatsPlayerStatsCurrencySpending = {
    __typename?: 'PlayerStatsPlayerStatsCurrencySpending';
    channelCurrency: Scalars['Int']['output'];
    hardCurrency: Scalars['Int']['output'];
    softCurrency: Scalars['Int']['output'];
};
export type PrivacyDeleteUserDataResponse = {
    __typename?: 'PrivacyDeleteUserDataResponse';
    taskId: Scalars['ID']['output'];
};
export type PrivacyExportUserDataResponse = {
    __typename?: 'PrivacyExportUserDataResponse';
    taskId: Scalars['ID']['output'];
};
export type PrivacyUserDataExportCompleteEvent = {
    __typename?: 'PrivacyUserDataExportCompleteEvent';
    dataUrl: Scalars['String']['output'];
    taskId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type ProfileBatchGetProfilesResponse = {
    __typename?: 'ProfileBatchGetProfilesResponse';
    profiles: Array<ProfileProfile>;
};
export type ProfileListPlayedGamesResponse = {
    __typename?: 'ProfileListPlayedGamesResponse';
    games: Array<ProfilePlayedGame>;
    pageInfo: ApiPageInfo;
};
export type ProfileListProfilesResponse = {
    __typename?: 'ProfileListProfilesResponse';
    pageInfo: ApiPageInfo;
    profiles: Array<ProfileProfile>;
};
export type ProfilePlayedGame = {
    __typename?: 'ProfilePlayedGame';
    game: GameGame;
    id: Scalars['ID']['output'];
    lastPlayedAt: Scalars['Timestamp']['output'];
    progression: GameUserProgression;
    season: GameSeason;
    seasonId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export declare enum ProfilePresenceStatus {
    PresenceStatusOffline = "PRESENCE_STATUS_OFFLINE",
    PresenceStatusOnline = "PRESENCE_STATUS_ONLINE",
    PresenceStatusUnspecified = "PRESENCE_STATUS_UNSPECIFIED"
}
export type ProfilePrivacySettings = {
    __typename?: 'ProfilePrivacySettings';
    anonymisePurchaseHighlights: Scalars['Boolean']['output'];
    discordUsernameVisibility: ProfilePrivacySettingsVisibility;
    hideOnlineStatus: Scalars['Boolean']['output'];
    showMatureContentWarning: Scalars['Boolean']['output'];
    visibility: ProfilePrivacySettingsVisibility;
};
export type ProfilePrivacySettingsInput = {
    anonymisePurchaseHighlights?: InputMaybe<Scalars['Boolean']['input']>;
    discordUsernameVisibility?: InputMaybe<ProfilePrivacySettingsVisibility>;
    hideOnlineStatus?: InputMaybe<Scalars['Boolean']['input']>;
    showMatureContentWarning?: InputMaybe<Scalars['Boolean']['input']>;
    visibility?: InputMaybe<ProfilePrivacySettingsVisibility>;
};
export declare enum ProfilePrivacySettingsVisibility {
    VisibilityAll = "VISIBILITY_ALL",
    VisibilityFriends = "VISIBILITY_FRIENDS",
    VisibilityOnlyMe = "VISIBILITY_ONLY_ME",
    VisibilityUnspecified = "VISIBILITY_UNSPECIFIED"
}
/** Profile message contains user profile information */
export type ProfileProfile = {
    __typename?: 'ProfileProfile';
    account?: Maybe<AuthAccount>;
    avatarConfig?: Maybe<ProfileProfileAvatarConfig>;
    /**
     * contains a concatenated list of different avatar urls (use avatars object instead)
     * @deprecated field is deprecated
     */
    avatarUrl: Scalars['String']['output'];
    avatars?: Maybe<ProfileProfileAvatars>;
    badges: Array<BadgeBadge>;
    bio: Scalars['String']['output'];
    channel?: Maybe<ChannelChannel>;
    discordUsername?: Maybe<Scalars['String']['output']>;
    /** @deprecated field is deprecated */
    displayName: Scalars['String']['output'];
    friends: Array<ProfileProfile>;
    friendshipStatus: FriendsFriendshipStatus;
    lastSeen?: Maybe<Scalars['Timestamp']['output']>;
    onlineStatus: ProfilePresenceStatus;
    playedGames: Array<ProfilePlayedGame>;
    settings?: Maybe<ProfileProfileSettings>;
    state: ApiEntityState;
    stats: PlayerStatsPlayerStats;
    userId: Scalars['ID']['output'];
    userTag: Scalars['String']['output'];
    visibility: ProfileProfileVisibility;
};
/** Profile message contains user profile information */
export type ProfileProfileBadgesArgs = {
    channel_id?: InputMaybe<Scalars['ID']['input']>;
};
/** Profile message contains user profile information */
export type ProfileProfileStatsArgs = {
    season_id?: InputMaybe<Scalars['String']['input']>;
};
export type ProfileProfileAvatarConfig = {
    __typename?: 'ProfileProfileAvatarConfig';
    model: AvatarAvatar;
    modelId: Scalars['ID']['output'];
};
export type ProfileProfileAvatars = {
    __typename?: 'ProfileProfileAvatars';
    avatar2D: Scalars['String']['output'];
    avatar3D: Scalars['String']['output'];
    avatarFullbody: Scalars['String']['output'];
    avatarGender: Scalars['String']['output'];
};
export type ProfileProfileSettings = {
    __typename?: 'ProfileProfileSettings';
    friends: FriendsFriendsSettings;
    privacy: ProfilePrivacySettings;
};
export type ProfileProfileUpdateInput = {
    bio?: InputMaybe<Scalars['String']['input']>;
    discordUsername?: InputMaybe<Scalars['String']['input']>;
    /** @deprecated field is deprecated */
    displayName?: InputMaybe<Scalars['String']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
    userTag?: InputMaybe<Scalars['String']['input']>;
};
export declare enum ProfileProfileVisibility {
    ProfileVisibilityPrivate = "PROFILE_VISIBILITY_PRIVATE",
    ProfileVisibilityPublic = "PROFILE_VISIBILITY_PUBLIC",
    ProfileVisibilityUnspecified = "PROFILE_VISIBILITY_UNSPECIFIED"
}
export type ProfileResolveUserTagsResponse = {
    __typename?: 'ProfileResolveUserTagsResponse';
    profiles: Array<ProfileProfile>;
    userIds: Array<ProfileResolveUserTagsResponseUserIdsEntry>;
};
export type ProfileResolveUserTagsResponseUserIdsEntry = {
    __typename?: 'ProfileResolveUserTagsResponseUserIdsEntry';
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};
export type ProgressionBatchGetSeasonProgressionRequestQueryInput = {
    seasonId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type ProgressionBatchGetSeasonProgressionResponse = {
    __typename?: 'ProgressionBatchGetSeasonProgressionResponse';
    progression: Array<ProgressionSeasonProgression>;
};
export type ProgressionChannel = {
    __typename?: 'ProgressionChannel';
    channelId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type ProgressionExperiencePoints = {
    __typename?: 'ProgressionExperiencePoints';
    amount: Scalars['Int']['output'];
    target?: Maybe<ProgressionExperiencePointsTargetUnion>;
};
export type ProgressionExperiencePointsTargetUnion = ProgressionChannel | ProgressionFan | ProgressionSeason;
export type ProgressionFan = {
    __typename?: 'ProgressionFan';
    userId: Scalars['ID']['output'];
};
export type ProgressionGetDailyParticipationLimitResponse = {
    __typename?: 'ProgressionGetDailyParticipationLimitResponse';
    remainingDailyParticipationMinutes: Scalars['Int']['output'];
};
export type ProgressionGetDailyXpBoostLimitResponse = {
    __typename?: 'ProgressionGetDailyXPBoostLimitResponse';
    remainingDailyXpBoost: Scalars['Int']['output'];
};
export type ProgressionGetDailyXpEarningsLimitResponse = {
    __typename?: 'ProgressionGetDailyXPEarningsLimitResponse';
    remainingDailyXpEarningsMinutes: Scalars['Int']['output'];
};
export type ProgressionLevel = {
    __typename?: 'ProgressionLevel';
    number: Scalars['Int']['output'];
    target?: Maybe<ProgressionLevelTargetUnion>;
};
export type ProgressionLevelConfig = {
    __typename?: 'ProgressionLevelConfig';
    /**
     * channel_id is an optional configuration for channel loyalty related level
     *  configs
     */
    channelId: Scalars['ID']['output'];
    number: Scalars['Int']['output'];
    rewards: Array<RewardRewardType>;
    /** season_id is an optional configuration for season related level configs */
    seasonId: Scalars['ID']['output'];
    threshold: Scalars['Int']['output'];
};
export type ProgressionLevelTargetUnion = ProgressionChannel | ProgressionFan | ProgressionSeason;
export type ProgressionListLevelConfigsResponse = {
    __typename?: 'ProgressionListLevelConfigsResponse';
    levelConfigs: Array<ProgressionLevelConfig>;
};
export type ProgressionListSeasonProgressionResponse = {
    __typename?: 'ProgressionListSeasonProgressionResponse';
    progression: Array<ProgressionSeasonProgression>;
};
export type ProgressionProgressionUpdateEvent = {
    __typename?: 'ProgressionProgressionUpdateEvent';
    reason: ReasonReason;
    updates: Array<ProgressionProgressionUpdateEventUpdate>;
};
export type ProgressionProgressionUpdateEventUpdate = {
    __typename?: 'ProgressionProgressionUpdateEventUpdate';
    update?: Maybe<ProgressionProgressionUpdateEventUpdateUpdateUnion>;
};
export type ProgressionProgressionUpdateEventUpdateExperiencePointUpdate = {
    __typename?: 'ProgressionProgressionUpdateEventUpdateExperiencePointUpdate';
    newPoints: ProgressionExperiencePoints;
    oldPoints: ProgressionExperiencePoints;
};
export type ProgressionProgressionUpdateEventUpdateLevelUpdate = {
    __typename?: 'ProgressionProgressionUpdateEventUpdateLevelUpdate';
    newLevel: ProgressionLevel;
    oldLevel: ProgressionLevel;
};
export type ProgressionProgressionUpdateEventUpdateUpdateUnion = ProgressionProgressionUpdateEventUpdateExperiencePointUpdate | ProgressionProgressionUpdateEventUpdateLevelUpdate;
export type ProgressionSeason = {
    __typename?: 'ProgressionSeason';
    seasonId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type ProgressionSeasonProgression = {
    __typename?: 'ProgressionSeasonProgression';
    level: Scalars['Int']['output'];
    nextLevel: Scalars['Int']['output'];
    nextLevelThreshold: Scalars['Int']['output'];
    season: GameSeason;
    seasonId: Scalars['ID']['output'];
    xpAmount: Scalars['Int']['output'];
};
export type Query = {
    __typename?: 'Query';
    /** AgreementService.ListAgreements */
    agreements?: Maybe<AgreementListAgreementResponse>;
    /** AnnouncementService.ListAnnouncements */
    announcements?: Maybe<AnnouncementListAnnouncementsResponse>;
    /** ArenaService.GetArena */
    arena?: Maybe<ArenaArena>;
    /** ArenaService.ListArenas */
    arenas?: Maybe<ArenaListArenasResponse>;
    /** AvatarService.GetAvatar */
    avatar?: Maybe<AvatarAvatar>;
    /** AvatarAnimationService.GetAnimation */
    avatarAnimation?: Maybe<AvatarAnimation>;
    /** AvatarAnimationService.BatchGetAnimations */
    avatarAnimationBatch?: Maybe<AvatarBatchGetAnimationsResponse>;
    /** AvatarAnimationService.ListAnimations */
    avatarAnimations?: Maybe<AvatarListAnimationsResponse>;
    /** AvatarService.GetAvatarPart */
    avatarPart?: Maybe<AvatarAvatarPart>;
    /** AvatarService.ListAvatarParts */
    avatarParts?: Maybe<AvatarListAvatarPartsResponse>;
    /** AvatarService.BatchGetAvatarParts */
    avatarPartsBatch?: Maybe<AvatarBatchGetAvatarPartsResponse>;
    /** AvatarService.ListAvatars */
    avatars?: Maybe<AvatarListAvatarsResponse>;
    /** AvatarService.BatchGetAvatars */
    avatarsBatch?: Maybe<AvatarBatchGetAvatarsResponse>;
    /** ProgressionService.BatchGetSeasonProgression */
    batchGetSeasonProgression?: Maybe<ProgressionBatchGetSeasonProgressionResponse>;
    /** FriendsService.ListBlockedUsers */
    blockedUsers?: Maybe<FriendsListBlockedUsersResponse>;
    /** BoosterService.GetBooster */
    booster?: Maybe<GameLogicBooster>;
    /** BoosterService.ListBoosters */
    boosters?: Maybe<GameCardListBoostersResponse>;
    /** ChannelService.GetChannel */
    channel?: Maybe<ChannelChannel>;
    /** FriendsService.GetChannelActiveFriends */
    channelActiveFriends?: Maybe<FriendsGetChannelActiveFriendsResponse>;
    /** ChannelModerationService.ListBanAppeals */
    channelBanAppeals?: Maybe<ChannelListBanAppealsResponse>;
    /** ChannelModerationService.GetUserBanStatus */
    channelBanUserStatus?: Maybe<ChannelUserBanStatus>;
    /** ChannelModerationService.BatchGetUserBanStatus */
    channelBanUserStatuses?: Maybe<ChannelBatchGetUserBanStatusResponse>;
    /** ChannelModerationService.ListBannedUsers */
    channelBannedUsers?: Maybe<ChannelListBannedUsersResponse>;
    /** ChannelEmojiService.ListChannelEmojis */
    channelEmojis?: Maybe<EmojiListChannelEmojisResponse>;
    /** FeatureFlagService.GetChannelFeatureFlag */
    channelFeatureFlag?: Maybe<FlagFeatureFlagState>;
    /** FeatureFlagService.ListChannelFeatureFlags */
    channelFeatureFlags?: Maybe<FlagListChannelFeatureFlagsResponse>;
    /** ChannelModerationService.GetModerationSettings */
    channelModerationSettings?: Maybe<ChannelModerationSettings>;
    /** ChannelService.ListChannelPrivilegedUsers */
    channelPrivilegedUsers?: Maybe<ChannelListChannelPrivilegedUsersResponse>;
    /** StoreServiceV2.GetChannelStoreFront */
    channelStoreFront?: Maybe<StoreV2StoreFront>;
    /** ChannelSubscriptionService.GetChannelSubscriptionConfig */
    channelSubscriptionConfig?: Maybe<SubscriptionChannelSubscriptionConfig>;
    /** ChannelSubscriptionService.ListChannelSubscriptionTiers */
    channelSubscriptionTiers?: Maybe<SubscriptionListChannelSubscriptionTiersResponse>;
    /** WaitlistService.GetChannelWaitlistSettings */
    channelWaitlistSettings?: Maybe<WaitlistChannelWaitlistSettings>;
    /** ChannelService.ListChannels */
    channels?: Maybe<ChannelListChannelsResponse>;
    /** ChatService.ListMessages */
    chatMessages?: Maybe<ChatListMessagesResponse>;
    /** ChatModerationService.GetChatUserStatus */
    chatUserStatus?: Maybe<ChatGetChatUserStatusResponse>;
    /** ChatService.ListChatUsers */
    chatUsers?: Maybe<ChatListChatUsersResponse>;
    /** ProgressionService.GetDailyParticipationLimit */
    dailyParticipationLimit?: Maybe<ProgressionGetDailyParticipationLimitResponse>;
    /** ProgressionService.GetDailyXPBoostLimit */
    dailyXPBoostLimit?: Maybe<ProgressionGetDailyXpBoostLimitResponse>;
    /** ProgressionService.GetDailyXPEarningsLimit */
    dailyXPEarningsLimit?: Maybe<ProgressionGetDailyXpEarningsLimitResponse>;
    /** FTUEService.ListDismissedTooltips */
    dismissedTooltips?: Maybe<FtueListDismissedTooltipsResponse>;
    /** EmojiService.GetEmoji */
    emoji?: Maybe<EmojiEmoji>;
    /**
     * EmojiService.ListEmojis
     * @deprecated field is deprecated
     */
    emojis?: Maybe<EmojiListEmojisResponse>;
    /** EmojiService.BatchGetEmojis */
    emojisBatch?: Maybe<EmojiBatchGetEmojisResponse>;
    /** FeatureFlagService.GetFeatureFlagConfig */
    featureFlagConfig?: Maybe<FlagFeatureFlagConfig>;
    /** FeatureFlagService.GetFeatureFlagSchema */
    featureFlagSchema?: Maybe<FlagFeatureFlagSchema>;
    /** ChannelService.GetFollowStatus */
    followStatuses?: Maybe<ChannelGetFollowStatusResponse>;
    /** ChannelService.GetUserFollowedChannels */
    followedChannels?: Maybe<ChannelGetUserFollowedChannelsResponse>;
    /** FriendsService.ListFriends */
    friends?: Maybe<FriendsListFriendsResponse>;
    /** FriendsService.GetFriendshipStatus */
    friendshipStatuses?: Maybe<FriendsGetFriendshipStatusResponse>;
    /** GameService.GetGame */
    game?: Maybe<GameGame>;
    /** GameCardService.BatchGetGameCards */
    gameCards?: Maybe<GameCardBatchGetGameCardsResponse>;
    /** GameService.BatchGetGames */
    games?: Maybe<GameBatchGetGamesResponse>;
    /** ChannelService.BatchGetChannels */
    getChannels?: Maybe<ChannelBatchGetChannelsResponse>;
    /** ChannelService.BatchStreamGetChannel */
    getStreamChannels?: Maybe<ChannelBatchStreamGetChannelResponse>;
    /** GoalCardService.GetGoalCard */
    goalCard?: Maybe<GoalCardGoalCard>;
    /** GoalCardService.GetSlotOptions */
    goalCardSlotOptions?: Maybe<GoalCardGetSlotOptionsResponse>;
    /** GoalCardService.ListGoalCardSlots */
    goalCardSlots?: Maybe<GoalCardListGoalCardSlotsResponse>;
    /** GoalCardService.BatchGetGoalCards */
    goalCards?: Maybe<GoalCardBatchGetGoalCardsResponse>;
    /** StreamIngestConfigService.GetIngestConfig */
    ingestConfig?: Maybe<StreamIngestConfigChannelIngestConfig>;
    /** StreamIngestConfigService.ListIngestConfigs */
    ingestConfigs?: Maybe<StreamIngestConfigChannelIngestConfigs>;
    /** UserInventoryService.ListUserInventory */
    inventory?: Maybe<InventoryListUserInventoryResponse>;
    /** InvitationService.ListInvitationCodes */
    invitationCodes?: Maybe<InvitationListInvitationCodesResponse>;
    /** ItemService.GetItem */
    item?: Maybe<ItemGetItemResponse>;
    /** ItemService.ListItems */
    items?: Maybe<ItemListItemsResponse>;
    /** ItemService.BatchGetItems */
    itemsBatch?: Maybe<ItemBatchGetItemsResponse>;
    /** GameCardService.ListGameCards */
    listGameCards?: Maybe<GameCardListGameCardsResponse>;
    /** GameService.ListGames */
    listGames?: Maybe<GameListGamesResponse>;
    /** ProgressionService.ListLevelConfigs */
    listLevelConfigs?: Maybe<ProgressionListLevelConfigsResponse>;
    /** ProgressionService.ListSeasonProgression */
    listSeasonProgression?: Maybe<ProgressionListSeasonProgressionResponse>;
    /** GameService.ListSeasons */
    listSeasons?: Maybe<GameListSeasonsResponse>;
    /** MatchServiceV2.GetGroupChatID */
    matchGroupChatID?: Maybe<MatchGetGroupChatIdResponse>;
    /** MatchAdminService.GetGroupState */
    matchGroupState?: Maybe<MatchGetGroupStateResponse>;
    /** MatchServiceV2.GetMatchState */
    matchState?: Maybe<MatchGetMatchStateResponse>;
    /** MatchAdminService.GetStreamState */
    matchStreamState?: Maybe<MatchGetStreamStateResponse>;
    /** MediaService.BatchGetMediaUrl */
    mediaUrlsBatch?: Maybe<MediaBatchGetMediaUrlResponse>;
    /** ChannelModerationService.ListModerationEvents */
    moderationEvents?: Maybe<ChannelListModerationEventsResponse>;
    /** NotificationService.ListNotifications */
    notifications?: Maybe<NotificationListNotificationsResponse>;
    /** AuthServiceV4.GetOAuth2Consent */
    oauth2Consent?: Maybe<AuthV4GetOAuth2ConsentResponse>;
    /** PartyService.GetParty */
    party?: Maybe<PartyParty>;
    /** PaymentService.GetPayment */
    payment?: Maybe<PaymentPayment>;
    /** PlacementsService.GetPlacement */
    placement?: Maybe<AdsGetPlacementResponse>;
    /** PlatformModerationService.GetUserPlatformBan */
    platformBan?: Maybe<ModerationPlatformBan>;
    /** PlatformModerationService.ListPlatformBanAppeals */
    platformBanAppeals?: Maybe<ModerationListPlatformBanAppealsResponse>;
    /** PlatformEmojiService.ListPlatformEmojis */
    platformEmojis?: Maybe<EmojiListPlatformEmojisResponse>;
    /** StoreServiceV2.GetPlatformStoreFront */
    platformStoreFront?: Maybe<StoreV2StoreFront>;
    /** ProfileService.ListPlayedGames */
    playedGames?: Maybe<ProfileListPlayedGamesResponse>;
    /** ProfileService.GetProfile - Returns user profiles based on a given userID */
    profile?: Maybe<ProfileProfile>;
    /** ProfileService.BatchGetProfiles */
    profileBatch?: Maybe<ProfileBatchGetProfilesResponse>;
    /** ProfileService.ListProfiles */
    profiles?: Maybe<ProfileListProfilesResponse>;
    /** FriendsService.ListReceivedFriendRequests */
    receivedFriendRequests?: Maybe<FriendsListReceivedFriendRequestsResponse>;
    /** SupportService.GetReportCase */
    reportCase?: Maybe<SupportReportCase>;
    /** SupportService.ListReports */
    reports?: Maybe<SupportListReportsResponse>;
    /** ProfileService.ResolveUserTags */
    resolveUserTags?: Maybe<ProfileResolveUserTagsResponse>;
    /** ChannelConfigService.GetRestreamingConfig */
    restreamingConfig?: Maybe<ChannelRestreamingConfig>;
    /** RewardService.ListRewards */
    rewards?: Maybe<RewardListRewardsResponse>;
    /** SearchService.Search */
    search?: Maybe<SearchSearchResponse>;
    /** GameService.GetSeason */
    season?: Maybe<GameSeason>;
    /** ProgressionService.GetSeasonProgression */
    seasonProgression?: Maybe<ProgressionSeasonProgression>;
    /** GameService.BatchGetSeasons */
    seasons?: Maybe<GameBatchGetSeasonsResponse>;
    /** ChannelConfigService.GetSelectedStreamBackendConfig */
    selectedStreamBackendConfig?: Maybe<ChannelStreamBackendConfig>;
    /** StoreServiceV2.GetSellableItem */
    sellableItem?: Maybe<StoreV2SellableItem>;
    /** FriendsService.ListSentFriendRequests */
    sentFriendRequests?: Maybe<FriendsListSentFriendRequestsResponse>;
    /** ChannelService.GetStream */
    stream?: Maybe<ChannelStream>;
    /** ChannelConfigService.GetStreamBackendConfig */
    streamBackendConfig?: Maybe<ChannelStreamBackendConfig>;
    /** ChannelConfigService.ListStreamBackendConfigs */
    streamBackendConfigs?: Maybe<ChannelListStreamBackendConfigsResponse>;
    /** StreamerCardService.GetStreamerCard */
    streamerCard?: Maybe<GameLogicStreamerCard>;
    /** StreamerCardService.ListStreamerCardDrafts */
    streamerCardDrafts?: Maybe<GameCardListStreamerCardDraftsResponse>;
    /** StoreServiceV2.ListStreamerCardSaleConfigs */
    streamerCardSaleConfigs?: Maybe<StoreV2ListStreamerCardSaleConfigsResponse>;
    /** StreamerCardService.ListStreamerCards */
    streamerCards?: Maybe<GameCardListStreamerCardsResponse>;
    /** StreamerCardService.BatchGetStreamerCards */
    streamerCardsBatch?: Maybe<GameCardBatchGetStreamerCardsResponse>;
    /** ChannelService.ListStreams */
    streams?: Maybe<ChannelListStreamsResponse>;
    /** PaymentService.ListSuccessfulPayments */
    successfulPayments?: Maybe<PaymentListSuccessfulPaymentsResponse>;
    /** SupportService.GetArticle */
    supportArticle?: Maybe<SupportArticle>;
    /** StoreServiceV2.ListTopUpSellableItems */
    topUpSellableItems?: Maybe<StoreV2ListTopUpSellableItemsResponse>;
    /** AnnouncementService.ListUserAnnouncements */
    userAnnouncements?: Maybe<AnnouncementListUserAnnouncementsResponse>;
    /** ChannelService.GetUserChannel */
    userChannel?: Maybe<ChannelChannel>;
    /** ChannelModerationService.ListUserChannelBans */
    userChannelBans?: Maybe<ChannelListUserChannelBansResponse>;
    /** ChannelService.ListUserChannelRoles */
    userChannelRoles?: Maybe<ChannelListUserChannelRolesResponse>;
    /** ChannelSubscriptionService.GetUserChannelSubscription */
    userChannelSubscription?: Maybe<SubscriptionChannelSubscription>;
    /** ChannelSubscriptionService.ListUserChannelSubscriptions */
    userChannelSubscriptions?: Maybe<SubscriptionListUserChannelSubscriptionsResponse>;
    /** FeatureFlagService.GetUserFeatureFlag */
    userFeatureFlag?: Maybe<FlagFeatureFlagState>;
    /** FeatureFlagService.ListUserFeatureFlags */
    userFeatureFlags?: Maybe<FlagListUserFeatureFlagsResponse>;
    /** PartyService.GetUserParty */
    userParty?: Maybe<PartyParty>;
    /** ChannelService.ListUserPrivilegedChannels */
    userPrivilegedChannels?: Maybe<ChannelListUserPrivilegedChannelsResponse>;
    /** WaitlistService.ListWaitlistOrigins */
    waitlistOrigins?: Maybe<WaitlistListWaitlistOriginsResponse>;
    /** WaitlistService.ListWaitlistUsers */
    waitlistUsers?: Maybe<WaitlistListWaitlistUsersResponse>;
    /** WalletService.GetWallet */
    wallet?: Maybe<WalletGetWalletResponse>;
    /** WalletService.ListWalletTransactions */
    walletTransactions?: Maybe<WalletListWalletTransactionsResponse>;
};
export type QueryAgreementsArgs = {
    includeOldRevisions?: InputMaybe<Scalars['Boolean']['input']>;
};
export type QueryAnnouncementsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filter?: InputMaybe<AnnouncementAnnouncementFilterInput>;
};
export type QueryArenaArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryArenasArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryAvatarArgs = {
    avatarId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryAvatarAnimationArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryAvatarAnimationBatchArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryAvatarPartArgs = {
    avatarPartId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryAvatarPartsBatchArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryAvatarsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    listAll?: InputMaybe<Scalars['Boolean']['input']>;
};
export type QueryAvatarsBatchArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryBatchGetSeasonProgressionArgs = {
    queries?: InputMaybe<Array<ProgressionBatchGetSeasonProgressionRequestQueryInput>>;
};
export type QueryBlockedUsersArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryBoosterArgs = {
    id?: InputMaybe<Scalars['Int']['input']>;
};
export type QueryChannelArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelActiveFriendsArgs = {
    channelIds?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelBanAppealsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryChannelBanUserStatusArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelBanUserStatusesArgs = {
    channelIds?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelBannedUsersArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryChannelEmojisArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
    includeCount?: InputMaybe<Scalars['Boolean']['input']>;
    includeDisabled?: InputMaybe<Scalars['Boolean']['input']>;
};
export type QueryChannelFeatureFlagArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    flagName?: InputMaybe<Scalars['String']['input']>;
};
export type QueryChannelFeatureFlagsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelModerationSettingsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelPrivilegedUsersArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryChannelStoreFrontArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelSubscriptionConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelSubscriptionTiersArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelWaitlistSettingsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChannelsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    liveStatus?: InputMaybe<ChannelLiveStatus>;
    name?: InputMaybe<Scalars['String']['input']>;
};
export type QueryChatMessagesArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryChatUserStatusArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryChatUsersArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    sortBy?: InputMaybe<Scalars['String']['input']>;
    userLabel?: InputMaybe<ChatUserLabel>;
};
export type QueryEmojiArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryEmojisArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<EmojiListEmojisRequestFilterInput>>;
    includeCount?: InputMaybe<Scalars['Boolean']['input']>;
    includeDisabled?: InputMaybe<Scalars['Boolean']['input']>;
};
export type QueryEmojisBatchArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryFeatureFlagConfigArgs = {
    revision?: InputMaybe<Scalars['String']['input']>;
};
export type QueryFollowStatusesArgs = {
    channelIds?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryFollowedChannelsArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryFriendsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<FriendsListFriendsRequestFilterInput>>;
    priorityOrder?: InputMaybe<Scalars['Boolean']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryFriendshipStatusesArgs = {
    friendIds?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryGameArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryGameCardsArgs = {
    cardIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryGamesArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryGetChannelsArgs = {
    channelIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryGetStreamChannelsArgs = {
    streamIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryGoalCardArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryGoalCardSlotOptionsArgs = {
    slotId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryGoalCardsArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryIngestConfigArgs = {
    ftlId?: InputMaybe<Scalars['Int']['input']>;
};
export type QueryIngestConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryInventoryArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<InventoryListUserInventoryRequestFilterInput>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryInvitationCodesArgs = {
    includeUsed?: InputMaybe<Scalars['Boolean']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryItemArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryItemsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<ItemListItemsRequestFilterInput>>;
};
export type QueryItemsBatchArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryListGameCardsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    gameId?: InputMaybe<Scalars['ID']['input']>;
    seasonId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryListLevelConfigsArgs = {
    maxLevel?: InputMaybe<Scalars['Int']['input']>;
    minLevel?: InputMaybe<Scalars['Int']['input']>;
    seasonId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryListSeasonProgressionArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryListSeasonsArgs = {
    gameId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryMatchGroupChatIdArgs = {
    groupId?: InputMaybe<Scalars['ID']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryMatchGroupStateArgs = {
    groupId?: InputMaybe<Scalars['ID']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryMatchStateArgs = {
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryMatchStreamStateArgs = {
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryMediaUrlsBatchArgs = {
    options?: InputMaybe<MediaMediaOptionsInput>;
    urls?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryModerationEventsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
    filter?: InputMaybe<ChannelModerationEventsFilterInput>;
};
export type QueryNotificationsArgs = {
    cursor?: InputMaybe<Scalars['String']['input']>;
};
export type QueryOauth2ConsentArgs = {
    clientId?: InputMaybe<Scalars['ID']['input']>;
    scopes?: InputMaybe<Array<Scalars['String']['input']>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPartyArgs = {
    partyId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPaymentArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPlacementArgs = {
    placementId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPlatformBanArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPlatformBanAppealsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    status?: InputMaybe<ModerationAppealStatus>;
};
export type QueryPlatformEmojisArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    includeCount?: InputMaybe<Scalars['Boolean']['input']>;
    includeDisabled?: InputMaybe<Scalars['Boolean']['input']>;
};
export type QueryPlatformStoreFrontArgs = {
    gameId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryPlayedGamesArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryProfileArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryProfileBatchArgs = {
    userIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryProfilesArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryReceivedFriendRequestsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryReportCaseArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryReportsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filter?: InputMaybe<SupportReportsFilterInput>;
};
export type QueryResolveUserTagsArgs = {
    userTags?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryRestreamingConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryRewardsArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySearchArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    entityTypes?: InputMaybe<Array<SearchEntityType>>;
    query?: InputMaybe<Scalars['String']['input']>;
};
export type QuerySeasonArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySeasonProgressionArgs = {
    seasonId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySeasonsArgs = {
    ids?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QuerySelectedStreamBackendConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySellableItemArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySentFriendRequestsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryStreamArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryStreamBackendConfigArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryStreamBackendConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryStreamerCardArgs = {
    id?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryStreamerCardDraftsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<GameCardListStreamerCardDraftsRequestFilterInput>>;
};
export type QueryStreamerCardSaleConfigsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QueryStreamerCardsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<GameCardListStreamerCardsRequestFilterInput>>;
};
export type QueryStreamerCardsBatchArgs = {
    streamerCardIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type QueryStreamsArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
};
export type QuerySuccessfulPaymentsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filter?: InputMaybe<PaymentListSuccessfulPaymentsRequestFilterInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QuerySupportArticleArgs = {
    attachmentBaseUrl?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['ID']['input']>;
    locale?: InputMaybe<Scalars['String']['input']>;
};
export type QueryTopUpSellableItemsArgs = {
    currencyId?: InputMaybe<Scalars['ID']['input']>;
    minAmount?: InputMaybe<Scalars['Int']['input']>;
};
export type QueryUserAnnouncementsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    target?: InputMaybe<AnnouncementAnnouncementTarget>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserChannelArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserChannelBansArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserChannelRolesArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserChannelSubscriptionArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserChannelSubscriptionsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<SubscriptionListUserChannelSubscriptionsRequestFilterInput>>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserFeatureFlagArgs = {
    flagName?: InputMaybe<Scalars['String']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserFeatureFlagsArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserPartyArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryUserPrivilegedChannelsArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryWaitlistUsersArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filters?: InputMaybe<Array<WaitlistWaitlistFilterInput>>;
};
export type QueryWalletArgs = {
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type QueryWalletTransactionsArgs = {
    cursor?: InputMaybe<ApiCursorInput>;
    filter?: InputMaybe<WalletListWalletTransactionsRequestFilterInput>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export declare enum RarityRarity {
    RarityCommon = "RARITY_COMMON",
    RarityEpic = "RARITY_EPIC",
    RarityLegendary = "RARITY_LEGENDARY",
    RarityRare = "RARITY_RARE",
    RarityUncommon = "RARITY_UNCOMMON",
    RarityUnspecified = "RARITY_UNSPECIFIED"
}
export type ReasonReason = {
    __typename?: 'ReasonReason';
    metadata?: Maybe<AttributeAttributeMap>;
    reason?: Maybe<ReasonReasonReasonUnion>;
};
export type ReasonReasonAdWatched = {
    __typename?: 'ReasonReasonAdWatched';
    placementId: Scalars['ID']['output'];
};
export type ReasonReasonAdWatchedInput = {
    placementId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonAdministrative = {
    __typename?: 'ReasonReasonAdministrative';
    reason: Scalars['String']['output'];
};
export type ReasonReasonAdministrativeInput = {
    reason?: InputMaybe<Scalars['String']['input']>;
};
export type ReasonReasonChannelOwner = {
    __typename?: 'ReasonReasonChannelOwner';
    channelId: Scalars['ID']['output'];
};
export type ReasonReasonChannelOwnerInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonChannelSubscription = {
    __typename?: 'ReasonReasonChannelSubscription';
    channelId: Scalars['ID']['output'];
};
export type ReasonReasonChannelSubscriptionInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonGoalCardComplete = {
    __typename?: 'ReasonReasonGoalCardComplete';
    goalCard: GoalCardGoalCard;
    goalCardId: Scalars['ID']['output'];
    goalCardSlotId: Scalars['ID']['output'];
};
export type ReasonReasonGoalCardCompleteInput = {
    goalCardId?: InputMaybe<Scalars['ID']['input']>;
    goalCardSlotId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonGoalCardSlotReshuffle = {
    __typename?: 'ReasonReasonGoalCardSlotReshuffle';
    goalCardSlotId: Scalars['ID']['output'];
};
export type ReasonReasonGoalCardSlotReshuffleInput = {
    goalCardSlotId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonInput = {
    adWatched?: InputMaybe<ReasonReasonAdWatchedInput>;
    administrative?: InputMaybe<ReasonReasonAdministrativeInput>;
    channelOwner?: InputMaybe<ReasonReasonChannelOwnerInput>;
    channelSubscription?: InputMaybe<ReasonReasonChannelSubscriptionInput>;
    goalCardComplete?: InputMaybe<ReasonReasonGoalCardCompleteInput>;
    goalCardSlotReshuffle?: InputMaybe<ReasonReasonGoalCardSlotReshuffleInput>;
    levelUp?: InputMaybe<ReasonReasonLevelUpInput>;
    matchEnd?: InputMaybe<ReasonReasonMatchEndInput>;
    metadata?: InputMaybe<AttributeAttributeMapInput>;
    provision?: InputMaybe<ReasonReasonProvisionInput>;
    purchaseWithInGameCurrency?: InputMaybe<ReasonReasonPurchaseWithInGameCurrencyInput>;
    purchaseWithPayment?: InputMaybe<ReasonReasonPurchaseWithPaymentInput>;
    reshuffle?: InputMaybe<ReasonReasonReshuffleInput>;
    rewardClaimed?: InputMaybe<ReasonReasonRewardClaimedInput>;
    storeOrderPayment?: InputMaybe<ReasonReasonStoreOrderPaymentInput>;
};
export type ReasonReasonLevelUp = {
    __typename?: 'ReasonReasonLevelUp';
    level: Scalars['Int']['output'];
    season: GameSeason;
    seasonId: Scalars['ID']['output'];
};
export type ReasonReasonLevelUpInput = {
    level?: InputMaybe<Scalars['Int']['input']>;
    seasonId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonMatchEnd = {
    __typename?: 'ReasonReasonMatchEnd';
    groupId: Scalars['ID']['output'];
};
export type ReasonReasonMatchEndInput = {
    groupId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonProvision = {
    __typename?: 'ReasonReasonProvision';
    rev: Scalars['String']['output'];
    seasonId: Scalars['ID']['output'];
};
export type ReasonReasonProvisionInput = {
    rev?: InputMaybe<Scalars['String']['input']>;
    seasonId?: InputMaybe<Scalars['ID']['input']>;
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type ReasonReasonPurchaseWithInGameCurrency = {
    __typename?: 'ReasonReasonPurchaseWithInGameCurrency';
    adRevenueShares: Array<ReasonRevenueShare>;
    itemType: StoreV2ItemType;
    orderId: Scalars['ID']['output'];
    revenueShares: Array<ReasonRevenueShare>;
    sku: Scalars['String']['output'];
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type ReasonReasonPurchaseWithInGameCurrencyInput = {
    adRevenueShares?: InputMaybe<Array<ReasonRevenueShareInput>>;
    itemType?: InputMaybe<StoreV2ItemType>;
    orderId?: InputMaybe<Scalars['ID']['input']>;
    revenueShares?: InputMaybe<Array<ReasonRevenueShareInput>>;
    sku?: InputMaybe<Scalars['String']['input']>;
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type ReasonReasonPurchaseWithPayment = {
    __typename?: 'ReasonReasonPurchaseWithPayment';
    cardIssuingCountry: Scalars['String']['output'];
    orderId: Scalars['ID']['output'];
    price: PaymentAmount;
    reference: Scalars['String']['output'];
    sku: Scalars['String']['output'];
    timestamp: Scalars['Timestamp']['output'];
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type ReasonReasonPurchaseWithPaymentInput = {
    cardIssuingCountry?: InputMaybe<Scalars['String']['input']>;
    orderId?: InputMaybe<Scalars['ID']['input']>;
    price?: InputMaybe<PaymentAmountInput>;
    reference?: InputMaybe<Scalars['String']['input']>;
    sku?: InputMaybe<Scalars['String']['input']>;
    timestamp?: InputMaybe<Scalars['InputTimestamp']['input']>;
};
export type ReasonReasonReasonUnion = ReasonReasonAdWatched | ReasonReasonAdministrative | ReasonReasonChannelOwner | ReasonReasonChannelSubscription | ReasonReasonGoalCardComplete | ReasonReasonGoalCardSlotReshuffle | ReasonReasonLevelUp | ReasonReasonMatchEnd | ReasonReasonProvision | ReasonReasonPurchaseWithInGameCurrency | ReasonReasonPurchaseWithPayment | ReasonReasonReshuffle | ReasonReasonRewardClaimed | ReasonReasonStoreOrderPayment;
export type ReasonReasonReshuffle = {
    __typename?: 'ReasonReasonReshuffle';
    groupId: Scalars['ID']['output'];
    matchId: Scalars['ID']['output'];
    streamId: Scalars['ID']['output'];
};
export type ReasonReasonReshuffleInput = {
    groupId?: InputMaybe<Scalars['ID']['input']>;
    matchId?: InputMaybe<Scalars['ID']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type ReasonReasonRewardClaimed = {
    __typename?: 'ReasonReasonRewardClaimed';
    rewardId: Scalars['ID']['output'];
    rewardReason: ReasonReason;
};
export type ReasonReasonRewardClaimedInput = {
    rewardId?: InputMaybe<Scalars['ID']['input']>;
    rewardReason?: InputMaybe<ReasonReasonInput>;
};
export type ReasonReasonStoreOrderPayment = {
    __typename?: 'ReasonReasonStoreOrderPayment';
    adRevenueShares: Array<ReasonRevenueShare>;
    itemType: StoreV2ItemType;
    orderId: Scalars['ID']['output'];
    revenueShares: Array<ReasonRevenueShare>;
    sku: Scalars['String']['output'];
};
export type ReasonReasonStoreOrderPaymentInput = {
    adRevenueShares?: InputMaybe<Array<ReasonRevenueShareInput>>;
    itemType?: InputMaybe<StoreV2ItemType>;
    orderId?: InputMaybe<Scalars['ID']['input']>;
    revenueShares?: InputMaybe<Array<ReasonRevenueShareInput>>;
    sku?: InputMaybe<Scalars['String']['input']>;
};
export type ReasonRevenueRecipient = {
    __typename?: 'ReasonRevenueRecipient';
    kind: ReasonRevenueRecipientKind;
    recipientId: Scalars['ID']['output'];
};
export type ReasonRevenueRecipientInput = {
    kind?: InputMaybe<ReasonRevenueRecipientKind>;
    recipientId?: InputMaybe<Scalars['ID']['input']>;
};
export declare enum ReasonRevenueRecipientKind {
    KindChannel = "KIND_CHANNEL",
    KindPlatform = "KIND_PLATFORM",
    KindUnspecified = "KIND_UNSPECIFIED"
}
export type ReasonRevenueShare = {
    __typename?: 'ReasonRevenueShare';
    percent: Scalars['Int']['output'];
    recipient: ReasonRevenueRecipient;
};
export type ReasonRevenueShareInput = {
    percent?: InputMaybe<Scalars['Int']['input']>;
    recipient?: InputMaybe<ReasonRevenueRecipientInput>;
};
export declare enum RenderingCameraTransitionRequestTransitionTarget {
    TransitionTargetArena = "TRANSITION_TARGET_ARENA",
    TransitionTargetCameraDrive1 = "TRANSITION_TARGET_CAMERA_DRIVE1",
    TransitionTargetSpotlight = "TRANSITION_TARGET_SPOTLIGHT",
    TransitionTargetUnspecified = "TRANSITION_TARGET_UNSPECIFIED"
}
export type RewardClaimRewardResponse = {
    __typename?: 'RewardClaimRewardResponse';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type RewardListRewardsResponse = {
    __typename?: 'RewardListRewardsResponse';
    rewards: Array<RewardReward>;
};
export type RewardReward = {
    __typename?: 'RewardReward';
    id: Scalars['ID']['output'];
    reason: ReasonReason;
    rewardedAt: Scalars['Timestamp']['output'];
    type: RewardRewardType;
    userId: Scalars['ID']['output'];
};
export type RewardRewardType = {
    __typename?: 'RewardRewardType';
    reward?: Maybe<RewardRewardTypeRewardUnion>;
};
export type RewardRewardTypeCurrency = {
    __typename?: 'RewardRewardTypeCurrency';
    currencyAmount: Scalars['Int']['output'];
    currencyId: Scalars['ID']['output'];
};
export type RewardRewardTypeItem = {
    __typename?: 'RewardRewardTypeItem';
    item: ItemItem;
    itemCount: Scalars['Int']['output'];
    itemId: Scalars['ID']['output'];
};
export type RewardRewardTypeRewardUnion = RewardRewardTypeCurrency | RewardRewardTypeItem;
export declare enum SearchEntityType {
    EntityTypeChannel = "ENTITY_TYPE_CHANNEL",
    EntityTypeUnspecified = "ENTITY_TYPE_UNSPECIFIED",
    EntityTypeUser = "ENTITY_TYPE_USER"
}
export type SearchResultItem = {
    __typename?: 'SearchResultItem';
    entity?: Maybe<SearchResultItemEntityUnion>;
    entityId: Scalars['ID']['output'];
    entityType: SearchEntityType;
    matchedProperties: Array<Scalars['String']['output']>;
    score: Scalars['Float']['output'];
};
export type SearchResultItemEntityUnion = ChannelChannel | ProfileProfile;
export type SearchSearchResponse = {
    __typename?: 'SearchSearchResponse';
    pageInfo: ApiPageInfo;
    resultItems: Array<SearchResultItem>;
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type StoreV2BuyWithInGameCurrencyResponse = {
    __typename?: 'StoreV2BuyWithInGameCurrencyResponse';
    orderId: Scalars['ID']['output'];
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type StoreV2BuyWithPaymentResponse = {
    __typename?: 'StoreV2BuyWithPaymentResponse';
    orderId: Scalars['ID']['output'];
    session: PaymentSession;
};
export type StoreV2Content = {
    __typename?: 'StoreV2Content';
    value?: Maybe<StoreV2ContentValueUnion>;
};
export type StoreV2ContentValueUnion = StoreV2CurrencyRef | StoreV2ItemRef;
export type StoreV2CurrencyRef = {
    __typename?: 'StoreV2CurrencyRef';
    amount: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
};
/** protolint:disable:next MESSAGE_NAMES_EXCLUDE_PREPOSITIONS */
export type StoreV2InGameCurrencyPrice = {
    __typename?: 'StoreV2InGameCurrencyPrice';
    amount: Scalars['Int']['output'];
    amountWithoutDiscount: Scalars['Int']['output'];
    currencyId: Scalars['ID']['output'];
    default: Scalars['Boolean']['output'];
};
export type StoreV2ItemRef = {
    __typename?: 'StoreV2ItemRef';
    count: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    inventoryState?: Maybe<InventoryInventoryItem>;
    item: ItemItem;
};
export declare enum StoreV2ItemType {
    ItemTypeCurrencyPack = "ITEM_TYPE_CURRENCY_PACK",
    ItemTypePremiumCardBundle = "ITEM_TYPE_PREMIUM_CARD_BUNDLE",
    ItemTypeStandardCardBundle = "ITEM_TYPE_STANDARD_CARD_BUNDLE",
    ItemTypeStreamerCard = "ITEM_TYPE_STREAMER_CARD",
    ItemTypeUnspecified = "ITEM_TYPE_UNSPECIFIED"
}
export type StoreV2ListStreamerCardSaleConfigsResponse = {
    __typename?: 'StoreV2ListStreamerCardSaleConfigsResponse';
    configs: Array<StoreV2StreamerCardSaleConfig>;
    pageInfo: ApiPageInfo;
};
export type StoreV2ListTopUpSellableItemsResponse = {
    __typename?: 'StoreV2ListTopUpSellableItemsResponse';
    items: Array<StoreV2SellableItem>;
};
export type StoreV2Period = {
    __typename?: 'StoreV2Period';
    from: Scalars['Timestamp']['output'];
    until: Scalars['Timestamp']['output'];
};
export type StoreV2PeriodInput = {
    from?: InputMaybe<Scalars['InputTimestamp']['input']>;
    until?: InputMaybe<Scalars['InputTimestamp']['input']>;
};
export type StoreV2Price = {
    __typename?: 'StoreV2Price';
    amount: Scalars['Int']['output'];
    amountWithoutDiscount: Scalars['Int']['output'];
    currency: PaymentCurrency;
};
export type StoreV2PurchaseLimits = {
    __typename?: 'StoreV2PurchaseLimits';
    perItem: Scalars['Int']['output'];
    perUser: Scalars['Int']['output'];
};
export type StoreV2SellableItem = {
    __typename?: 'StoreV2SellableItem';
    availableUntil?: Maybe<Scalars['Timestamp']['output']>;
    content: Array<StoreV2Content>;
    discountPercent: Scalars['Int']['output'];
    id: Scalars['ID']['output'];
    igcPrices?: Maybe<Array<StoreV2InGameCurrencyPrice>>;
    meta: StoreV2SellableItemMeta;
    name: Scalars['String']['output'];
    price?: Maybe<StoreV2Price>;
    promotionName: Scalars['String']['output'];
    purchaseLimits: StoreV2PurchaseLimits;
    signature: Scalars['String']['output'];
    sku: Scalars['String']['output'];
    type: StoreV2ItemType;
};
export type StoreV2SellableItemMeta = {
    __typename?: 'StoreV2SellableItemMeta';
    channelId: Scalars['ID']['output'];
    configId: Scalars['ID']['output'];
    itemType: StoreV2ItemType;
    promotionId: Scalars['ID']['output'];
    storeFrontId: Scalars['ID']['output'];
    storeType: StoreV2StoreType;
};
export type StoreV2StoreFront = {
    __typename?: 'StoreV2StoreFront';
    categories: Array<StoreV2StoreFrontCategory>;
    gameId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    type: StoreV2StoreType;
};
export type StoreV2StoreFrontCategory = {
    __typename?: 'StoreV2StoreFrontCategory';
    id: Scalars['ID']['output'];
    itemType: StoreV2ItemType;
    sellableItems: Array<StoreV2SellableItem>;
};
export declare enum StoreV2StoreType {
    StoreTypeChannel = "STORE_TYPE_CHANNEL",
    StoreTypePlatform = "STORE_TYPE_PLATFORM",
    StoreTypeUnspecified = "STORE_TYPE_UNSPECIFIED"
}
export type StoreV2StreamerCardSaleConfig = {
    __typename?: 'StoreV2StreamerCardSaleConfig';
    cardId: Scalars['ID']['output'];
    channelId: Scalars['ID']['output'];
    enabled: Scalars['Boolean']['output'];
    excludeFromBundles: Scalars['Boolean']['output'];
    period?: Maybe<StoreV2Period>;
};
export type StoreV2StreamerCardSaleConfigUpdateInput = {
    cardId?: InputMaybe<Scalars['ID']['input']>;
    channelId?: InputMaybe<Scalars['ID']['input']>;
    enabled?: InputMaybe<Scalars['Boolean']['input']>;
    excludeFromBundles?: InputMaybe<Scalars['Boolean']['input']>;
    period?: InputMaybe<StoreV2PeriodInput>;
    unsetPeriod?: InputMaybe<Scalars['Boolean']['input']>;
};
export declare enum StreamDeploymentStreamDeploymentStatusComponentStatus {
    ComponentStatusContainersUnready = "COMPONENT_STATUS_CONTAINERS_UNREADY",
    ComponentStatusDeployingContainers = "COMPONENT_STATUS_DEPLOYING_CONTAINERS",
    ComponentStatusDeployingPod = "COMPONENT_STATUS_DEPLOYING_POD",
    ComponentStatusDeploymentStarted = "COMPONENT_STATUS_DEPLOYMENT_STARTED",
    ComponentStatusDisabled = "COMPONENT_STATUS_DISABLED",
    ComponentStatusOffline = "COMPONENT_STATUS_OFFLINE",
    ComponentStatusProvisioningNode = "COMPONENT_STATUS_PROVISIONING_NODE",
    ComponentStatusReady = "COMPONENT_STATUS_READY",
    ComponentStatusUnspecified = "COMPONENT_STATUS_UNSPECIFIED"
}
export type StreamInfoStreamInfo = {
    __typename?: 'StreamInfoStreamInfo';
    channelId: Scalars['ID']['output'];
    gameId: Scalars['ID']['output'];
    seasonId: Scalars['ID']['output'];
    streamId: Scalars['ID']['output'];
};
export type StreamIngestConfigChannelIngestConfig = {
    __typename?: 'StreamIngestConfigChannelIngestConfig';
    channelId: Scalars['ID']['output'];
    config: StreamIngestConfigIngestConfig;
    streamingStatus: StreamIngestConfigStreamingStatus;
};
export type StreamIngestConfigChannelIngestConfigs = {
    __typename?: 'StreamIngestConfigChannelIngestConfigs';
    channelId: Scalars['ID']['output'];
    configs: Array<StreamIngestConfigIngestConfig>;
};
export type StreamIngestConfigIngestConfig = {
    __typename?: 'StreamIngestConfigIngestConfig';
    ingest?: Maybe<StreamIngestConfigIngestConfigIngestUnion>;
};
export type StreamIngestConfigIngestConfigFtlConfig = {
    __typename?: 'StreamIngestConfigIngestConfigFTLConfig';
    sharedKey: Scalars['String']['output'];
    streamId: Scalars['Int']['output'];
    streamKey: Scalars['String']['output'];
};
export type StreamIngestConfigIngestConfigIngestUnion = StreamIngestConfigIngestConfigFtlConfig;
export declare enum StreamIngestConfigStreamingStatus {
    StreamingStatusStreamingDisabled = "STREAMING_STATUS_STREAMING_DISABLED",
    StreamingStatusUnspecified = "STREAMING_STATUS_UNSPECIFIED",
    StreamingStatusUserSuspended = "STREAMING_STATUS_USER_SUSPENDED"
}
export type StreamerActivateContextualTeamActionResponse = {
    __typename?: 'StreamerActivateContextualTeamActionResponse';
    activated: Scalars['Boolean']['output'];
    cooldown: Scalars['Duration']['output'];
};
export type StreamerChannelFollowed = {
    __typename?: 'StreamerChannelFollowed';
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type StreamerChannelSubscribed = {
    __typename?: 'StreamerChannelSubscribed';
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type StreamerStreamEvent = {
    __typename?: 'StreamerStreamEvent';
    content?: Maybe<StreamerStreamEventContentUnion>;
    timestamp: Scalars['Timestamp']['output'];
};
export type StreamerStreamEventContentUnion = GameLogicActiveCardSucceededMsg | GameLogicHighScoringCardPromotedMsg | GameLogicMatchEndedMsg | GameLogicMatchStartedMsg | GameLogicPlayerJoinedMsg | GameStateStreamState | IntType | StreamerChannelFollowed | StreamerChannelSubscribed;
export declare enum StreamerStreamEventFilterEventType {
    EventTypeActiveCardSucceeded = "EVENT_TYPE_ACTIVE_CARD_SUCCEEDED",
    EventTypeChannelFollowed = "EVENT_TYPE_CHANNEL_FOLLOWED",
    EventTypeChannelSubscribed = "EVENT_TYPE_CHANNEL_SUBSCRIBED",
    EventTypeHighScoringCardPromoted = "EVENT_TYPE_HIGH_SCORING_CARD_PROMOTED",
    EventTypePlayerJoined = "EVENT_TYPE_PLAYER_JOINED",
    EventTypeUnspecified = "EVENT_TYPE_UNSPECIFIED"
}
export type StreamerStreamEventFilterInput = {
    eventTypes?: InputMaybe<Array<StreamerStreamEventFilterEventType>>;
};
export type StreamerTriggerCameraTransitionResponse = {
    __typename?: 'StreamerTriggerCameraTransitionResponse';
    success: Scalars['Boolean']['output'];
};
export type StringType = {
    __typename?: 'StringType';
    /** The wrapped value of type String */
    value: Scalars['String']['output'];
};
export type Subscription = {
    __typename?: 'Subscription';
    /** ChannelService.ChannelEventStream */
    channelEventsSubscribe?: Maybe<ChannelChannelEvent>;
    /** ChannelService.LiveStatusUpdates - Subscription APIs */
    channelLiveStatusSubscribe?: Maybe<ChannelLiveStatusEvent>;
    /** ChannelService.ChannelStreamDetailUpdates */
    channelStreamDetailSubscribe?: Maybe<ChannelChannelStreamDetailEvent>;
    /** ChannelService.ViewerCountUpdates */
    channelViewerCountSubscribe?: Maybe<ChannelViewerCountEvent>;
    /** ChatModerationService.StreamAutoModQueue */
    chatAutoModQueueSubscribe?: Maybe<ChatAutoModQueueEvent>;
    /** ChatService.ChatMessageStream */
    chatMessageSubscribe?: Maybe<ChatChatEvent>;
    /** ChannelConfigService.IngestStatsUpdates */
    ingestStatsSubscribe?: Maybe<ChannelIngestStatsEvent>;
    /** ChannelModerationService.ModerationEventsStream */
    moderationEventsSubscribe?: Maybe<ChannelModerationEvent>;
    /** NotificationService.Notifications */
    notificationSubscribe?: Maybe<NotificationNotification>;
    /** PartyService.StreamPartyUpdates */
    partyUpdateSubscribe?: Maybe<PartyPartyUpdateEvent>;
    /** StreamerService.StreamEvents */
    streamEventsSubscribe?: Maybe<StreamerStreamEvent>;
    /** MatchServiceV2.StreamSpectatorCoordinationEvents */
    streamSpectatorCoordinationEventsSubscribe?: Maybe<MatchStreamSpectatorCoordinationEvent>;
    /** ChannelConfigService.StreamStatusUpdates */
    streamStatusSubscribe?: Maybe<ChannelStreamStatusEvent>;
    /** FeatureFlagService.StreamConfigUpdates */
    subscribeFeatureFlagConfigUpdates?: Maybe<FlagFeatureFlagConfig>;
};
export type SubscriptionChannelEventsSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionChannelLiveStatusSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionChannelStreamDetailSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionChannelViewerCountSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionChatAutoModQueueSubscribeArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionChatMessageSubscribeArgs = {
    chatId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionIngestStatsSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionModerationEventsSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    filter?: InputMaybe<ChannelModerationEventsFilterInput>;
};
export type SubscriptionNotificationSubscribeArgs = {
    cursor?: InputMaybe<Scalars['String']['input']>;
};
export type SubscriptionPartyUpdateSubscribeArgs = {
    partyId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionStreamEventsSubscribeArgs = {
    filter?: InputMaybe<StreamerStreamEventFilterInput>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionStreamSpectatorCoordinationEventsSubscribeArgs = {
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionStreamStatusSubscribeArgs = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
};
export type SubscriptionSubscribeFeatureFlagConfigUpdatesArgs = {
    revision?: InputMaybe<Scalars['String']['input']>;
};
export type SubscriptionChannelSubscription = {
    __typename?: 'SubscriptionChannelSubscription';
    activatedAt?: Maybe<Scalars['Timestamp']['output']>;
    cancelledAt?: Maybe<Scalars['Timestamp']['output']>;
    channel: ChannelChannel;
    channelId: Scalars['ID']['output'];
    createdAt: Scalars['Timestamp']['output'];
    expiresAt?: Maybe<Scalars['Timestamp']['output']>;
    id: Scalars['ID']['output'];
    paymentFailedAt?: Maybe<Scalars['Timestamp']['output']>;
    renewedAt?: Maybe<Scalars['Timestamp']['output']>;
    state: SubscriptionChannelSubscriptionState;
    terminatedAt?: Maybe<Scalars['Timestamp']['output']>;
    tier: Scalars['Int']['output'];
    userId: Scalars['ID']['output'];
};
export type SubscriptionChannelSubscriptionConfig = {
    __typename?: 'SubscriptionChannelSubscriptionConfig';
    channelId: Scalars['ID']['output'];
    subscriptionsEnabled: Scalars['Boolean']['output'];
    tiers: Array<SubscriptionChannelSubscriptionTier>;
};
export type SubscriptionChannelSubscriptionEntitlement = {
    __typename?: 'SubscriptionChannelSubscriptionEntitlement';
    amount: Scalars['Int']['output'];
    item: ItemItem;
    itemId: Scalars['ID']['output'];
};
export declare enum SubscriptionChannelSubscriptionState {
    StateActive = "STATE_ACTIVE",
    StateCancelled = "STATE_CANCELLED",
    StateExpired = "STATE_EXPIRED",
    StatePending = "STATE_PENDING",
    StateTerminated = "STATE_TERMINATED",
    StateUnspecified = "STATE_UNSPECIFIED"
}
export type SubscriptionChannelSubscriptionTier = {
    __typename?: 'SubscriptionChannelSubscriptionTier';
    description: Scalars['String']['output'];
    entitlements: Array<SubscriptionChannelSubscriptionEntitlement>;
    level: Scalars['Int']['output'];
    name: Scalars['String']['output'];
    prices: Array<SubscriptionSubscriptionPrice>;
};
export type SubscriptionChannelSubscriptionUpdateEvent = {
    __typename?: 'SubscriptionChannelSubscriptionUpdateEvent';
    subscription: SubscriptionChannelSubscription;
    updateType: SubscriptionChannelSubscriptionUpdateEventUpdateType;
    updatedAt: Scalars['Timestamp']['output'];
};
export declare enum SubscriptionChannelSubscriptionUpdateEventUpdateType {
    UpdateTypeActivated = "UPDATE_TYPE_ACTIVATED",
    UpdateTypeCancellationRequested = "UPDATE_TYPE_CANCELLATION_REQUESTED",
    UpdateTypeCancelled = "UPDATE_TYPE_CANCELLED",
    UpdateTypeCreated = "UPDATE_TYPE_CREATED",
    UpdateTypeExpired = "UPDATE_TYPE_EXPIRED",
    UpdateTypePaymentFailed = "UPDATE_TYPE_PAYMENT_FAILED",
    UpdateTypeRenewed = "UPDATE_TYPE_RENEWED",
    UpdateTypeTerminated = "UPDATE_TYPE_TERMINATED",
    UpdateTypeUnspecified = "UPDATE_TYPE_UNSPECIFIED"
}
export type SubscriptionCheckoutExistingSubscriptionResponse = {
    __typename?: 'SubscriptionCheckoutExistingSubscriptionResponse';
    sessionData: Scalars['String']['output'];
};
export type SubscriptionCheckoutNewSubscriptionResponse = {
    __typename?: 'SubscriptionCheckoutNewSubscriptionResponse';
    sessionData: Scalars['String']['output'];
};
export type SubscriptionListChannelSubscriptionTiersResponse = {
    __typename?: 'SubscriptionListChannelSubscriptionTiersResponse';
    tiers: Array<SubscriptionChannelSubscriptionTier>;
};
export type SubscriptionListUserChannelSubscriptionsRequestFilterInput = {
    paymentFailed?: InputMaybe<Scalars['Boolean']['input']>;
    state?: InputMaybe<SubscriptionChannelSubscriptionState>;
};
export type SubscriptionListUserChannelSubscriptionsResponse = {
    __typename?: 'SubscriptionListUserChannelSubscriptionsResponse';
    pageInfo: ApiPageInfo;
    subscriptions: Array<SubscriptionChannelSubscription>;
};
export type SubscriptionSubscriptionPrice = {
    __typename?: 'SubscriptionSubscriptionPrice';
    period: SubscriptionSubscriptionPricePeriod;
    price: Scalars['Int']['output'];
};
export declare enum SubscriptionSubscriptionPricePeriod {
    PeriodMonth = "PERIOD_MONTH",
    PeriodUnspecified = "PERIOD_UNSPECIFIED",
    PeriodYear = "PERIOD_YEAR"
}
export type SubscriptionUpdateSubscriptionPaymentMethodResponse = {
    __typename?: 'SubscriptionUpdateSubscriptionPaymentMethodResponse';
    sessionData: Scalars['String']['output'];
};
export type SupportArticle = {
    __typename?: 'SupportArticle';
    body: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    locale: Scalars['String']['output'];
    title: Scalars['String']['output'];
};
export type SupportListReportsResponse = {
    __typename?: 'SupportListReportsResponse';
    pageInfo: ApiPageInfo;
    reports: Array<SupportReport>;
};
export type SupportReport = {
    __typename?: 'SupportReport';
    caseId: Scalars['ID']['output'];
    context: SupportReportContext;
    createdAt: Scalars['Timestamp']['output'];
    description: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    reason: SupportReportReason;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type SupportReportCase = {
    __typename?: 'SupportReportCase';
    closedAt: Scalars['Timestamp']['output'];
    closedBy: Scalars['String']['output'];
    context: SupportReportContext;
    createdAt: Scalars['Timestamp']['output'];
    firstDescription: Scalars['String']['output'];
    firstReason: SupportReportReason;
    firstReporterId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    moderatorComment: Scalars['String']['output'];
    resolution: SupportReportCaseResolution;
    status: SupportReportCaseStatus;
};
export declare enum SupportReportCaseResolution {
    ReportCaseResolutionAllowContent = "REPORT_CASE_RESOLUTION_ALLOW_CONTENT",
    ReportCaseResolutionRemoveContent = "REPORT_CASE_RESOLUTION_REMOVE_CONTENT",
    ReportCaseResolutionUnspecified = "REPORT_CASE_RESOLUTION_UNSPECIFIED"
}
export declare enum SupportReportCaseStatus {
    ReportCaseStatusClosed = "REPORT_CASE_STATUS_CLOSED",
    ReportCaseStatusOpen = "REPORT_CASE_STATUS_OPEN",
    ReportCaseStatusUnspecified = "REPORT_CASE_STATUS_UNSPECIFIED"
}
export type SupportReportContext = {
    __typename?: 'SupportReportContext';
    value?: Maybe<SupportReportContextValueUnion>;
};
export type SupportReportContextChannel = {
    __typename?: 'SupportReportContextChannel';
    channelId: Scalars['ID']['output'];
    target: SupportReportContextChannelTarget;
};
export type SupportReportContextChannelInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    target?: InputMaybe<SupportReportContextChannelTarget>;
};
export declare enum SupportReportContextChannelTarget {
    TargetDescription = "TARGET_DESCRIPTION",
    TargetName = "TARGET_NAME",
    TargetUnspecified = "TARGET_UNSPECIFIED"
}
export type SupportReportContextChatMessage = {
    __typename?: 'SupportReportContextChatMessage';
    channelId: Scalars['ID']['output'];
    chatId: Scalars['ID']['output'];
    messageId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type SupportReportContextChatMessageInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    chatId?: InputMaybe<Scalars['ID']['input']>;
    messageId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type SupportReportContextInput = {
    channel?: InputMaybe<SupportReportContextChannelInput>;
    chatMessage?: InputMaybe<SupportReportContextChatMessageInput>;
    stream?: InputMaybe<SupportReportContextStreamInput>;
    user?: InputMaybe<SupportReportContextUserInput>;
};
export type SupportReportContextStream = {
    __typename?: 'SupportReportContextStream';
    channelId: Scalars['ID']['output'];
    startAt: Scalars['Int']['output'];
    streamId: Scalars['ID']['output'];
    userId: Scalars['ID']['output'];
};
export type SupportReportContextStreamInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    startAt?: InputMaybe<Scalars['Int']['input']>;
    streamId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export type SupportReportContextUser = {
    __typename?: 'SupportReportContextUser';
    target: SupportReportContextUserTarget;
    userId: Scalars['ID']['output'];
};
export type SupportReportContextUserInput = {
    target?: InputMaybe<SupportReportContextUserTarget>;
    userId?: InputMaybe<Scalars['ID']['input']>;
};
export declare enum SupportReportContextUserTarget {
    TargetName = "TARGET_NAME",
    TargetUnspecified = "TARGET_UNSPECIFIED"
}
export type SupportReportContextValueUnion = SupportReportContextChannel | SupportReportContextChatMessage | SupportReportContextStream | SupportReportContextUser;
export declare enum SupportReportReason {
    ReportReasonChildSafetyChildAbuse = "REPORT_REASON_CHILD_SAFETY_CHILD_ABUSE",
    ReportReasonChildSafetyCse = "REPORT_REASON_CHILD_SAFETY_CSE",
    ReportReasonChildSafetyDangerous = "REPORT_REASON_CHILD_SAFETY_DANGEROUS",
    ReportReasonChildSafetyUnderageUser = "REPORT_REASON_CHILD_SAFETY_UNDERAGE_USER",
    ReportReasonGraphicMediaAnimalAbuse = "REPORT_REASON_GRAPHIC_MEDIA_ANIMAL_ABUSE",
    ReportReasonGraphicMediaGore = "REPORT_REASON_GRAPHIC_MEDIA_GORE",
    ReportReasonGraphicMediaViolence = "REPORT_REASON_GRAPHIC_MEDIA_VIOLENCE",
    ReportReasonHarassment = "REPORT_REASON_HARASSMENT",
    ReportReasonHarassmentBlackmail = "REPORT_REASON_HARASSMENT_BLACKMAIL",
    ReportReasonHarassmentIncitement = "REPORT_REASON_HARASSMENT_INCITEMENT",
    ReportReasonHarassmentNonConsensualIntimateImages = "REPORT_REASON_HARASSMENT_NON_CONSENSUAL_INTIMATE_IMAGES",
    ReportReasonHarassmentSexualNonConsensual = "REPORT_REASON_HARASSMENT_SEXUAL_NON_CONSENSUAL",
    ReportReasonHarassmentStalking = "REPORT_REASON_HARASSMENT_STALKING",
    ReportReasonHatefulBehavior = "REPORT_REASON_HATEFUL_BEHAVIOR",
    ReportReasonIllegalActivitySale = "REPORT_REASON_ILLEGAL_ACTIVITY_SALE",
    ReportReasonIllegalActivityWeapons = "REPORT_REASON_ILLEGAL_ACTIVITY_WEAPONS",
    ReportReasonIllegalAlcoholNicotine = "REPORT_REASON_ILLEGAL_ALCOHOL_NICOTINE",
    ReportReasonIllegalDrugs = "REPORT_REASON_ILLEGAL_DRUGS",
    ReportReasonIllegalManipulation = "REPORT_REASON_ILLEGAL_MANIPULATION",
    ReportReasonIllegalSpam = "REPORT_REASON_ILLEGAL_SPAM",
    ReportReasonImpersonation = "REPORT_REASON_IMPERSONATION",
    ReportReasonInauthenticGameplay = "REPORT_REASON_INAUTHENTIC_GAMEPLAY",
    ReportReasonOffPlatform = "REPORT_REASON_OFF_PLATFORM",
    ReportReasonPlatformRulesViolation = "REPORT_REASON_PLATFORM_RULES_VIOLATION",
    ReportReasonPossibleIllegalActivity = "REPORT_REASON_POSSIBLE_ILLEGAL_ACTIVITY",
    ReportReasonRestrictedGamesInherentlyViolative = "REPORT_REASON_RESTRICTED_GAMES_INHERENTLY_VIOLATIVE",
    ReportReasonRestrictedGamesMature = "REPORT_REASON_RESTRICTED_GAMES_MATURE",
    ReportReasonSelfHarm = "REPORT_REASON_SELF_HARM",
    ReportReasonSexualBehaviorExplicit = "REPORT_REASON_SEXUAL_BEHAVIOR_EXPLICIT",
    ReportReasonSexualBehaviorSuggestive = "REPORT_REASON_SEXUAL_BEHAVIOR_SUGGESTIVE",
    ReportReasonSpam = "REPORT_REASON_SPAM",
    ReportReasonSpamSuspensionEvasion = "REPORT_REASON_SPAM_SUSPENSION_EVASION",
    ReportReasonUnknown = "REPORT_REASON_UNKNOWN",
    ReportReasonUnspecified = "REPORT_REASON_UNSPECIFIED",
    ReportReasonViolenceExtremism = "REPORT_REASON_VIOLENCE_EXTREMISM"
}
export type SupportReportsFilterInput = {
    caseId?: InputMaybe<Scalars['ID']['input']>;
};
export type WaitlistChannelWaitlistSettings = {
    __typename?: 'WaitlistChannelWaitlistSettings';
    maxSignupsPerStream: Scalars['Int']['output'];
    signupStreamDuration: Scalars['Duration']['output'];
};
export type WaitlistListWaitlistOriginsResponse = {
    __typename?: 'WaitlistListWaitlistOriginsResponse';
    origins: Array<AuthSignupOrigin>;
};
export type WaitlistListWaitlistUsersResponse = {
    __typename?: 'WaitlistListWaitlistUsersResponse';
    pageInfo: ApiPageInfo;
    totalCount: Scalars['Int']['output'];
    users: Array<WaitlistWaitlistUser>;
};
export type WaitlistWaitlistFilterChannelsInput = {
    channelIds?: InputMaybe<Array<Scalars['String']['input']>>;
};
export type WaitlistWaitlistFilterInput = {
    channelId?: InputMaybe<Scalars['ID']['input']>;
    channels?: InputMaybe<WaitlistWaitlistFilterChannelsInput>;
};
export type WaitlistWaitlistUser = {
    __typename?: 'WaitlistWaitlistUser';
    createdAt: Scalars['Timestamp']['output'];
    profile: ProfileProfile;
    signupOrigin?: Maybe<AuthSignupOrigin>;
    userId: Scalars['ID']['output'];
};
export type WalletAddCurrenciesResponse = {
    __typename?: 'WalletAddCurrenciesResponse';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type WalletGetWalletResponse = {
    __typename?: 'WalletGetWalletResponse';
    wallet: WalletWallet;
};
export type WalletListWalletTransactionsRequestFilterInput = {
    from?: InputMaybe<Scalars['InputTimestamp']['input']>;
    to?: InputMaybe<Scalars['InputTimestamp']['input']>;
};
export type WalletListWalletTransactionsResponse = {
    __typename?: 'WalletListWalletTransactionsResponse';
    pageInfo: ApiPageInfo;
    transactions: Array<WalletTransaction>;
};
export type WalletOperation = {
    __typename?: 'WalletOperation';
    currencyAmount: Scalars['Int']['output'];
    currencyBalance: Scalars['Int']['output'];
    currencyId: Scalars['ID']['output'];
    type: WalletOperationType;
};
export declare enum WalletOperationType {
    TypeAdd = "TYPE_ADD",
    TypeSubtract = "TYPE_SUBTRACT",
    TypeUnspecified = "TYPE_UNSPECIFIED"
}
export type WalletSubtractCurrenciesResponse = {
    __typename?: 'WalletSubtractCurrenciesResponse';
    emptyTypeWorkaround: Scalars['Boolean']['output'];
};
export type WalletTransaction = {
    __typename?: 'WalletTransaction';
    createdAt: Scalars['Timestamp']['output'];
    id: Scalars['ID']['output'];
    operations: Array<WalletOperation>;
    reason: ReasonReason;
    user: ProfileProfile;
    userId: Scalars['ID']['output'];
};
export type WalletTransactionEvent = {
    __typename?: 'WalletTransactionEvent';
    transaction: WalletTransaction;
};
export type WalletWallet = {
    __typename?: 'WalletWallet';
    currencies: Array<WalletWalletCurrency>;
    userId: Scalars['ID']['output'];
};
export type WalletWalletCurrency = {
    __typename?: 'WalletWalletCurrency';
    currencyAmount: Scalars['Int']['output'];
    currencyId: Scalars['ID']['output'];
};
export type WalletWalletCurrencyInput = {
    currencyAmount?: InputMaybe<Scalars['Int']['input']>;
    currencyId?: InputMaybe<Scalars['ID']['input']>;
};
export type AvatarMovementsQueryVariables = Exact<{
    userId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type AvatarMovementsQuery = {
    __typename?: 'Query';
    inventory?: {
        __typename?: 'InventoryListUserInventoryResponse';
        items: Array<{
            __typename?: 'InventoryInventoryItem';
            itemId: string;
            item: {
                __typename?: 'ItemItem';
                id: string;
                details?: {
                    __typename?: 'AvatarAnimation';
                    name: string;
                    chatCommand: string;
                    iconUrl: string;
                    id: string;
                } | {
                    __typename?: 'EmojiEmoji';
                } | {
                    __typename?: 'GameLogicCard';
                } | {
                    __typename?: 'GameLogicStreamerCard';
                } | null;
            };
        }>;
    } | null;
};
export type EmoteAvatarAnimationFragment = {
    __typename?: 'AvatarAnimation';
    name: string;
    chatCommand: string;
    iconUrl: string;
    id: string;
};
export type ChatMessageSenderProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
    channelId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type ChatMessageSenderProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        badges: Array<{
            __typename?: 'BadgeBadge';
            type: BadgeBadgeType;
            level: number;
        }>;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type ChatMessagesProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
};
export type EmojiDrawerChannelFragment = {
    __typename?: 'ChannelChannel';
    id: string;
    liveStatus: ChannelLiveStatus;
    logo: string;
    name: string;
};
export type LocalPlayerBoosterRequestProfileFragment = {
    __typename?: 'ProfileProfile';
    userTag: string;
};
export type OtherPlayerBoosterProfileFragment = {
    __typename?: 'ProfileProfile';
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type OtherBoosterRequestOtherProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type OtherBoosterRequestOtherProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type LocalBoosterRequestOtherProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type LocalBoosterRequestOtherProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
    } | null;
};
export type ChatProfilesQueryVariables = Exact<{
    userIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
    channelId: Scalars['ID']['input'];
}>;
export type ChatProfilesQuery = {
    __typename?: 'Query';
    profileBatch?: {
        __typename?: 'ProfileBatchGetProfilesResponse';
        profiles: Array<{
            __typename?: 'ProfileProfile';
            userId: string;
            userTag: string;
            onlineStatus: ProfilePresenceStatus;
            badges: Array<{
                __typename?: 'BadgeBadge';
                type: BadgeBadgeType;
                level: number;
            }>;
            avatars?: {
                __typename?: 'ProfileProfileAvatars';
                avatar2D: string;
            } | null;
            settings?: {
                __typename?: 'ProfileProfileSettings';
                privacy: {
                    __typename?: 'ProfilePrivacySettings';
                    hideOnlineStatus: boolean;
                };
            } | null;
        }>;
    } | null;
};
export type ChatModerationStatusQueryVariables = Exact<{
    chatId: Scalars['ID']['input'];
    userId: Scalars['ID']['input'];
}>;
export type ChatModerationStatusQuery = {
    __typename?: 'Query';
    chatUserStatus?: {
        __typename?: 'ChatGetChatUserStatusResponse';
        muted: boolean;
        muteDuration?: string | null;
    } | null;
};
export type ChatMessageWithSenderFragment = {
    __typename?: 'ChatChatMessage';
    senderId: string;
    chatId: string;
    state: ApiEntityState;
    messageId: string;
    createdAt: string;
    moderationStatus: ChatModerationStatus;
    sender: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    };
    content: {
        __typename?: 'ChatMessageContent';
        content?: {
            __typename?: 'ChatTextMessage';
            text: string;
            attachments: Array<{
                __typename?: 'ChatTextMessageAttachment';
                label: string;
                source: string;
                startIndex: number;
                endIndex: number;
            }>;
        } | {
            __typename?: 'ChatTombstone';
            emptyTypeWorkaround: boolean;
        } | null;
    };
};
export type ChatMessageFragment = {
    __typename?: 'ChatChatMessage';
    senderId: string;
    chatId: string;
    state: ApiEntityState;
    messageId: string;
    createdAt: string;
    moderationStatus: ChatModerationStatus;
    content: {
        __typename?: 'ChatMessageContent';
        content?: {
            __typename?: 'ChatTextMessage';
            text: string;
            attachments: Array<{
                __typename?: 'ChatTextMessageAttachment';
                label: string;
                source: string;
                startIndex: number;
                endIndex: number;
            }>;
        } | {
            __typename?: 'ChatTombstone';
            emptyTypeWorkaround: boolean;
        } | null;
    };
};
export type ChatMessageSenderProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type ChatHistoryQueryVariables = Exact<{
    chatId: Scalars['ID']['input'];
    channelId?: InputMaybe<Scalars['ID']['input']>;
    cursor?: InputMaybe<ApiCursorInput>;
}>;
export type ChatHistoryQuery = {
    __typename?: 'Query';
    chatMessages?: {
        __typename?: 'ChatListMessagesResponse';
        messages: Array<{
            __typename?: 'ChatChatMessage';
            senderId: string;
            chatId: string;
            state: ApiEntityState;
            messageId: string;
            createdAt: string;
            moderationStatus: ChatModerationStatus;
            sender: {
                __typename?: 'ProfileProfile';
                userId: string;
                userTag: string;
                onlineStatus: ProfilePresenceStatus;
                badges: Array<{
                    __typename?: 'BadgeBadge';
                    type: BadgeBadgeType;
                    level: number;
                }>;
                avatars?: {
                    __typename?: 'ProfileProfileAvatars';
                    avatar2D: string;
                } | null;
                settings?: {
                    __typename?: 'ProfileProfileSettings';
                    privacy: {
                        __typename?: 'ProfilePrivacySettings';
                        hideOnlineStatus: boolean;
                    };
                } | null;
            };
            content: {
                __typename?: 'ChatMessageContent';
                content?: {
                    __typename?: 'ChatTextMessage';
                    text: string;
                    attachments: Array<{
                        __typename?: 'ChatTextMessageAttachment';
                        label: string;
                        source: string;
                        startIndex: number;
                        endIndex: number;
                    }>;
                } | {
                    __typename?: 'ChatTombstone';
                    emptyTypeWorkaround: boolean;
                } | null;
            };
        }>;
    } | null;
};
export type ChatSubscriptionSubscriptionVariables = Exact<{
    chatId: Scalars['ID']['input'];
}>;
export type ChatSubscriptionSubscription = {
    __typename?: 'Subscription';
    chatMessageSubscribe?: {
        __typename?: 'ChatChatEvent';
        event?: {
            __typename?: 'ChatChatDetails';
        } | {
            __typename?: 'ChatChatMessage';
            senderId: string;
            chatId: string;
            state: ApiEntityState;
            messageId: string;
            createdAt: string;
            moderationStatus: ChatModerationStatus;
            content: {
                __typename?: 'ChatMessageContent';
                content?: {
                    __typename?: 'ChatTextMessage';
                    text: string;
                    attachments: Array<{
                        __typename?: 'ChatTextMessageAttachment';
                        label: string;
                        source: string;
                        startIndex: number;
                        endIndex: number;
                    }>;
                } | {
                    __typename?: 'ChatTombstone';
                    emptyTypeWorkaround: boolean;
                } | null;
            };
        } | {
            __typename?: 'ChatHideMessage';
            messageId: string;
        } | {
            __typename?: 'ChatMessageDenied';
            userId: string;
        } | {
            __typename?: 'ChatUserBanned';
            userId: string;
        } | {
            __typename?: 'ChatUserMuted';
            userId: string;
            duration: string;
        } | null;
    } | null;
};
export type SendChatMessageMutationVariables = Exact<{
    chatId: Scalars['ID']['input'];
    content: ChatTextMessageInput;
    consentToModeration?: InputMaybe<Scalars['Boolean']['input']>;
}>;
export type SendChatMessageMutation = {
    __typename?: 'Mutation';
    sendChatMessage?: {
        __typename?: 'ChatSendMessageResponse';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type ChatChannelEventsSubscriptionSubscriptionVariables = Exact<{
    channelId: Scalars['ID']['input'];
}>;
export type ChatChannelEventsSubscriptionSubscription = {
    __typename?: 'Subscription';
    channelEventsSubscribe?: {
        __typename?: 'ChannelChannelEvent';
        channelId: string;
        createdAt: string;
        id: string;
        content: {
            __typename?: 'ChannelChannelEventContent';
            content?: {
                __typename?: 'ChannelBundlePurchase';
                bundleName: string;
                userId: string;
                streamerCards?: Array<{
                    __typename?: 'GameLogicStreamerCard';
                    id: string;
                    channelId: string;
                    name: string;
                }> | null;
                user?: {
                    __typename?: 'ProfileProfile';
                    userId: string;
                    userTag: string;
                    onlineStatus: ProfilePresenceStatus;
                    badges: Array<{
                        __typename?: 'BadgeBadge';
                        type: BadgeBadgeType;
                        level: number;
                    }>;
                    avatars?: {
                        __typename?: 'ProfileProfileAvatars';
                        avatarFullbody: string;
                        avatar2D: string;
                    } | null;
                    friendshipStatus: {
                        __typename?: 'FriendsFriendshipStatus';
                        status: FriendsFriendshipStatusStatus;
                        lastStatusChange: string;
                    };
                    settings?: {
                        __typename?: 'ProfileProfileSettings';
                        privacy: {
                            __typename?: 'ProfilePrivacySettings';
                            hideOnlineStatus: boolean;
                        };
                    } | null;
                } | null;
            } | {
                __typename?: 'ChannelStreamerCardPurchase';
                userId: string;
                streamerCard: {
                    __typename?: 'GameLogicStreamerCard';
                    id: string;
                    name: string;
                    channelId: string;
                };
                user?: {
                    __typename?: 'ProfileProfile';
                    userId: string;
                    userTag: string;
                    onlineStatus: ProfilePresenceStatus;
                    badges: Array<{
                        __typename?: 'BadgeBadge';
                        type: BadgeBadgeType;
                        level: number;
                    }>;
                    avatars?: {
                        __typename?: 'ProfileProfileAvatars';
                        avatarFullbody: string;
                        avatar2D: string;
                    } | null;
                    friendshipStatus: {
                        __typename?: 'FriendsFriendshipStatus';
                        status: FriendsFriendshipStatusStatus;
                        lastStatusChange: string;
                    };
                    settings?: {
                        __typename?: 'ProfileProfileSettings';
                        privacy: {
                            __typename?: 'ProfilePrivacySettings';
                            hideOnlineStatus: boolean;
                        };
                    } | null;
                } | null;
            } | {
                __typename?: 'ChannelSubscriptionPurchase';
                userId: string;
                tier: number;
                user?: {
                    __typename?: 'ProfileProfile';
                    userId: string;
                    userTag: string;
                    onlineStatus: ProfilePresenceStatus;
                    badges: Array<{
                        __typename?: 'BadgeBadge';
                        type: BadgeBadgeType;
                        level: number;
                    }>;
                    avatars?: {
                        __typename?: 'ProfileProfileAvatars';
                        avatarFullbody: string;
                        avatar2D: string;
                    } | null;
                    friendshipStatus: {
                        __typename?: 'FriendsFriendshipStatus';
                        status: FriendsFriendshipStatusStatus;
                        lastStatusChange: string;
                    };
                    settings?: {
                        __typename?: 'ProfileProfileSettings';
                        privacy: {
                            __typename?: 'ProfilePrivacySettings';
                            hideOnlineStatus: boolean;
                        };
                    } | null;
                } | null;
            } | null;
        };
    } | null;
};
export type UseChatEmojisAndMentionsAttachmentFragment = {
    __typename?: 'ChatTextMessageAttachment';
    label: string;
    source: string;
    startIndex: number;
    endIndex: number;
};
export type UserInventoryEmojisEmojiFragment = {
    __typename?: 'EmojiEmoji';
    id: string;
    label: string;
    image: string;
    channelId: string;
};
export type UserInventoryEmojisQueryVariables = Exact<{
    userId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type UserInventoryEmojisQuery = {
    __typename?: 'Query';
    inventory?: {
        __typename?: 'InventoryListUserInventoryResponse';
        items: Array<{
            __typename?: 'InventoryInventoryItem';
            itemId: string;
            item: {
                __typename?: 'ItemItem';
                id: string;
                details?: {
                    __typename?: 'AvatarAnimation';
                } | {
                    __typename?: 'EmojiEmoji';
                    id: string;
                    label: string;
                    image: string;
                    channelId: string;
                } | {
                    __typename?: 'GameLogicCard';
                } | {
                    __typename?: 'GameLogicStreamerCard';
                } | null;
            };
        }>;
    } | null;
};
export type UserInventoryEmojisChannelFragment = {
    __typename?: 'ChannelChannel';
    id: string;
    liveStatus: ChannelLiveStatus;
    logo: string;
    name: string;
};
export type UserInventoryEmojisChannelsQueryVariables = Exact<{
    channelIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;
export type UserInventoryEmojisChannelsQuery = {
    __typename?: 'Query';
    getChannels?: {
        __typename?: 'ChannelBatchGetChannelsResponse';
        channels: Array<{
            __typename?: 'ChannelChannel';
            id: string;
            liveStatus: ChannelLiveStatus;
            logo: string;
            name: string;
        }>;
    } | null;
};
export type ChannelBannerChannelFragment = {
    __typename?: 'ChannelChannel';
    offlineBanner: string;
};
export type ChannelLogoChannelFragment = {
    __typename?: 'ChannelChannel';
    liveStatus: ChannelLiveStatus;
    logo: string;
    name: string;
};
export type PlatformAnnouncementFragment = {
    __typename?: 'AnnouncementAnnouncement';
    id: string;
    title: string;
    text: string;
    category: AnnouncementAnnouncementCategory;
    startTime?: string | null;
    image: string;
};
export type ProfileImageProfileFragment = {
    __typename?: 'ProfileProfile';
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type ReportedStreamerProfileQueryVariables = Exact<{
    channelId: Scalars['ID']['input'];
}>;
export type ReportedStreamerProfileQuery = {
    __typename?: 'Query';
    channel?: {
        __typename?: 'ChannelChannel';
        id: string;
        name: string;
        logo: string;
        liveStatus: ChannelLiveStatus;
    } | null;
};
export type ReportedUserProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type ReportedUserProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userTag: string;
        userId: string;
        onlineStatus: ProfilePresenceStatus;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type ReportStreamTimestampQueryVariables = Exact<{
    streamId: Scalars['ID']['input'];
}>;
export type ReportStreamTimestampQuery = {
    __typename?: 'Query';
    stream?: {
        __typename?: 'ChannelStream';
        streamId: string;
        segments: Array<{
            __typename?: 'ChannelStreamSegment';
            startTime: string;
        }>;
    } | null;
};
export type ReportUserMutationVariables = Exact<{
    reason: SupportReportReason;
    description?: InputMaybe<Scalars['String']['input']>;
    context: SupportReportContextInput;
}>;
export type ReportUserMutation = {
    __typename?: 'Mutation';
    createReport?: {
        __typename?: 'SupportReport';
        createdAt: string;
    } | null;
};
export type ChannelAssetCreateTokenMutationVariables = Exact<{
    channelId?: InputMaybe<Scalars['ID']['input']>;
    assetType?: InputMaybe<ChannelAssetType>;
}>;
export type ChannelAssetCreateTokenMutation = {
    __typename?: 'Mutation';
    createChannelAssetUploadToken?: {
        __typename?: 'ChannelCreateChannelAssetUploadTokenResponse';
        token: string;
    } | null;
};
export type LogoUpdateChannelChannelFragment = {
    __typename?: 'ChannelChannel';
    id: string;
    logo: string;
};
export type BannerUpdateChannelChannelFragment = {
    __typename?: 'ChannelChannel';
    id: string;
    offlineBanner: string;
};
export type EmojiAssetCreateTokenMutationVariables = Exact<{
    itemId: Scalars['ID']['input'];
}>;
export type EmojiAssetCreateTokenMutation = {
    __typename?: 'Mutation';
    createEmojiUploadToken?: {
        __typename?: 'EmojiCreateEmojiUploadTokenResponse';
        token: string;
    } | null;
};
export type AssetUploadEmojiEmojiFragment = {
    __typename?: 'EmojiEmoji';
    id: string;
    image: string;
};
export type StreamSpectatorCoordinationSubscribeSubscriptionVariables = Exact<{
    streamId: Scalars['ID']['input'];
}>;
export type StreamSpectatorCoordinationSubscribeSubscription = {
    __typename?: 'Subscription';
    streamSpectatorCoordinationEventsSubscribe?: {
        __typename?: 'MatchStreamSpectatorCoordinationEvent';
        event?: {
            __typename?: 'MatchStreamSpectatorChangeGroupEvent';
            groupId: string;
        } | null;
    } | null;
};
export type UpdateAvatarMutationVariables = Exact<{
    avatarId: Scalars['ID']['input'];
}>;
export type UpdateAvatarMutation = {
    __typename?: 'Mutation';
    updateProfileAvatar?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type WalletQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type WalletQuery = {
    __typename?: 'Query';
    wallet?: {
        __typename?: 'WalletGetWalletResponse';
        wallet: {
            __typename?: 'WalletWallet';
            currencies: Array<{
                __typename?: 'WalletWalletCurrency';
                currencyId: string;
                currencyAmount: number;
            }>;
        };
    } | null;
};
export type WalletCurrencyFragment = {
    __typename?: 'WalletWalletCurrency';
    currencyId: string;
    currencyAmount: number;
};
export type ActiveFriendsListProfileFragment = {
    __typename?: 'ProfileProfile';
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type BlockUserProfileFragment = {
    __typename?: 'ProfileProfile';
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type BlockedUserProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type BlockedUserProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type FriendRequestButtonProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
        lastStatusChange: string;
    };
};
export type ResolvedAddFriendUserTagQueryVariables = Exact<{
    userTag: Scalars['String']['input'];
}>;
export type ResolvedAddFriendUserTagQuery = {
    __typename?: 'Query';
    resolveUserTags?: {
        __typename?: 'ProfileResolveUserTagsResponse';
        userIds: Array<{
            __typename?: 'ProfileResolveUserTagsResponseUserIdsEntry';
            key: string;
            value: string;
        }>;
    } | null;
};
export type FriendsSidebarFriendFragment = {
    __typename?: 'FriendsUser';
    userId: string;
    lastStatusChange: string;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        onlineStatus: ProfilePresenceStatus;
        userTag: string;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
        };
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    };
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
            game: {
                __typename?: 'GameGame';
                id: string;
                name: string;
            };
        } | null;
    } | null;
};
export type FriendsSidebarFriendProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
    };
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type FriendsSidebarFriendButtonsProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
    };
};
export type FriendsSidebarFriendPanelProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type FriendsSidebarFriendPanelFriendFragment = {
    __typename?: 'FriendsUser';
    lastStatusChange: string;
    userId: string;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        onlineStatus: ProfilePresenceStatus;
        userTag: string;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
        };
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    };
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
            game: {
                __typename?: 'GameGame';
                id: string;
                name: string;
            };
        } | null;
    } | null;
};
export type FriendsSidebarFriendStatusFriendsUserFragment = {
    __typename?: 'FriendsUser';
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
            game: {
                __typename?: 'GameGame';
                id: string;
                name: string;
            };
        } | null;
    } | null;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        onlineStatus: ProfilePresenceStatus;
    };
};
export type FriendsSidebarFriendActionsFriendsUserFragment = {
    __typename?: 'FriendsUser';
    userId: string;
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
        } | null;
    } | null;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
        };
    };
};
export type FriendsSidebarFriendListFriendFragment = {
    __typename?: 'FriendsUser';
    userId: string;
    lastStatusChange: string;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        onlineStatus: ProfilePresenceStatus;
        userTag: string;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
        };
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    };
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
            game: {
                __typename?: 'GameGame';
                id: string;
                name: string;
            };
        } | null;
    } | null;
};
export type FriendsSidebarFriendListProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
    };
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type FriendSidebarFriendsQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
    cursor?: InputMaybe<Scalars['String']['input']>;
    pageSize?: Scalars['Int']['input'];
}>;
export type FriendSidebarFriendsQuery = {
    __typename?: 'Query';
    friends?: {
        __typename?: 'FriendsListFriendsResponse';
        pageInfo: {
            __typename?: 'APIPageInfo';
            endCursor: string;
            hasNextPage: boolean;
        };
        users: Array<{
            __typename?: 'FriendsUser';
            userId: string;
            lastStatusChange: string;
            profile: {
                __typename?: 'ProfileProfile';
                userId: string;
                onlineStatus: ProfilePresenceStatus;
                userTag: string;
                friendshipStatus: {
                    __typename?: 'FriendsFriendshipStatus';
                    status: FriendsFriendshipStatusStatus;
                };
                avatars?: {
                    __typename?: 'ProfileProfileAvatars';
                    avatar2D: string;
                } | null;
                settings?: {
                    __typename?: 'ProfileProfileSettings';
                    privacy: {
                        __typename?: 'ProfilePrivacySettings';
                        hideOnlineStatus: boolean;
                    };
                } | null;
            };
            activity?: {
                __typename?: 'FriendsActivity';
                isOnline: boolean;
                channel?: {
                    __typename?: 'ChannelChannel';
                    id: string;
                    name: string;
                    game: {
                        __typename?: 'GameGame';
                        id: string;
                        name: string;
                    };
                } | null;
            } | null;
        }>;
    } | null;
};
export type FriendsSidebarFriendsViewDataQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type FriendsSidebarFriendsViewDataQuery = {
    __typename?: 'Query';
    userParty?: {
        __typename?: 'PartyParty';
        leaderId: string;
        members: Array<{
            __typename?: 'PartyPartyMember';
            userId: string;
            profile: {
                __typename?: 'ProfileProfile';
                userId: string;
                userTag: string;
                onlineStatus: ProfilePresenceStatus;
                avatars?: {
                    __typename?: 'ProfileProfileAvatars';
                    avatar2D: string;
                } | null;
                friendshipStatus: {
                    __typename?: 'FriendsFriendshipStatus';
                    status: FriendsFriendshipStatusStatus;
                };
                settings?: {
                    __typename?: 'ProfileProfileSettings';
                    privacy: {
                        __typename?: 'ProfilePrivacySettings';
                        hideOnlineStatus: boolean;
                    };
                } | null;
            };
        }>;
    } | null;
    receivedFriendRequests?: {
        __typename?: 'FriendsListReceivedFriendRequestsResponse';
        users: Array<{
            __typename?: 'FriendsUser';
            userId: string;
            profile: {
                __typename?: 'ProfileProfile';
                userId: string;
            };
        }>;
    } | null;
};
export type PartyStreamChannelQueryVariables = Exact<{
    channelId: Scalars['ID']['input'];
}>;
export type PartyStreamChannelQuery = {
    __typename?: 'Query';
    channel?: {
        __typename?: 'ChannelChannel';
        id: string;
        currentStreamId: string;
        name: string;
        game: {
            __typename?: 'GameGame';
            id: string;
            name: string;
        };
    } | null;
};
export type FriendsSidebarInviteFriendsQueryVariables = Exact<{
    userId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type FriendsSidebarInviteFriendsQuery = {
    __typename?: 'Query';
    invitationCodes?: {
        __typename?: 'InvitationListInvitationCodesResponse';
        codes: Array<{
            __typename?: 'InvitationInvitationCode';
            code: string;
        }>;
    } | null;
};
export type FriendsSidebarMenuPendingRequestsQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type FriendsSidebarMenuPendingRequestsQuery = {
    __typename?: 'Query';
    receivedFriendRequests?: {
        __typename?: 'FriendsListReceivedFriendRequestsResponse';
        users: Array<{
            __typename?: 'FriendsUser';
            userId: string;
        }>;
    } | null;
};
export type FriendsSidebarPartyFriendFragment = {
    __typename?: 'FriendsUser';
    userId: string;
    lastStatusChange: string;
    profile: {
        __typename?: 'ProfileProfile';
        userId: string;
        onlineStatus: ProfilePresenceStatus;
        userTag: string;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
        };
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    };
    activity?: {
        __typename?: 'FriendsActivity';
        isOnline: boolean;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
            game: {
                __typename?: 'GameGame';
                id: string;
                name: string;
            };
        } | null;
    } | null;
};
export type FriendsSidebarPartyProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
    };
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type FriendsSidebarPendingViewDataQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type FriendsSidebarPendingViewDataQuery = {
    __typename?: 'Query';
    receivedFriendRequests?: {
        __typename?: 'FriendsListReceivedFriendRequestsResponse';
        users: Array<{
            __typename?: 'FriendsUser';
            userId: string;
            lastStatusChange: string;
            profile: {
                __typename?: 'ProfileProfile';
                userId: string;
                onlineStatus: ProfilePresenceStatus;
                userTag: string;
                friendshipStatus: {
                    __typename?: 'FriendsFriendshipStatus';
                    status: FriendsFriendshipStatusStatus;
                };
                avatars?: {
                    __typename?: 'ProfileProfileAvatars';
                    avatar2D: string;
                } | null;
                settings?: {
                    __typename?: 'ProfileProfileSettings';
                    privacy: {
                        __typename?: 'ProfilePrivacySettings';
                        hideOnlineStatus: boolean;
                    };
                } | null;
            };
            activity?: {
                __typename?: 'FriendsActivity';
                isOnline: boolean;
                channel?: {
                    __typename?: 'ChannelChannel';
                    id: string;
                    name: string;
                    game: {
                        __typename?: 'GameGame';
                        id: string;
                        name: string;
                    };
                } | null;
            } | null;
        }>;
    } | null;
    sentFriendRequests?: {
        __typename?: 'FriendsListSentFriendRequestsResponse';
        users: Array<{
            __typename?: 'FriendsUser';
            userId: string;
            lastStatusChange: string;
            profile: {
                __typename?: 'ProfileProfile';
                userId: string;
                onlineStatus: ProfilePresenceStatus;
                userTag: string;
                friendshipStatus: {
                    __typename?: 'FriendsFriendshipStatus';
                    status: FriendsFriendshipStatusStatus;
                };
                avatars?: {
                    __typename?: 'ProfileProfileAvatars';
                    avatar2D: string;
                } | null;
                settings?: {
                    __typename?: 'ProfileProfileSettings';
                    privacy: {
                        __typename?: 'ProfilePrivacySettings';
                        hideOnlineStatus: boolean;
                    };
                } | null;
            };
            activity?: {
                __typename?: 'FriendsActivity';
                isOnline: boolean;
                channel?: {
                    __typename?: 'ChannelChannel';
                    id: string;
                    name: string;
                    game: {
                        __typename?: 'GameGame';
                        id: string;
                        name: string;
                    };
                } | null;
            } | null;
        }>;
    } | null;
};
export type MiniProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatarFullbody: string;
        avatar2D: string;
    } | null;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
        lastStatusChange: string;
    };
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type MiniProfileBadgeFragment = {
    __typename?: 'BadgeBadge';
    type: BadgeBadgeType;
    level: number;
};
export type MiniProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
    channelId?: InputMaybe<Scalars['ID']['input']>;
}>;
export type MiniProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        friendshipStatus: {
            __typename?: 'FriendsFriendshipStatus';
            status: FriendsFriendshipStatusStatus;
            lastStatusChange: string;
        };
        badges: Array<{
            __typename?: 'BadgeBadge';
            type: BadgeBadgeType;
            level: number;
        }>;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatarFullbody: string;
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type PartyInvitePartyFragment = {
    __typename?: 'PartyParty';
    id: string;
    streamId: string;
    channel?: {
        __typename?: 'ChannelChannel';
        id: string;
        name: string;
    } | null;
};
export type PartyInviteLeaderProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    userTag: string;
    onlineStatus: ProfilePresenceStatus;
    avatars?: {
        __typename?: 'ProfileProfileAvatars';
        avatar2D: string;
    } | null;
    settings?: {
        __typename?: 'ProfileProfileSettings';
        privacy: {
            __typename?: 'ProfilePrivacySettings';
            hideOnlineStatus: boolean;
        };
    } | null;
};
export type PartyInviterProfileQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type PartyInviterProfileQuery = {
    __typename?: 'Query';
    profile?: {
        __typename?: 'ProfileProfile';
        userId: string;
        userTag: string;
        onlineStatus: ProfilePresenceStatus;
        avatars?: {
            __typename?: 'ProfileProfileAvatars';
            avatar2D: string;
        } | null;
        settings?: {
            __typename?: 'ProfileProfileSettings';
            privacy: {
                __typename?: 'ProfilePrivacySettings';
                hideOnlineStatus: boolean;
            };
        } | null;
    } | null;
};
export type PartyInviterPartyQueryVariables = Exact<{
    partyId: Scalars['ID']['input'];
}>;
export type PartyInviterPartyQuery = {
    __typename?: 'Query';
    party?: {
        __typename?: 'PartyParty';
        id: string;
        streamId: string;
        channel?: {
            __typename?: 'ChannelChannel';
            id: string;
            name: string;
        } | null;
    } | null;
};
export type UserBadgeFragment = {
    __typename?: 'BadgeBadge';
    type: BadgeBadgeType;
    level: number;
};
export type LeavePartyMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    partyId: Scalars['ID']['input'];
}>;
export type LeavePartyMutation = {
    __typename?: 'Mutation';
    deletePartyMember?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type CreatePartyMutationVariables = Exact<{
    leaderId: Scalars['ID']['input'];
}>;
export type CreatePartyMutation = {
    __typename?: 'Mutation';
    createParty?: {
        __typename?: 'PartyParty';
        id: string;
    } | null;
};
export type CreatePartyInvitationMutationVariables = Exact<{
    inviterId: Scalars['ID']['input'];
    inviteeId: Scalars['ID']['input'];
    partyId: Scalars['ID']['input'];
}>;
export type CreatePartyInvitationMutation = {
    __typename?: 'Mutation';
    createPartyInvitation?: {
        __typename?: 'PartyPartyInvitation';
        partyId: string;
    } | null;
};
export type PartyInvitesCreatePartyMemberMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    partyId: Scalars['ID']['input'];
}>;
export type PartyInvitesCreatePartyMemberMutation = {
    __typename?: 'Mutation';
    createPartyMember?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type PartyInvitesDeletePartyInviteMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    partyId: Scalars['ID']['input'];
}>;
export type PartyInvitesDeletePartyInviteMutation = {
    __typename?: 'Mutation';
    deletePartyInvitation?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type PartyInvitesCurrentPartyQueryVariables = Exact<{
    userId: Scalars['ID']['input'];
}>;
export type PartyInvitesCurrentPartyQuery = {
    __typename?: 'Query';
    userParty?: {
        __typename?: 'PartyParty';
        id: string;
        leaderId: string;
        streamId: string;
        members: Array<{
            __typename?: 'PartyPartyMember';
            userId: string;
        }>;
    } | null;
};
export type PartyInvitesPartyUpdatesSubscriptionVariables = Exact<{
    partyId: Scalars['ID']['input'];
}>;
export type PartyInvitesPartyUpdatesSubscription = {
    __typename?: 'Subscription';
    partyUpdateSubscribe?: {
        __typename?: 'PartyPartyUpdateEvent';
        party: {
            __typename?: 'PartyParty';
            id: string;
            streamId: string;
            leaderId: string;
            members: Array<{
                __typename?: 'PartyPartyMember';
                userId: string;
                profile: {
                    __typename?: 'ProfileProfile';
                    userId: string;
                };
            }>;
        };
    } | null;
};
export type FriendStatusUpdateProfileFragment = {
    __typename?: 'ProfileProfile';
    userId: string;
    friendshipStatus: {
        __typename?: 'FriendsFriendshipStatus';
        status: FriendsFriendshipStatusStatus;
    };
};
export type SocialAcceptFriendRequestMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    friendId: Scalars['ID']['input'];
}>;
export type SocialAcceptFriendRequestMutation = {
    __typename?: 'Mutation';
    acceptFriendRequest?: {
        __typename?: 'FriendsAcceptFriendRequestResponse';
        friendId: string;
        friend: {
            __typename?: 'ProfileProfile';
            userId: string;
            friendshipStatus: {
                __typename?: 'FriendsFriendshipStatus';
                status: FriendsFriendshipStatusStatus;
            };
        };
    } | null;
};
export type NewFriendRequestUserFragment = {
    __typename?: 'FriendsUser';
    userId: string;
};
export type SocialBlockUserMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    blockedUserId: Scalars['ID']['input'];
}>;
export type SocialBlockUserMutation = {
    __typename?: 'Mutation';
    blockUser?: {
        __typename?: 'FriendsBlockUserResponse';
        blockedUserId: string;
        blockedUser: {
            __typename?: 'ProfileProfile';
            userId: string;
            friendshipStatus: {
                __typename?: 'FriendsFriendshipStatus';
                status: FriendsFriendshipStatusStatus;
            };
        };
    } | null;
};
export type SocialRemoveFriendMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    friendId: Scalars['ID']['input'];
}>;
export type SocialRemoveFriendMutation = {
    __typename?: 'Mutation';
    removeFriend?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type SocialRemoveReceivedFriendRequestMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    friendId: Scalars['ID']['input'];
}>;
export type SocialRemoveReceivedFriendRequestMutation = {
    __typename?: 'Mutation';
    removeFriendRequest?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type SocialRemoveSentFriendRequestMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    friendId: Scalars['ID']['input'];
}>;
export type SocialRemoveSentFriendRequestMutation = {
    __typename?: 'Mutation';
    removeFriendRequest?: {
        __typename?: 'GoogleProtobufEmpty';
        emptyTypeWorkaround: boolean;
    } | null;
};
export type SocialSendFriendRequestMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    friendId: Scalars['ID']['input'];
}>;
export type SocialSendFriendRequestMutation = {
    __typename?: 'Mutation';
    sendFriendRequest?: {
        __typename?: 'FriendsSendFriendRequestResponse';
        friendId: string;
        friend: {
            __typename?: 'ProfileProfile';
            userId: string;
            friendshipStatus: {
                __typename?: 'FriendsFriendshipStatus';
                status: FriendsFriendshipStatusStatus;
            };
        };
    } | null;
};
export type SocialUnblockUserMutationVariables = Exact<{
    userId: Scalars['ID']['input'];
    blockedUserId: Scalars['ID']['input'];
}>;
export type SocialUnblockUserMutation = {
    __typename?: 'Mutation';
    unblockUser?: {
        __typename?: 'FriendsUnblockUserResponse';
        unblockedUserId: string;
        unblockedUser: {
            __typename?: 'ProfileProfile';
            userId: string;
            friendshipStatus: {
                __typename?: 'FriendsFriendshipStatus';
                status: FriendsFriendshipStatusStatus;
            };
        };
    } | null;
};
export declare const EmoteAvatarAnimationFragmentDoc: Apollo.DocumentNode;
export declare const ChatMessagesProfileFragmentDoc: Apollo.DocumentNode;
export declare const LocalPlayerBoosterRequestProfileFragmentDoc: Apollo.DocumentNode;
export declare const ProfileImageProfileFragmentDoc: Apollo.DocumentNode;
export declare const OtherPlayerBoosterProfileFragmentDoc: Apollo.DocumentNode;
export declare const UseChatEmojisAndMentionsAttachmentFragmentDoc: Apollo.DocumentNode;
export declare const ChatMessageFragmentDoc: Apollo.DocumentNode;
export declare const ChatMessageSenderProfileFragmentDoc: Apollo.DocumentNode;
export declare const ChatMessageWithSenderFragmentDoc: Apollo.DocumentNode;
export declare const UserInventoryEmojisEmojiFragmentDoc: Apollo.DocumentNode;
export declare const ChannelLogoChannelFragmentDoc: Apollo.DocumentNode;
export declare const EmojiDrawerChannelFragmentDoc: Apollo.DocumentNode;
export declare const UserInventoryEmojisChannelFragmentDoc: Apollo.DocumentNode;
export declare const ChannelBannerChannelFragmentDoc: Apollo.DocumentNode;
export declare const PlatformAnnouncementFragmentDoc: Apollo.DocumentNode;
export declare const LogoUpdateChannelChannelFragmentDoc: Apollo.DocumentNode;
export declare const BannerUpdateChannelChannelFragmentDoc: Apollo.DocumentNode;
export declare const AssetUploadEmojiEmojiFragmentDoc: Apollo.DocumentNode;
export declare const WalletCurrencyFragmentDoc: Apollo.DocumentNode;
export declare const ActiveFriendsListProfileFragmentDoc: Apollo.DocumentNode;
export declare const BlockUserProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendPanelProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendButtonsProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendStatusFriendsUserFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendActionsFriendsUserFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendPanelFriendFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendListFriendFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarFriendListProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarPartyFriendFragmentDoc: Apollo.DocumentNode;
export declare const FriendsSidebarPartyProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendRequestButtonProfileFragmentDoc: Apollo.DocumentNode;
export declare const MiniProfileFragmentDoc: Apollo.DocumentNode;
export declare const UserBadgeFragmentDoc: Apollo.DocumentNode;
export declare const MiniProfileBadgeFragmentDoc: Apollo.DocumentNode;
export declare const PartyInvitePartyFragmentDoc: Apollo.DocumentNode;
export declare const PartyInviteLeaderProfileFragmentDoc: Apollo.DocumentNode;
export declare const FriendStatusUpdateProfileFragmentDoc: Apollo.DocumentNode;
export declare const NewFriendRequestUserFragmentDoc: Apollo.DocumentNode;
export declare const AvatarMovementsDocument: Apollo.DocumentNode;
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
export declare function useAvatarMovementsQuery(baseOptions?: Apollo.QueryHookOptions<AvatarMovementsQuery, AvatarMovementsQueryVariables>): Apollo.QueryResult<AvatarMovementsQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export declare function useAvatarMovementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvatarMovementsQuery, AvatarMovementsQueryVariables>): Apollo.LazyQueryResultTuple<AvatarMovementsQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export type AvatarMovementsQueryHookResult = ReturnType<typeof useAvatarMovementsQuery>;
export type AvatarMovementsLazyQueryHookResult = ReturnType<typeof useAvatarMovementsLazyQuery>;
export type AvatarMovementsQueryResult = Apollo.QueryResult<AvatarMovementsQuery, AvatarMovementsQueryVariables>;
export declare const ChatMessageSenderProfileDocument: Apollo.DocumentNode;
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
export declare function useChatMessageSenderProfileQuery(baseOptions: Apollo.QueryHookOptions<ChatMessageSenderProfileQuery, ChatMessageSenderProfileQueryVariables>): Apollo.QueryResult<ChatMessageSenderProfileQuery, Exact<{
    userId: string;
    channelId?: InputMaybe<string> | undefined;
}>>;
export declare function useChatMessageSenderProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatMessageSenderProfileQuery, ChatMessageSenderProfileQueryVariables>): Apollo.LazyQueryResultTuple<ChatMessageSenderProfileQuery, Exact<{
    userId: string;
    channelId?: InputMaybe<string> | undefined;
}>>;
export type ChatMessageSenderProfileQueryHookResult = ReturnType<typeof useChatMessageSenderProfileQuery>;
export type ChatMessageSenderProfileLazyQueryHookResult = ReturnType<typeof useChatMessageSenderProfileLazyQuery>;
export type ChatMessageSenderProfileQueryResult = Apollo.QueryResult<ChatMessageSenderProfileQuery, ChatMessageSenderProfileQueryVariables>;
export declare const OtherBoosterRequestOtherProfileDocument: Apollo.DocumentNode;
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
export declare function useOtherBoosterRequestOtherProfileQuery(baseOptions: Apollo.QueryHookOptions<OtherBoosterRequestOtherProfileQuery, OtherBoosterRequestOtherProfileQueryVariables>): Apollo.QueryResult<OtherBoosterRequestOtherProfileQuery, Exact<{
    userId: string;
}>>;
export declare function useOtherBoosterRequestOtherProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OtherBoosterRequestOtherProfileQuery, OtherBoosterRequestOtherProfileQueryVariables>): Apollo.LazyQueryResultTuple<OtherBoosterRequestOtherProfileQuery, Exact<{
    userId: string;
}>>;
export type OtherBoosterRequestOtherProfileQueryHookResult = ReturnType<typeof useOtherBoosterRequestOtherProfileQuery>;
export type OtherBoosterRequestOtherProfileLazyQueryHookResult = ReturnType<typeof useOtherBoosterRequestOtherProfileLazyQuery>;
export type OtherBoosterRequestOtherProfileQueryResult = Apollo.QueryResult<OtherBoosterRequestOtherProfileQuery, OtherBoosterRequestOtherProfileQueryVariables>;
export declare const LocalBoosterRequestOtherProfileDocument: Apollo.DocumentNode;
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
export declare function useLocalBoosterRequestOtherProfileQuery(baseOptions: Apollo.QueryHookOptions<LocalBoosterRequestOtherProfileQuery, LocalBoosterRequestOtherProfileQueryVariables>): Apollo.QueryResult<LocalBoosterRequestOtherProfileQuery, Exact<{
    userId: string;
}>>;
export declare function useLocalBoosterRequestOtherProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LocalBoosterRequestOtherProfileQuery, LocalBoosterRequestOtherProfileQueryVariables>): Apollo.LazyQueryResultTuple<LocalBoosterRequestOtherProfileQuery, Exact<{
    userId: string;
}>>;
export type LocalBoosterRequestOtherProfileQueryHookResult = ReturnType<typeof useLocalBoosterRequestOtherProfileQuery>;
export type LocalBoosterRequestOtherProfileLazyQueryHookResult = ReturnType<typeof useLocalBoosterRequestOtherProfileLazyQuery>;
export type LocalBoosterRequestOtherProfileQueryResult = Apollo.QueryResult<LocalBoosterRequestOtherProfileQuery, LocalBoosterRequestOtherProfileQueryVariables>;
export declare const ChatProfilesDocument: Apollo.DocumentNode;
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
export declare function useChatProfilesQuery(baseOptions: Apollo.QueryHookOptions<ChatProfilesQuery, ChatProfilesQueryVariables>): Apollo.QueryResult<ChatProfilesQuery, Exact<{
    userIds: string | string[];
    channelId: string;
}>>;
export declare function useChatProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatProfilesQuery, ChatProfilesQueryVariables>): Apollo.LazyQueryResultTuple<ChatProfilesQuery, Exact<{
    userIds: string | string[];
    channelId: string;
}>>;
export type ChatProfilesQueryHookResult = ReturnType<typeof useChatProfilesQuery>;
export type ChatProfilesLazyQueryHookResult = ReturnType<typeof useChatProfilesLazyQuery>;
export type ChatProfilesQueryResult = Apollo.QueryResult<ChatProfilesQuery, ChatProfilesQueryVariables>;
export declare const ChatModerationStatusDocument: Apollo.DocumentNode;
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
export declare function useChatModerationStatusQuery(baseOptions: Apollo.QueryHookOptions<ChatModerationStatusQuery, ChatModerationStatusQueryVariables>): Apollo.QueryResult<ChatModerationStatusQuery, Exact<{
    chatId: string;
    userId: string;
}>>;
export declare function useChatModerationStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatModerationStatusQuery, ChatModerationStatusQueryVariables>): Apollo.LazyQueryResultTuple<ChatModerationStatusQuery, Exact<{
    chatId: string;
    userId: string;
}>>;
export type ChatModerationStatusQueryHookResult = ReturnType<typeof useChatModerationStatusQuery>;
export type ChatModerationStatusLazyQueryHookResult = ReturnType<typeof useChatModerationStatusLazyQuery>;
export type ChatModerationStatusQueryResult = Apollo.QueryResult<ChatModerationStatusQuery, ChatModerationStatusQueryVariables>;
export declare const ChatHistoryDocument: Apollo.DocumentNode;
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
export declare function useChatHistoryQuery(baseOptions: Apollo.QueryHookOptions<ChatHistoryQuery, ChatHistoryQueryVariables>): Apollo.QueryResult<ChatHistoryQuery, Exact<{
    chatId: string;
    channelId?: InputMaybe<string> | undefined;
    cursor?: InputMaybe<ApiCursorInput> | undefined;
}>>;
export declare function useChatHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatHistoryQuery, ChatHistoryQueryVariables>): Apollo.LazyQueryResultTuple<ChatHistoryQuery, Exact<{
    chatId: string;
    channelId?: InputMaybe<string> | undefined;
    cursor?: InputMaybe<ApiCursorInput> | undefined;
}>>;
export type ChatHistoryQueryHookResult = ReturnType<typeof useChatHistoryQuery>;
export type ChatHistoryLazyQueryHookResult = ReturnType<typeof useChatHistoryLazyQuery>;
export type ChatHistoryQueryResult = Apollo.QueryResult<ChatHistoryQuery, ChatHistoryQueryVariables>;
export declare const ChatSubscriptionDocument: Apollo.DocumentNode;
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
export declare function useChatSubscriptionSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatSubscriptionSubscription, ChatSubscriptionSubscriptionVariables>): Apollo.SubscriptionResult<ChatSubscriptionSubscription, any>;
export type ChatSubscriptionSubscriptionHookResult = ReturnType<typeof useChatSubscriptionSubscription>;
export type ChatSubscriptionSubscriptionResult = Apollo.SubscriptionResult<ChatSubscriptionSubscription>;
export declare const SendChatMessageDocument: Apollo.DocumentNode;
export type SendChatMessageMutationFn = Apollo.MutationFunction<SendChatMessageMutation, SendChatMessageMutationVariables>;
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
export declare function useSendChatMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendChatMessageMutation, SendChatMessageMutationVariables>): Apollo.MutationTuple<SendChatMessageMutation, Exact<{
    chatId: string;
    content: ChatTextMessageInput;
    consentToModeration?: InputMaybe<boolean> | undefined;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SendChatMessageMutationHookResult = ReturnType<typeof useSendChatMessageMutation>;
export type SendChatMessageMutationResult = Apollo.MutationResult<SendChatMessageMutation>;
export type SendChatMessageMutationOptions = Apollo.BaseMutationOptions<SendChatMessageMutation, SendChatMessageMutationVariables>;
export declare const ChatChannelEventsSubscriptionDocument: Apollo.DocumentNode;
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
export declare function useChatChannelEventsSubscriptionSubscription(baseOptions: Apollo.SubscriptionHookOptions<ChatChannelEventsSubscriptionSubscription, ChatChannelEventsSubscriptionSubscriptionVariables>): Apollo.SubscriptionResult<ChatChannelEventsSubscriptionSubscription, any>;
export type ChatChannelEventsSubscriptionSubscriptionHookResult = ReturnType<typeof useChatChannelEventsSubscriptionSubscription>;
export type ChatChannelEventsSubscriptionSubscriptionResult = Apollo.SubscriptionResult<ChatChannelEventsSubscriptionSubscription>;
export declare const UserInventoryEmojisDocument: Apollo.DocumentNode;
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
export declare function useUserInventoryEmojisQuery(baseOptions?: Apollo.QueryHookOptions<UserInventoryEmojisQuery, UserInventoryEmojisQueryVariables>): Apollo.QueryResult<UserInventoryEmojisQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export declare function useUserInventoryEmojisLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserInventoryEmojisQuery, UserInventoryEmojisQueryVariables>): Apollo.LazyQueryResultTuple<UserInventoryEmojisQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export type UserInventoryEmojisQueryHookResult = ReturnType<typeof useUserInventoryEmojisQuery>;
export type UserInventoryEmojisLazyQueryHookResult = ReturnType<typeof useUserInventoryEmojisLazyQuery>;
export type UserInventoryEmojisQueryResult = Apollo.QueryResult<UserInventoryEmojisQuery, UserInventoryEmojisQueryVariables>;
export declare const UserInventoryEmojisChannelsDocument: Apollo.DocumentNode;
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
export declare function useUserInventoryEmojisChannelsQuery(baseOptions?: Apollo.QueryHookOptions<UserInventoryEmojisChannelsQuery, UserInventoryEmojisChannelsQueryVariables>): Apollo.QueryResult<UserInventoryEmojisChannelsQuery, Exact<{
    channelIds?: InputMaybe<string | string[]> | undefined;
}>>;
export declare function useUserInventoryEmojisChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserInventoryEmojisChannelsQuery, UserInventoryEmojisChannelsQueryVariables>): Apollo.LazyQueryResultTuple<UserInventoryEmojisChannelsQuery, Exact<{
    channelIds?: InputMaybe<string | string[]> | undefined;
}>>;
export type UserInventoryEmojisChannelsQueryHookResult = ReturnType<typeof useUserInventoryEmojisChannelsQuery>;
export type UserInventoryEmojisChannelsLazyQueryHookResult = ReturnType<typeof useUserInventoryEmojisChannelsLazyQuery>;
export type UserInventoryEmojisChannelsQueryResult = Apollo.QueryResult<UserInventoryEmojisChannelsQuery, UserInventoryEmojisChannelsQueryVariables>;
export declare const ReportedStreamerProfileDocument: Apollo.DocumentNode;
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
export declare function useReportedStreamerProfileQuery(baseOptions: Apollo.QueryHookOptions<ReportedStreamerProfileQuery, ReportedStreamerProfileQueryVariables>): Apollo.QueryResult<ReportedStreamerProfileQuery, Exact<{
    channelId: string;
}>>;
export declare function useReportedStreamerProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportedStreamerProfileQuery, ReportedStreamerProfileQueryVariables>): Apollo.LazyQueryResultTuple<ReportedStreamerProfileQuery, Exact<{
    channelId: string;
}>>;
export type ReportedStreamerProfileQueryHookResult = ReturnType<typeof useReportedStreamerProfileQuery>;
export type ReportedStreamerProfileLazyQueryHookResult = ReturnType<typeof useReportedStreamerProfileLazyQuery>;
export type ReportedStreamerProfileQueryResult = Apollo.QueryResult<ReportedStreamerProfileQuery, ReportedStreamerProfileQueryVariables>;
export declare const ReportedUserProfileDocument: Apollo.DocumentNode;
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
export declare function useReportedUserProfileQuery(baseOptions: Apollo.QueryHookOptions<ReportedUserProfileQuery, ReportedUserProfileQueryVariables>): Apollo.QueryResult<ReportedUserProfileQuery, Exact<{
    userId: string;
}>>;
export declare function useReportedUserProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportedUserProfileQuery, ReportedUserProfileQueryVariables>): Apollo.LazyQueryResultTuple<ReportedUserProfileQuery, Exact<{
    userId: string;
}>>;
export type ReportedUserProfileQueryHookResult = ReturnType<typeof useReportedUserProfileQuery>;
export type ReportedUserProfileLazyQueryHookResult = ReturnType<typeof useReportedUserProfileLazyQuery>;
export type ReportedUserProfileQueryResult = Apollo.QueryResult<ReportedUserProfileQuery, ReportedUserProfileQueryVariables>;
export declare const ReportStreamTimestampDocument: Apollo.DocumentNode;
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
export declare function useReportStreamTimestampQuery(baseOptions: Apollo.QueryHookOptions<ReportStreamTimestampQuery, ReportStreamTimestampQueryVariables>): Apollo.QueryResult<ReportStreamTimestampQuery, Exact<{
    streamId: string;
}>>;
export declare function useReportStreamTimestampLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportStreamTimestampQuery, ReportStreamTimestampQueryVariables>): Apollo.LazyQueryResultTuple<ReportStreamTimestampQuery, Exact<{
    streamId: string;
}>>;
export type ReportStreamTimestampQueryHookResult = ReturnType<typeof useReportStreamTimestampQuery>;
export type ReportStreamTimestampLazyQueryHookResult = ReturnType<typeof useReportStreamTimestampLazyQuery>;
export type ReportStreamTimestampQueryResult = Apollo.QueryResult<ReportStreamTimestampQuery, ReportStreamTimestampQueryVariables>;
export declare const ReportUserDocument: Apollo.DocumentNode;
export type ReportUserMutationFn = Apollo.MutationFunction<ReportUserMutation, ReportUserMutationVariables>;
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
export declare function useReportUserMutation(baseOptions?: Apollo.MutationHookOptions<ReportUserMutation, ReportUserMutationVariables>): Apollo.MutationTuple<ReportUserMutation, Exact<{
    reason: SupportReportReason;
    description?: InputMaybe<string> | undefined;
    context: SupportReportContextInput;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type ReportUserMutationHookResult = ReturnType<typeof useReportUserMutation>;
export type ReportUserMutationResult = Apollo.MutationResult<ReportUserMutation>;
export type ReportUserMutationOptions = Apollo.BaseMutationOptions<ReportUserMutation, ReportUserMutationVariables>;
export declare const ChannelAssetCreateTokenDocument: Apollo.DocumentNode;
export type ChannelAssetCreateTokenMutationFn = Apollo.MutationFunction<ChannelAssetCreateTokenMutation, ChannelAssetCreateTokenMutationVariables>;
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
export declare function useChannelAssetCreateTokenMutation(baseOptions?: Apollo.MutationHookOptions<ChannelAssetCreateTokenMutation, ChannelAssetCreateTokenMutationVariables>): Apollo.MutationTuple<ChannelAssetCreateTokenMutation, Exact<{
    channelId?: InputMaybe<string> | undefined;
    assetType?: InputMaybe<ChannelAssetType> | undefined;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type ChannelAssetCreateTokenMutationHookResult = ReturnType<typeof useChannelAssetCreateTokenMutation>;
export type ChannelAssetCreateTokenMutationResult = Apollo.MutationResult<ChannelAssetCreateTokenMutation>;
export type ChannelAssetCreateTokenMutationOptions = Apollo.BaseMutationOptions<ChannelAssetCreateTokenMutation, ChannelAssetCreateTokenMutationVariables>;
export declare const EmojiAssetCreateTokenDocument: Apollo.DocumentNode;
export type EmojiAssetCreateTokenMutationFn = Apollo.MutationFunction<EmojiAssetCreateTokenMutation, EmojiAssetCreateTokenMutationVariables>;
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
export declare function useEmojiAssetCreateTokenMutation(baseOptions?: Apollo.MutationHookOptions<EmojiAssetCreateTokenMutation, EmojiAssetCreateTokenMutationVariables>): Apollo.MutationTuple<EmojiAssetCreateTokenMutation, Exact<{
    itemId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type EmojiAssetCreateTokenMutationHookResult = ReturnType<typeof useEmojiAssetCreateTokenMutation>;
export type EmojiAssetCreateTokenMutationResult = Apollo.MutationResult<EmojiAssetCreateTokenMutation>;
export type EmojiAssetCreateTokenMutationOptions = Apollo.BaseMutationOptions<EmojiAssetCreateTokenMutation, EmojiAssetCreateTokenMutationVariables>;
export declare const StreamSpectatorCoordinationSubscribeDocument: Apollo.DocumentNode;
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
export declare function useStreamSpectatorCoordinationSubscribeSubscription(baseOptions: Apollo.SubscriptionHookOptions<StreamSpectatorCoordinationSubscribeSubscription, StreamSpectatorCoordinationSubscribeSubscriptionVariables>): Apollo.SubscriptionResult<StreamSpectatorCoordinationSubscribeSubscription, any>;
export type StreamSpectatorCoordinationSubscribeSubscriptionHookResult = ReturnType<typeof useStreamSpectatorCoordinationSubscribeSubscription>;
export type StreamSpectatorCoordinationSubscribeSubscriptionResult = Apollo.SubscriptionResult<StreamSpectatorCoordinationSubscribeSubscription>;
export declare const UpdateAvatarDocument: Apollo.DocumentNode;
export type UpdateAvatarMutationFn = Apollo.MutationFunction<UpdateAvatarMutation, UpdateAvatarMutationVariables>;
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
export declare function useUpdateAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAvatarMutation, UpdateAvatarMutationVariables>): Apollo.MutationTuple<UpdateAvatarMutation, Exact<{
    avatarId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type UpdateAvatarMutationHookResult = ReturnType<typeof useUpdateAvatarMutation>;
export type UpdateAvatarMutationResult = Apollo.MutationResult<UpdateAvatarMutation>;
export type UpdateAvatarMutationOptions = Apollo.BaseMutationOptions<UpdateAvatarMutation, UpdateAvatarMutationVariables>;
export declare const WalletDocument: Apollo.DocumentNode;
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
export declare function useWalletQuery(baseOptions: Apollo.QueryHookOptions<WalletQuery, WalletQueryVariables>): Apollo.QueryResult<WalletQuery, Exact<{
    userId: string;
}>>;
export declare function useWalletLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalletQuery, WalletQueryVariables>): Apollo.LazyQueryResultTuple<WalletQuery, Exact<{
    userId: string;
}>>;
export type WalletQueryHookResult = ReturnType<typeof useWalletQuery>;
export type WalletLazyQueryHookResult = ReturnType<typeof useWalletLazyQuery>;
export type WalletQueryResult = Apollo.QueryResult<WalletQuery, WalletQueryVariables>;
export declare const BlockedUserProfileDocument: Apollo.DocumentNode;
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
export declare function useBlockedUserProfileQuery(baseOptions: Apollo.QueryHookOptions<BlockedUserProfileQuery, BlockedUserProfileQueryVariables>): Apollo.QueryResult<BlockedUserProfileQuery, Exact<{
    userId: string;
}>>;
export declare function useBlockedUserProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockedUserProfileQuery, BlockedUserProfileQueryVariables>): Apollo.LazyQueryResultTuple<BlockedUserProfileQuery, Exact<{
    userId: string;
}>>;
export type BlockedUserProfileQueryHookResult = ReturnType<typeof useBlockedUserProfileQuery>;
export type BlockedUserProfileLazyQueryHookResult = ReturnType<typeof useBlockedUserProfileLazyQuery>;
export type BlockedUserProfileQueryResult = Apollo.QueryResult<BlockedUserProfileQuery, BlockedUserProfileQueryVariables>;
export declare const ResolvedAddFriendUserTagDocument: Apollo.DocumentNode;
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
export declare function useResolvedAddFriendUserTagQuery(baseOptions: Apollo.QueryHookOptions<ResolvedAddFriendUserTagQuery, ResolvedAddFriendUserTagQueryVariables>): Apollo.QueryResult<ResolvedAddFriendUserTagQuery, Exact<{
    userTag: string;
}>>;
export declare function useResolvedAddFriendUserTagLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResolvedAddFriendUserTagQuery, ResolvedAddFriendUserTagQueryVariables>): Apollo.LazyQueryResultTuple<ResolvedAddFriendUserTagQuery, Exact<{
    userTag: string;
}>>;
export type ResolvedAddFriendUserTagQueryHookResult = ReturnType<typeof useResolvedAddFriendUserTagQuery>;
export type ResolvedAddFriendUserTagLazyQueryHookResult = ReturnType<typeof useResolvedAddFriendUserTagLazyQuery>;
export type ResolvedAddFriendUserTagQueryResult = Apollo.QueryResult<ResolvedAddFriendUserTagQuery, ResolvedAddFriendUserTagQueryVariables>;
export declare const FriendSidebarFriendsDocument: Apollo.DocumentNode;
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
export declare function useFriendSidebarFriendsQuery(baseOptions: Apollo.QueryHookOptions<FriendSidebarFriendsQuery, FriendSidebarFriendsQueryVariables>): Apollo.QueryResult<FriendSidebarFriendsQuery, Exact<{
    userId: string;
    cursor?: InputMaybe<string> | undefined;
    pageSize?: number | undefined;
}>>;
export declare function useFriendSidebarFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendSidebarFriendsQuery, FriendSidebarFriendsQueryVariables>): Apollo.LazyQueryResultTuple<FriendSidebarFriendsQuery, Exact<{
    userId: string;
    cursor?: InputMaybe<string> | undefined;
    pageSize?: number | undefined;
}>>;
export type FriendSidebarFriendsQueryHookResult = ReturnType<typeof useFriendSidebarFriendsQuery>;
export type FriendSidebarFriendsLazyQueryHookResult = ReturnType<typeof useFriendSidebarFriendsLazyQuery>;
export type FriendSidebarFriendsQueryResult = Apollo.QueryResult<FriendSidebarFriendsQuery, FriendSidebarFriendsQueryVariables>;
export declare const FriendsSidebarFriendsViewDataDocument: Apollo.DocumentNode;
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
export declare function useFriendsSidebarFriendsViewDataQuery(baseOptions: Apollo.QueryHookOptions<FriendsSidebarFriendsViewDataQuery, FriendsSidebarFriendsViewDataQueryVariables>): Apollo.QueryResult<FriendsSidebarFriendsViewDataQuery, Exact<{
    userId: string;
}>>;
export declare function useFriendsSidebarFriendsViewDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendsSidebarFriendsViewDataQuery, FriendsSidebarFriendsViewDataQueryVariables>): Apollo.LazyQueryResultTuple<FriendsSidebarFriendsViewDataQuery, Exact<{
    userId: string;
}>>;
export type FriendsSidebarFriendsViewDataQueryHookResult = ReturnType<typeof useFriendsSidebarFriendsViewDataQuery>;
export type FriendsSidebarFriendsViewDataLazyQueryHookResult = ReturnType<typeof useFriendsSidebarFriendsViewDataLazyQuery>;
export type FriendsSidebarFriendsViewDataQueryResult = Apollo.QueryResult<FriendsSidebarFriendsViewDataQuery, FriendsSidebarFriendsViewDataQueryVariables>;
export declare const PartyStreamChannelDocument: Apollo.DocumentNode;
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
export declare function usePartyStreamChannelQuery(baseOptions: Apollo.QueryHookOptions<PartyStreamChannelQuery, PartyStreamChannelQueryVariables>): Apollo.QueryResult<PartyStreamChannelQuery, Exact<{
    channelId: string;
}>>;
export declare function usePartyStreamChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PartyStreamChannelQuery, PartyStreamChannelQueryVariables>): Apollo.LazyQueryResultTuple<PartyStreamChannelQuery, Exact<{
    channelId: string;
}>>;
export type PartyStreamChannelQueryHookResult = ReturnType<typeof usePartyStreamChannelQuery>;
export type PartyStreamChannelLazyQueryHookResult = ReturnType<typeof usePartyStreamChannelLazyQuery>;
export type PartyStreamChannelQueryResult = Apollo.QueryResult<PartyStreamChannelQuery, PartyStreamChannelQueryVariables>;
export declare const FriendsSidebarInviteFriendsDocument: Apollo.DocumentNode;
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
export declare function useFriendsSidebarInviteFriendsQuery(baseOptions?: Apollo.QueryHookOptions<FriendsSidebarInviteFriendsQuery, FriendsSidebarInviteFriendsQueryVariables>): Apollo.QueryResult<FriendsSidebarInviteFriendsQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export declare function useFriendsSidebarInviteFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendsSidebarInviteFriendsQuery, FriendsSidebarInviteFriendsQueryVariables>): Apollo.LazyQueryResultTuple<FriendsSidebarInviteFriendsQuery, Exact<{
    userId?: InputMaybe<string> | undefined;
}>>;
export type FriendsSidebarInviteFriendsQueryHookResult = ReturnType<typeof useFriendsSidebarInviteFriendsQuery>;
export type FriendsSidebarInviteFriendsLazyQueryHookResult = ReturnType<typeof useFriendsSidebarInviteFriendsLazyQuery>;
export type FriendsSidebarInviteFriendsQueryResult = Apollo.QueryResult<FriendsSidebarInviteFriendsQuery, FriendsSidebarInviteFriendsQueryVariables>;
export declare const FriendsSidebarMenuPendingRequestsDocument: Apollo.DocumentNode;
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
export declare function useFriendsSidebarMenuPendingRequestsQuery(baseOptions: Apollo.QueryHookOptions<FriendsSidebarMenuPendingRequestsQuery, FriendsSidebarMenuPendingRequestsQueryVariables>): Apollo.QueryResult<FriendsSidebarMenuPendingRequestsQuery, Exact<{
    userId: string;
}>>;
export declare function useFriendsSidebarMenuPendingRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendsSidebarMenuPendingRequestsQuery, FriendsSidebarMenuPendingRequestsQueryVariables>): Apollo.LazyQueryResultTuple<FriendsSidebarMenuPendingRequestsQuery, Exact<{
    userId: string;
}>>;
export type FriendsSidebarMenuPendingRequestsQueryHookResult = ReturnType<typeof useFriendsSidebarMenuPendingRequestsQuery>;
export type FriendsSidebarMenuPendingRequestsLazyQueryHookResult = ReturnType<typeof useFriendsSidebarMenuPendingRequestsLazyQuery>;
export type FriendsSidebarMenuPendingRequestsQueryResult = Apollo.QueryResult<FriendsSidebarMenuPendingRequestsQuery, FriendsSidebarMenuPendingRequestsQueryVariables>;
export declare const FriendsSidebarPendingViewDataDocument: Apollo.DocumentNode;
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
export declare function useFriendsSidebarPendingViewDataQuery(baseOptions: Apollo.QueryHookOptions<FriendsSidebarPendingViewDataQuery, FriendsSidebarPendingViewDataQueryVariables>): Apollo.QueryResult<FriendsSidebarPendingViewDataQuery, Exact<{
    userId: string;
}>>;
export declare function useFriendsSidebarPendingViewDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FriendsSidebarPendingViewDataQuery, FriendsSidebarPendingViewDataQueryVariables>): Apollo.LazyQueryResultTuple<FriendsSidebarPendingViewDataQuery, Exact<{
    userId: string;
}>>;
export type FriendsSidebarPendingViewDataQueryHookResult = ReturnType<typeof useFriendsSidebarPendingViewDataQuery>;
export type FriendsSidebarPendingViewDataLazyQueryHookResult = ReturnType<typeof useFriendsSidebarPendingViewDataLazyQuery>;
export type FriendsSidebarPendingViewDataQueryResult = Apollo.QueryResult<FriendsSidebarPendingViewDataQuery, FriendsSidebarPendingViewDataQueryVariables>;
export declare const MiniProfileDocument: Apollo.DocumentNode;
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
export declare function useMiniProfileQuery(baseOptions: Apollo.QueryHookOptions<MiniProfileQuery, MiniProfileQueryVariables>): Apollo.QueryResult<MiniProfileQuery, Exact<{
    userId: string;
    channelId?: InputMaybe<string> | undefined;
}>>;
export declare function useMiniProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MiniProfileQuery, MiniProfileQueryVariables>): Apollo.LazyQueryResultTuple<MiniProfileQuery, Exact<{
    userId: string;
    channelId?: InputMaybe<string> | undefined;
}>>;
export type MiniProfileQueryHookResult = ReturnType<typeof useMiniProfileQuery>;
export type MiniProfileLazyQueryHookResult = ReturnType<typeof useMiniProfileLazyQuery>;
export type MiniProfileQueryResult = Apollo.QueryResult<MiniProfileQuery, MiniProfileQueryVariables>;
export declare const PartyInviterProfileDocument: Apollo.DocumentNode;
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
export declare function usePartyInviterProfileQuery(baseOptions: Apollo.QueryHookOptions<PartyInviterProfileQuery, PartyInviterProfileQueryVariables>): Apollo.QueryResult<PartyInviterProfileQuery, Exact<{
    userId: string;
}>>;
export declare function usePartyInviterProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PartyInviterProfileQuery, PartyInviterProfileQueryVariables>): Apollo.LazyQueryResultTuple<PartyInviterProfileQuery, Exact<{
    userId: string;
}>>;
export type PartyInviterProfileQueryHookResult = ReturnType<typeof usePartyInviterProfileQuery>;
export type PartyInviterProfileLazyQueryHookResult = ReturnType<typeof usePartyInviterProfileLazyQuery>;
export type PartyInviterProfileQueryResult = Apollo.QueryResult<PartyInviterProfileQuery, PartyInviterProfileQueryVariables>;
export declare const PartyInviterPartyDocument: Apollo.DocumentNode;
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
export declare function usePartyInviterPartyQuery(baseOptions: Apollo.QueryHookOptions<PartyInviterPartyQuery, PartyInviterPartyQueryVariables>): Apollo.QueryResult<PartyInviterPartyQuery, Exact<{
    partyId: string;
}>>;
export declare function usePartyInviterPartyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PartyInviterPartyQuery, PartyInviterPartyQueryVariables>): Apollo.LazyQueryResultTuple<PartyInviterPartyQuery, Exact<{
    partyId: string;
}>>;
export type PartyInviterPartyQueryHookResult = ReturnType<typeof usePartyInviterPartyQuery>;
export type PartyInviterPartyLazyQueryHookResult = ReturnType<typeof usePartyInviterPartyLazyQuery>;
export type PartyInviterPartyQueryResult = Apollo.QueryResult<PartyInviterPartyQuery, PartyInviterPartyQueryVariables>;
export declare const LeavePartyDocument: Apollo.DocumentNode;
export type LeavePartyMutationFn = Apollo.MutationFunction<LeavePartyMutation, LeavePartyMutationVariables>;
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
export declare function useLeavePartyMutation(baseOptions?: Apollo.MutationHookOptions<LeavePartyMutation, LeavePartyMutationVariables>): Apollo.MutationTuple<LeavePartyMutation, Exact<{
    userId: string;
    partyId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type LeavePartyMutationHookResult = ReturnType<typeof useLeavePartyMutation>;
export type LeavePartyMutationResult = Apollo.MutationResult<LeavePartyMutation>;
export type LeavePartyMutationOptions = Apollo.BaseMutationOptions<LeavePartyMutation, LeavePartyMutationVariables>;
export declare const CreatePartyDocument: Apollo.DocumentNode;
export type CreatePartyMutationFn = Apollo.MutationFunction<CreatePartyMutation, CreatePartyMutationVariables>;
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
export declare function useCreatePartyMutation(baseOptions?: Apollo.MutationHookOptions<CreatePartyMutation, CreatePartyMutationVariables>): Apollo.MutationTuple<CreatePartyMutation, Exact<{
    leaderId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type CreatePartyMutationHookResult = ReturnType<typeof useCreatePartyMutation>;
export type CreatePartyMutationResult = Apollo.MutationResult<CreatePartyMutation>;
export type CreatePartyMutationOptions = Apollo.BaseMutationOptions<CreatePartyMutation, CreatePartyMutationVariables>;
export declare const CreatePartyInvitationDocument: Apollo.DocumentNode;
export type CreatePartyInvitationMutationFn = Apollo.MutationFunction<CreatePartyInvitationMutation, CreatePartyInvitationMutationVariables>;
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
export declare function useCreatePartyInvitationMutation(baseOptions?: Apollo.MutationHookOptions<CreatePartyInvitationMutation, CreatePartyInvitationMutationVariables>): Apollo.MutationTuple<CreatePartyInvitationMutation, Exact<{
    inviterId: string;
    inviteeId: string;
    partyId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type CreatePartyInvitationMutationHookResult = ReturnType<typeof useCreatePartyInvitationMutation>;
export type CreatePartyInvitationMutationResult = Apollo.MutationResult<CreatePartyInvitationMutation>;
export type CreatePartyInvitationMutationOptions = Apollo.BaseMutationOptions<CreatePartyInvitationMutation, CreatePartyInvitationMutationVariables>;
export declare const PartyInvitesCreatePartyMemberDocument: Apollo.DocumentNode;
export type PartyInvitesCreatePartyMemberMutationFn = Apollo.MutationFunction<PartyInvitesCreatePartyMemberMutation, PartyInvitesCreatePartyMemberMutationVariables>;
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
export declare function usePartyInvitesCreatePartyMemberMutation(baseOptions?: Apollo.MutationHookOptions<PartyInvitesCreatePartyMemberMutation, PartyInvitesCreatePartyMemberMutationVariables>): Apollo.MutationTuple<PartyInvitesCreatePartyMemberMutation, Exact<{
    userId: string;
    partyId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type PartyInvitesCreatePartyMemberMutationHookResult = ReturnType<typeof usePartyInvitesCreatePartyMemberMutation>;
export type PartyInvitesCreatePartyMemberMutationResult = Apollo.MutationResult<PartyInvitesCreatePartyMemberMutation>;
export type PartyInvitesCreatePartyMemberMutationOptions = Apollo.BaseMutationOptions<PartyInvitesCreatePartyMemberMutation, PartyInvitesCreatePartyMemberMutationVariables>;
export declare const PartyInvitesDeletePartyInviteDocument: Apollo.DocumentNode;
export type PartyInvitesDeletePartyInviteMutationFn = Apollo.MutationFunction<PartyInvitesDeletePartyInviteMutation, PartyInvitesDeletePartyInviteMutationVariables>;
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
export declare function usePartyInvitesDeletePartyInviteMutation(baseOptions?: Apollo.MutationHookOptions<PartyInvitesDeletePartyInviteMutation, PartyInvitesDeletePartyInviteMutationVariables>): Apollo.MutationTuple<PartyInvitesDeletePartyInviteMutation, Exact<{
    userId: string;
    partyId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type PartyInvitesDeletePartyInviteMutationHookResult = ReturnType<typeof usePartyInvitesDeletePartyInviteMutation>;
export type PartyInvitesDeletePartyInviteMutationResult = Apollo.MutationResult<PartyInvitesDeletePartyInviteMutation>;
export type PartyInvitesDeletePartyInviteMutationOptions = Apollo.BaseMutationOptions<PartyInvitesDeletePartyInviteMutation, PartyInvitesDeletePartyInviteMutationVariables>;
export declare const PartyInvitesCurrentPartyDocument: Apollo.DocumentNode;
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
export declare function usePartyInvitesCurrentPartyQuery(baseOptions: Apollo.QueryHookOptions<PartyInvitesCurrentPartyQuery, PartyInvitesCurrentPartyQueryVariables>): Apollo.QueryResult<PartyInvitesCurrentPartyQuery, Exact<{
    userId: string;
}>>;
export declare function usePartyInvitesCurrentPartyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PartyInvitesCurrentPartyQuery, PartyInvitesCurrentPartyQueryVariables>): Apollo.LazyQueryResultTuple<PartyInvitesCurrentPartyQuery, Exact<{
    userId: string;
}>>;
export type PartyInvitesCurrentPartyQueryHookResult = ReturnType<typeof usePartyInvitesCurrentPartyQuery>;
export type PartyInvitesCurrentPartyLazyQueryHookResult = ReturnType<typeof usePartyInvitesCurrentPartyLazyQuery>;
export type PartyInvitesCurrentPartyQueryResult = Apollo.QueryResult<PartyInvitesCurrentPartyQuery, PartyInvitesCurrentPartyQueryVariables>;
export declare const PartyInvitesPartyUpdatesDocument: Apollo.DocumentNode;
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
export declare function usePartyInvitesPartyUpdatesSubscription(baseOptions: Apollo.SubscriptionHookOptions<PartyInvitesPartyUpdatesSubscription, PartyInvitesPartyUpdatesSubscriptionVariables>): Apollo.SubscriptionResult<PartyInvitesPartyUpdatesSubscription, any>;
export type PartyInvitesPartyUpdatesSubscriptionHookResult = ReturnType<typeof usePartyInvitesPartyUpdatesSubscription>;
export type PartyInvitesPartyUpdatesSubscriptionResult = Apollo.SubscriptionResult<PartyInvitesPartyUpdatesSubscription>;
export declare const SocialAcceptFriendRequestDocument: Apollo.DocumentNode;
export type SocialAcceptFriendRequestMutationFn = Apollo.MutationFunction<SocialAcceptFriendRequestMutation, SocialAcceptFriendRequestMutationVariables>;
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
export declare function useSocialAcceptFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SocialAcceptFriendRequestMutation, SocialAcceptFriendRequestMutationVariables>): Apollo.MutationTuple<SocialAcceptFriendRequestMutation, Exact<{
    userId: string;
    friendId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialAcceptFriendRequestMutationHookResult = ReturnType<typeof useSocialAcceptFriendRequestMutation>;
export type SocialAcceptFriendRequestMutationResult = Apollo.MutationResult<SocialAcceptFriendRequestMutation>;
export type SocialAcceptFriendRequestMutationOptions = Apollo.BaseMutationOptions<SocialAcceptFriendRequestMutation, SocialAcceptFriendRequestMutationVariables>;
export declare const SocialBlockUserDocument: Apollo.DocumentNode;
export type SocialBlockUserMutationFn = Apollo.MutationFunction<SocialBlockUserMutation, SocialBlockUserMutationVariables>;
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
export declare function useSocialBlockUserMutation(baseOptions?: Apollo.MutationHookOptions<SocialBlockUserMutation, SocialBlockUserMutationVariables>): Apollo.MutationTuple<SocialBlockUserMutation, Exact<{
    userId: string;
    blockedUserId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialBlockUserMutationHookResult = ReturnType<typeof useSocialBlockUserMutation>;
export type SocialBlockUserMutationResult = Apollo.MutationResult<SocialBlockUserMutation>;
export type SocialBlockUserMutationOptions = Apollo.BaseMutationOptions<SocialBlockUserMutation, SocialBlockUserMutationVariables>;
export declare const SocialRemoveFriendDocument: Apollo.DocumentNode;
export type SocialRemoveFriendMutationFn = Apollo.MutationFunction<SocialRemoveFriendMutation, SocialRemoveFriendMutationVariables>;
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
export declare function useSocialRemoveFriendMutation(baseOptions?: Apollo.MutationHookOptions<SocialRemoveFriendMutation, SocialRemoveFriendMutationVariables>): Apollo.MutationTuple<SocialRemoveFriendMutation, Exact<{
    userId: string;
    friendId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialRemoveFriendMutationHookResult = ReturnType<typeof useSocialRemoveFriendMutation>;
export type SocialRemoveFriendMutationResult = Apollo.MutationResult<SocialRemoveFriendMutation>;
export type SocialRemoveFriendMutationOptions = Apollo.BaseMutationOptions<SocialRemoveFriendMutation, SocialRemoveFriendMutationVariables>;
export declare const SocialRemoveReceivedFriendRequestDocument: Apollo.DocumentNode;
export type SocialRemoveReceivedFriendRequestMutationFn = Apollo.MutationFunction<SocialRemoveReceivedFriendRequestMutation, SocialRemoveReceivedFriendRequestMutationVariables>;
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
export declare function useSocialRemoveReceivedFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SocialRemoveReceivedFriendRequestMutation, SocialRemoveReceivedFriendRequestMutationVariables>): Apollo.MutationTuple<SocialRemoveReceivedFriendRequestMutation, Exact<{
    userId: string;
    friendId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialRemoveReceivedFriendRequestMutationHookResult = ReturnType<typeof useSocialRemoveReceivedFriendRequestMutation>;
export type SocialRemoveReceivedFriendRequestMutationResult = Apollo.MutationResult<SocialRemoveReceivedFriendRequestMutation>;
export type SocialRemoveReceivedFriendRequestMutationOptions = Apollo.BaseMutationOptions<SocialRemoveReceivedFriendRequestMutation, SocialRemoveReceivedFriendRequestMutationVariables>;
export declare const SocialRemoveSentFriendRequestDocument: Apollo.DocumentNode;
export type SocialRemoveSentFriendRequestMutationFn = Apollo.MutationFunction<SocialRemoveSentFriendRequestMutation, SocialRemoveSentFriendRequestMutationVariables>;
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
export declare function useSocialRemoveSentFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SocialRemoveSentFriendRequestMutation, SocialRemoveSentFriendRequestMutationVariables>): Apollo.MutationTuple<SocialRemoveSentFriendRequestMutation, Exact<{
    userId: string;
    friendId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialRemoveSentFriendRequestMutationHookResult = ReturnType<typeof useSocialRemoveSentFriendRequestMutation>;
export type SocialRemoveSentFriendRequestMutationResult = Apollo.MutationResult<SocialRemoveSentFriendRequestMutation>;
export type SocialRemoveSentFriendRequestMutationOptions = Apollo.BaseMutationOptions<SocialRemoveSentFriendRequestMutation, SocialRemoveSentFriendRequestMutationVariables>;
export declare const SocialSendFriendRequestDocument: Apollo.DocumentNode;
export type SocialSendFriendRequestMutationFn = Apollo.MutationFunction<SocialSendFriendRequestMutation, SocialSendFriendRequestMutationVariables>;
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
export declare function useSocialSendFriendRequestMutation(baseOptions?: Apollo.MutationHookOptions<SocialSendFriendRequestMutation, SocialSendFriendRequestMutationVariables>): Apollo.MutationTuple<SocialSendFriendRequestMutation, Exact<{
    userId: string;
    friendId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialSendFriendRequestMutationHookResult = ReturnType<typeof useSocialSendFriendRequestMutation>;
export type SocialSendFriendRequestMutationResult = Apollo.MutationResult<SocialSendFriendRequestMutation>;
export type SocialSendFriendRequestMutationOptions = Apollo.BaseMutationOptions<SocialSendFriendRequestMutation, SocialSendFriendRequestMutationVariables>;
export declare const SocialUnblockUserDocument: Apollo.DocumentNode;
export type SocialUnblockUserMutationFn = Apollo.MutationFunction<SocialUnblockUserMutation, SocialUnblockUserMutationVariables>;
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
export declare function useSocialUnblockUserMutation(baseOptions?: Apollo.MutationHookOptions<SocialUnblockUserMutation, SocialUnblockUserMutationVariables>): Apollo.MutationTuple<SocialUnblockUserMutation, Exact<{
    userId: string;
    blockedUserId: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export type SocialUnblockUserMutationHookResult = ReturnType<typeof useSocialUnblockUserMutation>;
export type SocialUnblockUserMutationResult = Apollo.MutationResult<SocialUnblockUserMutation>;
export type SocialUnblockUserMutationOptions = Apollo.BaseMutationOptions<SocialUnblockUserMutation, SocialUnblockUserMutationVariables>;
