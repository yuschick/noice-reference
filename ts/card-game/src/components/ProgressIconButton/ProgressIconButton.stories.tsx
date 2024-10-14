import { StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { RiMedal2Fill } from 'react-icons/ri';

import { ProgressIconButton, Props } from './ProgressIconButton';

import { GameTimer } from '@game-logic/timer';
import { BoosterType } from '@game-types';

export default {
  title: 'Card Row/ProgressIconButton',
  component: ProgressIconButton,
};

export const Default = {
  args: {
    icon: RiMedal2Fill,
  },
};

export const Booster = {
  args: {
    icon: BoosterType.NextUp,
  },
};

export const Ready = {
  args: {
    icon: RiMedal2Fill,
    isReady: true,
  },
};

export const WithTimer: StoryObj<Props & { duration: number }> = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [timer, setTimer] = useState<GameTimer>(GameTimer.FromNow(args.duration));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setTimer(GameTimer.FromNow(args.duration));
    }, [args.duration]);

    return (
      <ProgressIconButton
        {...args}
        timer={timer}
      />
    );
  },

  args: {
    ...Default.args,
    duration: 5000,
  },
};

export const WithPulseRepeat = {
  args: {
    ...Default.args,
    repeatPulse: true,
  },
};
