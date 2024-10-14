import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { StringUtils } from '@noice-com/utils';
import { generatePath, useParams } from 'react-router';

import styles from './Channel.module.css';
import { ChannelLinks } from './ChannelLinks';
import { DeleteChannelButton } from './DeleteChannelButton';

import { generateChannelPlatformLink } from '@common/external-links';
import { TextField, Textarea } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import {
  PermissionLink,
  PermissionWrapper,
  useUserPermissions,
} from '@common/permission';
import { AuthPlatformRole, useChannelQuery, useChannelUserProfileQuery } from '@gen';

gql`
  query Channel($channelId: ID!, $skipConfigs: Boolean = false) {
    channel(id: $channelId) {
      id
      name
      description
      followerCount
      subscriberCount
      title
      links {
        url
        name
        type
      }
      isPublic
      streamerId
      currentStreamId
      ...DeleteChannelChannel
      priority
    }

    streamBackendConfigs(channelId: $channelId) @skip(if: $skipConfigs) {
      configs {
        gameId
        id
      }
    }

    selectedStreamBackendConfig(channelId: $channelId) @skip(if: $skipConfigs) {
      gameId
    }

    ingestConfigs(channelId: $channelId) @skip(if: $skipConfigs) {
      channelId
      configs {
        ingest {
          ... on StreamIngestConfigIngestConfigFTLConfig {
            streamKey
          }
        }
      }
    }
  }
`;

gql`
  query ChannelUserProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
      ...ProfileImageProfile
      ...ChannelOwnerAgreements
    }
  }
`;

export function Channel() {
  const { channelId } = useParams();
  const { hasPermissionFromArray } = useUserPermissions();

  const { data, loading, error, refetch } = useChannelQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      channelId: channelId!,
      skipConfigs: !hasPermissionFromArray([AuthPlatformRole.PlatformRoleAdmin]),
    },
    skip: !channelId,
  });

  const { data: userData } = useChannelUserProfileQuery({
    variables: { userId: data?.channel?.streamerId || '' },
    skip: !data?.channel?.streamerId,
  });

  if (loading) {
    return <ContentModulePage.Loading />;
  }

  if (error || !data?.channel) {
    return <ContentModulePage.Error />;
  }

  const channelData = data.channel;
  const streamConfigsData = data.streamBackendConfigs;
  const streamKey = data?.ingestConfigs?.configs?.[0].ingest?.streamKey;
  const streamedGame =
    data?.selectedStreamBackendConfig &&
    data?.streamBackendConfigs?.configs.find(
      (config) => config.gameId === data.selectedStreamBackendConfig?.gameId,
    );

  return (
    <ContentModulePage
      actions={[
        {
          type: 'link',
          text: 'View Channel on Noice',
          href: generateChannelPlatformLink(channelData.name),
        },
      ]}
      key={channelId}
    >
      <ContentModulePage.Content title="About">
        <TextField
          defaultValue={channelData?.id}
          label="ID"
          readOnly
        />

        <TextField
          defaultValue={channelData.name}
          label="Channel name"
          readOnly
        />

        {userData?.profile && (
          <>
            <span className={styles.label}>Owner</span>
            <div className={styles.userProfile}>
              <ProfileImage profile={userData.profile} />
              <PermissionLink
                className={styles.userTag}
                to={generatePath('/users/:userId', { userId: userData.profile.userId })}
              >
                {userData.profile.userTag}
              </PermissionLink>
            </div>
          </>
        )}

        <Textarea
          defaultValue={channelData.description}
          label="Channel bio"
          readOnly
        />
      </ContentModulePage.Content>

      <PermissionWrapper>
        <ContentModulePage.Content title="Stats">
          <ContentModulePage.Item
            label="Followers"
            value={channelData.followerCount}
          />

          <ContentModulePage.Item
            label="Subscribers"
            value={channelData.subscriberCount}
          />
        </ContentModulePage.Content>
      </PermissionWrapper>

      <ContentModulePage.Content title="Links">
        <ChannelLinks links={channelData.links} />
      </ContentModulePage.Content>

      <ContentModulePage.Content title="Stream info">
        <TextField
          defaultValue={channelData.title}
          label="Stream title"
        />
        {streamedGame && (
          <TextField
            defaultValue={StringUtils.normalizePropertyName(streamedGame.gameId)}
            label="Streamed game"
          />
        )}
        <PermissionWrapper>
          {!!streamKey && (
            <TextField
              defaultValue={streamKey}
              label="Stream key"
            />
          )}
        </PermissionWrapper>
      </ContentModulePage.Content>

      <ContentModulePage.ContentEmpty />

      <PermissionWrapper>
        <ContentModulePage.Content title="Stream configs">
          {streamConfigsData?.configs.map(({ id, gameId }) => (
            <TextField
              defaultValue={id}
              key={id}
              label={StringUtils.normalizePropertyName(gameId)}
              readOnly
            />
          ))}
        </ContentModulePage.Content>
      </PermissionWrapper>

      <PermissionWrapper>
        <DeleteChannelButton
          channel={channelData}
          onAfterDeleting={refetch}
        />
      </PermissionWrapper>
    </ContentModulePage>
  );
}
