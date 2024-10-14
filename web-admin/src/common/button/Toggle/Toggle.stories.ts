import { Toggle } from './Toggle';

export default {
  component: Toggle,
  argTypes: {},
};

export const Default = {
  args: {
    label: 'Enable stuff',
    onText: 'Stuff is enabled',
    offText: 'Stuff is disabled',
  },
};
