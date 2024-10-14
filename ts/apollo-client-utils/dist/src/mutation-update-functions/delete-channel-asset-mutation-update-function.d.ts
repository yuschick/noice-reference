import { ApolloCache, DefaultContext, MutationUpdaterFunction } from '@apollo/client';
import { ChannelAssetType, Exact, Scalars } from '../../gen';
export declare const deleteChannelAssetMutationUpdateFunction: MutationUpdaterFunction<any, Exact<{
    channelId: Scalars['ID']['input'];
    assetType: ChannelAssetType;
}>, DefaultContext, ApolloCache<any>>;
