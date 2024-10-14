const MILLION_TRESHOLD = 1_000_000;
const THOUSAND_THRESHOLD = 1_000;
export const formatLargeNumber = (value: number) => {
  if (value >= MILLION_TRESHOLD) {
    return (value / MILLION_TRESHOLD).toFixed(1) + 'M';
  }

  if (value >= THOUSAND_THRESHOLD) {
    return (value / THOUSAND_THRESHOLD).toFixed(1) + 'K';
  }

  return value.toString();
};
