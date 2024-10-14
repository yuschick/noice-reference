import { CoreAssets } from '@noice-com/assets-core';
import { StoryFn, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { MdPause } from 'react-icons/md';

import { GameStateBottomBar, Props } from './GameStateBottomBar';

export default {
  title: 'GameStateBottomBar',
  component: GameStateBottomBar,
};

type Story = StoryObj<Props>;

export const GamePaused: Story = {
  args: {
    icon: MdPause,
    reason: 'Game is paused!',
  },
};

export const ProgressionPaused: Story = {
  args: {
    icon: CoreAssets.Icons.Alert,
    reason: 'Progression is currently disabled due to: Season is changing',
  },
};

const RoundEndedTemplate: StoryFn<Props> = (args) => {
  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev - 1;
        if (next === 0) {
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameStateBottomBar
      {...args}
      reason={
        <div>
          Card select will be locked after next round starts in{' '}
          <span style={{ color: 'var(--noi-color-teal-main)' }}>{seconds} seconds</span>
        </div>
      }
    />
  );
};

export const RoundEnded = {
  args: {
    icon: CoreAssets.Icons.Lock,
  },
  render: RoundEndedTemplate,
};
