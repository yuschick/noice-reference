import {
  Item,
  ItemBootstrap,
  ItemService as ItemServicePb,
} from '@noice-com/schemas/item/item.pb';

import { IItemService, SubService } from './types';

export class ItemService extends SubService implements IItemService {
  public async getItem(itemID: string): Promise<Item> {
    const res = await ItemServicePb.GetItem({ id: itemID }, await this._getInitReq());

    return res.item;
  }

  public async getItems(itemIDs: string[]): Promise<Item[]> {
    const res = await ItemServicePb.BatchGetItems(
      { ids: itemIDs },
      await this._getInitReq(),
    );

    return res.items || [];
  }

  public async listItems(): Promise<Item[]> {
    const res = await ItemServicePb.ListItems({}, await this._getInitReq());

    return res.items || [];
  }

  public async createItemBootstrap(bootstrap: ItemBootstrap): Promise<void> {
    await ItemServicePb.CreateItemBootstrap({ bootstrap }, await this._getInitReq());
  }

  public async updateItemBootstrap(body: ItemBootstrap): Promise<void> {
    await ItemServicePb.UpdateItemBootstrap({ body }, await this._getInitReq());
  }

  public async listItemBootstraps(itemId: string): Promise<ItemBootstrap[]> {
    const { bootstraps } = await ItemServicePb.ListItemBootstraps(
      { itemId },
      await this._getInitReq(),
    );

    return bootstraps;
  }
}
