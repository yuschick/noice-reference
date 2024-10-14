import { Textarea } from './Textarea';

export default {
  component: Textarea,
  argTypes: {},
};

export const Default = {
  args: {
    label: 'Write your story',
  },
};

export const WithDefaultValue = {
  args: {
    ...Default.args,
    defaultValue: 'Duis excepteur et est non aliquip ex ex nulla.',
  },
};
