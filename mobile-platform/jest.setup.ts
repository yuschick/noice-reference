/* eslint-disable @typescript-eslint/naming-convention */
import { global } from '@apollo/client/utilities/globals';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'));

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('@react-native-firebase/analytics', () => jest.fn());

jest.mock('react-native-orientation-locker', () => ({
  lockToLandscapeRight: jest.fn(),
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn(),
}));

jest.mock('@livekit/react-native-webrtc', () => ({
  RTCPeerConnection: jest.fn(),
  RTCSessionDescription: jest.fn(),
  RTCIceCandidate: jest.fn(),
  RTCView: jest.fn(),
  MediaStream: jest.fn(),
  mediaDevices: {
    getUserMedia: jest.fn(),
  },
}));

jest.mock('react-native-sha256', () => ({
  sha256: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  setContext: jest.fn(),
  captureException: jest.fn(),
  ReactNavigationInstrumentation: jest.fn().mockImplementation(() => ({
    registerNavigationContainer: jest.fn(),
  })),
  wrap: (component: JSX.Element) => component,
  ReactNativeTracing: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@usercentrics/react-native-sdk', () => ({
  Usercentrics: {
    configure: jest.fn(),
  },
  UsercentricsOptions: jest.fn(),
}));

jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(),
  useAnimatedStyle: jest.fn(),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
  Easing: {
    linear: jest.fn(),
  },
  createAnimatedComponent: jest.fn(),
  Keyframe: function () {
    return {
      duration: jest.fn().mockReturnThis(),
      reduceMotion: jest.fn().mockReturnThis(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  },
  ReduceMotion: {
    System: 'system',
  },
}));

jest.mock('@shopify/react-native-skia', () => ({
  Surface: jest.fn(),
  Canvas: jest.fn(),
}));

jest.mock('singular-react-native', () => {
  class SingularConfig {
    constructor() {}
  }

  return {
    SingularConfig,
    Singular: jest.fn(),
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-haptic-feedback', () => 'HapticFeedback');
jest.mock('@webview-bridge/react-native', () => 'WebViewBridge');
jest.mock('ironsource-mediation', () => 'IronSourceMediation');
jest.mock('@invertase/react-native-apple-authentication', () => 'AppleAuthentication');
jest.mock('react-native-app-auth', () => 'AppAuth');
jest.mock('@react-native-clipboard/clipboard', () => 'Clipboard');
jest.mock('react-native-webview', () => 'WebView');
jest.mock('@livekit/react-native-webrtc', () => ({
  registerGlobals: jest.fn(),
}));

jest.mock('@chargebee/react-native-chargebee', () => ({
  configure: jest.fn(),
}));
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.NativeModules.RNRefiner = {
    addToResponse: jest.fn(),
    identifyUser: jest.fn(),
    initialize: jest.fn(),
    resetUser: jest.fn(),
    setProject: jest.fn(),
    trackEvent: jest.fn(),
  };

  return RN;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (global as any).crypto.randomUUID !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).crypto.randomUUID = jest.fn;
}

global.fetch = require('cross-fetch');
