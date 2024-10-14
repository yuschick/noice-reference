import { useMountEffect } from '@noice-com/common-react-core';
import { usePopoverMenu } from '@noice-com/common-ui';
import { StoryObj, StoryFn } from '@storybook/react';

import { SoloDialogMenu, Props } from './SoloDialogMenu';

export default {
  title: 'Card Row Team Info/Solo Dialog Menu',
  component: SoloDialogMenu,
};

const Template: StoryFn<Props> = (args) => {
  const popover = usePopoverMenu({ placement: 'top' });

  useMountEffect(() => {
    popover.actions.toggle();
  });

  return (
    <div style={{ position: 'relative' }}>
      <SoloDialogMenu
        {...args}
        popover={popover}
      />
    </div>
  );
};

export const Default: StoryObj<Props> = {
  render: Template,

  args: {},

  argTypes: {
    onJoinTeamClicked: {
      name: 'Change Team Clicked Handler',
    },
    onOpenBestPlaysClicked: {
      name: 'Open Best Plays Handler',
    },
  },
};
