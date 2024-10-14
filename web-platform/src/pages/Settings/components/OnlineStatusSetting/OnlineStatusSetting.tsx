import { gql } from '@apollo/client';
import { Switch } from '@noice-com/common-ui';

import { SettingsGroup, SettingsItem } from '../SettingsGroup';

import { useHideOnlineStatusSettingMutation } from '@common/user-settings';
import { OnlineStatusSettingProfileFragment } from '@gen';

gql`
  fragment OnlineStatusSettingProfile on ProfileProfile {
    settings {
      privacy {
        hideOnlineStatus
      }
    }
  }
`;

interface Props {
  profile: OnlineStatusSettingProfileFragment;
}

export function OnlineStatusSetting({ profile }: Props) {
  const hideOnlineStatus = !!profile?.settings?.privacy.hideOnlineStatus;

  const [toggleHideOnlineStatus, { loading: hideOnlineStatusLoading }] =
    useHideOnlineStatusSettingMutation({
      variables: {
        hideOnlineStatus: !hideOnlineStatus,
      },
    });

  return (
    <SettingsGroup
      description="Who can see if you're online?"
      title="Online Status"
    >
      <SettingsItem state={hideOnlineStatus ? 'disabled' : 'enabled'}>
        <span>Everyone</span>

        <SettingsItem.Control>
          <Switch
            checked={!hideOnlineStatus}
            isLoading={hideOnlineStatusLoading}
            label="Online status"
            labelType="hidden"
            onChange={() => toggleHideOnlineStatus()}
          />
        </SettingsItem.Control>
      </SettingsItem>
    </SettingsGroup>
  );
}
