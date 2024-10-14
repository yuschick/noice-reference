import { FieldPolicy } from '@apollo/client';

import { ChannelModerationSettings } from '../../gen';

type ChannelModerationSettingsFieldPolicy = FieldPolicy<
  ChannelModerationSettings,
  ChannelModerationSettings,
  ChannelModerationSettings
>;

export function channelModerationSettingsCache(): ChannelModerationSettingsFieldPolicy {
  return {
    keyArgs: ['channelId'],
    read(existing) {
      return existing;
    },
    merge(existing, incoming) {
      return { ...existing, ...incoming };
    },
  };
}
