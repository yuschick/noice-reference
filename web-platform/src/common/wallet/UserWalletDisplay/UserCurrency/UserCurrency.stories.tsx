import { StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { UserCurrency, Props } from './UserCurrency';

import { WalletWalletCurrency } from '@gen';

export default {
  title: 'UserCurrency',
  component: UserCurrency,
};

const currency: WalletWalletCurrency = {
  currencyId: 'hard-currency',
  currencyAmount: 2500,
};

const Template: StoryFn<Props> = (args) => {
  const [currency, setCurrency] = useState<WalletWalletCurrency>(args.currency);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrency((prev) => ({
        ...prev,
        currencyAmount: Math.max(
          0,
          prev.currencyAmount +
            (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 5000),
        ),
      }));
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <UserCurrency currency={currency} />;
};

export const Default = {
  args: {
    currency,
  },
  render: Template,
};
