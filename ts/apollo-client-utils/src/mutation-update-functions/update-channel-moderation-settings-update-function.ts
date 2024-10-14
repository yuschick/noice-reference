import { ApolloCache, DefaultContext, MutationUpdaterFunction } from '@apollo/client';

import {
  ChannelAutomodSettingsInput,
  ChannelModerationSettings,
  Exact,
  InputMaybe,
  Scalars,
} from '../../gen';

export const updateChannelModerationSettingsUpdateFunction: MutationUpdaterFunction<
  any,
  Exact<{
    channelId: Scalars['ID']['input'];
    banAppealsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    automod?: InputMaybe<ChannelAutomodSettingsInput>;
  }>,
  DefaultContext,
  ApolloCache<any>
> = (cache, _result, { variables }) => {
  cache.modify({
    fields: {
      channelModerationSettings(
        existingChannelModerationSettings: Partial<ChannelModerationSettings>,
      ) {
        return {
          ...existingChannelModerationSettings,
          banAppealsEnabled:
            variables?.banAppealsEnabled ??
            existingChannelModerationSettings.banAppealsEnabled,
          automod: {
            ...existingChannelModerationSettings.automod,
            ...variables?.automod,
          },
        };
      },
    },
  });
};
