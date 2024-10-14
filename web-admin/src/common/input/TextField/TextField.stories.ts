import { TextField } from './TextField';

export default {
  component: TextField,
  argTypes: {},
};

export const Default = {
  args: {
    label: 'First name',
  },
};

export const WithDefaultValue = {
  args: {
    ...Default.args,
    defaultValue: 'Tahvo',
  },
};
