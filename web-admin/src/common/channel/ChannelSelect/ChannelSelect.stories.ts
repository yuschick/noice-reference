/* eslint-disable @typescript-eslint/naming-convention */
import { StoryHelpers } from '@noice-com/common-ui';

import { ChannelSelect } from './ChannelSelect';

import { ChannelSelectChannelFragment } from '@gen';

export default {
  component: ChannelSelect,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    results: [
      {
        entity: {
          __typename: 'ChannelChannel',
          ...(StoryHelpers.getNewChannel() as ChannelSelectChannelFragment),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userTag'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...(StoryHelpers.getNewChannel() as ChannelSelectChannelFragment),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['email'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...(StoryHelpers.getNewChannel() as ChannelSelectChannelFragment),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userTag'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...(StoryHelpers.getNewChannel() as ChannelSelectChannelFragment),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userId'],
      },
    ],
    query: 'odjk',
  },
};

export const WithSelected = {
  args: {
    ...Default.args,
    selected: {
      ...(StoryHelpers.getNewChannel() as ChannelSelectChannelFragment),
      streamer: StoryHelpers.getNewProfile(),
    },
  },
};

export const WithError = {
  args: {
    ...Default.args,
    hasError: true,
  },
};
