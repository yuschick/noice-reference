import { DateAndTimeUtils } from '@noice-com/utils';
import { DateTime, Duration } from 'luxon';
type DateFormat = Date | number | string;
export const getTimeSinceLabel = (dateFrom: DateFormat, dateTo: DateFormat) => {
  const startDateTime = DateTime.fromJSDate(new Date(dateFrom));
  const endDateTime = DateTime.fromJSDate(new Date(dateTo));

  const diff = endDateTime.diff(startDateTime, ['days', 'hours', 'minutes']);

  if (diff.days >= 1) {
    return `${Math.round(diff.days)} day${diff.days > 1 ? 's' : ''}`;
  } else if (diff.hours >= 1) {
    return `${Math.round(diff.hours)} hour${diff.hours > 1 ? 's' : ''}`;
  } else if (diff.minutes >= 1) {
    return `${Math.round(diff.minutes)} minute${diff.minutes > 1 ? 's' : ''}`;
  }

  return null;
};

export const convertDurationToHours = (duration: string | null | undefined) => {
  if (!duration) {
    return null;
  }

  const durationInMs = DateAndTimeUtils.parseDuration(duration);

  return Duration.fromMillis(durationInMs).toFormat('h');
};
