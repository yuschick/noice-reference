/* eslint-disable @typescript-eslint/naming-convention */

declare module 'react-native-config' {
  interface NativeConfig {
    SERVICES_LIB_HOST: string;
    SERVICES_WS_HOST: string;
    CDN_URL: string;
    SENTRY_DSN: string;
    HCAPTCHA_SITE_KEY: string;
    NOICE_BASE_URL: string;
    IRON_SOURCE_APP_KEY: string;
    USER_CENTRIC_SETTINGS_ID: string;
    DISCORD_CLIENT_ID: string;
    CHARGEBEE_SITE: string;
    CHARGEBEE_PUBLISHABLE_API_KEY: string;
    CHARGEBEE_IOS_KEY: string;
    CHARGEBEE_ANDROID_KEY: string;
    SINGULAR_KEY: string;
    SINGULAR_SECRET: string;
    SINGULAR_IS_PRD: string;
    FACEBOOK_APP_ID: string;
    REFINER_PROJECT_ID: string;
    IS_RELEASE_BUILD: string;
  }

  const Config: NativeConfig;
  export default Config;
}
