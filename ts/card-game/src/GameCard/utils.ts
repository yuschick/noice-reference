export const getLevelGroup = (level: number): number =>
  // level 0-1: group zero
  // level 2-9: group one
  // level 10-19: group two
  // ...
  // 50(+): group six
  level >= 50 ? 6 : level <= 1 ? 0 : Math.floor(level / 10) + 1;

export const getLevelGroupClassName = (level: number): string =>
  `levelGroup${getLevelGroup(level)}`;
