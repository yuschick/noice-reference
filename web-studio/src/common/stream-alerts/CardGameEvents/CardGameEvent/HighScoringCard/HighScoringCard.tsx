import { gql } from '@apollo/client';
import { Booster, CardGameAssets, GameCard } from '@noice-com/card-game';
import classNames from 'classnames';
import { SyntheticEvent, useRef } from 'react';

import { GameCardWithVFX } from '../GameCardWithVFX';

import styles from './HighScoringCard.module.css';

import { CardGameEventHighScoringCardPlayerFragment, GameCardFragment } from '@gen';

export type CardState = 'appear' | 'disappear' | 'none';

gql`
  fragment CardGameEventHighScoringCardPlayer on ProfileProfile {
    userId
    avatars {
      avatarFullbody
    }
    userTag
  }
`;

interface Props {
  card: GameCardFragment;
  player: CardGameEventHighScoringCardPlayerFragment;
  points: number;
  boosterIds: number[];
}

const highscoreVfxVideos = [
  CardGameAssets.Vfx.PromotedHighScoringCardMp4,
  CardGameAssets.Vfx.PromotedHighScoringCardWebm,
];

export function HighScoringCard({ card, player, points, boosterIds }: Props) {
  const wrapperRef = useRef(null);

  const onWrapperAnimationEnd = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.target !== wrapperRef.current) {
      return;
    }
  };

  if (!player || !card) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper)}
      ref={wrapperRef}
      onAnimationEnd={onWrapperAnimationEnd}
    >
      <div className={styles.cardWrapper}>
        <GameCardWithVFX
          appearType="slow"
          delay={550}
          duration={2000}
          vfxVideos={highscoreVfxVideos}
        >
          <GameCard card={{ ...card, pointsMin: points }} />
          {!!boosterIds.length && (
            <div className={styles.boostersWrapper}>
              {boosterIds?.map((boosterId) => (
                <Booster
                  boosterId={boosterId}
                  className={styles.booster}
                  key={boosterId}
                />
              ))}
            </div>
          )}
        </GameCardWithVFX>
      </div>
    </div>
  );
}
