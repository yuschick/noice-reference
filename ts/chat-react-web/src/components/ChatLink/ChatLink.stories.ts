import { ChatLink } from './ChatLink';

export default {
  title: 'ChatLink',
  component: ChatLink,
};

export const Default = {
  args: {
    url: window.location.href,
    fontSize: 'small',
  },
};

export const External = {
  args: {
    url: 'https://www.google.com',
    fontSize: 'small',
  },
};
