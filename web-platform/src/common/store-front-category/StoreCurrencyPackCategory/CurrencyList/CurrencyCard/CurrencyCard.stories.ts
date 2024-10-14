import { CurrencyCard } from './CurrencyCard';

export default {
  title: 'StoreFrontCategory/Currency Card',
  component: CurrencyCard,
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

const priceCurrencyBundle = {
  name: 'Bag of Gems',
  price: {
    currency: 'CURRENCY_EUR',
    amount: 299,
  },
  promotionName: '',
  content: [
    {
      value: {
        __typename: 'StoreV2CurrencyRef',
        id: 'hard-currency',
        amount: 100,
      },
    },
  ],
};

const igcPriceCurrencyBundle = {
  name: 'Box of Tokens',
  price: null,
  content: [
    {
      value: {
        __typename: 'StoreV2CurrencyRef',
        id: 'reshuffle-token',
        amount: 100,
      },
    },
  ],
  igcPrices: [
    {
      currencyId: 'hard-currency',
      default: true,
      amount: 50,
    },
  ],
};

export const Default = {
  args: {
    sellableItem: priceCurrencyBundle,
  },
};

export const Disabled = {
  args: {
    sellableItem: priceCurrencyBundle,
    isPurchasing: true,
  },
};

export const WithPromotion = {
  args: {
    sellableItem: {
      ...priceCurrencyBundle,
      price: {
        ...priceCurrencyBundle.price,
        amountWithoutDiscount: 399,
      },
      promotionName: 'Summer sale!',
      discountPercent: 25,
    },
  },
};

export const WithNoiceCurrency = {
  args: {
    sellableItem: igcPriceCurrencyBundle,
  },
};

export const WithNoiceCurrencyAndPromotion = {
  args: {
    sellableItem: {
      ...igcPriceCurrencyBundle,
      igcPrices: [
        {
          ...igcPriceCurrencyBundle.igcPrices[0],
          amountWithoutDiscount: 50,
          amount: 25,
        },
      ],
      promotionName: 'Summer sale!',
      discountPercent: 50,
    },
  },
};
