import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Icon,
  TooltipPortal,
  VisuallyHidden,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { MiniProfilePortal } from '@noice-com/social';
import classNames from 'classnames';
import { useRef, useState } from 'react';

import styles from './CardRowAvatar.module.css';

import { CardRowAvatarProfileFragment, FriendsFriendshipStatusStatus } from '@game-gen';
import { useStreamGame } from '@game-logic/game/context';
import { useCardGamePlayer, usePlayerScore } from '@game-logic/player/hooks';

gql`
  fragment CardRowAvatarProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatar2D
    }
    friendshipStatus {
      status
    }
  }
`;

interface Props {
  className?: string;
  player: CardRowAvatarProfileFragment;
}

export function CardRowAvatar({ className, player }: Props) {
  const { userId: playerId, avatars, userTag, friendshipStatus } = player;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [playerScore] = usePlayerScore(playerId);
  const cgPlayer = useCardGamePlayer(playerId);
  const { channelId } = useStreamGame();
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const { userId: localPlayerId } = useAuthenticatedUser();

  const isLocalPlayer = localPlayerId === playerId;
  const isFriend =
    friendshipStatus?.status === FriendsFriendshipStatusStatus.StatusFriend;

  const onClick = () => {
    setShowMiniProfile((prev) => !prev);
  };

  const avatarElement = (
    <div
      className={classNames(styles.circleAvatar, {
        [styles.missing]: !avatars?.avatar2D,
        [styles.offline]: !cgPlayer?.isOnline,
      })}
      style={{ backgroundImage: `url(${avatars?.avatar2D})` }}
    >
      {isFriend && (
        <Icon
          className={styles.friendIcon}
          icon={CoreAssets.Icons.PersonWithCheck}
        />
      )}
      <VisuallyHidden>{userTag}</VisuallyHidden>
    </div>
  );

  return (
    <div
      className={classNames(className, styles.buttonWrapper)}
      ref={tooltipRef}
    >
      {!isLocalPlayer ? (
        <button
          className={styles.button}
          ref={buttonRef}
          onClick={onClick}
        >
          {avatarElement}
        </button>
      ) : (
        avatarElement
      )}

      <TooltipPortal
        anchorRef={tooltipRef}
        className={styles.tooltipContent}
        disabled={showMiniProfile}
        placement="top"
      >
        {playerScore >= 0 && (
          <>
            <span className={styles.tooltipScore}>{playerScore}</span>
            <br />
          </>
        )}
        <span className={styles.tooltipName}>{userTag}</span>
      </TooltipPortal>

      <MiniProfilePortal
        anchor={buttonRef}
        channelId={channelId ?? undefined}
        placement="top-start"
        showMiniProfile={showMiniProfile}
        userId={playerId}
        onClose={() => setShowMiniProfile(false)}
      />
    </div>
  );
}

const Loading = function Loading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className={classNames(styles.circleAvatar, styles.loading)} />
    </div>
  );
};

CardRowAvatar.Loading = Loading;
