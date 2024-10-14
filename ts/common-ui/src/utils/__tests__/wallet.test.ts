import { getWalletCurrencyId } from '..';

import { WalletCurrencyId } from '@common-types';

describe('getWalletCurrencyId', () => {
  it('should return correct value with valid input', () => {
    const result = getWalletCurrencyId('soft-currency');
    expect(result).toEqual(WalletCurrencyId.SoftCurrency);
  });

  it('should return null with invalid input', () => {
    const result = getWalletCurrencyId('invalid');
    expect(result).toBeNull();
  });

  it('should return nuull with undefined input', () => {
    const result = getWalletCurrencyId(undefined);
    expect(result).toBeNull();
  });
});
