import { StoryHelpers } from '@noice-com/common-ui';
import { StoryFn } from '@storybook/react';

import { NotificationPanel, Props } from './NotificationPanel';

export default {
  title: 'NavigationSidebar/NotificationPanel',
  component: NotificationPanel,
  argTypes: {
    showPanel: StoryHelpers.disableArg(),
    buttonRef: StoryHelpers.disableArg(),
    onOutsideClick: StoryHelpers.disableArg(),
  },
};

const Template: StoryFn<Props> = (args) => (
  <div style={{ position: 'relative' }}>
    <NotificationPanel {...args} />
  </div>
);

export const Default = {
  render: Template,

  args: {
    showPanel: true,
    announcements: [
      StoryHelpers.getNewAnnouncement(),
      StoryHelpers.getNewAnnouncement(),
      StoryHelpers.getNewAnnouncement(),
      StoryHelpers.getNewAnnouncement(),
      StoryHelpers.getNewAnnouncement(),
    ],
  },
};

export const Empty = {
  render: Template,

  args: {
    ...Default.args,
    announcements: [],
  },
};
