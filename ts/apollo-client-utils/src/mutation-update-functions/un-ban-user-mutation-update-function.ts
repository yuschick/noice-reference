import {
  ApolloCache,
  DefaultContext,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';

import { Exact, Scalars } from '../../gen';

export const unBanUserMutationUpdateFunction: MutationUpdaterFunction<
  any,
  Exact<{
    userId: Scalars['ID']['input'];
    channelId: Scalars['ID']['input'];
  }>,
  DefaultContext,
  ApolloCache<any>
> = (cache, _result, { variables }) => {
  cache.modify({
    fields: {
      channelBannedUsers(
        existingBannedUser: { users: Record<string, Reference> } = { users: {} },
      ) {
        if (!variables?.userId) {
          return existingBannedUser;
        }

        const users = existingBannedUser.users;
        delete users[variables?.userId];

        return { users };
      },
    },
  });
};
