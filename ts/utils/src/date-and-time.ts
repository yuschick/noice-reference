export const ShortDates = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export const getShortDate = (
  timestamp: number | string,
  options?: {
    showInUTC?: boolean;
  },
) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: options?.showInUTC ? 'UTC' : undefined,
  });

  return formatter.format(new Date(timestamp));
};

export const getTime = (
  timestamp: number | string,
  options?: {
    showSeconds?: boolean;
    showInUTC?: boolean;
  },
) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    second: options?.showSeconds ? 'numeric' : undefined,
    timeZone: options?.showInUTC ? 'UTC' : undefined,
  });

  return formatter.format(new Date(timestamp));
};

export function getDays(timestamp: number, useRound?: boolean): number {
  const days = timestamp / (1000 * 60 * 60 * 24);

  return useRound ? Math.round(days) : Math.floor(days);
}

export function getHours(timestamp: number, useRound?: boolean): number {
  const hours = (timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);

  return useRound ? Math.round(hours) : Math.floor(hours);
}

export function getMinutes(timestamp: number, useRound?: boolean): number {
  const minutes = (timestamp % (1000 * 60 * 60)) / (1000 * 60);

  return useRound ? Math.round(minutes) : Math.floor(minutes);
}

export function getSeconds(timestamp: number): number {
  return Math.floor((timestamp % (1000 * 60)) / 1000);
}

/**
 * Formats timestamp to string
 * 1s
 * 57s
 * 2m
 * 57m
 * 1h
 * 1d
 * 17d
 */
export function getRelativeTime(timestamp: number): string {
  const relativeTimestamp = Date.now() - timestamp;

  const days = getDays(relativeTimestamp, true);

  if (days) {
    return `${days}d`;
  }

  const hours = getHours(relativeTimestamp, true);

  if (hours) {
    return `${hours}h`;
  }

  const minutes = getMinutes(relativeTimestamp, true);

  if (minutes) {
    return `${minutes}m`;
  }

  return `${getSeconds(relativeTimestamp)}s`;
}

type Options = {
  days?: boolean;
  hours?: boolean;
  minutes?: boolean;
  seconds?: boolean;
  fallbackToMoreGranularTime?: boolean;
};
export function getFullRelativeTime(timestamp: string, options?: Options): string {
  const relativeTimestamp = new Date(timestamp).getTime() - Date.now();
  let time = '';

  const days = getDays(relativeTimestamp, false);
  const hours = getHours(relativeTimestamp, false);
  const minutes = getMinutes(relativeTimestamp, false);
  const seconds = getSeconds(relativeTimestamp);

  const showDays = days && options?.days;
  const showHours =
    hours && (options?.hours || (options?.fallbackToMoreGranularTime && !days));
  const showMinutes =
    minutes &&
    (options?.minutes || (options?.fallbackToMoreGranularTime && !days && !hours));
  const showSeconds =
    seconds &&
    (options?.seconds ||
      (options?.fallbackToMoreGranularTime && !days && !hours && !minutes));

  if (showDays) {
    if (days === 1) {
      time = `${days} day `;
    } else {
      time = `${days} days `;
    }
  }

  if (showHours) {
    if (hours === 1) {
      time += `${hours} hour `;
    } else {
      time += `${hours} hours `;
    }
  }

  if (showMinutes) {
    if (minutes === 1) {
      time += `${minutes} minute `;
    } else {
      time += `${minutes} minutes `;
    }
  }

  if (showSeconds) {
    if (seconds === 1) {
      time += `${seconds} second `;
    } else {
      time += `${seconds} seconds `;
    }
  }

  return time.trim();
}

/**
 * Parses protobuf string format duration into milliseconds
 */
export function parseDuration(durStr: string): number {
  const unit = (function () {
    const u = durStr.slice(-1);

    if (u === 's') {
      return 1;
    }

    if (u === 'm') {
      return 60;
    }

    if (u === 'h') {
      return 60 * 60;
    }

    if (u === 'd') {
      return 60 * 60 * 24;
    }

    throw new Error('invalid duration unit : must be one of s, m, h, or d');
  })();
  const value = parseFloat(durStr.slice(0, -1));
  const seconds = value * unit;

  return seconds * 1000;
}

export const getHTMLAttributeTime = (
  timestamp: number | string,
  options?: {
    showInUTC?: boolean;
  },
) => {
  const date = new Date(timestamp);

  const year = options?.showInUTC ? date.getUTCFullYear() : date.getFullYear();
  const month = options?.showInUTC ? date.getUTCMonth() : date.getMonth();
  const day = options?.showInUTC ? date.getUTCDate() : date.getDate();
  const hours = options?.showInUTC ? date.getUTCHours() : date.getHours();
  const minutes = options?.showInUTC ? date.getUTCMinutes() : date.getMinutes();

  return `${year}-${`0${month + 1}`.slice(-2)}-${`0${day}`.slice(-2)}T${`0${hours}`.slice(
    -2,
  )}:${`0${minutes}`.slice(-2)}`;
};

export const getHTMLAttributeTimeRelative = (timestamp: number | string) => {
  const relativeTimestamp = new Date(timestamp).getTime() - Date.now();
  let time = '';

  const days = getDays(relativeTimestamp, true);

  if (days) {
    time = `${days}D`;
  }

  const hours = getHours(relativeTimestamp, true);

  if (hours) {
    time += `${hours}H`;
  }

  const minutes = getMinutes(relativeTimestamp, true);

  if (minutes) {
    time += `${minutes}M`;
  }

  const seconds = getSeconds(relativeTimestamp);

  if (seconds) {
    time += `${seconds}S`;
  }

  return time;
};

interface GetDateTimeDifferenceProps {
  end: string;
  start: string;
}

export const getDateTimeDifference = ({ end, start }: GetDateTimeDifferenceProps) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const difference = endDate.getTime() - startDate.getTime();

  const days = Math.floor(difference / (24 * 60 * 60 * 1000));
  const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((difference % (60 * 1000)) / 1000);

  return [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours}h` : '',
    minutes > 0 ? `${minutes}m` : '',
    seconds > 0 ? `${seconds}s` : '',
  ]
    .join(' ')
    .trim();
};

export const getTimeDifferenceInSeconds = ({
  end,
  start,
}: GetDateTimeDifferenceProps) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const difference = endDate.getTime() - startDate.getTime();

  return difference / 1000;
};
