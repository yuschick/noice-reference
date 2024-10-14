import { UserBannedNotification } from '@noice-com/schemas/channel/moderation.pb';
import { FriendStatusUpdateEvent } from '@noice-com/schemas/friends/friends.pb';
import { GoalCardSlot } from '@noice-com/schemas/goal-card/goal_card.pb';
import { InventoryUpdateEvent } from '@noice-com/schemas/inventory/inventory.pb';
import { PlatformUserBannedNotification } from '@noice-com/schemas/moderation/platform_moderation.pb';
import {
  ForcedSignoutEvent,
  Notification,
} from '@noice-com/schemas/notification/notification.pb';
import { PartyInvitationUpdateEvent } from '@noice-com/schemas/party/party.pb';
import { ProgressionUpdateEvent } from '@noice-com/schemas/progression/progression.pb';
import { Reward } from '@noice-com/schemas/reward/reward.pb';

import { logger } from './lib';
import {
  IStreamCancel,
  IUserService,
  IUser,
  UserState,
  IUserDelegate,
  IClient,
  INotificationDelegate,
  UnclaimedRewardDetails,
  IRequestParamsProvider,
} from './types';
import { stateFromInventoryUpdate, progressionUpdatesFromEvent } from './userstate';

const log = logger('UserService');

class User implements IUser {
  private _state?: UserState;
  private _userId: string;
  private _delegates: IUserDelegate[] = [];
  private _managed = false;

  constructor(userId: string) {
    this._userId = userId;
  }

  public async fetch(client: IClient): Promise<void> {
    const wallet = await client.WalletService.getWallet();
    const inventory = await client.UserInventoryService.listUserInventory();
    const rewards = await client.RewardService.listRewards();
    const details = await client.RewardService.getRewardDetails(
      rewards.map((reward) => reward.type),
    );

    this._state = {
      wallet,
      inventory,
      unclaimedRewards: rewards.map((reward) => {
        let id: string | undefined;

        if (reward.type.item) {
          id = reward.type.item.itemId;
        } else if (reward.type.currency) {
          id = reward.type.currency.currencyId;
        }

        return {
          ...reward,
          details: details.get(id),
        };
      }),
    };
  }

  public addDelegate(delegate: IUserDelegate): void {
    if (!this._delegates.includes(delegate)) {
      this._delegates.push(delegate);
    }
  }

  public removeDelegate(delegate: IUserDelegate): void {
    const newDelegates = this._delegates.filter((existing) => existing !== delegate);
    this._delegates = newDelegates;
  }

  public get userDelegates(): IUserDelegate[] {
    return this._delegates;
  }

  public get userState(): UserState | undefined {
    return this._state;
  }

  public set userState(state: UserState) {
    this._state = state;
  }

  public get userId(): string {
    return this._userId;
  }

  public get isManaged(): boolean {
    return this._managed;
  }

  public set managed(managed: boolean) {
    this._managed = managed;
  }
}

interface IExtClient extends IClient, IRequestParamsProvider {}

export class UserService implements IUserService, INotificationDelegate {
  private _users: Map<string, User> = new Map();
  private _client: IExtClient;
  private _cancelNotifications: IStreamCancel | null = null;

  constructor(client: IExtClient) {
    this._client = client;
    this._client.onAuthenticated(() => {
      if (!this._cancelNotifications) {
        this._cancelNotifications = this._client.NotificationService.notifications(this);
      }
    });
    this._client.onLogout(() => {
      if (this._cancelNotifications) {
        this._cancelNotifications();
        this._cancelNotifications = null;
      }

      this._users = new Map();
    });

    this._client.onClose(() => {
      if (this._cancelNotifications) {
        this._cancelNotifications();
        this._cancelNotifications = null;
      }

      this._users = new Map();
    });
  }

  public onEnd(_err?: Error): void {
    this._cancelNotifications = null;
  }

  public onPing(_ctx: Notification, _ev: number): void {
    // Not implemented
  }

  public async onReward(_ctx: Notification, ev: Reward): Promise<void> {
    const rewardedUser = this._users.get(ev.userId);

    if (!ev.type) {
      log.error('Null reward detected, but handled! Bailing.', ev);
      return;
    }

    const details = await this._client.RewardService.getRewardDetails([ev.type]);
    const rewardDetails = details.values().next().value;
    const unclaimedRewardDetails: UnclaimedRewardDetails = {
      ...ev,
      details: rewardDetails,
    };

    if (rewardedUser) {
      if (rewardedUser.isManaged) {
        rewardedUser.userState.unclaimedRewards.push(unclaimedRewardDetails);
      }

      rewardedUser.userDelegates.forEach((delegate) => {
        delegate.onReward(rewardedUser, unclaimedRewardDetails);
      });
    }
  }

  public onGoalCardProgress(_ctx: Notification, _ev: GoalCardSlot): void {
    // @todo: Implement
  }

  public onProgressionUpdate(_ctx: Notification, ev: ProgressionUpdateEvent): void {
    this._users.forEach((user) => {
      const progressionUpdates = progressionUpdatesFromEvent(user.userId, ev);

      if (progressionUpdates.level.length > 0 || progressionUpdates.xp.length > 0) {
        user.userDelegates.forEach((delegate) =>
          delegate.onProgressionUpdate(user, progressionUpdates),
        );
      }
    });
  }

  public onInventoryUpdate(_ctx: Notification, ev: InventoryUpdateEvent): void {
    this._users.forEach((user) => {
      const [newState, filteredUpdate] = stateFromInventoryUpdate(
        user.userId,
        ev,
        user.userState,
      );

      if (user.isManaged) {
        user.userState = newState;
      }

      if (filteredUpdate.events?.length > 0) {
        user.userDelegates.forEach((delegate) =>
          delegate.onInventoryUpdate(user, filteredUpdate),
        );
      }
    });
  }

  public onFriendStatusUpdate(_ctx: Notification, ev: FriendStatusUpdateEvent): void {
    const user = this._users.get(ev.targetUserId);

    if (user) {
      user.userDelegates.forEach((d) => d.onFriendStatusUpdate(user, ev));
    }
  }

  public onPlacementStateUpdate(): void {
    // Not implemented
  }

  public onPartyInvitationUpdate(
    _ctx: Notification,
    ev: PartyInvitationUpdateEvent,
  ): void {
    const inviterUser = this._users.get(ev.partyInvitation.inviterId);
    const inviteeUser = this._users.get(ev.partyInvitation.inviteeId);
    [inviterUser, inviteeUser].forEach((user) => {
      if (user) {
        user.userDelegates.forEach((d) => d.onPartyInvitationUpdate(user, ev));
      }
    });
  }

  public onUserDataExportComplete(): void {
    // Not implemented
  }

  public onChannelUserBanned(_ctx: Notification, ev: UserBannedNotification): void {
    const user = this._users.get(ev.userId);

    if (user) {
      user.userDelegates.forEach((d) => d.onChannelUserBanned(user, ev));
    }
  }

  public onChannelSubscriptionUpdate(): void {
    // Not implemented
  }

  public onWalletTransaction(): void {
    // Not implemented
  }

  public onInvitationCodeUpdate() {
    // Not implemented
  }

  public onGiftSubscription() {
    // Not implemented
  }

  public onUsernameChange() {
    // Not implemented
  }

  public onPlatformUserBanned(
    _ctx: Notification,
    ev: PlatformUserBannedNotification,
  ): void {
    const user = this._users.get(ev.userId);

    if (user) {
      user.userDelegates.forEach((d) => d.onPlatformUserBanned(user, ev));
    }
  }

  public userNotifications(userId: string, delegate: IUserDelegate): () => void {
    let user: User = this._users.get(userId);

    if (!user) {
      user = new User(userId);
      this._users.set(userId, user);
    }

    user.addDelegate(delegate);

    return () => {
      user.removeDelegate(delegate);
    };
  }

  public onForcedSignout(_ctx: Notification, _ev: ForcedSignoutEvent): void {
    this._client.clearSession();
  }

  public async fetchUser(userId: string): Promise<IUser> {
    let user = this._users.get(userId);

    if (!user) {
      user = new User(userId);
      this._users.set(userId, user);
    }

    await user.fetch(this._client);
    user.managed = true;

    return user;
  }

  public getUser(userId: string): IUser | undefined {
    return this._users.get(userId);
  }
}
