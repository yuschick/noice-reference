/* eslint-disable @typescript-eslint/naming-convention */

import { PlacementState, RewardDescription } from '@noice-com/schemas/ads/ads.pb';
import { AnalyticsEvent } from '@noice-com/schemas/analytics/analytics.pb';
import { ClientType } from '@noice-com/schemas/api/client.pb';
import { Auth } from '@noice-com/schemas/auth/auth.pb';
import { Animation } from '@noice-com/schemas/avatar/animation.pb';
import { Avatar } from '@noice-com/schemas/avatar/avatar.pb';
import {
  Channel,
  ChannelDetailsUpdate,
  ChannelRole,
  ChannelRoles,
  AssetType,
} from '@noice-com/schemas/channel/channel.pb';
import {
  RestreamingConfig,
  StreamBackendConfig,
} from '@noice-com/schemas/channel/channel_config.pb';
import { ChannelIngestConfigs } from '@noice-com/schemas/channel/ingest_config.pb';
import {
  UserBannedNotification,
  Violation,
} from '@noice-com/schemas/channel/moderation.pb';
import {
  IAutoModQueueEventEventDelegate,
  IChatEventEventDelegate,
  MessageContent,
  SendMessageResponse,
} from '@noice-com/schemas/chat/chat.pb';
import { InitReq } from '@noice-com/schemas/fetch.pb';
import { FriendStatusUpdateEvent, User } from '@noice-com/schemas/friends/friends.pb';
import { DismissalType } from '@noice-com/schemas/ftue/ftue.pb';
import { ProgressionConfig } from '@noice-com/schemas/game-card/game_card.pb';
import {
  Card,
  CardLeveling,
  DebugMsgType,
  StreamerCard,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { GroupRunnerState } from '@noice-com/schemas/game-state/game_state.pb';
import {
  GoalCard,
  GoalCardSlot as GoalCardSlotPb,
} from '@noice-com/schemas/goal-card/goal_card.pb';
import {
  InventoryItem,
  InventoryUpdateEvent,
  ItemConsumption,
  ItemEntitlement,
  ListUserInventoryRequestFilter,
} from '@noice-com/schemas/inventory/inventory.pb';
import { Item } from '@noice-com/schemas/item/item.pb';
import {
  GetMatchStateResponse,
  GetStreamStateResponse,
  ILeaderboardUpdateContentDelegate,
  IStreamSpectatorCoordinationEventEventDelegate,
} from '@noice-com/schemas/match/match.pb';
import { IServerMessagePayloadDelegate } from '@noice-com/schemas/messaging/messaging.pb';
import { PlatformUserBannedNotification } from '@noice-com/schemas/moderation/platform_moderation.pb';
import {
  INotificationContentContentDelegate,
  Notification,
  ForcedSignoutEvent,
} from '@noice-com/schemas/notification/notification.pb';
import {
  Party,
  PartyInvitation,
  PartyInvitationUpdateEvent,
} from '@noice-com/schemas/party/party.pb';
import { Profile } from '@noice-com/schemas/profile/profile.pb';
import {
  ExperiencePoints,
  GetUserProgressionResponse,
  Level,
  ListLevelConfigsRequest,
} from '@noice-com/schemas/progression/progression.pb';
import {
  ReactionEventAdd,
  ReactionEventRemove,
  ReactionState,
  ReactionType,
} from '@noice-com/schemas/reaction/reaction.pb';
import { Reason } from '@noice-com/schemas/reason/reason.pb';
import {
  Reward,
  RewardType,
  RewardTypeCurrency,
} from '@noice-com/schemas/reward/reward.pb';
import {
  IWatchEventEventDelegate,
  QualityLayer,
  StreamPlacement,
} from '@noice-com/schemas/stream/egress.pb';
import {
  ActivateContextualTeamActionResponse,
  IStreamEventContentDelegate,
  IStreamDiagnosticsUpdateContentDelegate,
} from '@noice-com/schemas/streamer/streamer.pb';
import {
  Article,
  CreateZendeskTokenResponse,
  GetArticleRequest,
} from '@noice-com/schemas/support/support.pb';
import { Wallet, WalletCurrency } from '@noice-com/schemas/wallet/wallet.pb';
import { EncodingSettings } from 'lib/ts/gen/schemas/stream/recording_processor.pb';

import { LogLevel } from './lib/logging';

type Absent<T, K extends keyof T> = { [k in Exclude<keyof T, K>]?: undefined };
type OneOf<T> =
  | { [k in keyof T]?: undefined }
  | (keyof T extends infer K
      ? K extends string & keyof T
        ? { [k in K]: T[K] } & Absent<T, K>
        : never
      : never);
type RequireField<T, K extends keyof T> = Pick<Required<T>, K> & Omit<T, K>;

export interface IRequestParamsProvider {
  getInitReq(): Promise<InitReq>;
  getInitAuthReq(): InitReq;
  getPathPrefix(): string;
  onClose(delegate: () => void): () => void;
}

export class SubService {
  private _paramsProvider: IRequestParamsProvider;

  constructor(paramsProvider: IRequestParamsProvider) {
    this._paramsProvider = paramsProvider;
  }

  protected _getInitReq(): Promise<InitReq> {
    return this._paramsProvider.getInitReq();
  }

  protected _getInitAuthReq(): InitReq {
    return this._paramsProvider.getInitAuthReq();
  }

  protected _getParamsProvider(): IRequestParamsProvider {
    return this._paramsProvider;
  }

  protected _getPathPrefix(): string {
    return this._paramsProvider.getPathPrefix();
  }
}

export interface IStreamDelegate<C, O> {
  onEvent: IEventNotifier<C, O>;
  onEnd: IEndNotifier<C>;
}

export interface IEventNotifier<C, O> {
  (ctx: C, event: O): void;
}

export interface IEndNotifier<C> {
  (ctx: C, error?: Error): void;
}

export interface IStreamCancel {
  (): void;
}

export type AnalyticsClientCharacteristics = {
  windowWidth?: number;
  windowHeight?: number;
};

export type AnalyticsPayload = Omit<
  AnalyticsEvent,
  'eventName' | 'identity' | 'sequenceId' | 'clientTime' | 'windowWidth' | 'windowHeight'
>;

export interface IAnalyticsService {
  trackEventWithName(event: string, payload?: AnalyticsPayload): void;
  trackEvent(payload: AnalyticsPayload): void;
  sendEventsImmediately(options?: { keepalive?: boolean }): Promise<void>;
  setClientType(clientType: ClientType): void;
  setClientCharacteristics(characteristics: AnalyticsClientCharacteristics): void;
}

export interface IReactionDelegateContext {
  parentType: string;
  parentId: string;
}

export interface IReactionDelegate {
  onInitialState(ctx: IReactionDelegateContext, reactions: ReactionState[]): void;
  onReactionAdded(ctx: IReactionDelegateContext, reaction: ReactionEventAdd): void;
  onReactionRemoved(ctx: IReactionDelegateContext, reaction: ReactionEventRemove): void;
  onEnd(ctx: IReactionDelegateContext, e?: Error): void;
}

export interface IReactionService {
  streamReactions(
    parentType: string,
    parentID: string,
    delegate: IReactionDelegate,
  ): IStreamCancel;
  addReaction(
    parentType: string,
    parentID: string,
    resourceType: string,
    resourceID: string,
    reaction: ReactionType,
  ): Promise<ReactionState>;
  removeReaction(
    parentType: string,
    parentID: string,
    resourceType: string,
    resourceID: string,
  ): Promise<ReactionState>;
}

export enum ConnectionState {
  UNSPECIFIED,
  CONNECTED,
  DISCONNECTED,
  RECONNECTING,
}

export type ConnectionErrorMsg = {
  code: number;
  reason: string;
};

export type ConnectionClosedMsg = {
  code: number;
  reason: string;
};

export type ConnectionStateInfo = OneOf<{
  error: ConnectionErrorMsg;
  closed: ConnectionClosedMsg;
}>;

export type ConnectionStatusChangedMsg = {
  state: ConnectionState;
} & ConnectionStateInfo;

export interface IMatchGroupDelegate extends IServerMessagePayloadDelegate<IMatchGroup> {
  initialized(matchGroup: IMatchGroup): void;
  onConnectionStatusChanged(ctx: IMatchGroup, ev: ConnectionStatusChangedMsg): void;
  onRetryMatchMaking(ctx: IMatchGroup): void;
}

export interface IMatchGroup {
  groupId: string;
  localUserId: string;
  spectator: boolean;

  removeDelegate(delegate: IMatchGroupDelegate): void;
  leave(): Promise<void>;

  setActiveCard(cardID: string): Promise<void>;
  shuffleHand(): Promise<void>;
  triggerEmoji(emojiID: string): Promise<void>;
  triggerEmote(emoteID: string): Promise<void>;
  useBooster(targetUserID: string, boosterID: number): Promise<void>;
  requestBooster(targetUserID: string, boosterID: number): Promise<void>;
  cancelBoosterRequest(targetUserID: string, boosterID: number): Promise<void>;
  voteCard(targetUserID: string, cardID: string): Promise<void>;
  cancelCardVote(targetUserID: string, cardID: string): Promise<void>;
  collectAONPoints(): Promise<void>;
  requestHand(): Promise<void>;
  requestChallenges(): Promise<void>;
  setActiveChallenge(challengeId: string): Promise<void>;

  setDebug(msgType: DebugMsgType, enabled: boolean, jsonData?: string): Promise<void>;

  // State getters helper functions
  joinTeamAction(): Promise<void>;
}

export interface UserState {
  wallet: Wallet;
  inventory: InventoryItem[];
  unclaimedRewards: UnclaimedRewardDetails[];
}

export interface ExperienceUpdate {
  old: ExperiencePoints;
  new: ExperiencePoints;
}

export interface LevelUpdate {
  old: Level;
  new: Level;
}

export type ProgressionUpdates = {
  xp: ExperienceUpdate[];
  level: LevelUpdate[];
  reason?: Reason;
};

export type UserProgress = Omit<GetUserProgressionResponse, 'experiencePoints'> & {
  experiencePoints: ExperiencePointsWithNextLevel[];
};

export type ExperiencePointsWithNextLevel = ExperiencePoints & {
  nextLevelThreshold?: string;
};

export interface IUserDelegate {
  onProgressionUpdate(ctx: IUser, ev: ProgressionUpdates): void;
  onInventoryUpdate(ctx: IUser, ev: InventoryUpdateEvent): void;
  onReward(ctx: IUser, ev: UnclaimedRewardDetails): void;
  onFriendStatusUpdate(ctx: IUser, ev: FriendStatusUpdateEvent): void;
  onPartyInvitationUpdate(ctx: IUser, ev: PartyInvitationUpdateEvent): void;
  onChannelUserBanned(ctx: IUser, ev: UserBannedNotification): void;
  onPlatformUserBanned(ctx: IUser, ev: PlatformUserBannedNotification): void;
  onForcedSignout(ctx: IUser, ev: ForcedSignoutEvent): void;
}

export type ISpectatorEventDelegate =
  IStreamSpectatorCoordinationEventEventDelegate<string> & {
    onEnd(ctx: string, error?: Error): void;
  };

export interface IUser {
  addDelegate(delegate: IUserDelegate): void;
  removeDelegate(delegate: IUserDelegate): void;
  get userState(): UserState | undefined;
  get userId(): string;
  get isManaged(): boolean;
}

export interface IUserService {
  userNotifications(userId: string, delegate: IUserDelegate): () => void;
  fetchUser(userId: string): Promise<IUser>;
  getUser(userId: string): IUser | undefined;
}

export type MatchMakingResult = {
  groupId: string;
  teamChangeAvailableAt: string | undefined;
};

export interface IMatchMakingService {
  findMatchGroup(streamID: string): Promise<MatchMakingResult>;
  assignUserToGroup(streamID: string, groupID: string, userID?: string): Promise<void>;
}

export interface IMatchService {
  joinMatchGroup(
    streamID: string,
    groupID: string,
    delegates: IMatchGroupDelegate[],
    spectator?: boolean,
    onMatchGroupInitialized?: (group: IMatchGroup) => void,
  ): Promise<IMatchGroup>;
  getStreamState(streamID: string): Promise<GetStreamStateResponse>;
  getGroupState(streamID: string, groupID: string): Promise<GroupRunnerState>;
  getMatchState(streamID: string): Promise<GetMatchStateResponse>;

  consumeSpectatorCoordinationEvents(
    streamID: string,
    delegate: ISpectatorEventDelegate,
  ): () => void;
  resetGroup(): void;
  close(leavingMatch: boolean): Promise<void>;
}

export interface IPrivacyService {
  exportUserData(): Promise<void>;
  deleteUserData(): Promise<void>;
}

export interface IProfileService {
  getProfile(userId: string): Promise<Profile>;
  updateProfile(req: Profile): Promise<Profile>;
}

export interface IProfileAdminService {
  resolveEmails(emails: string[]): Promise<{ [key: string]: string }>;
}

export interface IFTUEService {
  dismissTooltip(tooltipId: string, dismissalType: DismissalType): Promise<void>;
  deleteDismissedTooltip(tooltipId: string): Promise<void>;
  listDismissedTooltips(): Promise<string[]>;
}

export interface IUserInventoryService {
  listUserInventory(filters?: ListUserInventoryRequestFilter[]): Promise<InventoryItem[]>;
  addEntitlements(userId: string, entitlements: ItemEntitlement[]): Promise<void>;
  removeEntitlements(userId: string, consumptions: ItemConsumption[]): Promise<void>;
}

export interface IPartyService {
  getUserParty(userId: string): Promise<Party>;
  createParty(inviteeIds: string[]): Promise<Party>;
  getParty(partyId: string): Promise<Party>;
  createPartyMember(partyId: string, userId: string): Promise<void>;
  deletePartyMember(partyId: string, userId: string): Promise<void>;
  createPartyInvitation(
    partyId: string,
    inviterId: string,
    inviteeId: string,
  ): Promise<PartyInvitation>;
  deletePartyInvitation(partyId: string, userId: string): Promise<void>;
  listReceivedPartyInvitations(userId: string): Promise<PartyInvitation[]>;
  listSentPartyInvitations(userId: string): Promise<PartyInvitation[]>;
}

export interface IPartyAdminService {
  listParties(): Promise<Party[]>;
  createParty(userIds: string[]): Promise<Party>;
  deleteParty(partyId: string): Promise<void>;
}

export interface IChatDelegate extends IChatEventEventDelegate<string> {
  onEnd(_: string, err?: Error): void;
}

export interface IAutoModQueueDelegate extends IAutoModQueueEventEventDelegate<string> {
  onEnd(_: string, err?: Error): void;
}

export interface IChatService extends IChatModerationService {
  sendChatMessage(
    chatID: string,
    content: MessageContent,
    moderationConsent: boolean,
  ): Promise<SendMessageResponse>;
  chatMessages(chatID: string, delegate: IChatDelegate): () => void;
}

export interface IChatModerationService {
  approveAutomodItem(chatID: string, moderationItemID: string): Promise<void>;
  denyAutomodItem(chatID: string, moderationItemID: string): Promise<void>;
  clearAutomodItem(chatID: string, moderationItemID: string): Promise<void>;
  automodEvents(chatID: string, delegate: IAutoModQueueDelegate): () => void;
}

export enum GoalCardSlotState {
  EMPTY,
  SELECTED,
  COMPLETED,
  COLLECTED,
  FAILED,
  UNSPECIFIED,
}

export type ExtendedGoalCardSlot = Omit<GoalCardSlotPb, 'cardOptions'> & {
  cardOptions: GoalCard[];
  goalCard?: GoalCard;
  state: GoalCardSlotState;
  resetTimePast: boolean;
  readyForPick: boolean;
};

export interface IGoalCardService {
  listGoalCardSlots(): Promise<ExtendedGoalCardSlot[]>;
  getSlotOptions(slotId: string): Promise<GoalCard[]>;
  reshuffleSlot(slotId: string): Promise<GoalCard[]>;
  setGoalCardSlot(goalCardSlotId: string, goalCardId: string): Promise<void>;
  getGlobalResetTime(): Promise<Date>;
}

export type RewardDetails = {
  item?: ItemRewardDetails;
  currency?: CurrencyRewardDetails;
};

export type CurrencyRewardDetails = {
  currencyId: string;
  currencyAmount: number;
};

export type ItemRewardDetails = {
  props: Item;
  gameCard?: Card;
};

export type UnclaimedRewardDetails = Reward & {
  details: RewardDetails;
};

export interface IRewardService {
  listRewards(): Promise<Reward[]>;
  claimReward(rewardID: string): Promise<void>;
  getRewardDetails(rewards: RewardType[]): Promise<Map<string, RewardDetails>>;
}

export interface StoreBundleItemPreviousStats {
  pointsMin?: number;
  pointsMax?: number;
  targetValue?: number;
}

export type StoreItemItemGameCardDetails = Card & {
  currentLeveling?: CardLeveling;
  currentStats?: StoreBundleItemPreviousStats;
};

export interface INotificationDelegate
  extends INotificationContentContentDelegate<Notification> {
  onEnd(e?: Error): void;
}

export interface INotificationService {
  notifications(delegate: INotificationDelegate): IStreamCancel;
}

export interface IWalletService {
  getWallet(): Promise<Wallet>;
  addCurrencies(userID: string, currencies: WalletCurrency[]): Promise<void>;
  substractCurrencies(userID: string, currencies: WalletCurrency[]): Promise<void>;
}

export type PlacementDetails = {
  placementId: string;
  state: PlacementState;
  referenceId: string;
  reward?: RewardDescription;
  rewards?: RewardDescription[];
  updatesAt?: string;
};

export interface IPlacementService {
  getPlacement(placementID: string): Promise<PlacementDetails>;
  rewardPlacement(placementID: string): Promise<void>;
}

export interface RewardCard extends Card {
  itemId: string;
}

export interface LevelRewards {
  requiredLevel: number;
  cardDetail?: RewardCard;
  currencyDetails: RewardTypeCurrency[];
}

export interface IProgressionService {
  getLevelThresholds(req: ListLevelConfigsRequest): Promise<number[]>;
}

export interface IGameCardService {
  listGameCards(channelId?: string): Promise<Card[]>;
  getGameCardsWithInventory(
    inventoryItems: InventoryItem[],
    channelId?: string,
  ): Promise<Card[]>;
  getGameCard(id: string): Promise<Card>;
  getGameCards(ids: string[]): Promise<Card[]>;
  getProgressionConfig(): Promise<ProgressionConfig>;
  getStreamerCards(ids: string[]): Promise<StreamerCard[]>;
  listStreamerCards(streamerId?: string, familyId?: string): Promise<StreamerCard[]>;
}

export interface IItemService {
  getItem(itemID: string): Promise<Item>;
  getItems(itemIDs: string[]): Promise<Item[]>;
  listItems(): Promise<Item[]>;
}

export interface IWatchSession {
  id: string;
  close(): void;
  selectQualityLayer(layer: QualityLayer): Promise<void>;
  selectGroup(groupId: string): void;
  signalFirstFrame(): Promise<void>;
}

export interface IStreamingDelegate
  extends Omit<
    IWatchEventEventDelegate<IWatchSession>,
    'onError' | 'onOffer' | 'onAck' | 'onAnswer'
  > {
  onMediaStream(
    session: IWatchSession,
    mediaStream: MediaStream,
    qualityLayers: QualityLayer[],
  ): void;
  onConnectionStateChange(
    connectionState: RTCIceConnectionState,
    gatheringState: RTCIceGatheringState,
    egressType: string,
    livepeerUrl: string,
  ): void;
  onEnd(session: IWatchSession, err?: Error): void;
}

export type WatchParams = {
  raw: boolean;
};

export interface IStreamingService {
  watch(
    streamID: string,
    params: WatchParams,
    delegate: IStreamingDelegate,
    sendAnalyticsEvent: (payload: AnalyticsPayload) => void,
    placement: StreamPlacement,
  ): IWatchSession;
}

export class RecordingError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);

    this.status = status;
  }
}

export type EncodingDelegate = {
  onAccepted(encodingID: string): void;
  onStarted(encodingID: string): void;
  onProgress(encodingID: string, progress: number): void;
};

export interface IRecordingService {
  watchRecording(channelId: string, streamId: string, offset: number): Promise<string>;
  encodeRecording(
    streamId: string,
    settings: EncodingSettings,
    delegate?: EncodingDelegate,
  ): Promise<string>;
}

export interface Session {
  auth: Auth;
  created: Date;
}

export interface ILeaderboardGroup {
  groupId: string;
  groupName: string;
  points: number;
  players: ILeaderboardPlayer[];
}

export interface ILeaderboardState {
  streamId: string;
  groups: Map<string, ILeaderboardGroup>;
}

export interface IStreamLeaderboard {
  getGroup(groupId: string): ILeaderboardGroup | undefined;
  getState(): ILeaderboardState;
  getLeaderboard(): ILeaderboardGroup[];
}

export interface ILeaderboardDelegate
  extends ILeaderboardUpdateContentDelegate<IStreamLeaderboard> {
  onEnd(e?: Error): void;
}

export interface IStreamerEvents {
  getStreamId(): string;
}

export interface IStreamerServiceListener
  extends IStreamEventContentDelegate<IStreamerEvents> {
  onEnd(e?: Error): void;
}

export interface IStreamDiagnosticsUpdateListener
  extends IStreamDiagnosticsUpdateContentDelegate<IStreamerEvents> {
  onEnd(e?: Error): void;
}

export interface IStreamerService {
  getStreamEvents(streamId: string, delegate: IStreamerServiceListener): IStreamCancel;
  activateContextualTeamAction(
    streamId: string,
  ): Promise<ActivateContextualTeamActionResponse>;
}

export interface IFriendsService {
  inviteFriend(userId: string, friendId: string): Promise<void>;
  acceptInvitation(userId: string, friendId: string): Promise<void>;
  declineInvitation(userId: string, friendId: string): Promise<void>;
  removeFriend(userId: string, friendId: string): Promise<void>;
  blockUser(userId: string, blockedId: string): Promise<void>;
  listFriends(userId: string): Promise<User[]>;
  listSentFriendRequests(userId: string): Promise<User[]>;
  listReceivedFriendRequests(userId: string): Promise<User[]>;
  listBlockedUsers(userId: string): Promise<User[]>;
}

export interface ChannelFilter {
  online?: boolean;
  gameId?: string;
  name?: string;
}

export type ChannelDetailsParams = RequireField<ChannelDetailsUpdate, 'id'>;

export interface IChannelService {
  listChannels(channelFilter: ChannelFilter): Promise<Channel[]>;
  getChannel(channelId: string): Promise<Channel>;
  createChannel(channelName: string, streamerId: string): Promise<Channel>;
  deleteChannel(channelId: string): Promise<void>;
  updateChannelDetails(params: ChannelDetailsParams): Promise<Channel>;
  setUserChannelRoles(
    channelId: string,
    userId: string,
    roles: ChannelRole[],
  ): Promise<void>;
  listUserPrivilegedChannels(userId: string): Promise<ChannelRoles[]>;

  getAssetUploadToken(channelId: string, assetType: AssetType): Promise<string>;
  deleteChannelAsset(channelId: string, assetType: AssetType): Promise<void>;
}

export interface IChannelModerationService {
  banUser(
    channelId: string,
    userId: string,
    violation: Violation,
    description?: string,
  ): Promise<void>;
  unbanUser(channelId: string, userId: string): Promise<void>;
}

export type StreamBackendConfigUpdateParams = RequireField<StreamBackendConfig, 'id'>;

export type RestreamingConfigUpdateParams = RequireField<RestreamingConfig, 'channelId'>;

export interface IChannelConfigService {
  createStreamBackendConfig(
    channelId: string,
    gameId: string,
  ): Promise<StreamBackendConfig>;
  deleteStreamBackendConfig(channelId: string, id: string): Promise<void>;
  getStreamBackendConfig(channelId: string, id: string): Promise<StreamBackendConfig>;
  getSelectedStreamBackendConfig(channelId: string): Promise<StreamBackendConfig>;
  listStreamBackendConfigs(channelId: string): Promise<StreamBackendConfig[]>;
  updateStreamBackendConfig(
    params: StreamBackendConfigUpdateParams,
  ): Promise<StreamBackendConfig>;
  selectStreamBackendConfig(channelId: string, configId: string): Promise<void>;
}

export interface IIngestConfigService {
  refreshIngestConfigs(channelId: string): Promise<ChannelIngestConfigs>;
  listIngestConfigs(channelId: string): Promise<ChannelIngestConfigs>;
}

export interface IFeatureFlags {
  get(key: string, defaultValue?: string): string;
  has(key: string): boolean;
  values(): { [key: string]: string };
}
export type FeatureFlagUpdateListener = (flags: IFeatureFlags) => void;
export interface IFeatureFlagService {
  isAvailable(): boolean;
  getFeatureFlags(): Promise<IFeatureFlags>;
  onFeatureFlagsUpdate(callback: FeatureFlagUpdateListener): () => void;
}

export interface ISupportService {
  getArticle: (params: GetArticleRequest) => Promise<Article>;
  createZendeskToken: () => Promise<CreateZendeskTokenResponse>;
}

export interface IAvatarAnimationService {
  getAnimation: (id: string) => Promise<Animation>;
  listAnimations: () => Promise<Animation[]>;
}

export interface IAvatarService {
  getAvatar: (id: string) => Promise<Avatar>;
  getAvatars: (ids: string[]) => Promise<Avatar[]>;
  listAvatars: () => Promise<Avatar[]>;
}

export interface IStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface IClient {
  ProfileService: IProfileService;
  AvatarService: IAvatarService;
  AvatarAnimationService: IAvatarAnimationService;
  UserInventoryService: IUserInventoryService;
  NotificationService: INotificationService;
  MatchMakingService: IMatchMakingService;
  GoalCardService: IGoalCardService;
  RewardService: IRewardService;
  WalletService: IWalletService;
  MatchService: IMatchService;
  ChatService: IChatService;
  ProgressionService: IProgressionService;
  GameCardService: IGameCardService;
  ItemService: IItemService;
  AnalyticsService: IAnalyticsService;
  StreamingService: IStreamingService;
  StreamerService: IStreamerService;
  UserService: IUserService;
  ReactionService: IReactionService;
  storage: IStorage;
  clearSession(): Promise<void>;
  restoreSession(session: Session): Promise<void>;
  getSession(): Session;
  getToken(): Promise<string | undefined>;
  onAuthenticated(delegate: (auth: Auth) => void): () => void;
  onLogout(delegate: () => void): () => void;
  setLogLevel(level: LogLevel): void;
  close(): void;
}

export interface ILeaderboardPlayer {
  userId: string;
  points: number;
}

export interface IFileUploadService {
  uploadFile(uploadToken: string, file: File): Promise<string>;
}
