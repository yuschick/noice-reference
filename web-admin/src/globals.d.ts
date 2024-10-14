/* eslint-disable @typescript-eslint/naming-convention */

interface NoiceEnv {
  HASH_ROUTING: boolean;
  SERVICES_LIB_HOST: string;
  SERVICES_LIB_WEBSOCKET: string;
  AUTH_BASE_URL: string;
  HCAPTCHA_SITE_KEY: string;
  DISCORD_CLIENT_ID: string;
  PLATFORM_URL: string;
  STUDIO_URL: string;
  APPLE_REDIRECT_URI: string;
  BUILD_TIME: number;
  BUILD_HASH: string;
  USE_APOLLO_DEV_TOOLS?: boolean;
}

declare const NOICE: NoiceEnv;

interface Window {
  NOICE: NoiceEnv;
}

declare module '*.yml' {
  const data: unknown;
  export default data;
}

declare module '*.module.css';
