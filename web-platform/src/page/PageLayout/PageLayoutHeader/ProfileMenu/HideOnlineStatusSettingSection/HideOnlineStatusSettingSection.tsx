import { gql } from '@apollo/client';
import { Switch } from '@noice-com/common-ui';

import styles from './HideOnlineStatusSettingSection.module.css';

import { useHideOnlineStatusSettingMutation } from '@common/user-settings';
import { HideOnlineStatusSettingSectionProfileFragment } from '@gen';

gql`
  fragment HideOnlineStatusSettingSectionProfile on ProfileProfile {
    settings {
      privacy {
        hideOnlineStatus
      }
    }
  }
`;

interface Props {
  profile: HideOnlineStatusSettingSectionProfileFragment;
}

export function HideOnlineStatusSettingSection({ profile }: Props) {
  const { settings } = profile;
  const hideOnlineStatus = !!settings?.privacy?.hideOnlineStatus;

  const [changeHideOnlineStatus, { loading: hideOnlineStatusLoading }] =
    useHideOnlineStatusSettingMutation({
      variables: {
        hideOnlineStatus: !hideOnlineStatus,
      },
    });

  return (
    <div className={styles.hideOnlineStatusSetting}>
      <span>Show as online</span>

      <Switch
        checked={!hideOnlineStatus}
        isLoading={hideOnlineStatusLoading}
        label="Show as online"
        labelType="hidden"
        onChange={() => changeHideOnlineStatus()}
      />
    </div>
  );
}

HideOnlineStatusSettingSection.Loading = () => {
  return (
    <div className={styles.hideOnlineStatusSetting}>
      <span>Show as online</span>

      <Switch
        checked={false}
        label="Show as online"
        labelType="hidden"
        isLoading
        onChange={() => {}}
      />
    </div>
  );
};
