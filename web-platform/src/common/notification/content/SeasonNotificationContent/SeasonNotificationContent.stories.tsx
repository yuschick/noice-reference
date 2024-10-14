import { StoryHelpers } from '@noice-com/common-ui';
import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import { NotificationListItem } from '../../NotificationListItem';

import { SeasonNotificationContent } from './SeasonNotificationContent';

const seasonNotificationSeason = {
  id: 'season-id',
  name: 'Test Season 1',
  game: {
    id: 'game-id',
    name: 'Fortnite',
  },
  progression: {
    level: 3,
  },
};

const meta: Meta<typeof SeasonNotificationContent> = {
  title: 'Notifications/SeasonNotificationContent',
  component: SeasonNotificationContent,
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

export default meta;

export const Light = {
  args: {
    season: seasonNotificationSeason,
  },
};

export const Dark = {
  args: {
    ...Light.args,
    theme: 'dark',
  },
};
