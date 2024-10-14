import { gql } from '@apollo/client';
import { updateChannelModerationSettingsUpdateFunction } from '@noice-com/apollo-client-utils';
import { useState } from 'react';

import { useChannelContext } from '@common/channel';
import {
  useModeratorSettingsDataQuery,
  useUpdateChannelModerationBanAppealSettingMutation,
} from '@gen';

gql`
  query ModeratorSettingsData($channelId: ID!) {
    channelModerationSettings(channelId: $channelId) {
      channelId
      banAppealsEnabled
    }
  }
`;

gql`
  mutation UpdateChannelModerationBanAppealSetting(
    $channelId: ID!
    $banAppealsEnabled: Boolean
  ) {
    updateChannelModerationSettings(
      body: { channelId: $channelId, banAppealsEnabled: $banAppealsEnabled }
    ) {
      banAppealsEnabled
    }
  }
`;

interface HookResult {
  banAppealsEnabledLoading: boolean;
  banAppealsEnabled: boolean;
  onBanAppealsChange(value: boolean): void;
}

export function useModerationSettingsData(): HookResult {
  const [banAppealsEnabledChanging, setBanAppealsEnabledChanging] = useState(false);
  const { channelId } = useChannelContext();

  const { data, loading } = useModeratorSettingsDataQuery({
    variables: {
      channelId,
    },
  });

  const [updateSettings] = useUpdateChannelModerationBanAppealSettingMutation({
    // Update cache directly when mutation is done
    update: updateChannelModerationSettingsUpdateFunction,
  });

  const onBanAppealsChange = async (value: boolean) => {
    setBanAppealsEnabledChanging(true);

    await updateSettings({
      variables: {
        channelId,
        banAppealsEnabled: value,
      },
    });

    setBanAppealsEnabledChanging(false);
  };

  return {
    banAppealsEnabledLoading: loading || banAppealsEnabledChanging,
    banAppealsEnabled: !!data?.channelModerationSettings?.banAppealsEnabled,
    onBanAppealsChange,
  };
}
