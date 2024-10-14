import { ApolloCache, DefaultContext, MutationUpdaterFunction } from '@apollo/client';
import { Exact, Scalars } from '../../gen';
export declare const unfollowChannelMutationUpdateFunction: MutationUpdaterFunction<any, Exact<{
    channelId: Scalars['ID'];
    userId: Scalars['ID'];
}>, DefaultContext, ApolloCache<any>>;
