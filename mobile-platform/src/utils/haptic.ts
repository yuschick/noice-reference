import { trigger } from 'react-native-haptic-feedback';

/**
 * Haptic types that are available for both IOS and Android.
 * you can also use trigger() directly from react-native-haptic-feedback.
 * Read more here: https://github.com/mkuczera/react-native-haptic-feedback
 */
export const Haptic = {
  impactLight: () => trigger('impactLight'),
  impactMedium: () => trigger('impactMedium'),
  impactHeavy: () => trigger('impactHeavy'),
  rigid: () => trigger('rigid'),
  soft: () => trigger('soft'),
  notificationSuccess: () => trigger('notificationSuccess'),
  notificationWarning: () => trigger('notificationWarning'),
  notificationError: () => trigger('notificationError'),
} as const;
