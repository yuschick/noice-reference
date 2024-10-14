import {
  Wallet,
  WalletService as WalletServicePb,
  WalletAdminService,
  WalletCurrency,
} from '@noice-com/schemas/wallet/wallet.pb';

import { IWalletService, SubService } from './types';

export class WalletService extends SubService implements IWalletService {
  public async getWallet(): Promise<Wallet> {
    const resp = await WalletServicePb.GetWallet(
      { userId: 'me' },
      await this._getInitReq(),
    );

    if (!resp.wallet) {
      throw new Error('no wallet returned in the response');
    }

    return resp.wallet;
  }

  public async addCurrencies(
    userID: string,
    currencies: WalletCurrency[],
  ): Promise<void> {
    await WalletAdminService.AddCurrencies(
      {
        reason: {
          administrative: {},
        },
        userId: userID,
        currencies: currencies,
      },
      await this._getInitReq(),
    );
  }

  public async substractCurrencies(
    userID: string,
    currencies: WalletCurrency[],
  ): Promise<void> {
    await WalletAdminService.SubtractCurrencies(
      {
        reason: {
          administrative: {},
        },
        userId: userID,
        currencies: currencies,
      },
      await this._getInitReq(),
    );
  }
}
