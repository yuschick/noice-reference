import { gql } from '@apollo/client';
import { Switch, useAuthenticatedUser } from '@noice-com/common-ui';
import { DeepPartial } from '@noice-com/utils';

import { SettingsGroup, SettingsItem } from '../../SettingsGroup';

import {
  FriendRequestSettingProfileFragment,
  ProfileProfile,
  useProfilePrivacyFriendSettingsMutation,
} from '@gen';

gql`
  fragment FriendRequestSettingProfile on ProfileProfile {
    settings {
      friends {
        disableFriendRequests
      }
    }
  }

  mutation ProfilePrivacyFriendSettings($userId: ID, $disableFriendRequests: Boolean) {
    updateFriendsSettings(
      userId: $userId
      body: { disableFriendRequests: $disableFriendRequests }
    ) {
      disableFriendRequests
    }
  }
`;

interface Props {
  profile: FriendRequestSettingProfileFragment;
}

export function FriendRequestSetting({ profile }: Props) {
  const { userId } = useAuthenticatedUser();

  const allowFriendRequest = !profile?.settings?.friends.disableFriendRequests;

  const [toggleDisableFriendRequest, { loading }] =
    useProfilePrivacyFriendSettingsMutation({
      variables: {
        userId,
        disableFriendRequests: !!allowFriendRequest,
      },
      update(cache, _result, { variables }) {
        cache.updateFragment<DeepPartial<ProfileProfile>>(
          {
            id: cache.identify({ userId, __typename: 'ProfileProfile' }),
            fragment: gql`
              fragment DisabledFriendRequestUpdateProfile on ProfileProfile {
                userId
                settings {
                  friends {
                    disableFriendRequests
                  }
                }
              }
            `,
          },
          (existingProfile) => ({
            ...existingProfile,
            settings: {
              ...existingProfile?.settings,
              friends: {
                ...existingProfile?.settings?.friends,
                disableFriendRequests: variables?.disableFriendRequests ?? undefined,
              },
            },
          }),
        );
      },
    });

  return (
    <SettingsGroup
      description="Can others send you a friend request?"
      title="Friend Requests"
    >
      <SettingsItem state={allowFriendRequest ? 'enabled' : 'disabled'}>
        <span>Allow friend requests</span>

        <SettingsItem.Control>
          <Switch
            checked={allowFriendRequest}
            isLoading={loading}
            label="Friend Requests"
            labelType="hidden"
            onChange={() => toggleDisableFriendRequest()}
          />
        </SettingsItem.Control>
      </SettingsItem>
    </SettingsGroup>
  );
}
