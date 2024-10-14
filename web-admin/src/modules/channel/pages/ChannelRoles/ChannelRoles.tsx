import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, ProfileImage } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useParams } from 'react-router';

import styles from './ChannelRoles.module.css';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { hideEmailDomain } from '@common/profile';
import {
  ChannelChannelRole,
  ChannelUserRolesQuery,
  ChannelUserRolesQueryVariables,
  ProfileImageProfileFragment,
  useChannelUserRolesQuery,
} from '@gen';

gql`
  query ChannelUserRoles($channelId: ID!, $cursor: APICursorInput) {
    channelPrivilegedUsers(channelId: $channelId, cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      users {
        roles
        userId
        user {
          account {
            email
          }
          userId
          userTag
          ...ProfileImageProfile
        }
      }
    }
  }
`;

const getRole = ([role]: ChannelChannelRole[]) => {
  switch (role) {
    case ChannelChannelRole.ChannelRoleModerator:
      return (
        <>
          <Icon
            className={classNames(styles.icon, styles.moderator)}
            icon={CoreAssets.Icons.RoleModerator}
          />
          <span>Moderator</span>
        </>
      );
    case ChannelChannelRole.ChannelRoleStreamer:
      return (
        <>
          <Icon
            className={classNames(styles.icon, styles.streamer)}
            icon={CoreAssets.Icons.RoleStreamer}
          />
          <span>Owner/Streamer</span>
        </>
      );
    case ChannelChannelRole.ChannelRolePlatformModerator:
      return (
        <>
          <Icon
            className={classNames(styles.icon, styles.moderator)}
            icon={CoreAssets.Icons.RoleModerator}
          />
          <span>Platform Moderator</span>
        </>
      );
    case ChannelChannelRole.ChannelRoleUnspecified:
    default:
      return <span>Unspecified</span>;
  }
};

const getProfile = (profile: ProfileImageProfileFragment & { userTag: string }) => {
  return (
    <div className={styles.avatarWrapper}>
      <ProfileImage
        profile={profile}
        size="xs"
      />
      <span>{profile.userTag}</span>
    </div>
  );
};

export function ChannelRoles() {
  const { channelId } = useParams();
  const dataTransform = (data: ChannelUserRolesQuery) => {
    return (
      data?.channelPrivilegedUsers?.users
        .filter((user) => user.roles.length)
        .map((user) => {
          return (({ user, roles }) => ({
            role: getRole(roles),
            username: getProfile(user),
            userId: user.userId,
            email: hideEmailDomain(user.account?.email ?? ''),
          }))(user);
        }) ?? []
    );
  };

  const getPageInfo = (data: ChannelUserRolesQuery) =>
    data.channelPrivilegedUsers?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<ChannelUserRolesQuery, ChannelUserRolesQueryVariables>
      caption="Roles"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useChannelUserRolesQuery}
      idField="userId"
      skip={!channelId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ channelId: channelId! }}
      includeIdField
    />
  );
}
