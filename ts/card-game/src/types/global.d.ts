/* eslint-disable @typescript-eslint/naming-convention */
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: SvgrComponent;
  export default value;
}

declare module '*.svg?url' {
  const value: string;
  export default value;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.mp4' {
  const value: string;
  export default value;
}

interface NoiceEnv {
  CDN_URL: string;
  showDebug: () => void;
  onDebugViewStart: (
    addDebugListener: (listener: import('logging').DebugListener) => () => void,
  ) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __SoundController?: import('@noice-com/common-ui').SoundController<
    import('@game-types').GameLocalStorageKeys
  >;
}

declare const NOICE: NoiceEnv;

interface Window {
  NOICE: NoiceEnv;
  dataLayer?: Record<string, unknown>[]; // Google Tag Manager
}

declare module '*.module.css';
