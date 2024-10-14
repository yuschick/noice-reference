import { FieldPolicy, Reference } from '@apollo/client';
import { ProfileListProfilesResponse } from '../../gen';
type ExistingProfilePagination = (Omit<ProfileListProfilesResponse, 'profiles'> & {
    profiles: Record<string, Reference>;
}) | null;
type ResultProfilePagination = (Omit<ProfileListProfilesResponse, 'profiles'> & {
    profiles: Reference[];
}) | null;
type ProfileFieldPolicy = FieldPolicy<ExistingProfilePagination, ResultProfilePagination, ResultProfilePagination>;
export declare function profilePagination(): ProfileFieldPolicy;
export {};
