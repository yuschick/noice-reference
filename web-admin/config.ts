/* eslint-disable @typescript-eslint/naming-convention */
export const getConfig = (env: Record<string, string | undefined>) => ({
  IS_LOCAL: env.IS_LOCAL === 'true',
  VERBOSE_LOGGING: env.VERBOSE_LOGGING === 'true',
  SERVICES_LIB_HOST: env.SERVICES_LIB_HOST,
  SERVICES_LIB_WEBSOCKET: env.SERVICES_LIB_WEBSOCKET,
  BUILD_TIME: env.BUILD_TIME ? new Date(env.BUILD_TIME).getTime() : Date.now(),
  BUILD_HASH: env.BUILD_HASH || 'unknown',
  CDN_URL: env.CDN_URL,
  HASH_ROUTING: env.HASH_ROUTING === 'true',
  LIST_ONLY_LIVE_CHANNELS: env.LIST_ONLY_LIVE_CHANNELS === 'true',
  HCAPTCHA_SITE_KEY: env.HCAPTCHA_SITE_KEY,
  DISCORD_CLIENT_ID: env.DISCORD_CLIENT_ID,
  PLATFORM_URL: env.PLATFORM_URL,
  STUDIO_URL: env.STUDIO_URL,
  APPLE_REDIRECT_URI: env.APPLE_REDIRECT_URI,
  USE_APOLLO_DEV_TOOLS: env.USE_APOLLO_DEV_TOOLS === 'true',
});
