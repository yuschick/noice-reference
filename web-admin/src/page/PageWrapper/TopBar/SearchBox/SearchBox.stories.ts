/* eslint-disable @typescript-eslint/naming-convention */
import { StoryHelpers } from '@noice-com/common-ui';

import { SearchBox } from './SearchBox';

import { SearchBoxChannelLinkChannelFragment } from '@gen';

export default {
  title: 'Search/SearchBox',
  component: SearchBox,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    userResults: [
      {
        entity: {
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userTag'],
      },
      {
        entity: {
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['email'],
      },
      {
        entity: {
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userTag'],
      },
      {
        entity: {
          __typename: 'ProfileProfile',
          ...StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userId'],
      },
    ],
    channelResults: [
      {
        entity: {
          __typename: 'ChannelChannel',
          ...StoryHelpers.getNewChannel<
            Omit<SearchBoxChannelLinkChannelFragment, 'streamer'>
          >(),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['name'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...StoryHelpers.getNewChannel<
            Omit<SearchBoxChannelLinkChannelFragment, 'streamer'>
          >(),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['title'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...StoryHelpers.getNewChannel<
            Omit<SearchBoxChannelLinkChannelFragment, 'streamer'>
          >(),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['email'],
      },
      {
        entity: {
          __typename: 'ChannelChannel',
          ...StoryHelpers.getNewChannel<
            Omit<SearchBoxChannelLinkChannelFragment, 'streamer'>
          >(),
          streamer: StoryHelpers.getNewProfile(),
        },
        matchedProperties: ['userTag'],
      },
    ],
  },
};

export const NoResult = {
  args: {
    userResults: [],
    channelResults: [],
  },
};
