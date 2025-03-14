/* eslint-disable @typescript-eslint/naming-convention */
export const getConfig = (
  env: Record<string, string | undefined>,
): Record<string, string | boolean | number | undefined> => ({
  IS_LOCAL: env.IS_LOCAL === 'true',
  VERBOSE_LOGGING: env.VERBOSE_LOGGING === 'true',
  SERVICES_LIB_HOST: env.SERVICES_LIB_HOST,
  SERVICES_LIB_WEBSOCKET: env.SERVICES_LIB_WEBSOCKET,
  AUTH_PATH: env.SERVICES_LIB_HOST,
  BUILD_TIME: env.BUILD_TIME ? new Date(env.BUILD_TIME).getTime() : Date.now(),
  BUILD_HASH: env.BUILD_HASH || 'unknown',
  CDN_URL: env.CDN_URL,
  STUDIO_URL: env.STUDIO_URL,
  APPLE_REDIRECT_URI: env.APPLE_REDIRECT_URI,
  ADYEN_CLIENT_KEY: env.ADYEN_CLIENT_KEY,
  ADYEN_ENVIRONMENT: env.ADYEN_ENVIRONMENT,
  ADMIN_URL: env.ADMIN_URL,
  HASH_ROUTING: env.HASH_ROUTING === 'true',
  LIST_ONLY_LIVE_CHANNELS: env.LIST_ONLY_LIVE_CHANNELS === 'true',
  HCAPTCHA_SITE_KEY: env.HCAPTCHA_SITE_KEY,
  DISCORD_CLIENT_ID: env.DISCORD_CLIENT_ID,
  USE_APOLLO_DEV_TOOLS: env.USE_APOLLO_DEV_TOOLS === 'true',
  CHARGEBEE_SITE: env.CHARGEBEE_SITE,
  USE_GOOGLE_ADS_TESTMODE: env.USE_GOOGLE_ADS_TESTMODE === 'true',
  SENTRY_ENVIRONMENT: env.SENTRY_ENVIRONMENT,
  PROXY_AUTH_HOSTNAME: env.PROXY_AUTH_HOSTNAME,
  REFINER_PROJECT_ID: env.REFINER_PROJECT_ID,
  FIREBASE_ENABLED: env.FIREBASE_ENABLED === 'true',
  FIREBASE_API_KEY: env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: env.FIREBASE_APP_ID,
  FIREBASE_VAPID_KEY: env.FIREBASE_VAPID_KEY,
  SHOW_ZENDESK_WIDGET: !!env.ZENDESK_SNIPPET_SRC,
});
