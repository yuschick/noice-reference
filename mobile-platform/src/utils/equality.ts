export const isNonEmptyString = (str?: string): str is string => {
  if (!str) {
    return false;
  }

  return str.trim() !== '';
};
