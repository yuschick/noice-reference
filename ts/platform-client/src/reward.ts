import { Card } from '@noice-com/schemas/game-logic/game_logic.pb';
import { ItemType } from '@noice-com/schemas/item/item.pb';
import {
  Reward,
  RewardService as RewardServicePb,
  RewardType,
} from '@noice-com/schemas/reward/reward.pb';

import {
  IRewardService,
  SubService,
  IClient,
  IRequestParamsProvider,
  RewardDetails,
  ItemRewardDetails,
  CurrencyRewardDetails,
} from './types';

export class RewardService extends SubService implements IRewardService {
  private _client: IClient;

  constructor(client: IClient & IRequestParamsProvider) {
    super(client);
    this._client = client;
  }

  public async listRewards(): Promise<Reward[]> {
    const resp = await RewardServicePb.ListRewards({}, await this._getInitReq());

    return resp.rewards || [];
  }

  public async claimReward(rewardId: string): Promise<void> {
    await RewardServicePb.ClaimReward({ rewardId }, await this._getInitReq());
    return;
  }

  public async getRewardDetails(
    rewards: RewardType[],
  ): Promise<Map<string, RewardDetails>> {
    const details: Map<string, RewardDetails> = new Map();

    const itemsToFetch: string[] = [];
    rewards.forEach((reward) => {
      if (reward.item) {
        itemsToFetch.push(reward.item.itemId);
      }
    });

    const items = await this._client.ItemService.getItems(itemsToFetch);
    const cardItems = items.filter((item) => item.type === ItemType.TYPE_GAME_CARD);

    let cards: Card[] = [];

    if (cardItems.length > 0) {
      cards = await this._client.GameCardService.getGameCardsWithInventory(
        cardItems.map((item) => ({ itemCount: '1', itemId: item.id })),
      );
    }

    const itemToCard = new Map<string, Card>();

    for (const i in cardItems) {
      const card = cards[i];
      itemToCard.set(cardItems[i].id, card);
    }

    rewards.forEach((reward) => {
      let currency: CurrencyRewardDetails | undefined;
      let item: ItemRewardDetails | undefined;
      let id: string | undefined;

      if (reward.currency) {
        id = reward.currency.currencyId;
        currency = {
          currencyAmount: parseInt(reward.currency.currencyAmount, 10),
          currencyId: reward.currency.currencyId,
        };

        if (currency.currencyAmount === 0) {
          return false;
        }
      } else if (reward.item) {
        id = reward.item.itemId;
        item = {
          props: items.find((item) => item.id === reward.item.itemId),
          gameCard: itemToCard.get(reward.item.itemId),
        };

        if (parseInt(reward.item.itemCount ?? '0', 10) === 0) {
          return false;
        }
      }

      if (id) {
        details.set(id, {
          currency,
          item,
        });
      }
    });

    return details;
  }
}
