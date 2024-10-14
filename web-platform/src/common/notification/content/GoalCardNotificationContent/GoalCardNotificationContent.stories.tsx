import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { GoalCardNotificationContent } from './GoalCardNotificationContent';

const meta: Meta<typeof GoalCardNotificationContent> = {
  title: 'Notifications/GoalCardNotificationContent',
  component: GoalCardNotificationContent,
  decorators: [
    (Story, { args }) => (
      <div style={{ inlineSize: '400px' }}>
        <NotificationListItem
          theme={args.theme}
          onCloseClick={action('close')}
        >
          <Story />
        </NotificationListItem>
      </div>
    ),
  ],
  argTypes: {
    notificationId: StoryHelpers.disableArg(),
    description: StoryHelpers.disableArg(),
    subtext: StoryHelpers.disableArg(),
    icon: StoryHelpers.disableArg(),
  },
};

const goalCardNotificationInProgressSlotData = {
  id: '1',
  progress: {
    percentage: 0.5,
    value: 1,
    completed: false,
  },
  goalCard: {
    id: '1',
    target: 2,
    description: 'Score points from a Hype Booster 2 times',
  },
};

const goalCardNotificationCompletedSlotData = {
  ...goalCardNotificationInProgressSlotData,
  progress: {
    percentage: 1,
    value: 2,
    completed: true,
  },
};

export default meta;
type Story = StoryObj<typeof GoalCardNotificationContent>;

export const LightInProgress: Story = {
  args: {
    slot: goalCardNotificationInProgressSlotData,
  },
};

export const DarkInProgress: Story = {
  args: {
    ...LightInProgress.args,
    theme: 'dark',
  },
};

export const LightCompleted: Story = {
  args: {
    slot: goalCardNotificationCompletedSlotData,
  },
};

export const DarkCompleted: Story = {
  args: {
    ...LightCompleted.args,
    theme: 'dark',
  },
};
