import { StoryHelpers } from '@noice-com/common-ui';

import { Checkbox } from './Checkbox';
export default {
  component: Checkbox,
  argTypes: {
    register: StoryHelpers.disableArg(),
    className: StoryHelpers.disableArg(),
  },
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    label: 'Label',
    register: () => ({} as any),
  },
};
