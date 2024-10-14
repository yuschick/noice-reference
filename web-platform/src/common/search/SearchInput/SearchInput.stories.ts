import { StoryHelpers } from '@noice-com/common-ui';

import { SearchInput } from './SearchInput';

import { SearchInputChannelLinkChannelFragment } from '@gen';

export default {
  title: 'SearchInput',
  component: SearchInput,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    searchResults: {
      channel: [
        {
          result:
            StoryHelpers.getNewChannel<
              Omit<SearchInputChannelLinkChannelFragment, 'streamer'>
            >(),
        },
        {
          result:
            StoryHelpers.getNewChannel<
              Omit<SearchInputChannelLinkChannelFragment, 'streamer'>
            >(),
        },
        {
          result:
            StoryHelpers.getNewChannel<
              Omit<SearchInputChannelLinkChannelFragment, 'streamer'>
            >(),
        },
      ],
    },
    onValueChange: () => {},
    getSearchPageLink: () => {},
  },
};

export const NoResult = {
  args: {
    searchResults: [],
    onValueChange: () => {},
    getSearchPageLink: () => {},
  },
};
