import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  IconButton,
  PopoverMenu,
  VisuallyHidden,
  useAuthenticatedUser,
  usePopoverMenu,
} from '@noice-com/common-ui';

import { useFriendsAnalytics } from '../hooks/useFriendsAnalytics.hook';

import { useFriendsSidebarMenuPendingRequestsQuery } from '@social-gen';
import { usePlaySound } from '@social-hooks';
import { FriendsView, SocialSoundKeys } from '@social-types';

interface Props {
  selectedFriendsView: FriendsView;
  onSelectFriendsView(view: FriendsView): void;
}

const menuItems = [FriendsView.Accepted, FriendsView.Pending, FriendsView.AddFriend];

gql`
  query FriendsSidebarMenuPendingRequests($userId: ID!) {
    receivedFriendRequests(userId: $userId) {
      users {
        userId
      }
    }
  }
`;
// @todo: this component needs some love, to close the menu when clicking outside of it and just trying to make it more accessible in general
export function FriendsSidebarMenu({ selectedFriendsView, onSelectFriendsView }: Props) {
  const { userId } = useAuthenticatedUser();
  const [playButtonClickSound] = usePlaySound(SocialSoundKeys.ButtonClickConfirm);
  const { sendFriendMenuOpenedEvent } = useFriendsAnalytics();
  const popover = usePopoverMenu({ placement: 'bottom-end' });

  const onClick = () => {
    popover.actions.toggle();

    if (!popover.state.popoverMenuIsOpen) {
      sendFriendMenuOpenedEvent();
    }
  };

  const onMenuButtonClick = (view: FriendsView) => {
    onSelectFriendsView(view);
    playButtonClickSound();
  };

  const { data } = useFriendsSidebarMenuPendingRequestsQuery({
    variables: { userId },
  });

  const pendingRequestsAmount = data?.receivedFriendRequests?.users.length ?? 0;
  const hasPendingRequests = !!pendingRequestsAmount;

  return (
    <div>
      <IconButton
        icon={CoreAssets.Icons.Menu}
        label="Open menu"
        level="secondary"
        ref={popover.state.popoverMenuTriggerRef}
        shape="sharp"
        size="lg"
        onClick={onClick}
      />

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          {menuItems
            .filter((item) => item !== selectedFriendsView)
            .map((item) => (
              <PopoverMenu.Button
                key={item}
                onClick={() => onMenuButtonClick(item)}
              >
                {item}
                {hasPendingRequests && item === FriendsView.Pending && (
                  <VisuallyHidden>({pendingRequestsAmount} open)</VisuallyHidden>
                )}
              </PopoverMenu.Button>
            ))}
        </PopoverMenu.Section>
      </PopoverMenu>
    </div>
  );
}
