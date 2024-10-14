import { gql } from '@apollo/client';

import { ModeratorList } from '../ModeratorList/ModeratorList';

import { useChannelContext } from '@common/channel';
import {
  ChannelChannelRole,
  ModeratorProfileFragment,
  useModeratorListPrivilegedUsersQuery,
  useSetUserRolesMutation,
} from '@gen';

const PAGE_SIZE = 20;

gql`
  query ModeratorListPrivilegedUsers($channelId: ID!, $pageSize: Int!, $cursor: String) {
    channelPrivilegedUsers(
      channelId: $channelId
      cursor: { first: $pageSize, after: $cursor }
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      users {
        userId
        roles
        user {
          userId
          ...ModeratorProfile
        }
      }
    }
  }

  ${ModeratorList.fragments.entry}
`;

gql`
  mutation SetUserRoles($channelId: ID!, $userId: ID!, $roles: [ChannelChannelRole!]) {
    setUserChannelRoles(channelId: $channelId, userId: $userId, roles: $roles) {
      emptyTypeWorkaround
    }
  }
`;

interface HookResult {
  moderators: ModeratorProfileFragment[];
  privilegedUsers: string[];
  hasNextPage: boolean;
  addModerator(userId: string): void;
  onRemoveModerator(userId: string): void;
  fetchMoreModerators(): void;
}

export function useModerationRolesData(): HookResult {
  const { channelId } = useChannelContext();

  const { data, fetchMore, refetch } = useModeratorListPrivilegedUsersQuery({
    variables: {
      channelId,
      pageSize: PAGE_SIZE,
    },
  });

  const [setRoles] = useSetUserRolesMutation({
    onCompleted() {
      refetch();
    },
  });

  const moderators =
    data?.channelPrivilegedUsers?.users
      .filter(({ roles }) => roles.includes(ChannelChannelRole.ChannelRoleModerator))
      .map(({ user }) => user) || [];

  const privilegedUsers =
    data?.channelPrivilegedUsers?.users
      .filter(
        ({ roles }) =>
          roles.includes(ChannelChannelRole.ChannelRoleModerator) ||
          roles.includes(ChannelChannelRole.ChannelRoleStreamer),
      )
      .map(({ user }) => user.userId) || [];

  const addModerator = (userId: string) => {
    const user = data?.channelPrivilegedUsers?.users.find(
      (user) => user.userId === userId,
    );

    setRoles({
      variables: {
        channelId,
        userId,
        roles: [...(user?.roles ?? []), ChannelChannelRole.ChannelRoleModerator],
      },
    });
  };

  const onRemoveModerator = (userId: string) => {
    const user = data?.channelPrivilegedUsers?.users.find(
      (user) => user.userId === userId,
    );
    const roles =
      user?.roles?.filter((role) => role !== ChannelChannelRole.ChannelRoleModerator) ||
      [];

    setRoles({
      variables: {
        channelId,
        userId,
        roles,
      },
    });
  };

  const fetchMoreModerators = () => {
    fetchMore({
      variables: {
        pageSize: PAGE_SIZE,
        cursor: data?.channelPrivilegedUsers?.pageInfo.endCursor,
      },
    });
  };

  return {
    moderators,
    privilegedUsers,
    addModerator,
    onRemoveModerator,
    fetchMoreModerators,
    hasNextPage: !!data?.channelPrivilegedUsers?.pageInfo.hasNextPage,
  };
}
