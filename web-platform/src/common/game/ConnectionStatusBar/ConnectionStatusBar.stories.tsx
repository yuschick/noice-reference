import { StoryHelpers } from '@noice-com/common-ui';
import { StoryObj, StoryFn } from '@storybook/react';
import { CSSProperties } from 'react';

import {
  StatusBar,
  Props as StatusBarProps,
  ReconnectingMessage,
  DisconnectedMessage,
} from './ConnectionStatusBar';

export default {
  title: 'Connection Status Bar',
  component: StatusBar,
  argTypes: {
    children: StoryHelpers.disableArg(),
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const wrapperStyles: CSSProperties = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
};

const Template: StoryFn<StatusBarProps> = ({ ...args }) => {
  return (
    <div style={wrapperStyles}>
      <StatusBar {...args} />
    </div>
  );
};

export const ConnectionStatusBar = {
  render: Template,

  args: {
    show: true,
    children: <span style={{ color: 'var(--noi-color-text-dark)' }}>Connected!</span>,
  },
};

interface ErrorProps {
  code: number;
  message: string;
}

const errorPropTypes = {
  hide: StoryHelpers.disableArg(),
  hasError: StoryHelpers.disableArg(),
  code: {
    control: { type: 'number' },
  },
  message: {
    control: { type: 'text' },
  },
};

export const ReconnectingBar: StoryObj<ErrorProps> = {
  render: ({ ...args }) => (
    <div style={wrapperStyles}>
      <StatusBar show>
        <ReconnectingMessage {...args} />
      </StatusBar>
    </div>
  ),

  argTypes: { ...errorPropTypes },

  args: {
    code: 1,
    message: 'SERVER ERROR',
  },
};

export const DisconnectedBar: StoryObj<ErrorProps> = {
  render: ({ ...args }) => (
    <div style={wrapperStyles}>
      <StatusBar show>
        <DisconnectedMessage {...args} />
      </StatusBar>
    </div>
  ),

  argTypes: { ...errorPropTypes },

  args: {
    code: 1,
    message: 'Connection interrupted',
  },
};
