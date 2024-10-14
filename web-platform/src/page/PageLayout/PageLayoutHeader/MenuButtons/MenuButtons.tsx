import { gql } from '@apollo/client';
import { Breakpoint, CommonUtils, useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { DebugMenu } from '../DebugMenu';
import { HelpMenu } from '../HelpMenu';
import { NotificationPanel } from '../Notifications';

import styles from './MenuButtons.module.css';

import { MenuButtonsProfileFragment } from '@gen';

gql`
  fragment MenuButtonsProfile on ProfileProfile {
    ...DebugMenuProfile
    ...NotificationProfile
  }
`;

interface Props {
  profile: Nullable<MenuButtonsProfileFragment>;
}

export function MenuButtons({ profile }: Props) {
  const { isFullAccount } = useAuthentication();

  return (
    <div className={styles.menuButtons}>
      <Breakpoint
        query={`(min-width: ${CommonUtils.getRem(isFullAccount ? 600 : 1100)})`}
      >
        <DebugMenu profile={profile} />

        <HelpMenu />
      </Breakpoint>

      {isFullAccount && <NotificationPanel profile={profile} />}
    </div>
  );
}
