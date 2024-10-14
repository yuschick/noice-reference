import { Nullable } from '@noice-com/utils';

export const isValidDate = (date: string) => {
  return !isNaN(Date.parse(date));
};

export const getTimeRelativeToServerTime = (
  time: Nullable<string>,
  serverTime: Nullable<string>,
): number => {
  if (!time || !serverTime) {
    return 0;
  }

  return parseInt(serverTime, 10) - parseInt(time, 10);
};
