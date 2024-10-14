export const getMuteDurationTimestamp = (duration: string) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + parseInt(duration, 10));
  return time;
};
