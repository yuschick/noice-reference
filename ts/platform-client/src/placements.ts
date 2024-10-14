import {
  PlacementsService as PlacementsServicePb,
  PlacementStateEvent,
} from '@noice-com/schemas/ads/ads.pb';
import { Notification } from '@noice-com/schemas/notification/notification.pb';

import { Delegate, EventEmitter } from './lib';
import {
  PlacementDetails,
  IPlacementService,
  SubService,
  IClient,
  IRequestParamsProvider,
  IStreamCancel,
} from './types';

interface ExtClient extends IClient, IRequestParamsProvider {}

export class PlacementService extends SubService implements IPlacementService {
  private _client: ExtClient;
  private _updateEmitter = new EventEmitter<PlacementDetails>();
  private _notificationsCancel?: IStreamCancel;
  private _userId: string;

  constructor(cli: ExtClient) {
    super(cli);

    this._client = cli;
    this._client.onAuthenticated((auth) => {
      this._onLogin(auth.uid);
    });
    this._client.onLogout(() => {
      this._onLogout();
    });
    this._client.onClose(() => {
      this._onLogout();
    });
  }

  private _onLogin(userID: string) {
    if (this._userId === userID) {
      return;
    }

    this._userId = userID;
    this._notificationsCancel?.();
    this._notificationsCancel = this._client.NotificationService.notifications(this);
  }

  private _onLogout() {
    this._notificationsCancel?.();
    this._notificationsCancel = undefined;
  }

  public addListener(delegate: Delegate<PlacementDetails>): () => void {
    return this._updateEmitter.addListener(delegate);
  }

  public async getPlacement(placementId: string): Promise<PlacementDetails> {
    const resp = await PlacementsServicePb.GetPlacement(
      { placementId },
      await this._getInitReq(),
    );

    return {
      placementId: resp.placementId,
      state: resp.state,
      referenceId: resp.referenceId,
      updatesAt: resp.updatesAt,
      reward: resp.reward,
      rewards: resp.rewards,
    };
  }

  public async rewardPlacement(placementId: string): Promise<void> {
    await PlacementsServicePb.RewardPlacement({ placementId }, await this._getInitReq());
  }

  // INotificationsDelegate

  public async onPlacementStateUpdate(
    _: Notification,
    ev: PlacementStateEvent,
  ): Promise<void> {
    this._updateEmitter.emit({
      placementId: ev.placementId,
      referenceId: ev.referenceId,
      state: ev.state,
    });
  }

  public onEnd(): void {
    // Not implemented
  }

  public onPing(): void {
    // Not implemented
  }
  public onReward(): void {
    // Not implemented
  }

  public onProgressionUpdate(): void {
    // Not implemented
  }

  public onWalletUpdate(): void {
    // Not implemented
  }

  public onInventoryUpdate(): void {
    // Not implemented
  }

  public onGoalCardProgress(): void {
    // Not implemented
  }
  public onFriendStatusUpdate(): void {
    // Not implemented
  }

  public onPartyInvitationUpdate(): void {
    // Not implemented
  }

  public onUserDataExportComplete(): void {
    // Not implemented
  }

  public onChannelUserBanned(): void {
    // Not implemented
  }

  public onPlatformUserBanned(): void {
    // Not implemented
  }

  public onChannelSubscriptionUpdate(): void {
    // Not implemented
  }

  public onWalletTransaction(): void {
    // Not implemented
  }

  public onForcedSignout(): void {
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
}
