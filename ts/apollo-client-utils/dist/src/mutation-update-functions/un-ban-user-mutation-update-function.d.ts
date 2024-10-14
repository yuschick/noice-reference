import { ApolloCache, DefaultContext, MutationUpdaterFunction } from '@apollo/client';
import { Exact, Scalars } from '../../gen';
export declare const unBanUserMutationUpdateFunction: MutationUpdaterFunction<any, Exact<{
    userId: Scalars['ID']['input'];
    channelId: Scalars['ID']['input'];
}>, DefaultContext, ApolloCache<any>>;
