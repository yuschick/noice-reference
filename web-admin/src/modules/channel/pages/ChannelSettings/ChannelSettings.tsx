import { gql } from '@apollo/client';
import { useParams } from 'react-router';

import { ArenaCrowdSettings } from './ArenaCrowdSettings/ArenaCrowdSettings';
import { ChannelMonetizationSettings } from './ChannelMonetizationSettings/ChannelMonetizationSettings';
import { ChannelVisibility } from './ChannelVisibility/ChannelVisibility';
import { PredictionGameSettings } from './PredictionGameSettings/PredictionGameSettings';
import { PrioritySettings } from './PrioritySettings/PrioritySettings';
import { RecordingSettings } from './RecordingSettings/RecordingSettings';
import { RiskTierSettings } from './RiskTierSettings/RiskTierSettings';

import { ContentModulePage } from '@common/page-components';
import { PermissionWrapper, useUserPermissions } from '@common/permission';
import { AuthPlatformRole, ChannelLiveStatus, useChannelSettingsQuery } from '@gen';

gql`
  query ChannelSettings($channelId: ID!, $skipConfigs: Boolean = false) {
    channel(id: $channelId) {
      id
      liveStatus
      ...ChannelVisibilityChannel
      ...ChannelMonetizationChannel
      priority
      riskTier
    }

    selectedStreamBackendConfig(channelId: $channelId) @skip(if: $skipConfigs) {
      ...PredictionGameChannelStreamBackendConfig
      ...ArenaCrowdChannelStreamBackendConfig
      ...RecordingChannelStreamBackendConfig
    }

    arenas(channelId: $channelId) {
      arenas {
        ...ArenaCrowdArena
      }
    }
  }
`;

export function ChannelSettings() {
  const { channelId } = useParams();
  const { hasPermissionFromArray } = useUserPermissions();

  const { data, loading, error } = useChannelSettingsQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      channelId: channelId!,
      skipConfigs: !hasPermissionFromArray([
        AuthPlatformRole.PlatformRoleAdmin,
        AuthPlatformRole.PlatformRolePxAgent,
      ]),
    },
    skip: !channelId,
  });

  if (loading) {
    return <ContentModulePage.Loading />;
  }

  if (!data?.channel || error) {
    return null;
  }

  const { channel, selectedStreamBackendConfig, arenas } = data;
  const { liveStatus, priority, riskTier } = channel;

  return (
    <ContentModulePage isOneColumnPage>
      <ChannelVisibility channel={channel} />
      <ChannelMonetizationSettings channel={channel} />

      <PermissionWrapper>
        <RiskTierSettings currentRiskTier={riskTier} />
      </PermissionWrapper>

      <PermissionWrapper allowedRoles={[AuthPlatformRole.PlatformRolePxAgent]}>
        <PrioritySettings currentPriority={priority ?? 0} />
      </PermissionWrapper>

      <PermissionWrapper allowedRoles={[AuthPlatformRole.PlatformRolePxAgent]}>
        <ArenaCrowdSettings
          arenas={arenas?.arenas ?? []}
          backendConfig={selectedStreamBackendConfig ?? null}
          isOnline={liveStatus === ChannelLiveStatus.LiveStatusLive}
        />
      </PermissionWrapper>

      <PermissionWrapper>
        <PredictionGameSettings
          backendConfig={selectedStreamBackendConfig ?? null}
          isOnline={liveStatus === ChannelLiveStatus.LiveStatusLive}
        />
      </PermissionWrapper>

      <PermissionWrapper>
        <RecordingSettings
          backendConfig={selectedStreamBackendConfig ?? null}
          isOnline={liveStatus === ChannelLiveStatus.LiveStatusLive}
        />
      </PermissionWrapper>
    </ContentModulePage>
  );
}
