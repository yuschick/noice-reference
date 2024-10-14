import { useApolloClient } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { FriendStatusUpdateEventUpdateType } from '@noice-com/schemas/friends/friends.pb';
import { DeepPartial } from '@noice-com/utils';
import { useEffect } from 'react';

import {
  FriendStatusUpdateProfileFragmentDoc,
  FriendsFriendshipStatusStatus,
  ProfileProfile,
  FriendsListFriendsResponse,
  QueryFriendsArgs,
} from '@social-gen';

export function useUpdateProfileCacheOnEvents() {
  const client = useClient();
  const apolloClient = useApolloClient();

  useEffect(() => {
    return client.NotificationService.notifications({
      onFriendStatusUpdate(_ctx, ev) {
        const actorId = ev.actorUserId;

        if (!actorId || !ev.type) {
          return;
        }

        if (
          ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_ACCEPTED
        ) {
          apolloClient.cache.updateFragment<DeepPartial<ProfileProfile>>(
            {
              id: apolloClient.cache.identify({
                userId: actorId,
                __typename: 'ProfileProfile',
              }),
              fragment: FriendStatusUpdateProfileFragmentDoc,
            },
            (existingProfile) => {
              if (!existingProfile) {
                return;
              }

              return {
                ...existingProfile,
                friendshipStatus: {
                  ...existingProfile.friendshipStatus,
                  status: FriendsFriendshipStatusStatus.StatusFriend,
                },
              };
            },
          );

          return;
        }

        if (ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_FRIEND_INVITATION) {
          apolloClient.cache.updateFragment<DeepPartial<ProfileProfile>>(
            {
              id: apolloClient.cache.identify({
                userId: actorId,
                __typename: 'ProfileProfile',
              }),
              fragment: FriendStatusUpdateProfileFragmentDoc,
            },
            (existingProfile) => {
              if (!existingProfile) {
                return;
              }

              return {
                ...existingProfile,
                friendshipStatus: {
                  ...existingProfile.friendshipStatus,
                  status: FriendsFriendshipStatusStatus.StatusFriendRequestReceived,
                },
              };
            },
          );

          return;
        }

        if (
          [
            FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_CANCELLED,
            FriendStatusUpdateEventUpdateType.UPDATE_TYPE_USER_BLOCKED,
          ].includes(ev.type)
        ) {
          const id = apolloClient.cache.identify({
            userId: actorId,
            __typename: 'FriendsUser',
          });

          apolloClient.cache.evict({ id });
          apolloClient.cache.gc();

          // Remove friends from the root friends cache
          apolloClient.cache.modify({
            fields: {
              friends(
                existing: FriendsListFriendsResponse,
                { storeFieldName, fieldName, readField },
              ) {
                const { userId } = getFieldsVariables<QueryFriendsArgs>(
                  storeFieldName,
                  fieldName,
                );

                // actor userId
                if (userId === ev.actorUserId) {
                  // target userId
                  return {
                    ...existing,
                    users: existing.users.filter(
                      (friend) => readField('userId', friend) !== ev.targetUserId,
                    ),
                  };
                }

                // target userId
                if (userId === ev.targetUserId) {
                  // actor userId
                  return {
                    ...existing,
                    users: existing.users.filter(
                      (friend) => readField('userId', friend) !== ev.actorUserId,
                    ),
                  };
                }
              },
            },
          });
        }
      },
    });
  }, [client, apolloClient]);
}
