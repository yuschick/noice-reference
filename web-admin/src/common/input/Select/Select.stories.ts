import { Select } from './Select';

export default {
  component: Select,
  argTypes: {},
};

export const Default = {
  args: {
    label: 'Choose a pet',
    options: ['Dog', 'Cat', 'Hamster', 'Parrot', 'Spider', 'Goldfish'],
  },
};

export const WithDefaultValue = {
  args: {
    ...Default.args,
    defaultValue: 'Hamster',
  },
};
