import { gql } from '@apollo/client';
import { useChannelUnbanMutation } from '@noice-com/social-react-core';
import { Nullable } from '@noice-com/utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router';

import { BanDetails } from '../BanDetails/BanDetails';
import { BannedUser } from '../BannedUser/BannedUser';

import { useChannelContext } from '@common/channel';
import {
  ChannelAppealStatus,
  useModerationBannedListQuery,
  useModerationUpdateChannelBanAppealMutation,
} from '@gen';

const PAGE_SIZE = 20;

gql`
  query ModerationBannedList($channelId: ID!, $cursor: String, $pageSize: Int) {
    channelBannedUsers(
      channelId: $channelId
      cursor: { first: $pageSize, after: $cursor }
    ) {
      users {
        channelId
        ...BannedUserBannedUser
        ...BanDetailsUser
        user {
          userTag
        }
        userId
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${BannedUser.fragments.entry}
  ${BanDetails.fragments.entry}
`;

gql`
  mutation ModerationUpdateChannelBanAppeal(
    $userId: ID!
    $channelId: ID!
    $status: ChannelAppealStatus!
  ) {
    updateChannelBanAppeal(userId: $userId, channelId: $channelId, status: $status) {
      emptyTypeWorkaround
    }
  }
`;

export function useBannedUsers() {
  const [activeBannedUserId, setActiveBannedUserId] = useState<Nullable<string>>(null);
  const { channelId } = useChannelContext();

  const hashOpened = useRef(false);

  const location = useLocation();

  const { data, refetch, fetchMore } = useModerationBannedListQuery({
    variables: {
      channelId,
      pageSize: PAGE_SIZE,
    },
    onCompleted(data) {
      // If hash user is opened already, do nothing
      if (hashOpened.current) {
        return;
      }

      const userTag = location.hash.substring(1);

      // If not userTag hash, do nothing
      if (!userTag) {
        return;
      }

      // Get the user for userTag has
      const user = data.channelBannedUsers?.users.find(
        (user) => user.user.userTag === userTag,
      );

      // If there is user, set them as active
      if (user) {
        setActiveBannedUserId(user.userId);
        hashOpened.current = true;
        return;
      }

      // Fetch more data if user is not found and there is more pages
      if (data?.channelBannedUsers?.pageInfo.hasNextPage) {
        fetchMore({
          variables: {
            pageSize: PAGE_SIZE,
            cursor: data?.channelBannedUsers?.pageInfo.endCursor,
          },
        });
      }
    },
  });

  const [unBanUser] = useChannelUnbanMutation();

  const [updateBanAppeal] = useModerationUpdateChannelBanAppealMutation({
    onCompleted() {
      refetch();
    },
  });

  const onUnBanClick = useCallback(
    async (userId: string) => {
      await unBanUser({
        variables: {
          channelId,
          userId,
        },
      });

      toast.success('User is unbanned');
    },
    [channelId, unBanUser],
  );

  const onRejectAppeal = useCallback(
    async (userId: string) => {
      await updateBanAppeal({
        variables: {
          channelId,
          userId,
          status: ChannelAppealStatus.AppealStatusDeclined,
        },
      });

      toast.success("User's appeal rejected");
    },
    [channelId, updateBanAppeal],
  );

  const onAcceptAppeal = useCallback(
    async (userId: string) => {
      await updateBanAppeal({
        variables: {
          channelId,
          userId,
          status: ChannelAppealStatus.AppealStatusAccepted,
        },
      });

      toast.success("User's appeal accepted");
    },
    [channelId, updateBanAppeal],
  );

  const activeBannedUser = useMemo(() => {
    if (!activeBannedUserId) {
      return null;
    }

    const activeBannedUser = data?.channelBannedUsers?.users.find(
      (user) => user.userId === activeBannedUserId,
    );

    if (!activeBannedUser) {
      return null;
    }

    return {
      ...activeBannedUser,
      onUnBanClick,
      onRejectAppeal,
      onAcceptAppeal,
    };
  }, [
    activeBannedUserId,
    data?.channelBannedUsers?.users,
    onAcceptAppeal,
    onRejectAppeal,
    onUnBanClick,
  ]);

  const fetchMoreUsers = useCallback(async () => {
    await fetchMore({
      variables: {
        pageSize: PAGE_SIZE,
        cursor: data?.channelBannedUsers?.pageInfo.endCursor,
      },
    });
  }, [data?.channelBannedUsers?.pageInfo.endCursor, fetchMore]);

  return {
    bannedUsers: data?.channelBannedUsers?.users,
    fetchMoreUsers,
    hasNextPage: !!data?.channelBannedUsers?.pageInfo.hasNextPage,
    activeBannedUser,
    setActiveBannedUserId,
  };
}
