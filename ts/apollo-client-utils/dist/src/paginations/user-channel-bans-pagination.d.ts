import { FieldPolicy, Reference } from '@apollo/client';
import { ChannelListUserChannelBansResponse } from '../../gen';
type ExistingUserChannelBansPagination = (Omit<ChannelListUserChannelBansResponse, 'bans'> & {
    bans: Record<string, Reference>;
}) | null;
type ResultUserChannelBansPagination = (Omit<ChannelListUserChannelBansResponse, 'bans'> & {
    bans: Reference[];
}) | null;
type UserChannelBansFieldPolicy = FieldPolicy<ExistingUserChannelBansPagination, ResultUserChannelBansPagination, ResultUserChannelBansPagination>;
export declare function userChannelBansPagination(): UserChannelBansFieldPolicy;
export {};
