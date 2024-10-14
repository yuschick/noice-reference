import { InvitationCode } from './InvitationCode';

export default {
  title: 'InvitationCode',
  component: InvitationCode,
  argTypes: {
    code: {
      control: {
        type: 'text',
      },
      required: true,
    },
  },
};

export const Default = {
  args: {
    code: 'i1mp5ar6778ia8',
  },
};
