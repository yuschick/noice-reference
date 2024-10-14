import { ModeratorFeedbackMessage } from './ModeratorFeedbackMessage';

export default {
  title: 'ModeratorFeedbackMessage',
  component: ModeratorFeedbackMessage,
};

export const MuteSuccess = {
  args: {
    message: 'USERNAME is muted for 2 minutes',
    username: 'tahvo',
  },
};

export const MuteFailed = {
  args: {
    message: 'Muting USERNAME failed',
    username: 'tahvo',
  },
};
