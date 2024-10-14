import { StoryHelpers } from '@noice-com/common-ui';

import { DatePicker } from './DatePicker';

export default {
  component: DatePicker,
  argTypes: {
    register: StoryHelpers.disableArg(),
    className: StoryHelpers.disableArg(),
  },
};

export const Default = {
  args: { label: 'Your birthday', register: () => ({} as any) },
};
