import { Meta, StoryFn } from '@storybook/react';
import { CSSProperties } from 'react';

import {
  HighScoringCardOverlay,
  HighScoringCardOverlayProps,
} from './HighScoringCardOverlay';

export default {
  title: 'MatchViewLg/High Scoring Card/Overlay Badge',
  component: HighScoringCardOverlay,
  argTypes: {
    view: {
      options: ['countdown', 'hidden'],
      control: { type: 'select' },
    },
  },
} as Meta<typeof HighScoringCardOverlay>;

const wrapperStyles: CSSProperties = {
  display: 'flex',
  width: '200px',
  height: '100px',
  justifyContent: 'center',
  alignItems: 'center',
};

const Template: StoryFn<HighScoringCardOverlayProps> = ({ ...args }) => {
  return (
    <div style={wrapperStyles}>
      <HighScoringCardOverlay {...args} />
    </div>
  );
};

export const Default = {
  render: Template,
  parameters: {},

  args: {
    view: 'countdown',
    countDownDuration: 5000,
  },
};
