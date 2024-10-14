/* eslint-disable @typescript-eslint/naming-convention */
import { GameStoryHelpers } from '@noice-com/card-game';
import { StoryHelpers } from '@noice-com/common-ui';

import { CardBundleCard } from './CardBundleCard';

import { StoreV2ItemType, WalletDocument } from '@gen';

const USER_ID = 'user-id';

export default {
  title: 'StoreFrontCategory/CardBundleCard',
  component: CardBundleCard,
  decorators: [StoryHelpers.withAuthProvider({ userId: USER_ID })],
  parameters: StoryHelpers.Apollo.addMocks([
    StoryHelpers.Apollo.createMock(
      WalletDocument,
      { userId: USER_ID },
      {
        wallet: {
          wallet: {
            currencies: [
              {
                currencyId: 'channel-currency',
                currencyAmount: 0,
                __typename: 'WalletWalletCurrency',
              },
              {
                currencyId: 'hard-currency',
                currencyAmount: 1000,
                __typename: 'WalletWalletCurrency',
              },
              {
                currencyId: 'reshuffle-token',
                currencyAmount: 1000,
                __typename: 'WalletWalletCurrency',
              },
              {
                currencyId: 'soft-currency',
                currencyAmount: 5000,
                __typename: 'WalletWalletCurrency',
              },
            ],
            __typename: 'WalletWallet',
          },
          __typename: 'WalletGetWalletResponse',
        },
      },
    ),
  ]),
};

export const Default = {
  args: {
    sellableItem: {
      type: StoreV2ItemType.ItemTypeStandardCardBundle,
      name: 'Standard Small',
      igcPrices: [
        {
          amount: 4000,
          currencyId: 'soft-currency',
          default: true,
        },
      ],
      content: [
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 4,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-1',
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
                __typename: 'GameLogicCard',
                id: '1|1|base',
                rarity: 'RARITY_COMMON',
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 7,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-12',
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
                __typename: 'GameLogicCard',
                id: '12|1|base',
                rarity: 'RARITY_UNCOMMON',
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 6,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-14',
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
                __typename: 'GameLogicCard',
                id: '14|1|base',
                rarity: 'RARITY_EPIC',
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 3,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-16',
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
                __typename: 'GameLogicCard',
                id: '16|1|base',
                rarity: 'RARITY_LEGENDARY',
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 5,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-50',
              details: {
                ...GameStoryHelpers.getNewGraphQLGameCard(),
                __typename: 'GameLogicCard',
                id: '50|1|base',
                rarity: 'RARITY_RARE',
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
      ],
    },
    isOpened: false,
  },
};

export const BundleOnSale = {
  ...Default,
  args: {
    ...Default.args,
    sellableItem: {
      ...Default.args.sellableItem,
      igcPrices: [
        {
          amount: 3000,
          currencyId: 'soft-currency',
          default: true,
          amountWithoutDiscount: 4000,
        },
      ],
      discountPercent: 50,
      promotionName: 'First-Time Purchase',
    },
  },
};

export const BundleWithStreamerCard = {
  args: {
    sellableItem: {
      type: StoreV2ItemType.ItemTypePremiumCardBundle,
      igcPrices: [
        {
          amount: 400,
          currencyId: 'hard-currency',
          default: true,
        },
      ],
      content: [
        ...Default.args.sellableItem.content,
        {
          __typename: 'StoreV2Content',
          value: {
            __typename: 'StoreV2ItemRef',
            count: 7,
            item: {
              __typename: 'ItemItem',
              id: 'game-card-fortnite-12',
              details: {
                __typename: 'GameLogicStreamerCard',
                ...GameStoryHelpers.getNewGraphQLGameStreamerCard(),
                baseCard: {
                  ...GameStoryHelpers.getNewGraphQLGameCard(),
                },
              },
              game: {
                id: 'fortnite',
                name: 'Fortnite',
              },
            },
          },
        },
      ],
    },
  },
};
