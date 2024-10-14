import { Platform } from 'react-native';

export type BreakPoint = 'xs' | 's' | 'm' | 'lg' | 'xl' | 'xxl' | 'xxxl';

const iOSDeviceBreakpoints = new Map<BreakPoint, number>([
  ['xs', 320], // SE
  ['s', 375], // SE 3d gen
  ['m', 393], // Standard iPhone / pro
  ['lg', 430], // iPhone pro max,
  ['xl', 768], // iPad 6th gen,
  ['xxl', 834], // iPad pro,
  ['xxxl', 1024], // iPad pro 12.9"
]);

// @todo: might need some tweaking, also issue with varying dpi on android
// might be an issue here
const androidDeviceBreakpoints = new Map<BreakPoint, number>([
  ['xs', 320],
  ['s', 375],
  ['m', 393],
  ['lg', 430],
  ['xl', 768],
  ['xxl', 834],
  ['xxxl', 1024],
]);

const breakPointMap: Record<typeof Platform.OS, Map<BreakPoint, number>> = {
  ios: iOSDeviceBreakpoints,
  android: androidDeviceBreakpoints,

  // Not used so defaulting to iOS
  macos: iOSDeviceBreakpoints,
  web: iOSDeviceBreakpoints,
  windows: iOSDeviceBreakpoints,
} as const;

export const deviceBreakpoints = breakPointMap[Platform.OS];
