export const getMinHours = (min?: number) => {
  if (!min || min < 0) {
    // We want only positive values
    return 0;
  }

  // Check how many hours are in the min value
  return Math.floor(min / 60 / 60);
};

export const getMinMinutes = (hours: number, min?: number) => {
  if (!min || min < 0) {
    // We want only positive values
    return 0;
  }

  // Check how many minutes are in the min value after subtracting the hours
  const lefOverMinutes = Math.floor((min - hours * 60 * 60) / 60);

  // If the leftover minutes are more than 59, minutes needs only be positive
  if (lefOverMinutes > 59) {
    return 0;
  }

  // We want only positive values
  return Math.max(lefOverMinutes, 0);
};

export const getMinSeconds = (hours: number, minutes: number, min?: number) => {
  if (!min || min < 0) {
    // We want only positive values
    return 0;
  }

  // Check how many seconds are in the min value after subtracting the hours and minutes
  const leftOverSeconds = Math.floor(min - hours * 60 * 60 - minutes * 60);

  // If the leftover seconds are more than 59, seconds needs only be positive
  if (leftOverSeconds > 59) {
    return 0;
  }

  // We want only positive values
  return Math.max(leftOverSeconds, 0);
};

export const getMaxHours = (videoDuration: number, max?: number) => {
  // Do not set max value if no max value or video duration is provided
  if ((!videoDuration || videoDuration < 0) && (!max || max < 0)) {
    return undefined;
  }

  // If max is set, use smaller of duration and max, otherwise use duration
  let maxValue = max && max > 0 ? Math.min(videoDuration, max) : videoDuration;

  // If video duration is not set, use max value
  if ((!videoDuration || videoDuration < 0) && max && max >= 0) {
    maxValue = max;
  }

  // Check how many hours are in the max value
  return Math.floor(maxValue / 60 / 60);
};

export const getMaxMinutes = (videoDuration: number, hours: number, max?: number) => {
  /// Set default max value if no max value or video duration is provided
  if ((!videoDuration || videoDuration < 0) && (!max || max < 0)) {
    return 59;
  }

  // If max is set, use smaller of duration and max, otherwise use duration
  let maxValue = max && max > 0 ? Math.min(videoDuration, max) : videoDuration;

  // If video duration is not set, use max value
  if ((!videoDuration || videoDuration < 0) && max && max >= 0) {
    maxValue = max;
  }

  return Math.min(
    Math.floor(
      // Check how many minutes are in the max value after subtracting the hours
      (maxValue - hours * 60 * 60) / 60,
    ),
    // Minutes can not be more than 59
    59,
  );
};

export const getMaxSeconds = (
  videoDuration: number,
  hours: number,
  minutes: number,
  max?: number,
) => {
  // Set default max value if no max value or video duration is provided
  if ((!videoDuration || videoDuration < 0) && (!max || max < 0)) {
    return 59;
  }

  // If max is set, use smaller of duration and max, otherwise use duration
  let maxValue = max && max > 0 ? Math.min(videoDuration, max) : videoDuration;

  // If video duration is not set, use max value
  if ((!videoDuration || videoDuration < 0) && max && max >= 0) {
    maxValue = max;
  }

  return Math.min(
    Math.ceil(
      // Check how many seconds are in the max value after subtracting the hours and minutes
      maxValue - hours * 60 * 60 - minutes * 60,
    ),
    // Seconds can not be more than 59
    59,
  );
};
