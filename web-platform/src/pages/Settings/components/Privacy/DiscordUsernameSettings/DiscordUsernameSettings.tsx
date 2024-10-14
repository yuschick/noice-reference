import { gql } from '@apollo/client';
import { ButtonLink, Switch, useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { SettingsGroup, SettingsItem } from '../../SettingsGroup';
import { getSelectedVisibilities } from '../utils';

import { Routes, SettingsRoutes } from '@common/route';
import {
  AuthIdentityType,
  DiscordUsernameSettingsProfileFragment,
  ProfilePrivacySettingsVisibility,
  ProfileProfile,
  useProfilePrivacyChangeDiscordIdVisibilityMutation,
} from '@gen';

gql`
  fragment DiscordUsernameSettingsProfile on ProfileProfile {
    account {
      externalIds {
        type
        id
      }
    }
    settings {
      privacy {
        discordUsernameVisibility
      }
    }
  }

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

interface Props {
  profile: DiscordUsernameSettingsProfileFragment;
}

export function DiscordUsernameSettings({ profile }: Props) {
  const { userId } = useAuthenticatedUser();

  const discordUsername = profile?.account?.externalIds.find(
    ({ type }) => type === AuthIdentityType.IdentityTypeDiscord,
  )?.id;

  const selectedDiscordIdVisibilities = getSelectedVisibilities(
    profile?.settings?.privacy.discordUsernameVisibility ?? null,
  );

  const discordIsVisibleToEveryone = selectedDiscordIdVisibilities.includes(
    ProfilePrivacySettingsVisibility.VisibilityAll,
  );
  const discordIsVisibleToFriends = [
    ProfilePrivacySettingsVisibility.VisibilityAll,
    ProfilePrivacySettingsVisibility.VisibilityFriends,
  ].some((visibility) => selectedDiscordIdVisibilities.includes(visibility));
  const discordIdVisibility = profile?.settings?.privacy.discordUsernameVisibility;

  const [changeDiscordIdVisibility] = useProfilePrivacyChangeDiscordIdVisibilityMutation({
    update(cache, _result, { variables }) {
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment DiscordIdVisibilityUpdateProfile on ProfileProfile {
              userId
              settings {
                privacy {
                  discordUsernameVisibility
                }
              }
            }
          `,
        },
        (existingProfile) => ({
          ...existingProfile,
          settings: {
            ...existingProfile?.settings,
            privacy: {
              ...existingProfile?.settings?.privacy,
              discordIdVisibility: variables?.discordUsernameVisibility,
            },
          },
        }),
      );
    },
  });

  const onVisibilityChange = (value: string) => {
    const changeVisibilityFn = (visibility: ProfilePrivacySettingsVisibility) =>
      changeDiscordIdVisibility({
        variables: { userId, discordUsernameVisibility: visibility },
      });

    if (value === ProfilePrivacySettingsVisibility.VisibilityAll) {
      // In case toggle value is all, and it is set, change value to friends
      if (discordIdVisibility === value) {
        changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityFriends);
        return changeVisibilityFn;
      }

      // In case toggled value is all, and it is not set, change value to it
      changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityAll);
      return;
    }

    if (value === ProfilePrivacySettingsVisibility.VisibilityFriends) {
      // In case toggle value is friends, and it or all is set, change value to only me
      if (
        discordIdVisibility === value ||
        discordIdVisibility === ProfilePrivacySettingsVisibility.VisibilityAll
      ) {
        changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityOnlyMe);
        return;
      }

      // In case toggled value is friends, and it is not set, change value to it
      changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityFriends);
      return;
    }
  };

  if (!discordUsername) {
    return null;
  }

  return (
    <SettingsGroup
      description="Who can see your discord username?"
      title="Discord username"
    >
      <SettingsGroup.Action>
        <ButtonLink
          level="secondary"
          size="sm"
          to={`${Routes.Settings}/${SettingsRoutes.Connections}`}
        >
          View connections
        </ButtonLink>
      </SettingsGroup.Action>

      <SettingsItem state={discordIsVisibleToEveryone ? 'enabled' : 'disabled'}>
        <span>Everyone</span>
        <SettingsItem.Control>
          <Switch
            checked={discordIsVisibleToEveryone}
            label="Everyone can see your Discord username"
            labelType="hidden"
            onChange={() =>
              onVisibilityChange(ProfilePrivacySettingsVisibility.VisibilityAll)
            }
          />
        </SettingsItem.Control>
      </SettingsItem>

      <SettingsItem state={discordIsVisibleToFriends ? 'enabled' : 'disabled'}>
        <span>Friends</span>
        <SettingsItem.Control>
          <Switch
            checked={discordIsVisibleToFriends}
            label="Friends can see your Discord username"
            labelType="hidden"
            onChange={() =>
              onVisibilityChange(ProfilePrivacySettingsVisibility.VisibilityFriends)
            }
          />
        </SettingsItem.Control>
      </SettingsItem>
    </SettingsGroup>
  );
}
