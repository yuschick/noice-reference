import { useAuthentication } from '@noice-com/common-ui';

import { FriendsSidebarAddFriend } from '../FriendsSidebarAddFriend/FriendsSidebarAddFriend';
import { FriendsSidebarFriendsView } from '../FriendsSidebarFriendsView/FriendsSidebarFriendsView';
import { FriendsSidebarPendingView } from '../FriendsSidebarPendingView/FriendsSidebarPendingView';

import { FriendsView } from '@social-types';

interface Props {
  minimized?: boolean;
  selectedView: FriendsView;
  isInStream: boolean;
  className?: string;
  onSelectView(selectedView: FriendsView): void;
}

export function FriendsSidebarContent({
  minimized,
  selectedView,
  onSelectView,
  isInStream,
  className,
}: Props) {
  const { isFullAccount } = useAuthentication();

  const onAddFriendClick = () => {
    onSelectView(FriendsView.AddFriend);
  };

  const onPendingFriendsClick = () => {
    onSelectView(FriendsView.Pending);
  };

  const onBackButtonClick = () => {
    onSelectView(FriendsView.Accepted);
  };

  if (!isFullAccount) {
    return null;
  }

  if (minimized || selectedView === FriendsView.Accepted) {
    return (
      <FriendsSidebarFriendsView
        className={className}
        isInStream={isInStream}
        minimized={minimized}
        onAddFriendClick={onAddFriendClick}
        onPendingFriendsClick={onPendingFriendsClick}
      />
    );
  }

  if (selectedView === FriendsView.AddFriend) {
    return (
      <FriendsSidebarAddFriend
        className={className}
        onBackButtonClick={onBackButtonClick}
      />
    );
  }

  if (selectedView === FriendsView.Pending) {
    return (
      <FriendsSidebarPendingView
        className={className}
        onAddFriendClick={onAddFriendClick}
        onBackButtonClick={onBackButtonClick}
      />
    );
  }

  return <div>Not implemented</div>;
}
