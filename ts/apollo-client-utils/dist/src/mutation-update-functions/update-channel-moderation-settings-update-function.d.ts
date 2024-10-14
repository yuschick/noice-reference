import { ApolloCache, DefaultContext, MutationUpdaterFunction } from '@apollo/client';
import { ChannelAutomodSettingsInput, Exact, InputMaybe, Scalars } from '../../gen';
export declare const updateChannelModerationSettingsUpdateFunction: MutationUpdaterFunction<any, Exact<{
    channelId: Scalars['ID']['input'];
    banAppealsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    automod?: InputMaybe<ChannelAutomodSettingsInput>;
}>, DefaultContext, ApolloCache<any>>;
