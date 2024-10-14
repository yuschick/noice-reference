import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';

import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    icon: StoryHelpers.disableArg(),
    className: StoryHelpers.disableArg(),
  },
};

export const Default = {
  args: {
    text: 'Click me',
  },
};

export const WithIcon = {
  args: {
    ...Default.args,
    icon: CoreAssets.Icons.Cards,
  },
};

export const Disabled = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const OnlyIcon = {
  args: {
    ...Default.args,
    icon: CoreAssets.Icons.Cards,
    hideText: true,
  },
};
