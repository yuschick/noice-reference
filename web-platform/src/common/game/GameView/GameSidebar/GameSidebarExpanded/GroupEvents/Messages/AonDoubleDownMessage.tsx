import { gql } from '@apollo/client';
import { parseDescription } from '@noice-com/card-game';
import { CommonUtils, ProfileImage } from '@noice-com/common-ui';
import React, { useRef, useState } from 'react';
import { CgChevronDoubleDownO } from 'react-icons/cg';

import styles from './CardEventMessage.module.css';
import { useGroupEventsPlayerProfile } from './hooks';
import { FloatingCard } from './Shared';

import { ProfilePresenceStatus, useAonDoubleDownCardQuery } from '@gen';

export interface Props {
  id?: string;
  playerName: string;
  playerColor: string;
  playerId: string;
  playerAvatar: string;
  playerOnlineStatus: ProfilePresenceStatus;
  cardDescription: string;
  attempt: number;
  maxTries: number;
  renderHoverElement: (
    show: boolean,
    ref: React.RefObject<HTMLElement>,
  ) => JSX.Element | null;
}

export function AonDoubleDownMessage({
  id,
  playerName,
  playerColor,
  playerId,
  playerAvatar,
  playerOnlineStatus,
  cardDescription,
  attempt,
  maxTries,
  renderHoverElement,
}: Props): JSX.Element {
  const [showHoverElement, setShowHoverElement] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className={styles.cardEventMessage}
        key={id}
        ref={ref}
        onMouseEnter={() => setShowHoverElement(true)}
        onMouseLeave={() => setShowHoverElement(false)}
      >
        <ProfileImage
          profile={{
            userTag: playerName,
            avatars: { avatar2D: playerAvatar },
            onlineStatus: playerOnlineStatus,
          }}
          size="xs"
        />
        <div className={styles.messageTextContainer}>
          <span className={styles.messageContent}>
            <span
              style={{
                color: CommonUtils.getUserIdColor({
                  preferredColor: playerColor,
                  userId: playerId,
                }),
              }}
            >
              {playerName}
            </span>
            {` is `}
            <div className={styles.doubleDownIcon}>
              <CgChevronDoubleDownO className={styles.doubleDownIconSvg} />
            </div>
            {` Doubling Down on their `}
            <span className={styles.descriptionLabel}>{cardDescription}</span>
            {` card (double down ${attempt} of ${maxTries})`}
          </span>
        </div>
      </div>
      {renderHoverElement(showHoverElement, ref)}
    </>
  );
}

interface WithDataProps {
  id?: string;
  cardOwnerId: string;
  cardId: string;
  attempt: number;
  maxTries: number;
}

gql`
  query AonDoubleDownCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        ...GameCard
      }
    }
  }
`;

export function AonDoubleDownMessageWithData({
  id,
  cardOwnerId,
  cardId,
  attempt,
  maxTries,
}: WithDataProps) {
  const player = useGroupEventsPlayerProfile(cardOwnerId);

  const { data } = useAonDoubleDownCardQuery({
    variables: {
      cardId,
    },
  });
  const card = data?.gameCards?.cards[0] ?? null;

  if (!player || !player.avatars || !card) {
    return null;
  }

  return (
    <AonDoubleDownMessage
      attempt={attempt}
      cardDescription={parseDescription(card)}
      id={id}
      maxTries={maxTries}
      playerAvatar={player.avatars.avatar2D}
      playerColor={player.preferredColor}
      playerId={player.userId}
      playerName={player.userTag}
      playerOnlineStatus={player.onlineStatus}
      renderHoverElement={(show, ref) => (
        <FloatingCard
          cardData={card}
          containerRef={ref}
          points={card.pointsMin}
          show={show}
        />
      )}
    />
  );
}
