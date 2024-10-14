import { gql } from '@apollo/client';
import { ButtonLink, Switch, useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { SettingsGroup, SettingsItem } from '../../SettingsGroup';
import { getSelectedVisibilities } from '../utils';

import {
  ProfilePageSettingsProfileFragment,
  ProfilePrivacySettingsVisibility,
  ProfileProfile,
  useProfilePrivacyChangeVisibilityMutation,
} from '@gen';

gql`
  fragment ProfilePageSettingsProfile on ProfileProfile {
    settings {
      privacy {
        visibility
      }
    }
  }

  mutation ProfilePrivacyChangeVisibility(
    $userId: ID
    $visibility: ProfilePrivacySettingsVisibility
  ) {
    updatePrivacySettings(userId: $userId, body: { visibility: $visibility }) {
      visibility
    }
  }
`;

interface Props {
  profile: ProfilePageSettingsProfileFragment;
  profilePagePath: string;
}

export function ProfilePageSettings({ profilePagePath, profile }: Props) {
  const { userId } = useAuthenticatedUser();

  const visibility = profile?.settings?.privacy.visibility;

  const selectedVisibilities = getSelectedVisibilities(visibility ?? null);

  const profileIsVisibleToEveryone = selectedVisibilities.includes(
    ProfilePrivacySettingsVisibility.VisibilityAll,
  );
  const profileIsVisibleToFriends = [
    ProfilePrivacySettingsVisibility.VisibilityAll,
    ProfilePrivacySettingsVisibility.VisibilityFriends,
  ].some((visibility) => selectedVisibilities.includes(visibility));

  const [changeVisibility] = useProfilePrivacyChangeVisibilityMutation({
    update(cache, _result, { variables }) {
      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment VisibilityUpdateProfile on ProfileProfile {
              userId
              settings {
                privacy {
                  visibility
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
              visibility: variables?.visibility ?? undefined,
            },
          },
        }),
      );
    },
  });

  const onVisibilityChange = (value: string) => {
    const changeVisibilityFn = (visibility: ProfilePrivacySettingsVisibility) =>
      changeVisibility({ variables: { userId, visibility } });

    if (value === ProfilePrivacySettingsVisibility.VisibilityAll) {
      // In case toggle value is all, and it is set, change value to friends
      if (visibility === value) {
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
        visibility === value ||
        visibility === ProfilePrivacySettingsVisibility.VisibilityAll
      ) {
        changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityOnlyMe);
        return;
      }

      // In case toggled value is friends, and it is not set, change value to it
      changeVisibilityFn(ProfilePrivacySettingsVisibility.VisibilityFriends);
      return;
    }
  };

  return (
    <SettingsGroup
      description="Who can see your profile page?"
      title="Profile page"
    >
      <SettingsGroup.Action>
        <ButtonLink
          level="secondary"
          size="sm"
          to={profilePagePath}
        >
          View profile page
        </ButtonLink>
      </SettingsGroup.Action>

      <SettingsItem state={profileIsVisibleToEveryone ? 'enabled' : 'disabled'}>
        <span>Everyone</span>

        <SettingsItem.Control>
          <Switch
            checked={profileIsVisibleToEveryone}
            label="Everyone can see your profile"
            labelType="hidden"
            onChange={() =>
              onVisibilityChange(ProfilePrivacySettingsVisibility.VisibilityAll)
            }
          />
        </SettingsItem.Control>
      </SettingsItem>

      <SettingsItem state={profileIsVisibleToFriends ? 'enabled' : 'disabled'}>
        <span>Friends</span>
        <SettingsItem.Control>
          <Switch
            checked={profileIsVisibleToFriends}
            label="Friends can see your profile"
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
