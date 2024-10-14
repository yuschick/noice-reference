import { PlacementStateEvent } from '@noice-com/schemas/ads/ads.pb';
import { UserBannedNotification } from '@noice-com/schemas/channel/moderation.pb';
import { StreamError } from '@noice-com/schemas/fetch.pb';
import { FriendStatusUpdateEvent } from '@noice-com/schemas/friends/friends.pb';
import { GoalCardSlot } from '@noice-com/schemas/goal-card/goal_card.pb';
import { InventoryUpdateEvent } from '@noice-com/schemas/inventory/inventory.pb';
import { InvitationCodeUpdateEvent } from '@noice-com/schemas/invitation/invitation.pb';
import { PlatformUserBannedNotification } from '@noice-com/schemas/moderation/platform_moderation.pb';
import {
  ForcedSignoutEvent,
  Notification,
  routeNotificationContentContentDelegate,
  NotificationService as NotificationServicePb,
  GiftSubscription,
} from '@noice-com/schemas/notification/notification.pb';
import { PartyInvitationUpdateEvent } from '@noice-com/schemas/party/party.pb';
import { UserDataExportCompleteEvent } from '@noice-com/schemas/privacy/privacy.pb';
import { UsernameChange } from '@noice-com/schemas/profile/profile.pb';
import { ProgressionUpdateEvent } from '@noice-com/schemas/progression/progression.pb';
import { Reward } from '@noice-com/schemas/reward/reward.pb';
import { ChannelSubscriptionUpdateEvent } from '@noice-com/schemas/subscription/subscription.pb';
import { TransactionEvent } from '@noice-com/schemas/wallet/wallet.pb';

import {
  IClient,
  INotificationDelegate,
  INotificationService,
  IRequestParamsProvider,
  IStreamCancel,
  SubService,
} from './types';

const INITIAL_RETRY_BACKOFF = 500;

interface ExtClient extends IClient, IRequestParamsProvider {}

export class NotificationService
  extends SubService
  implements INotificationService, INotificationDelegate
{
  private _streamCancel?: IStreamCancel;
  private _listeners: Partial<INotificationDelegate>[] = [];
  private _pingReceived = -1;
  private _cursor?: string;
  private _retryBackoff = INITIAL_RETRY_BACKOFF;

  private _client: ExtClient;
  private _uid = '';

  constructor(cli: ExtClient) {
    super(cli);

    this._client = cli;

    cli.onClose((): void => {
      this._streamCancel && this._streamCancel();
      this._streamCancel = undefined;
    });
    cli.onAuthenticated((auth) => {
      if (this._uid !== '' && this._uid !== auth.uid) {
        this.resubscribe();
      }
    });
  }

  private _getRetryBackoff(): number {
    this._retryBackoff *= 2;

    return this._retryBackoff;
  }

  private _consumerNotifications(delegate?: INotificationDelegate): IStreamCancel {
    this._pingReceived = -1;

    const onEnd = (e?: Error) => {
      delegate?.onEnd?.(e);

      delegate = undefined;
    };

    const abortController = new AbortController();

    const promise = this._getInitReq().then((initReq) => {
      const userID = this._client.getSession()?.auth?.uid;

      this._uid = userID || '';

      return NotificationServicePb.Notifications(
        { cursor: this._cursor },
        (resp: Notification) => {
          this._retryBackoff = INITIAL_RETRY_BACKOFF;

          const content = resp.content;

          if (!content || !delegate) {
            return;
          }

          this._cursor = resp.id || this._cursor; // Pings don't have ID, so don't overwrite it

          routeNotificationContentContentDelegate<Notification>(resp, content, delegate);
        },
        { ...initReq, signal: abortController.signal },
      );
    });

    promise
      .then(() => onEnd())
      .catch((e: StreamError) => {
        if (e.code === 3) {
          this._cursor = undefined;
          // TODO add a new callback to inform the client that things are beyond repair and we need to refresh
          // the whole state
        }

        onEnd(e);
      });

    return () => {
      this._uid = '';
      onEnd(undefined);
      abortController.abort();
    };
  }

  private _startNotifications() {
    this._streamCancel = this._consumerNotifications(this);
  }

  private _safeForEachListener(
    l: (delegate: Partial<INotificationDelegate>) => void,
  ): void {
    this._listeners.forEach((d) => {
      try {
        l(d);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public notifications(delegate?: Partial<INotificationDelegate>): IStreamCancel {
    delegate && this._listeners.push(delegate);

    if (!this._streamCancel) {
      this._startNotifications();
    } else if (this._pingReceived !== -1) {
      // Fake ping event as it would be the first ping from the real stream
      delegate.onPing?.({ content: { ping: this._pingReceived } }, this._pingReceived);
    }

    return () => {
      delegate?.onEnd?.(undefined);

      this._listeners = this._listeners.filter((l) => l !== delegate);

      if (this._listeners.length === 0) {
        this._streamCancel && this._streamCancel();
        this._streamCancel = undefined;
      }
    };
  }

  public resubscribe() {
    this._streamCancel && this._streamCancel();
    this._streamCancel = undefined;
    this._startNotifications();
  }

  public onEnd(e?: Error): void {
    this._streamCancel = undefined;

    if (e) {
      if (this._pingReceived === -1) {
        // If we lost connection before any pings
        // where received wait for 5 seconds before connection.
        // TODO add logging for this
        setTimeout(() => {
          if (!this._streamCancel) {
            this._startNotifications();
          }
        }, this._getRetryBackoff());
      } else {
        this._startNotifications();
      }
    } else {
      this._safeForEachListener((l) => l.onEnd?.(e));
    }
  }

  public onPing(ctx: Notification, ev: number): void {
    this._pingReceived = ev;

    this._safeForEachListener((l) => l.onPing?.(ctx, ev));
  }

  public onReward(ctx: Notification, ev: Reward): void {
    this._safeForEachListener((l) => l.onReward?.(ctx, ev));
  }

  public onGoalCardProgress(ctx: Notification, ev: GoalCardSlot): void {
    this._safeForEachListener((l) => l.onGoalCardProgress?.(ctx, ev));
  }

  public onProgressionUpdate(ctx: Notification, ev: ProgressionUpdateEvent): void {
    this._safeForEachListener((l) => l.onProgressionUpdate?.(ctx, ev));
  }

  public onInventoryUpdate(ctx: Notification, ev: InventoryUpdateEvent): void {
    this._safeForEachListener((l) => l.onInventoryUpdate?.(ctx, ev));
  }

  public onPlacementStateUpdate(ctx: Notification, ev: PlacementStateEvent): void {
    this._safeForEachListener((l) => l.onPlacementStateUpdate?.(ctx, ev));
  }

  public onFriendStatusUpdate(ctx: Notification, ev: FriendStatusUpdateEvent): void {
    this._safeForEachListener((l) => l.onFriendStatusUpdate?.(ctx, ev));
  }

  public onPartyInvitationUpdate(
    ctx: Notification,
    ev: PartyInvitationUpdateEvent,
  ): void {
    this._safeForEachListener((l) => l.onPartyInvitationUpdate?.(ctx, ev));
  }

  public onUserDataExportComplete(
    ctx: Notification,
    ev: UserDataExportCompleteEvent,
  ): void {
    this._safeForEachListener((l) => l.onUserDataExportComplete?.(ctx, ev));
  }

  public onChannelUserBanned(ctx: Notification, ev: UserBannedNotification): void {
    this._safeForEachListener((l) => l.onChannelUserBanned?.(ctx, ev));
  }

  public onPlatformUserBanned(
    ctx: Notification,
    ev: PlatformUserBannedNotification,
  ): void {
    this._safeForEachListener((l) => l.onPlatformUserBanned?.(ctx, ev));
  }

  public onChannelSubscriptionUpdate(
    ctx: Notification,
    ev: ChannelSubscriptionUpdateEvent,
  ): void {
    this._safeForEachListener((l) => l.onChannelSubscriptionUpdate?.(ctx, ev));
  }

  public onWalletTransaction(ctx: Notification, ev: TransactionEvent): void {
    this._safeForEachListener((l) => l.onWalletTransaction?.(ctx, ev));
  }

  public onForcedSignout(ctx: Notification, ev: ForcedSignoutEvent): void {
    this._safeForEachListener((l) => l.onForcedSignout?.(ctx, ev));
  }

  public onInvitationCodeUpdate(ctx: Notification, ev: InvitationCodeUpdateEvent) {
    this._safeForEachListener((l) => l.onInvitationCodeUpdate?.(ctx, ev));
  }

  public onGiftSubscription(ctx: Notification, ev: GiftSubscription) {
    this._safeForEachListener((l) => l.onGiftSubscription?.(ctx, ev));
  }

  public onUsernameChange(ctx: Notification, ev: UsernameChange) {
    this._safeForEachListener((l) => l.onUsernameChange?.(ctx, ev));
  }
}
