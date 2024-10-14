import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Nullable } from '@noice-com/utils';

import {
  AuthIdentityType,
  ProfilePrivacySettingsVisibility,
  useProfilePrivacyChangeDiscordIdVisibilityMutation,
  useProfilePrivacyChangeVisibilityMutation,
  useProfilePrivacySettingsQuery,
  useUserPrivacyViewQuery,
} from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';

gql`
  mutation ProfilePrivacyChangeVisibility(
    $userId: ID
    $visibility: ProfilePrivacySettingsVisibility
  ) {
    updatePrivacySettings(userId: $userId, body: { visibility: $visibility }) {
      visibility
    }
  }
`;

gql`
  mutation ProfilePrivacyChangeDiscordIdVisibility(
    $userId: ID
    $discordUsernameVisibility: ProfilePrivacySettingsVisibility
  ) {
    updatePrivacySettings(
      userId: $userId
      body: { discordUsernameVisibility: $discordUsernameVisibility }
    ) {
      discordUsernameVisibility
    }
  }
`;

const getSelectedVisibilities = (
  visibility: Nullable<ProfilePrivacySettingsVisibility>,
) => {
  if (visibility === ProfilePrivacySettingsVisibility.VisibilityFriends) {
    return [ProfilePrivacySettingsVisibility.VisibilityFriends];
  }

  if (visibility === ProfilePrivacySettingsVisibility.VisibilityAll) {
    return [
      ProfilePrivacySettingsVisibility.VisibilityFriends,
      ProfilePrivacySettingsVisibility.VisibilityAll,
    ];
  }

  return [];
};

export const usePrivacyVisibility = () => {
  const { userId } = useAuth();

  const { data } = useProfilePrivacySettingsQuery({
    variables: {
      userId,
    },
  });

  const { data: accountData } = useUserPrivacyViewQuery({
    ...variablesOrSkip({ userId }),
  });

  const visibility = data?.profile?.settings?.privacy?.visibility;
  const discordIdVisibility = data?.profile?.settings?.privacy?.discordUsernameVisibility;

  const [mutateChangeVisibility] = useProfilePrivacyChangeVisibilityMutation({
    update(cache, { data: newData }) {
      cache.modify({
        id: cache.identify({ __typename: 'ProfileProfile', userId }),
        fields: {
          settings(existingSettings) {
            return {
              ...existingSettings,
              privacy: {
                ...existingSettings.privacy,
                visibility: newData?.updatePrivacySettings?.visibility,
              },
            };
          },
        },
      });
    },
    optimisticResponse(vars) {
      return {
        __typename: 'Mutation',
        updatePrivacySettings: {
          __typename: 'ProfilePrivacySettings',
          visibility:
            vars.visibility ?? ProfilePrivacySettingsVisibility.VisibilityOnlyMe,
        },
      };
    },
  });

  const [mutateChangeDiscordVisibility] =
    useProfilePrivacyChangeDiscordIdVisibilityMutation({
      update(cache, { data: newData }) {
        cache.modify({
          id: cache.identify({ __typename: 'ProfileProfile', userId }),
          fields: {
            settings(existingSettings) {
              return {
                ...existingSettings,
                privacy: {
                  ...existingSettings.privacy,
                  discordUsernameVisibility:
                    newData?.updatePrivacySettings?.discordUsernameVisibility,
                },
              };
            },
          },
        });
      },
      optimisticResponse(vars) {
        return {
          __typename: 'Mutation',
          updatePrivacySettings: {
            __typename: 'ProfilePrivacySettings',
            discordUsernameVisibility:
              vars.discordUsernameVisibility ??
              ProfilePrivacySettingsVisibility.VisibilityOnlyMe,
          },
        };
      },
    });

  const changeVisibility = (value: string, type: 'discord-id' | 'profile') => {
    let currentVisibilityVal: string | undefined;
    let changeVisibilityFn;

    if (type === 'discord-id') {
      changeVisibilityFn = (changedVisibility: ProfilePrivacySettingsVisibility) =>
        mutateChangeDiscordVisibility({
          variables: { userId, discordUsernameVisibility: changedVisibility },
        });
      currentVisibilityVal = discordIdVisibility;
    } else {
      changeVisibilityFn = (changedVisibility: ProfilePrivacySettingsVisibility) =>
        mutateChangeVisibility({ variables: { userId, visibility: changedVisibility } });
      currentVisibilityVal = visibility;
    }

    if (value === ProfilePrivacySettingsVisibility.VisibilityAll) {
      // In case toggle value is all, and it is set, change value to friends
      if (currentVisibilityVal === value) {
        changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityFriends);
        return;
      }

      // In case toggled value is all, and it is not set, change value to it
      changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityAll);
      return;
    }

    if (value === ProfilePrivacySettingsVisibility.VisibilityFriends) {
      // In case toggle value is friends, and it or all is set, change value to only me
      if (
        currentVisibilityVal === value ||
        currentVisibilityVal === ProfilePrivacySettingsVisibility.VisibilityAll
      ) {
        changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityOnlyMe);
        return;
      }

      // In case toggled value is friends, and it is not set, change value to it
      changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityFriends);
      return;
    }
  };

  const selectedVisibilities = getSelectedVisibilities(visibility ?? null);
  const selectedDiscordIdVisibilities = getSelectedVisibilities(
    discordIdVisibility ?? null,
  );

  const isDiscordConnected = accountData?.profile?.account?.externalIds.find(
    ({ type }) => type === AuthIdentityType.IdentityTypeDiscord,
  );

  const profileIsVisibleToEveryone = selectedVisibilities.includes(
    ProfilePrivacySettingsVisibility.VisibilityAll,
  );
  const profileIsVisibleToFriends = [
    ProfilePrivacySettingsVisibility.VisibilityAll,
    ProfilePrivacySettingsVisibility.VisibilityFriends,
  ].some((v) => selectedVisibilities.includes(v));

  const discordIsVisibleToEveryone = selectedDiscordIdVisibilities.includes(
    ProfilePrivacySettingsVisibility.VisibilityAll,
  );
  const discordIsVisibleToFriends = [
    ProfilePrivacySettingsVisibility.VisibilityAll,
    ProfilePrivacySettingsVisibility.VisibilityFriends,
  ].some((v) => selectedDiscordIdVisibilities.includes(v));

  return {
    changeVisibility,
    isDiscordConnected,
    discordIsVisibleToFriends,
    discordIsVisibleToEveryone,
    profileIsVisibleToFriends,
    profileIsVisibleToEveryone,
  };
};
