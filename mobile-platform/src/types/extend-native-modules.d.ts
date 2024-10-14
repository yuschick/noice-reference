import { NativeModule } from 'react-native';

export interface RefinerSDKInterface extends NativeModule {
  addToResponse: (response: Record<string, unknown> | null) => void;
  identifyUser: (
    userId: string,
    userTraits: Record<string, unknown>,
    locale: string | null,
    identityVerification: string | null,
  ) => Promise<void>;
  initialize: (projectId: string, debugMode: boolean) => void;
  resetUser: () => void;
  setProject: (projectId: string | null) => void;
  trackEvent: (eventName: string) => void;
}

// Extend native module types
declare module 'react-native' {
  interface NativeModulesStatic {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RNRefiner: RefinerSDKInterface;
  }
}
