import { StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import { Booster, BoosterProps } from './Booster';

import { GameTimer } from '@game-logic/timer';
import { boosterType } from '@game-story-helpers';
import { BoosterType } from '@game-types';

export default {
  title: 'Booster',
  component: Booster,
  argTypes: {
    type: boosterType,
    activeTime: {
      table: {
        disable: true,
      },
    },
  },
};

const boosterId = BoosterType.SpeedUp;

const Template: StoryFn<BoosterProps> = ({ ...args }) => (
  <div style={{ inlineSize: '2rem', blockSize: '2rem' }}>
    <Booster {...args} />
  </div>
);

export const Default = {
  render: Template,

  args: {
    boosterId,
  },
};

const WithTimer: StoryFn<BoosterProps & { duration: number }> = (args) => {
  const [timer, setTimer] = useState<GameTimer>(GameTimer.FromNow(args.duration));

  useEffect(() => {
    setTimer(GameTimer.FromNow(args.duration));
  }, [args.duration]);

  return (
    <Template
      {...args}
      timer={timer}
    />
  );
};

export const WithActiveTime = {
  render: WithTimer,

  args: {
    boosterId,
    duration: 5000,
    size: 'medium',
  },
};
