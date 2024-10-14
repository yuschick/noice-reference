import { FieldPolicy, Reference } from '@apollo/client';
import { FriendsListFriendsResponse } from '../../gen';
type ExistingFriendsPagination = (Omit<FriendsListFriendsResponse, 'users'> & {
    users: Reference[];
}) | null;
type ResultFriendsPagination = (Omit<FriendsListFriendsResponse, 'users'> & {
    users: Reference[];
}) | null;
type FriendsFieldPolicy = FieldPolicy<ExistingFriendsPagination, ResultFriendsPagination, ResultFriendsPagination>;
export declare function friendsPagination(): FriendsFieldPolicy;
export {};
