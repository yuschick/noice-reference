import { StoryObj, Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../Button';

import { FullScreenModal, Props } from './FullScreenModal';

import { disableArgs } from '@common-story-helpers';
import { WithChildren } from '@common-types';

const Content = ({ children }: WithChildren) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '150px',
      height: '150px',
      borderRadius: '8px',
      background: '#f8f8f8',
      boxShadow: '0px 4px 13px 4px rgba(0, 0, 0, 0.18)',
      marginBottom: '16px',
    }}
  >
    {children}
  </div>
);

export default {
  title: 'Modals/Full Screen Modal',
  component: FullScreenModal,
  argTypes: {
    includeHeader: {
      control: { type: 'boolean' },
    },
    hasTransparentBg: {
      control: { type: 'boolean' },
    },
  },
} as Meta<typeof FullScreenModal>;

const Template: StoryFn<Props> = (args) => {
  const [showDialog, setShowDialog] = useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  return (
    <div>
      <Button onClick={open}>Open dialog</Button>
      <FullScreenModal
        {...args}
        isOpen={showDialog}
        onDismiss={close}
      >
        <Content>{`Pretend I'm a card`}</Content>
        <div style={{ display: 'grid', placeContent: 'center' }}>
          <Button onClick={close}>Sounds Good</Button>
        </div>
      </FullScreenModal>
    </div>
  );
};

export const Default = {
  render: Template,

  args: {
    title: 'Something happened',
  },

  argTypes: disableArgs<Props>(['subtitle', 'headerContent', 'footerContent'], {}),
};

type ModifiedProps = Props & {
  exampleSubtitle?: string;
};

export const WithFooter: StoryObj<ModifiedProps> = {
  render: ({ ...args }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showDialog, setShowDialog] = useState(false);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    const subtitleContent = () => (
      <span style={{ color: '#fff' }}>{`Level 1 -> Level 2`}</span>
    );

    const footerContent = () => (
      <div style={{ display: 'grid', placeContent: 'center' }}>
        <Button onClick={close}>Sounds Good</Button>
      </div>
    );

    return (
      <div>
        <Button onClick={open}>Open dialog</Button>
        <FullScreenModal
          {...args}
          footerContent={footerContent}
          isOpen={showDialog}
          subtitle={subtitleContent}
          onDismiss={close}
        >
          <Content>{`Pretend I'm a card`}</Content>
        </FullScreenModal>
      </div>
    );
  },

  args: {
    title: 'Card Upgraded',
    includeHeader: false,
  },

  argTypes: disableArgs<Props>(['subtitle', 'headerContent', 'footerContent'], {}),
};
