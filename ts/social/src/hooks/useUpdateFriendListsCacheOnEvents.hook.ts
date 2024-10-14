import { gql, useApolloClient } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { useClient } from '@noice-com/common-react-core';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { FriendStatusUpdateEventUpdateType } from '@noice-com/schemas/friends/friends.pb';
import { addNewFriendToExistingFriendList } from '@noice-com/social-react-core';
import { DeepPartial } from '@noice-com/utils';
import { useEffect } from 'react';

import { FriendsListSentFriendRequestsResponse, QueryFriendsArgs } from '@social-gen';

export function useUpdateFriendListsCacheOnEvents() {
  const { userId } = useAuthenticatedUser();
  const client = useClient();
  const apolloClient = useApolloClient();

  useEffect(() => {
    return client.NotificationService.notifications({
      onFriendStatusUpdate(_ctx, ev) {
        const actorId = ev.actorUserId;

        if (!actorId || !ev.type) {
          return;
        }

        // When there is a new friend request, update the cache to include the new request
        if (ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_FRIEND_INVITATION) {
          apolloClient.cache.modify({
            fields: {
              receivedFriendRequests(existingRequests) {
                const newRequestUser = apolloClient.cache.writeFragment({
                  id: apolloClient.cache.identify({
                    userId: actorId,
                    __typename: 'FriendsUser',
                  }),
                  data: { userId: actorId },
                  fragment: gql`
                    fragment NewFriendRequestUser on FriendsUser {
                      userId
                    }
                  `,
                });

                return {
                  ...existingRequests,
                  users: [...existingRequests.users, newRequestUser],
                };
              },
            },
          });

          return;
        }

        // When there is a new friend, update the cache to include the new friend and remove the request
        if (
          ev.type === FriendStatusUpdateEventUpdateType.UPDATE_TYPE_INVITATION_ACCEPTED
        ) {
          apolloClient.cache.modify({
            fields: {
              // Remove the request from the received friend requests list
              sentFriendRequests(
                existingRequests: DeepPartial<FriendsListSentFriendRequestsResponse>,
                { readField },
              ) {
                return {
                  ...existingRequests,
                  users: existingRequests.users?.filter(
                    (user) => readField('userId', user) !== actorId,
                  ),
                };
              },
              // Add the friend to the friends list
              friends(existingFriendsResponse, { readField, storeFieldName, fieldName }) {
                const { userId: friendListUserId } = getFieldsVariables<QueryFriendsArgs>(
                  storeFieldName,
                  fieldName,
                );

                if (friendListUserId !== userId) {
                  // If the friend list is not for the current user or the actor id, do not modify the cache
                  if (friendListUserId !== actorId) {
                    return existingFriendsResponse;
                  }

                  // Add current user to the friend list of the actor
                  const newFriendUser = apolloClient.cache.writeFragment({
                    id: apolloClient.cache.identify({
                      userId,
                      __typename: 'FriendsUser',
                    }),
                    data: { userId: actorId },
                    fragment: gql`
                      fragment NewFriendRequestUser on FriendsUser {
                        userId
                      }
                    `,
                  });

                  return addNewFriendToExistingFriendList(
                    existingFriendsResponse,
                    newFriendUser,
                    readField,
                  );
                }

                const newFriendUser = apolloClient.cache.writeFragment({
                  id: apolloClient.cache.identify({
                    userId: actorId,
                    __typename: 'FriendsUser',
                  }),
                  data: { userId: actorId },
                  fragment: gql`
                    fragment NewFriendRequestUser on FriendsUser {
                      userId
                    }
                  `,
                });

                return addNewFriendToExistingFriendList(
                  existingFriendsResponse,
                  newFriendUser,
                  readField,
                );
              },
            },
          });

          return;
        }

        // When user is unfriended, or when a user is blocked, remove the friend from the cache
        if (
          [
            FriendStatusUpdateEventUpdateType.UPDATE_TYPE_USER_BLOCKED,
            FriendStatusUpdateEventUpdateType.UPDATE_TYPE_USER_UNFRIENDED,
          ].includes(ev.type)
        ) {
          const id = apolloClient.cache.identify({
            userId: actorId,
            __typename: 'FriendsUser',
          });

          // If there is no id for the user, do not try to evict
          if (!id) {
            return;
          }

          apolloClient.cache.evict({ id });
          apolloClient.cache.gc();

          return;
        }
      },
    });
  }, [client, apolloClient, userId]);
}
