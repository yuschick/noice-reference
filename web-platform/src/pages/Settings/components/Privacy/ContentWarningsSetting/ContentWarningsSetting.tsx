import { gql } from '@apollo/client';
import { Switch, useAuthenticatedUser } from '@noice-com/common-ui';

import { SettingsGroup, SettingsItem } from '../../SettingsGroup';

import { useConsentWarningSettingMutation } from '@common/user-settings';
import { ContentWarningSettingProfileFragment } from '@gen';

gql`
  fragment ContentWarningSettingProfile on ProfileProfile {
    settings {
      privacy {
        showMatureContentWarning
      }
    }
    account {
      uid
      matureRatedContentAllowed
    }
  }
`;

interface Props {
  profile: ContentWarningSettingProfileFragment;
}

export function ContentWarningsSetting({ profile }: Props) {
  const { userId } = useAuthenticatedUser();

  const matureRatedContentAllowed = profile.account?.matureRatedContentAllowed ?? false;
  const showContentWarning = profile.settings?.privacy.showMatureContentWarning ?? true;

  const [updateContentWarningSetting, { loading }] = useConsentWarningSettingMutation({
    variables: {
      showMatureContentWarning: !showContentWarning,
      userId,
    },
  });

  // Do not show setting if mature rated content is not allowed
  if (!matureRatedContentAllowed) {
    return null;
  }

  return (
    <SettingsGroup
      description="Do you want to receive a warning message before entering a channel with mature or positively sensitive content?"
      title="Content Warnings"
    >
      <SettingsItem state={showContentWarning ? 'enabled' : 'disabled'}>
        <span>Alway show warning message</span>
        <SettingsItem.Control>
          <Switch
            checked={showContentWarning}
            isLoading={loading}
            label="Always show warning message"
            labelType="hidden"
            onChange={() => updateContentWarningSetting()}
          />
        </SettingsItem.Control>
      </SettingsItem>
    </SettingsGroup>
  );
}
