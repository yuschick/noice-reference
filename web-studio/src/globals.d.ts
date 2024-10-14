/* eslint-disable @typescript-eslint/naming-convention */

interface NoiceEnv {
  APPLE_REDIRECT_URI: string;

  HASH_ROUTING: boolean;
  SERVICES_LIB_HOST: string;
  SERVICES_LIB_WEBSOCKET: string;
  AUTH_BASE_URL: string;
  PLATFORM_URL: string;
  ADMIN_URL: string;
  NOICE_OBS_PLUGIN_GITHUB_API_URL: string;
  IS_LOCAL: boolean;
  LIST_ONLY_LIVE_CHANNELS: boolean;
  HCAPTCHA_SITE_KEY: string;
  showDebug: () => void;
  __Client?: import('@noice-com/platform-client').Client;
  // Build info comes from Docker/Noice Workspace.
  BUILD_TIME: number;
  BUILD_HASH: string;
  DISCORD_CLIENT_ID: string;
  USE_APOLLO_DEV_TOOLS?: boolean;
  SENTRY_ENVIRONMENT: string;
  GAME_CONNECT_URL: string;
  SHOW_ZENDESK_WIDGET: boolean;
}

declare const NOICE: NoiceEnv;

interface Window {
  NOICE: NoiceEnv;
  externalStudioWidget?: boolean;
  zE?: ZendeskWidgetAPI;
}

declare module '*.module.css';

type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.ico' {
  const value: string;
  export default value;
}
