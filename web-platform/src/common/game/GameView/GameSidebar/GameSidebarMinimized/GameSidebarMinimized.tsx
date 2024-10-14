import { gql } from '@apollo/client';
import { FriendsSidebarContent, FriendsView } from '@noice-com/social';

import { SidebarChannelLogo } from '../SidebarChannelLogo/SidebarChannelLogo';

import styles from './GameSidebarMinimized.module.css';

import { useSocialSidebarState } from '@common/page';
import { GameSidebarMinimizedChannelFragment } from '@gen';

interface Props {
  channel: GameSidebarMinimizedChannelFragment;
}

export function GameSidebarMinimized({ channel }: Props) {
  const { onExpandSocialSidebarOnView } = useSocialSidebarState();

  const onSelectFriendView = (view: FriendsView) => {
    onExpandSocialSidebarOnView(view);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <SidebarChannelLogo
          {...channel}
          mini
        />
      </div>

      <FriendsSidebarContent
        selectedView={FriendsView.Accepted}
        isInStream
        minimized
        onSelectView={onSelectFriendView}
      />
    </div>
  );
}

GameSidebarMinimized.Loading = () => (
  <div>
    <SidebarChannelLogo.Loading />

    <div className={styles.divider} />
  </div>
);

GameSidebarMinimized.fragment = {
  channel: gql`
    fragment GameSidebarMinimizedChannel on ChannelChannel {
      ...SidebarChannelLogo
    }
    ${SidebarChannelLogo.fragment.entry}
  `,
};
