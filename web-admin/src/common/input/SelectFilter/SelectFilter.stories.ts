import { SelectFilter } from './SelectFilter';

export default {
  component: SelectFilter,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    label: 'Best Fruits',
    options: [
      {
        value: 'apple',
        label: 'Apple',
      },
      {
        value: 'banana',
        label: 'Banana',
      },
      {
        value: 'blueberry',
        label: 'Blueberry',
      },
      {
        value: 'boysenberry',
        label: 'Boysenberry',
      },
      {
        value: 'cherry',
        label: 'Cherry',
      },
      {
        value: 'cranberry',
        label: 'Cranberry',
      },
      {
        value: 'durian',
        label: 'Durian',
      },
      {
        value: 'eggplant',
        label: 'Eggplant',
      },
      {
        value: 'fig',
        label: 'Fig',
      },
      {
        value: 'grape',
        label: 'Grape',
      },
      {
        value: 'guava',
        label: 'Guava',
      },
      {
        value: 'huckleberry',
        label: 'Huckleberry',
      },
    ],
  },
};
