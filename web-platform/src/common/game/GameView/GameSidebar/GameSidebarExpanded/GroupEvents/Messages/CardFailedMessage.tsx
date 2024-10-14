import { gql } from '@apollo/client';
import { ActivatedBooster, parseDescription } from '@noice-com/card-game';
import { ProfileImage, CommonUtils } from '@noice-com/common-ui';
import React, { useRef, useState } from 'react';

import styles from './CardEventMessage.module.css';
import { useGroupEventsPlayerProfile } from './hooks';
import { InlineBoosterList, InlineBoosterProps } from './InlineActivatedBooster';
import { FloatingCard } from './Shared';

import { ProfilePresenceStatus, useCardFailedBoostersQuery } from '@gen';

export interface Props {
  id?: string;
  playerName: string;
  playerColor: string;
  playerId: string;
  playerAvatar: string;
  playerOnlineStatus: ProfilePresenceStatus;
  cardDescription: string;
  boosters: InlineBoosterProps[];
  renderHoverElement: (
    show: boolean,
    ref: React.RefObject<HTMLElement>,
  ) => JSX.Element | null;
}

export function CardFailedMessage({
  id,
  playerName,
  playerColor,
  playerId,
  playerAvatar,
  playerOnlineStatus,
  cardDescription,
  boosters = [],
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
            &apos;s{' card '}
            <span className={styles.descriptionLabel}>{cardDescription}</span>
            {' failed'}
          </span>
          <InlineBoosterList boosters={boosters} />
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
  boosters?: ActivatedBooster[];
}

gql`
  query CardFailedBoosters($cardId: String!) {
    boosters {
      boosters {
        id
        name
      }
    }
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        ...GameCard
      }
    }
  }
`;

export function CardFailedMessageWithData({
  id,
  cardOwnerId,
  cardId,
  boosters = [],
}: WithDataProps) {
  const player = useGroupEventsPlayerProfile(cardOwnerId);

  const { data } = useCardFailedBoostersQuery({
    variables: {
      cardId,
    },
  });

  const boosterData = data?.boosters?.boosters ?? [];
  const card = data?.gameCards?.cards[0] ?? null;

  const playerAvatar = player?.avatars?.avatar2D;

  if (!player || !playerAvatar || !boosterData.length || !card) {
    return null;
  }

  const activatedBoosters = boosters.map<InlineBoosterProps>((boosterPoints) => ({
    playerAvatar: playerAvatar,
    boosterName:
      boosterData.find((booster) => booster.id === boosterPoints.booster)?.name ??
      'Missing booster',
    boosterType: boosterPoints.booster,
    points: boosterPoints.points,
  }));

  return (
    <CardFailedMessage
      boosters={activatedBoosters}
      cardDescription={parseDescription(card)}
      id={id}
      playerAvatar={playerAvatar}
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
