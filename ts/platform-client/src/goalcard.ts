import {
  GoalCard,
  GoalCardSlot as GoalCardSlotPb,
  GoalCardService as GoalCardServicePb,
} from '@noice-com/schemas/goal-card/goal_card.pb';
import { Notification } from '@noice-com/schemas/notification/notification.pb';

import { EventEmitter, Delegate } from './lib';
import {
  ExtendedGoalCardSlot,
  GoalCardSlotState,
  IClient,
  IGoalCardService,
  IRequestParamsProvider,
  INotificationDelegate,
  IStreamCancel,
  SubService,
} from './types';

interface ExtClient extends IClient, IRequestParamsProvider {}

export class GoalCardService
  extends SubService
  implements IGoalCardService, INotificationDelegate
{
  private _client: ExtClient;
  private _updateEmitter = new EventEmitter<ExtendedGoalCardSlot>();
  private _notificationsCancel?: IStreamCancel;
  private _goalCards = new Map<string, GoalCard>();
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

  private _onLogin(userId: string) {
    if (this._userId === userId) {
      return;
    }

    this._notificationsCancel && this._notificationsCancel();
    this._notificationsCancel = this._client.NotificationService.notifications(this);
    this._userId = userId;
  }

  private _onLogout() {
    this._notificationsCancel && this._notificationsCancel();
    this._notificationsCancel = undefined;
    this._userId = undefined;
  }

  private _isSlotReadyForPick(slot: GoalCardSlotPb): boolean {
    const slotState = this._getSlotState(slot);
    const resetTimePast = this._isSlotResetTimePast(slot);

    return (
      slotState === GoalCardSlotState.EMPTY ||
      slotState === GoalCardSlotState.FAILED ||
      (slotState === GoalCardSlotState.COLLECTED && resetTimePast)
    );
  }

  private _isSlotResetTimePast(slot: GoalCardSlotPb): boolean {
    return slot.resetTime ? new Date(slot.resetTime).getTime() < Date.now() : false;
  }

  private _getSlotState(slot: GoalCardSlotPb): GoalCardSlotState {
    // Slot has no card
    if (!slot.goalCardId) {
      return GoalCardSlotState.EMPTY;
    }

    // Card has failed
    if (!slot.progress.completed && this._isSlotResetTimePast(slot)) {
      return GoalCardSlotState.FAILED;
    }

    // Card is not completed
    if (!slot.progress.completed) {
      return GoalCardSlotState.SELECTED;
    }

    // Get user, and if there is not user, slot state is unspecified
    const user = this._client.UserService.getUser(this._userId);

    if (!user) {
      return GoalCardSlotState.UNSPECIFIED;
    }

    // Get all unclaim reward for this slot and card
    const unclaimedRewards = user.userState.unclaimedRewards.filter(
      (unclaimedReward) =>
        unclaimedReward.reason.goalCardComplete &&
        unclaimedReward.reason.goalCardComplete.goalCardSlotId === slot.id &&
        unclaimedReward.reason.goalCardComplete.goalCardId === slot.goalCardId,
    );

    // If there is not unclaimed reward, slot is collected, otherwise just completed
    return !unclaimedRewards.length
      ? GoalCardSlotState.COLLECTED
      : GoalCardSlotState.COMPLETED;
  }

  public addListener(delegate: Delegate<ExtendedGoalCardSlot>): () => void {
    return this._updateEmitter.addListener(delegate);
  }

  public async listGoalCardSlots(): Promise<ExtendedGoalCardSlot[]> {
    const resp = await GoalCardServicePb.ListGoalCardSlots({}, await this._getInitReq());
    const slots = await Promise.all(
      resp.slots.map<Promise<ExtendedGoalCardSlot>>(async (slot) => {
        let goalCard: GoalCard;

        if (slot.goalCardId) {
          goalCard = await this.getGoalCard(slot.goalCardId);
        }

        let cardOptions: GoalCard[] = [];

        if (slot.cardOptions) {
          cardOptions = await this.getGoalCards(slot.cardOptions);
        }

        return {
          ...slot,
          goalCard,
          cardOptions,
          state: this._getSlotState(slot),
          resetTimePast: this._isSlotResetTimePast(slot),
          readyForPick: this._isSlotReadyForPick(slot),
        };
      }),
    );

    return slots;
  }

  public async getSlotOptions(slotId: string): Promise<GoalCard[]> {
    const resp = await GoalCardServicePb.GetSlotOptions(
      {
        slotId: slotId,
      },
      await this._getInitReq(),
    );

    for (const card of resp.cardOptions) {
      this._goalCards.set(card.id, card);
    }

    return resp.cardOptions || [];
  }

  public async reshuffleSlot(slotId: string): Promise<GoalCard[]> {
    const resp = await GoalCardServicePb.ReshuffleSlot(
      {
        slotId: slotId,
      },
      await this._getInitReq(),
    );

    for (const card of resp.cardOptions) {
      this._goalCards.set(card.id, card);
    }

    return resp.cardOptions || [];
  }

  public async setGoalCardSlot(
    goalCardSlotId: string,
    goalCardId: string,
  ): Promise<void> {
    await GoalCardServicePb.SetGoalCardSlot(
      {
        goalCardId,
        goalCardSlotId,
      },
      await this._getInitReq(),
    );
    return;
  }

  public async getGoalCard(goalCardId: string): Promise<GoalCard> {
    if (this._goalCards.has(goalCardId)) {
      return this._goalCards.get(goalCardId);
    }

    const resp = await GoalCardServicePb.GetGoalCard(
      {
        id: goalCardId,
      },
      await this._getInitReq(),
    );
    this._goalCards.set(goalCardId, resp);
    return resp;
  }

  public async getGoalCards(goalCardIds: string[]): Promise<GoalCard[]> {
    const toFetch = goalCardIds.filter((id) => !this._goalCards.has(id));

    if (toFetch.length !== 0) {
      const resp = await GoalCardServicePb.BatchGetGoalCards(
        {
          ids: toFetch,
        },
        await this._getInitReq(),
      );

      for (const card of resp.goalCards) {
        this._goalCards.set(card.id, card);
      }
    }

    return goalCardIds.map((id) => this._goalCards.get(id));
  }

  public async onGoalCardProgress(
    _ctx: Notification,
    slot: GoalCardSlotPb,
  ): Promise<void> {
    // TODO process/report errors
    let goalCard: GoalCard;

    if (slot.goalCardId) {
      goalCard = await this.getGoalCard(slot.goalCardId);
    }

    let cardOptions: GoalCard[] = [];

    if (slot.cardOptions) {
      cardOptions = await this.getGoalCards(slot.cardOptions);
    }

    this._updateEmitter.emit({
      ...slot,
      goalCard,
      cardOptions,
      state: this._getSlotState(slot),
      resetTimePast: this._isSlotResetTimePast(slot),
      readyForPick: this._isSlotReadyForPick(slot),
    });
  }

  public getGlobalResetTime(): Promise<Date> {
    const now = new Date();

    return Promise.resolve(
      new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
      ),
    );
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

  public onPlacementStateUpdate(): void {
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
