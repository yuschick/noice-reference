import { useMountEffect } from '@noice-com/common-react-core';
import { usePopoverMenu } from '@noice-com/common-ui';
import { StoryObj, StoryFn, Meta } from '@storybook/react';

import { TeamDialogMenu, Props } from './TeamDialogMenu';

export default {
  title: 'Card Row Team Info/Team Dialog Menu',
  component: TeamDialogMenu,
} as Meta<typeof TeamDialogMenu>;

const Template: StoryFn<Props> = (args) => {
  const popover = usePopoverMenu({ placement: 'top' });

  useMountEffect(() => {
    popover.actions.toggle();
  });

  return (
    <div style={{ position: 'relative' }}>
      <TeamDialogMenu
        {...args}
        popover={popover}
      />
    </div>
  );
};

export const Default: StoryObj<Props> = {
  render: Template,

  args: {
    groupName: 'Zebras With Mohawks',
  },

  argTypes: {
    groupName: {
      name: 'Group Name',
      control: { type: 'text' },
    },
    onPlaySoloClicked: {
      name: 'Play Solo Clicked Handler',
    },
    onChangeTeamClicked: {
      name: 'Change Team Clicked Handler',
    },
    onOpenBestPlaysClicked: {
      name: 'Open Best Plays Handler',
    },
  },
};
