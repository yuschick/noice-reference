import { Table } from './Table';

export default {
  component: Table,
  argTypes: {},
};

export const Default = {
  args: {
    caption: 'The example table',
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      { firstName: 'Jane', lastName: 'Doe' },
    ],
  },
};

export const EmptyTable = {
  args: {
    ...Default.args,
    data: [],
  },
};
