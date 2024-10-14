import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';
import { useCallback } from 'react';

import { useChannelContext } from '@common/channel';
import {
  SimulcastingDestinationConfigFragment,
  useChannelSimulcastingConfigQuery,
  useUpdateChannelSimulcastingConfigMutation,
} from '@gen';

interface HookResult {
  currentConfig: Nullable<SimulcastingDestinationConfigFragment>;
  loading: boolean;
  onUpdateConfig: (
    config: Partial<SimulcastingDestinationConfigFragment>,
  ) => Promise<void>;
  onDeleteConfig: () => Promise<void>;
  onToggleConfigEnabled: (enabled: boolean) => Promise<void>;
}

const emptyDestinationState = {
  rtmpEndpoint: '',
  rtmpKey: '',
  bitrate: 0,
  enabled: false,
};

gql`
  fragment SimulcastingDestinationConfig on ChannelRestreamingConfig {
    channelId
    rtmpEndpoint
    rtmpKey
    bitrate
    enabled
    ...SimulcastingSettingsOverviewConfig
  }

  query ChannelSimulcastingConfig($channelId: ID!) {
    restreamingConfig(channelId: $channelId) {
      ...SimulcastingDestinationConfig
    }
  }

  mutation UpdateChannelSimulcastingConfig(
    $channelId: ID!
    $rtmpEndpoint: String
    $rtmpKey: String
    $bitrate: Int
    $enabled: Boolean
  ) {
    updateRestreamingConfig(
      body: {
        channelId: $channelId
        rtmpEndpoint: $rtmpEndpoint
        rtmpKey: $rtmpKey
        bitrate: $bitrate
        enabled: $enabled
      }
    ) {
      ...SimulcastingDestinationConfig
    }
  }
`;

const hasDestination = (config?: Nullable<SimulcastingDestinationConfigFragment>) =>
  // @todo: should have better logic
  config?.rtmpEndpoint !== '' || config?.rtmpKey !== '';

export function useSimulcastingDestination(): HookResult {
  const { channelId } = useChannelContext();

  const { data, loading } = useChannelSimulcastingConfigQuery({
    variables: {
      channelId,
    },
  });
  const currentConfig = data?.restreamingConfig;

  const [updateConfig] = useUpdateChannelSimulcastingConfigMutation();

  const onUpdateConfig = async (
    config: Partial<SimulcastingDestinationConfigFragment>,
  ) => {
    if (!currentConfig) {
      return;
    }

    await updateConfig({ variables: { ...currentConfig, ...config } });
  };

  const onDeleteConfig = useCallback(async () => {
    // @todo: would be nice to have backend support having empty config
    await updateConfig({
      variables: {
        ...emptyDestinationState,
        channelId,
      },
    });
  }, [channelId, updateConfig]);

  const onToggleConfigEnabled = async (enabled: boolean) => {
    if (!currentConfig) {
      return;
    }

    await updateConfig({
      variables: {
        ...currentConfig,
        enabled,
      },
    });
  };

  return {
    currentConfig: currentConfig && hasDestination(currentConfig) ? currentConfig : null,
    loading,
    onUpdateConfig,
    onDeleteConfig,
    onToggleConfigEnabled,
  };
}
