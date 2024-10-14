import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';

import { Modal, ModalProps } from './Modal';

import { disableArg } from '@common-story-helpers';
import { WithChildren } from '@common-types';

export default {
  title: 'Modals/Modal',
  component: Modal,
  parameters: {
    backgrounds: { default: 'dark' },
  },
} as Meta<typeof Modal>;

const Template: StoryFn<ModalProps> = (args) => {
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <div>
      <Button
        theme="dark"
        onClick={open}
      >
        Open dialog
      </Button>
      <Modal
        {...args}
        isOpen={showDialog}
        onDismiss={close}
      />
    </div>
  );
};

const ExampleText = ({ children }: WithChildren) => (
  <div
    style={{
      textAlign: 'center',
      color: '#fff',
      fontSize: '1.15rem',
    }}
  >
    {children}
  </div>
);

export const Base = {
  render: Template,

  args: {
    includeHeader: false,
    children: (
      <ExampleText>
        This is a very basic empty base modal. You can hit escape to close it.
      </ExampleText>
    ),
  },

  argTypes: {
    children: disableArg(),
    hasTransparentBg: {
      control: { type: 'boolean' },
    },
  },
};

const panelHeader = () => <header>I am header</header>;

export const WithHeader = {
  render: Template,

  args: {
    includeHeader: true,
    headerContent: panelHeader,
    children: (
      <ExampleText>
        This is a very basic empty base modal. You can hit escape to close it.
      </ExampleText>
    ),
  },

  argTypes: {
    children: disableArg(),
    includeHeader: disableArg(),
    hasTransparentBg: {
      control: { type: 'boolean' },
    },
  },
};
