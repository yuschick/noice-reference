import { useAnimatedNumber } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { GameStateLabel, Props } from './GameStateLabel';

const Template: StoryFn<Props> = (args) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <GameStateLabel {...args} />
  </div>
);

export default {
  title: 'GameStateLabel',
  component: GameStateLabel,
  render: Template,
};

export const GameOn = {
  args: {
    title: 'Game on',
  },
};

export const GameOnWithSubtitle = {
  args: {
    title: 'Game on',
    subtitle: 'Card select is now locked',
  },
};

const Subtitle1 = () => (
  <div
    style={{
      textAlign: 'center',
      lineHeight: 'var(--noi-line-height-medium',
      whiteSpace: 'nowrap',
    }}
  >
    your team scored
    <br />
    <span
      style={{
        color: 'var(--noi-color-teal-main)',
      }}
    >
      240 points
    </span>
  </div>
);

const Subtitle2 = () => {
  const { value: secondsLeft } = useAnimatedNumber({
    initialValue: 15,
    target: 0,
    duration: 15000,
  });

  return (
    <div
      style={{
        textAlign: 'center',
        lineHeight: 'var(--noi-line-height-medium)',
        whiteSpace: 'nowrap',
      }}
    >
      pick card before next round starts
      <br />
      <span
        style={{
          color: 'var(--noi-color-teal-main)',
        }}
      >
        in {secondsLeft} seconds
      </span>
    </div>
  );
};

export const RoundEnded = {
  args: {
    subtitle: [<Subtitle1 key="subtitle1" />, <Subtitle2 key="subtitle2" />],
    title: 'Round ended',
  },
};

export const SidesSwitched = {
  args: {
    title: 'Sides Switched',
    subtitle: 'Cards are reset',
  },
};
