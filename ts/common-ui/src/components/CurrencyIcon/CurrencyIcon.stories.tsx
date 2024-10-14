import { StoryFn } from '@storybook/react';

import { CurrencyIcon, Props } from './CurrencyIcon';

import { WalletCurrencyId } from '@common-types';

export default {
  title: 'Currency Icon',
  component: CurrencyIcon,
  argTypes: {
    type: {
      options: Object.values(WalletCurrencyId),
      name: 'Currency type',
      description: 'Type of the currency for the icon',
      control: { type: 'select' },
    },
  },
};

const Template: StoryFn<Props> = ({ ...args }) => {
  return <CurrencyIcon {...args} />;
};

Template.parameters = {};

export const Default = {
  render: Template,
  parameters: {},

  args: {
    type: WalletCurrencyId.SoftCurrency,
    iconSize: 'lg',
  },
};
