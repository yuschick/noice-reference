/* eslint-disable @typescript-eslint/naming-convention */

type ZendeskWidgetAPI = import('@noice-com/common-ui').ZendeskWidgetAPI;

type DependenciesNoiceEnv = import('@noice-com/common-ui').CommonNoiceEnv &
  import('@noice-com/card-game').GameNoiceEnv;

interface WindowEventMap {
  UC_SDK_EVENT: CustomEvent<{ action: string }>;
}

interface NoiceEnv extends DependenciesNoiceEnv {
  showDebug: () => void;
  printDebugValues: () => void;

  onDebugViewStart: (
    addDebugListener: (listener: import('logging').DebugListener) => () => void,
  ) => void;

  triggerNotification: (
    message: import('@noice-com/gen-types/schemas/notification/notification.pb').Notification,
  ) => void;

  updateReadFlag: (
    flag: keyof import('./context/UnreadFlagsProvider').Flags,
    read: boolean,
  ) => void;

  // Build info comes from Docker/Noice Workspace.
  BUILD_TIME: number;
  BUILD_HASH: string;

  // Set from either .env or Docker.
  IS_LOCAL: boolean;
  VERBOSE_LOGGING: boolean;
  SERVICES_LIB_HOST: string;
  SERVICES_LIB_WEBSOCKET: string;
  AUTH_BASE_URL: string;
  CDN_URL: string;
  STUDIO_URL: string;
  APPLE_REDIRECT_URI: string;
  ADYEN_CLIENT_KEY: string;
  ADYEN_ENVIRONMENT: string;
  ADMIN_URL: string;
  PORT: number;
  HASH_ROUTING: boolean;
  HCAPTCHA_SITE_KEY: string;
  DISCORD_CLIENT_ID: string;
  LIST_ONLY_LIVE_CHANNELS: boolean;
  UI_CONTEXT?: object;
  USE_APOLLO_DEV_TOOLS?: boolean;
  CHARGEBEE_SITE: string;
  SENTRY_ENVIRONMENT: string;
  REFINER_PROJECT_ID: string;
  // Firebase config
  FIREBASE_ENABLED: boolean;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_VAPID_KEY: string;
  //
  SHOW_ZENDESK_WIDGET: boolean;
  Graphics: typeof import('@noice-com/web-renderer').Graphics;
  __DEBUG_MATCHGROUP?: import('@noice-com/platform-client').IMatchGroup;
  __Client?: import('@noice-com/platform-client').Client;
  __NotificationDelegate?: import('@noice-com/platform-client').INotificationContentContentDelegate;
  __SoundKeys__?: typeof import('@common/sound').AppSoundKeys;
  __SoundController?: import('@noice-com/common-ui').SoundController<
    import('@common/localstorage').AppLocalStorageKeys
  >;
}

interface UC_UI {
  showFirstLayer: () => void;
  isConsentRequired: () => boolean; // "true" for users who neither denied nor approved cookies (typically new users)
}

declare namespace GoogleH5 {
  interface PlacementInfo {
    breakType: string;
    breakName: string;
    breakFormat: 'interstitial' | 'reward';
    breakStatus:
      | 'notReady'
      | 'timeout'
      | 'error'
      | 'noAdPreloaded'
      | 'frequencyCapped'
      | 'ignored'
      | 'other'
      | 'dismissed'
      | 'viewed';
  }

  interface RewardAdBreak {
    type: 'reward'; // The type of this placement
    name: string; // A descriptive name for this placement
    beforeAd?: () => void; // Prepare for the ad. Mute and pause the game flow
    afterAd?: () => void; // Resume the game and re-enable sound
    beforeReward: (showAdFn: () => void) => void; // Show reward prompt (call showAdFn() if clicked)
    adDismissed: () => void; // Player dismissed the ad before it finished.
    adViewed: () => void; // Player watched the ad – give them the reward.
    adBreakDone?: (placementInfo: PlacementInfo) => void; // Always called (if provided) even if an ad didn't show
  }

  interface AdConfig {
    preloadAdBreaks?: 'on' | 'auto'; // Ad preloading strategy
    sound?: 'on' | 'off'; // This game has sound
    onReady?: () => void; // Called when API has initialised and adBreak() is ready
  }
}

declare const NOICE: NoiceEnv;
declare let adBreak: (params: GoogleH5.RewardAdBreak) => void;
declare let adConfig: (params: GoogleH5.AdConfig) => void;

interface Window {
  NOICE: NoiceEnv;
  UC_UI?: UC_UI;
  adBreak: (params: GoogleH5.RewardAdBreak) => void; // Google AdSense
  adConfig: (config: GoogleH5.AdConfig) => void; // Google AdSense
  adsBlocked: boolean;
  wasCookiesConsentShown: boolean | undefined;
  dataLayer: Record<string, unknown>[]; // Google Tag Manager
  ReactNativeWebView?: {
    injectedObjectJson?: () => string;
  };
  zE?: ZendeskWidgetAPI;
}

declare module '*.glsl' {
  const shader: string;
  export default shader;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const value: string;
  export default value;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.module.css';

declare module '*.yml' {
  const data: any;
  export default data;
}

type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const value: SvgrComponent;
  export default value;
}

declare module '*.svg?url' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.png?url' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.avif' {
  const value: string;
  export default value;
}

declare module '*.ico' {
  const value: string;
  export default value;
}

declare type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
