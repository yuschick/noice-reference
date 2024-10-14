import { gql } from '@apollo/client';
import { ActivatedBooster, parseDescription } from '@noice-com/card-game';
import { ProfileImage, CommonUtils } from '@noice-com/common-ui';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { RiMedal2Fill } from 'react-icons/ri';

import styles from './CardEventMessage.module.css';
import { useGroupEventsPlayerProfile } from './hooks';
import { InlineBoosterList, InlineBoosterProps } from './InlineActivatedBooster';
import { FloatingCard } from './Shared';

import { ProfilePresenceStatus, useCardSuccessDataQuery } from '@gen';

export interface Props {
  id?: string;
  playerName: string;
  playerColor: string;
  playerId: string;
  playerAvatar: string;
  playerOnlineStatus: ProfilePresenceStatus;
  cardDescription: string;
  points: number;
  isBestPlay?: boolean;
  boosters: InlineBoosterProps[];
  isStreamer: boolean;
  channelName: string;
  excludeBestPlays?: boolean;
  renderHoverElement: (
    show: boolean,
    ref: React.RefObject<HTMLElement>,
  ) => JSX.Element | null;
}

export function CardSuccessMessage({
  id,
  playerName,
  playerColor,
  playerId,
  playerAvatar,
  playerOnlineStatus,
  cardDescription,
  points,
  isBestPlay,
  isStreamer,
  channelName,
  boosters = [],
  excludeBestPlays,
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
              {playerName}{' '}
            </span>
            scored <span className={styles.scoreLabel}>{`${points} points`}</span> with{' '}
            <span
              className={classNames(styles.descriptionLabel, {
                [styles.isStreamer]: isStreamer,
              })}
            >
              {cardDescription}
            </span>{' '}
            {isStreamer ? (
              <span className={styles.streamerLabel}>({channelName})</span>
            ) : (
              'card'
            )}
            {isBestPlay && !excludeBestPlays && (
              <>
                {' and recorded a '}
                <div className={styles.bestPlayIcon}>
                  <RiMedal2Fill className={styles.bestPlayIconSvg} />
                </div>
                <span className={styles.bestPlayLabel}>New Best Play</span>
              </>
            )}
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
  points: number;
  isBestPlay?: boolean;
  boosters?: ActivatedBooster[];
  streamer?: string;
  excludeBestPlays?: boolean;
}

gql`
  query CardSuccessData($cardId: String!) {
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
        activeStreamerCard {
          channel {
            id
            streamer {
              userId
            }
            name
          }
        }
      }
    }
  }
`;

export function CardSuccessMessageWithData({
  id,
  cardOwnerId,
  cardId,
  points,
  isBestPlay,
  boosters = [],
  excludeBestPlays,
}: WithDataProps) {
  const player = useGroupEventsPlayerProfile(cardOwnerId);

  const { data } = useCardSuccessDataQuery({
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
    playerAvatar,
    boosterName:
      boosterData.find((booster) => booster.id === boosterPoints.booster)?.name ??
      'Missing booster',
    boosterType: boosterPoints.booster,
    points: boosterPoints.points,
  }));

  return (
    <CardSuccessMessage
      boosters={activatedBoosters}
      cardDescription={parseDescription(card)}
      channelName={card.activeStreamerCard?.channel.name ?? ''}
      excludeBestPlays={excludeBestPlays}
      id={id}
      isBestPlay={isBestPlay}
      isStreamer={!!card.activeStreamerCard?.channel.streamer}
      playerAvatar={playerAvatar}
      playerColor={player.preferredColor}
      playerId={player.userId}
      playerName={player.userTag}
      playerOnlineStatus={player.onlineStatus}
      points={points}
      renderHoverElement={(show, ref) => (
        <FloatingCard
          cardData={card}
          containerRef={ref}
          points={points}
          show={show}
        />
      )}
    />
  );
}
