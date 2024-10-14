import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { Booster, BoosterType } from '@noice-com/card-game';
import { CommonUtils, ProfileImage } from '@noice-com/common-ui';
import React, { useRef, useState } from 'react';

import styles from './CardEventMessage.module.css';
import { useGroupEventsBoosterData, useGroupEventsPlayerProfile } from './hooks';
import { FloatingCard } from './Shared';

import { ProfilePresenceStatus, useBoosterScoredCardQuery } from '@gen';

export function MissingCardPopup(): JSX.Element {
  return <div className={styles.missingCardWrapper}>Missing card data</div>;
}

export interface Props {
  id?: string;
  playerName: string;
  playerColor: string;

  playerId: string;
  playerAvatar: string;
  playerOnlineStatus: ProfilePresenceStatus;
  boosterId: BoosterType;
  boosterName: string;
  points: number;
  renderHoverElement: (
    show: boolean,
    ref: React.RefObject<HTMLElement>,
  ) => JSX.Element | null;
}

export function BoosterScoredMessage({
  id,
  playerName,
  playerColor,
  playerId,
  playerAvatar,
  playerOnlineStatus,
  boosterId,
  boosterName,
  points,
  renderHoverElement,
}: Props) {
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
            {` scored `}
            <span className={styles.scoreLabel}>{`${points} points`}</span>
            {` with the`}
            <Booster
              boosterId={boosterId}
              className={styles.booster}
            />
            <span className={styles.descriptionLabel}>{boosterName}</span> booster
          </span>
        </div>
      </div>
      {renderHoverElement(showHoverElement, ref)}
    </>
  );
}

interface WithDataProps {
  id?: string;
  boosterOwnerId: string;
  cardId?: string;
  boosterId: BoosterType;
  points: number;
}

gql`
  query BoosterScoredCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        ...GameCard
      }
    }
  }
`;

export function BoosterScoredMessageWithData({
  id,
  boosterOwnerId,
  cardId,
  boosterId,
  points,
}: WithDataProps) {
  const player = useGroupEventsPlayerProfile(boosterOwnerId);
  const booster = useGroupEventsBoosterData(boosterId);

  const { data } = useBoosterScoredCardQuery({
    ...variablesOrSkip({ cardId }),
  });
  const card = data?.gameCards?.cards[0] ?? null;

  const hoverElement: Props['renderHoverElement'] = card
    ? (show, ref) => (
        <FloatingCard
          cardData={card}
          containerRef={ref}
          points={card.pointsMin}
          show={show}
        />
      )
    : () => <MissingCardPopup />;

  if (!player || !player.avatars) {
    return null;
  }

  return (
    <BoosterScoredMessage
      boosterId={boosterId}
      boosterName={booster?.name ?? 'Missing booster'}
      id={id}
      playerAvatar={player.avatars.avatar2D}
      playerColor={player.preferredColor}
      playerId={player.userId}
      playerName={player.userTag}
      playerOnlineStatus={player.onlineStatus}
      points={points}
      renderHoverElement={hoverElement}
    />
  );
}
