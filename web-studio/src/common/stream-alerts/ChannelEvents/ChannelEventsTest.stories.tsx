import { Button } from '@noice-com/common-ui';
import type { Meta } from '@storybook/react';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { ChannelEvents } from './ChannelEvents';

import { AlertsList } from '@common/alerts';

const baseAlert = {
  duration: 4940,
  id: 'test-alert-1',
  maxAmount: 100,
  keepLast: false,
  priority: 1,
  header: {
    text: 'TestText',
    subtext: 'TestSubText',
  },
};

const baseAlertData = {
  timestamp: new Date().getTime().toString(),
  id: 'test-alert-1',
};

const baseUserData = {
  userId: 'test-user-id-1',
  userTag: 'Teppo Testaaja',
  avatars: {
    avatar2D: 'https://metalshockfinland.files.wordpress.com/2022/07/angus-mcsix.jpg',
    avatarFullbody:
      'https://media-cdn.gcp.stg.noice.com/avatar/image_body_img/c5cec837-1e2a-5b5d-af8c-55f6d85e85f6/b035c77d-b61f-4440-9731-6be3be2c56c6.png',
  },
};

const baseContent = {
  userId: 'test-user-id-1',
  user: baseUserData,
};

const possibleEvents: AlertsList = [
  {
    ...baseAlert,
    id: 'OVERRIDE',
    data: {
      ...baseAlertData,
      id: 'OVERRIDE',
      __typename: 'StreamerChannelActivityEvent',
      content: {
        ...baseContent,
        __typename: 'StreamerChannelSubscribed',
      },
    },
  },
  {
    ...baseAlert,
    id: 'OVERRIDE',
    data: {
      ...baseAlertData,
      id: 'OVERRIDE',
      __typename: 'StreamerChannelActivityEvent',
      content: {
        __typename: 'StreamerSubscriptionGifted',
        recipientUserIds: [
          'receiver-1',
          'receiver-2',
          'receiver-3',
          'receiver-4',
          'receiver-5',
        ],
        tier: 1,
        ...baseContent,
      },
    },
  },
];

const meta: Meta<typeof ChannelEvents> = {
  title: 'Stream Alerts/ChannelEvents/Test',
  component: ChannelEvents,
  decorators: [
    (Story, { args }) => {
      const [alerts, setAlerts] = useState<AlertsList>([]);

      const addAlert = useCallback(() => {
        setAlerts((prev) => {
          const indexToAdd = prev.length % possibleEvents.length;

          const baseData = possibleEvents[indexToAdd];
          const id = uuid();
          const newAlerts = [
            ...prev,
            { ...baseData, id, data: { ...baseData.data, id } },
          ];

          return newAlerts;
        });
      }, []);

      const completeAlert = useCallback((id: string) => {
        setAlerts((prev) => {
          const newAlerts = prev.filter((alert) => alert.id !== id);

          return newAlerts;
        });
      }, []);

      return (
        <div>
          <Button
            fit="content"
            size="xs"
            onClick={addAlert}
          >
            Add
          </Button>
          <Story args={{ ...args, alerts, onAlertCompleted: completeAlert }} />
        </div>
      );
    },
  ],
};

export default meta;

export const Test = {};
