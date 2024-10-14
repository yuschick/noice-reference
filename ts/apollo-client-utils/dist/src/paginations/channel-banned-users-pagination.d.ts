import { FieldPolicy, Reference } from '@apollo/client';
import { ChannelListBannedUsersResponse } from '../../gen';
type ExistingChannelBannedUsersPagination = (Omit<ChannelListBannedUsersResponse, 'users'> & {
    users: Record<string, Reference>;
}) | null;
type ResultChannelBannedUsersPagination = (Omit<ChannelListBannedUsersResponse, 'users'> & {
    users: Reference[];
}) | null;
type ChannelBannedUsersFieldPolicy = FieldPolicy<ExistingChannelBannedUsersPagination, ResultChannelBannedUsersPagination, ResultChannelBannedUsersPagination>;
export declare function channelBannedUsersPagination(): ChannelBannedUsersFieldPolicy;
export {};
