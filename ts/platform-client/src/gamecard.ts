import {
  CreateStreamerCardDraftRequest,
  GameCardService as GameCardServicePb,
  ProgressionConfig,
  StreamerCardService as StreamerCardServicePb,
} from '@noice-com/schemas/game-card/game_card.pb';
import { Card, StreamerCard } from '@noice-com/schemas/game-logic/game_logic.pb';
import { InventoryItem } from '@noice-com/schemas/inventory/inventory.pb';

import { isNotFound } from './error';
import { IGameCardService, SubService } from './types';

export class GameCardService extends SubService implements IGameCardService {
  public async listGameCards(channelId?: string): Promise<Card[]> {
    const res = await GameCardServicePb.ListGameCards(
      { channelId },
      await this._getInitReq(),
    );

    return res.cards || [];
  }

  public async getGameCardsWithInventory(
    inventoryItems: InventoryItem[],
    channelId?: string,
  ): Promise<Card[]> {
    const res = await GameCardServicePb.InventoryGetGameCards(
      {
        items: inventoryItems,
        channelId,
      },
      await this._getInitReq(),
    );

    return res.cards || [];
  }

  public async getGameCard(id: string): Promise<Card> {
    const res = await this.getGameCards([id]);

    return res[0];
  }

  public async getGameCards(ids: string[]): Promise<Card[]> {
    const res = await GameCardServicePb.BatchGetGameCards(
      { cardIds: ids },
      await this._getInitReq(),
    );

    return res.cards;
  }

  public async getProgressionConfig(): Promise<ProgressionConfig> {
    const res = await GameCardServicePb.GetProgressionConfig(
      {},
      await this._getInitReq(),
    );

    return res.config;
  }

  public async setStreamerCardSelection(streamerCardId: string): Promise<void> {
    await StreamerCardServicePb.SetStreamerCardSelection(
      { streamerCardId },
      await this._getInitReq(),
    );
  }

  public async unsetStreamerCardSelection(
    channelId: string,
    familyId: string,
  ): Promise<void> {
    await StreamerCardServicePb.UnsetStreamerCardSelection(
      { channelId, familyId },
      await this._getInitReq(),
    );
  }

  public async getStreamerCardSelection(
    channelId: string,
    familyId: string,
  ): Promise<StreamerCard> {
    try {
      const res = await StreamerCardServicePb.GetStreamerCardSelection(
        { channelId, familyId },
        await this._getInitReq(),
      );

      return res.card;
    } catch (e) {
      if (isNotFound(e)) {
        return null;
      }

      throw e;
    }
  }

  public async listStreamerCardSelections(familyId: string): Promise<StreamerCard[]> {
    try {
      const res = await StreamerCardServicePb.ListStreamerCardSelections(
        { familyId },
        await this._getInitReq(),
      );

      return res.cards;
    } catch (e) {
      if (isNotFound(e)) {
        return null;
      }

      throw e;
    }
  }

  public async getStreamerCards(ids: string[]): Promise<StreamerCard[]> {
    const res = await StreamerCardServicePb.BatchGetStreamerCards(
      { streamerCardIds: ids },
      await this._getInitReq(),
    );

    return res.cards;
  }

  public async listStreamerCards(
    channelId?: string,
    familyId?: string,
  ): Promise<StreamerCard[]> {
    if (channelId === undefined && familyId === undefined) {
      throw new Error('At least one of (channelId | familyId) needs to be given');
    }

    const filters = [];

    if (channelId !== undefined) {
      filters.push({ channelId });
    }

    if (familyId !== undefined) {
      filters.push({ familyId });
    }

    const res = await StreamerCardServicePb.ListStreamerCards(
      { filters },
      await this._getInitReq(),
    );

    return res.cards;
  }

  public async listInventoryStreamerCards(
    channelId?: string,
    familyId?: string,
  ): Promise<StreamerCard[]> {
    const res = await StreamerCardServicePb.ListInventoryStreamerCards(
      { channelId: channelId ?? '', familyId: familyId ?? '' },
      await this._getInitReq(),
    );

    return res.cards;
  }

  public async createStreamerCardDraft(
    req: CreateStreamerCardDraftRequest,
  ): Promise<StreamerCard> {
    return await StreamerCardServicePb.CreateStreamerCardDraft(
      req,
      await this._getInitReq(),
    );
  }

  public async publishStreamerCardDraft(
    channelId: string,
    draftId: string,
  ): Promise<void> {
    await StreamerCardServicePb.PublishStreamerCardDraft(
      { channelId, cardId: draftId },
      await this._getInitReq(),
    );
  }
}
