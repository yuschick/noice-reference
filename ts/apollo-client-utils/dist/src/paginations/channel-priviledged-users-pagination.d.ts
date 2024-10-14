import { FieldPolicy, Reference } from '@apollo/client';
import { ChannelListChannelPrivilegedUsersResponse } from '../../gen';
type ExistingChannelPagination = (Omit<ChannelListChannelPrivilegedUsersResponse, 'users'> & {
    users: Record<string, Reference>;
}) | null;
type ResultChannelPagination = (Omit<ChannelListChannelPrivilegedUsersResponse, 'users'> & {
    users: Reference[];
}) | null;
type ChannelFieldPolicy = FieldPolicy<ExistingChannelPagination, ResultChannelPagination, ResultChannelPagination>;
export declare function channelPrivilegedUsersPagination(): ChannelFieldPolicy;
export {};
