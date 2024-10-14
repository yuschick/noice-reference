import { renderHook } from '@testing-library/react';

import { useWallet } from '../useWallet.hook';

import { WalletCurrencyId } from '@common-types';

const mockUseAuthenticatedUser = jest.fn();
jest.mock('@common-context', () => ({
  useAuthentication: () => mockUseAuthenticatedUser(),
}));

const mockUseWalletQuery = jest.fn();
jest.mock('@common-gen', () => ({
  ...jest.requireActual('@common-gen'),
  useWalletQuery: () => mockUseWalletQuery(),
}));

const mockWalletData = {
  wallet: {
    wallet: {
      currencies: [
        {
          currencyId: WalletCurrencyId.HardCurrency,
          currencyAmount: 1000,
        },
        {
          currencyId: WalletCurrencyId.SoftCurrency,
          currencyAmount: 2000,
        },
      ],
    },
  },
};

describe('useWallet hook', () => {
  it('should return default wallet when no data is available', () => {
    mockUseAuthenticatedUser.mockReturnValue({ userId: '1', isImplicitAccount: false });
    mockUseWalletQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useWallet());
    const { wallet, currencies } = result.current;

    expect(wallet).toEqual({
      [WalletCurrencyId.ChannelCurrency]: 0,
      [WalletCurrencyId.HardCurrency]: 0,
      [WalletCurrencyId.ReshuffleToken]: 0,
      [WalletCurrencyId.SoftCurrency]: 0,
    });
    expect(currencies).toEqual([]);
  });

  it('should return wallet content when data is available', () => {
    mockUseAuthenticatedUser.mockReturnValue({ userId: '1', isImplicitAccount: false });
    mockUseWalletQuery.mockReturnValue({
      data: mockWalletData,
    });

    const { result } = renderHook(() => useWallet());
    const { wallet, currencies } = result.current;

    expect(wallet).toEqual({
      [WalletCurrencyId.ChannelCurrency]: 0,
      [WalletCurrencyId.HardCurrency]: 1000,
      [WalletCurrencyId.ReshuffleToken]: 0,
      [WalletCurrencyId.SoftCurrency]: 2000,
    });
    expect(currencies).toEqual([
      {
        currencyId: WalletCurrencyId.HardCurrency,
        currencyAmount: 1000,
      },
      {
        currencyId: WalletCurrencyId.SoftCurrency,
        currencyAmount: 2000,
      },
    ]);
  });

  it('should reduce hard currency for implicit accounts', () => {
    mockUseAuthenticatedUser.mockReturnValue({ userId: '1', isImplicitAccount: true });
    mockUseWalletQuery.mockReturnValue({
      data: mockWalletData,
    });

    const { result } = renderHook(() => useWallet());
    const { wallet, currencies } = result.current;

    expect(wallet).toEqual({
      [WalletCurrencyId.ChannelCurrency]: 0,
      [WalletCurrencyId.HardCurrency]: 750,
      [WalletCurrencyId.ReshuffleToken]: 0,
      [WalletCurrencyId.SoftCurrency]: 2000,
    });
    expect(currencies).toEqual([
      {
        currencyId: WalletCurrencyId.HardCurrency,
        currencyAmount: 750,
      },
      {
        currencyId: WalletCurrencyId.SoftCurrency,
        currencyAmount: 2000,
      },
    ]);
  });
});
