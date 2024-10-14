import toast from 'react-hot-toast';

export const showToastOnMiniProfileModerationAction = (
  message: string,
  username: string,
  status: 'success' | 'error',
) => {
  const messageWithUsername = message.replace('USERNAME', username);
  if (status === 'error') {
    toast.error(messageWithUsername);
    return;
  }
  toast.success(messageWithUsername);
};
