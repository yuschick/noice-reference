import { FieldPolicy, Reference } from '@apollo/client';

import { ProfileListProfilesResponse } from '../../gen';

type ExistingProfilePagination =
  | (Omit<ProfileListProfilesResponse, 'profiles'> & {
      profiles: Record<string, Reference>;
    })
  | null;

type ResultProfilePagination =
  | (Omit<ProfileListProfilesResponse, 'profiles'> & {
      profiles: Reference[];
    })
  | null;

type ProfileFieldPolicy = FieldPolicy<
  ExistingProfilePagination,
  ResultProfilePagination,
  ResultProfilePagination
>;

export function profilePagination(): ProfileFieldPolicy {
  return {
    keyArgs: ['liveStatus'],
    read(existing) {
      if (existing) {
        return {
          ...existing,
          profiles: Object.values(existing.profiles),
        };
      }
    },

    merge(existing, incoming, { readField }) {
      if (!incoming) {
        return existing || null;
      }

      const profiles: Record<string, Reference> = existing
        ? { ...existing.profiles }
        : {};

      incoming.profiles.forEach((profile) => {
        profiles[readField('userId', profile) as string] = profile;
      });

      return {
        ...incoming,
        profiles,
      };
    },
  };
}
