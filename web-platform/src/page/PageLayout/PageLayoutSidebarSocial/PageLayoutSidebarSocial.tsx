import { FriendsSidebarContent, FriendsView } from '@noice-com/social';

import styles from './PageLayoutSidebarSocial.module.css';

import { useStreamGame } from '@common/stream';

interface Props {
  onExpandSocialSidebarOnView(view: FriendsView): void;
}

export function PageLayoutSidebarSocial({ onExpandSocialSidebarOnView }: Props) {
  const { streamId } = useStreamGame();

  return (
    <aside
      aria-label="Social"
      className={styles.wrapper}
    >
      <div className={styles.sidebarContent}>
        <FriendsSidebarContent
          className={styles.friendsContent}
          isInStream={!!streamId}
          selectedView={FriendsView.Accepted}
          minimized
          onSelectView={onExpandSocialSidebarOnView}
        />
      </div>
    </aside>
  );
}
