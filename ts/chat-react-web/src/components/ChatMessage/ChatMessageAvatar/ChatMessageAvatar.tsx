import { FontSize, ProfileImage } from '@noice-com/common-ui';

import styles from './ChatMessageAvatar.module.css';

import { ProfileImageProfileFragment } from '@chat-gen';

interface Props {
  avatar2D: string;
  username: string;
  fontSize: FontSize;
  isOwnMessage: boolean;
  miniProfileOpen: boolean;
  onAvatarClick: () => void;
}

const profileImageSizeMap: Record<FontSize, 'xs' | 'sm' | undefined> = {
  small: 'xs',
  medium: 'xs',
  large: 'sm',
};

export function ChatMessageAvatar({
  avatar2D,
  username,
  isOwnMessage,
  miniProfileOpen,
  onAvatarClick,
  fontSize,
}: Props) {
  const profile: ProfileImageProfileFragment = {
    avatars: {
      avatar2D,
    },
    userTag: username,
  };

  if (isOwnMessage) {
    return (
      <ProfileImage
        profile={profile}
        size={profileImageSizeMap[fontSize]}
      />
    );
  }

  return (
    <button
      aria-expanded={miniProfileOpen ? 'true' : 'false'}
      aria-haspopup="dialog"
      className={styles.button}
      onClick={onAvatarClick}
    >
      <ProfileImage
        profile={profile}
        size={profileImageSizeMap[fontSize]}
      />
    </button>
  );
}
