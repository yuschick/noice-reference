import { WalletCurrencyId } from '@noice-com/common-ui';
import { StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Challenge, Props } from './Challenge';

import { ChallengeStatus } from '@game-logic/challenges';

const Template = (args: Props) => (
  <div
    style={{
      blockSize: '100vh',
      inlineSize: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div style={{ inlineSize: '100%', maxInlineSize: '30rem' }}>
      <Challenge {...args} />
    </div>
  </div>
);

export default {
  title: 'Challenges/Challenge',
  component: Challenge,
  render: Template,
  parameters: {
    layout: 'fullscreen',
  },
};

type Story = StoryObj<Props>;

const challenge = {
  description: 'One of the first 10 to be eliminated',
  pickRatePercentage: 60,
  status: 'unresolved' as ChallengeStatus,
  reward: {
    currencyId: WalletCurrencyId.SoftCurrency,
    amount: 99999,
  },
};

const defaultArgs: Props = {
  challenge,
  onClick: () => {},
};

const DefaultSelectable = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Template
      challenge={challenge}
      isSelected={isSelected}
      onClick={() => setIsSelected(!isSelected)}
    />
  );
};

export const Default: Story = {
  render: DefaultSelectable,
};

export const Selected: Story = {
  args: { ...defaultArgs, isSelected: true },
};

export const Successful: Story = {
  args: { ...defaultArgs, challenge: { ...defaultArgs.challenge, status: 'success' } },
};

export const Failed: Story = {
  args: { ...defaultArgs, challenge: { ...defaultArgs.challenge, status: 'failure' } },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Disabled: Story = {
  args: { ...defaultArgs, isDisabled: true },
};
