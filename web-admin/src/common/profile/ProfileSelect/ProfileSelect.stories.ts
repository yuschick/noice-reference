/* eslint-disable @typescript-eslint/naming-convention */
import { StoryHelpers } from '@noice-com/common-ui';

import { ProfileSelect } from './ProfileSelect';

export default {
  component: ProfileSelect,
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
    query: 'paavo',
  },
};

export const WithSelected = {
  args: {
    ...Default.args,
    selected: StoryHelpers.getNewProfile(),
  },
};

export const WithError = {
  args: {
    ...Default.args,
    hasError: true,
  },
};
