import { StoryObj } from '@storybook/react';

import { AnimatedLabel, Props } from './AnimatedLabel';
import styles from './AnimatedLabel.stories.module.css';

export default {
  title: 'AnimatedLabel',
  component: AnimatedLabel,
};

type Story = StoryObj<Props>;

export const Default: Story = {
  args: {
    className: styles.animatedLabel,
    text: 'Game on',
  },
};

export const WaitBeforeLeaving: Story = {
  args: {
    className: styles.animatedLabel,
    text: 'Game on',
    animationDurations: {
      wait: 3000,
    },
  },
};
