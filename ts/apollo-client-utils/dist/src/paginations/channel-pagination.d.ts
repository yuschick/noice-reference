import { FieldPolicy, Reference } from '@apollo/client';
import { ChannelListChannelsResponse } from '../../gen';
type ExistingChannelPagination = (Omit<ChannelListChannelsResponse, 'channels'> & {
    channels: Record<string, Reference>;
}) | null;
type ResultChannelPagination = (Omit<ChannelListChannelsResponse, 'channels'> & {
    channels: Reference[];
}) | null;
type ChannelFieldPolicy = FieldPolicy<ExistingChannelPagination, ResultChannelPagination, ResultChannelPagination>;
export declare function channelPagination(): ChannelFieldPolicy;
export {};
