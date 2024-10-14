import { To } from 'react-router-dom';

interface FriendsSidebarFriendPanelButton {
  type: 'button';
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

interface FriendsSidebarFriendPanelButtonLink {
  type: 'buttonLink';
  text: string;
  to: To;
}

export type FriendsSidebarFriendPanelAction =
  | FriendsSidebarFriendPanelButton
  | FriendsSidebarFriendPanelButtonLink;
