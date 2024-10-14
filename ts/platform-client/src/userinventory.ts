import {
  InventoryItem,
  ItemConsumption,
  ItemEntitlement,
  ListUserInventoryRequestFilter,
  UserInventoryAdminService,
  UserInventoryService as UserInventoryServicePb,
} from '@noice-com/schemas/inventory/inventory.pb';

import { IUserInventoryService, SubService } from './types';

export class UserInventoryService extends SubService implements IUserInventoryService {
  public async listUserInventory(
    filters?: ListUserInventoryRequestFilter[],
  ): Promise<InventoryItem[]> {
    const resp = await UserInventoryServicePb.ListUserInventory(
      { filters },
      await this._getInitReq(),
    );

    if (!resp.items) {
      throw new Error('items not specified in response');
    }

    return resp.items;
  }

  public async getInventoryItem(itemID: string): Promise<InventoryItem> {
    return await UserInventoryServicePb.GetInventoryItem(
      {
        itemId: itemID,
      },
      await this._getInitReq(),
    );
  }

  public async addEntitlements(
    userId: string,
    entitlements: ItemEntitlement[],
  ): Promise<void> {
    void (await UserInventoryAdminService.AddEntitlements(
      {
        userId,
        entitlements,
        reason: {
          administrative: {},
        },
      },
      await this._getInitReq(),
    ));
  }

  public async removeEntitlements(
    userId: string,
    consumptions: ItemConsumption[],
  ): Promise<void> {
    void (await UserInventoryAdminService.ConsumeItem(
      {
        userId,
        consumptions,
        reason: {
          administrative: {},
        },
      },
      await this._getInitReq(),
    ));
  }
}
