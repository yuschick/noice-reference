import { StoryHelpers } from '@noice-com/common-ui';

import { UserWalletDisplay } from './UserWalletDisplay';

import { WalletDocument } from '@gen';

const USER_ID = 'my-user-id';

export default {
  title: 'UserWalletDisplay',
  component: UserWalletDisplay,
  decorators: [StoryHelpers.withAuthProvider({ userId: USER_ID })],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Display a list of currencies for a user.`,
      },
    },
  },
};

export const Default = {
  args: {},

  parameters: {
    ...StoryHelpers.Apollo.addMocks([
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
                  currencyAmount: 9967053,
                  __typename: 'WalletWalletCurrency',
                },
                {
                  currencyId: 'reshuffle-token',
                  currencyAmount: 100000303,
                  __typename: 'WalletWalletCurrency',
                },
                {
                  currencyId: 'soft-currency',
                  currencyAmount: 131742,
                  __typename: 'WalletWalletCurrency',
                },
              ],
            },
          },
        },
      ),
    ]),
    docs: {
      description: {
        story: `A standard list of multiple currency types.`,
      },
    },
  },
};
