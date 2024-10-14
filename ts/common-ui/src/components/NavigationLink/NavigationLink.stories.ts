import { FaRegSmileBeam } from 'react-icons/fa';

import { NavigationLink } from './NavigationLink';

export default {
  title: 'NavigationLink',
  component: NavigationLink,
  argTypes: {},
};

export const Default = {
  args: {
    to: '#',
    label: 'Navigation link',
  },
};

export const WithIcon = {
  args: {
    ...Default.args,
    icon: FaRegSmileBeam,
  },
};

export const Highlighted = {
  args: {
    ...WithIcon.args,
    highlight: true,
  },
};
