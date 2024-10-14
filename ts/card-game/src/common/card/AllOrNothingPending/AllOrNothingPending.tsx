import { gql } from '@apollo/client';
import { useAnimatedNumber } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';

import { CardHighlightBooster } from '../CardHighlightBooster';
import { AllOrNothingState } from '../types';

import styles from './AllOrNothingPending.module.css';

import { GameCard } from '@game-card';
import { useAllOrNothingPendingCardQuery } from '@game-gen';

const log = makeLoggers('AllOrNothingPending');

gql`
  query AllOrNothingPendingCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        ...GameCard
      }
    }
  }
`;

export interface Props {
  className?: string;
  aonState: AllOrNothingState;
}

export function AllOrNothingPending({ className, aonState }: Props) {
  const { boosterPoints, cardId, allOrNothing } = aonState;
  const points = allOrNothing.totalPoints;

  const { data, loading } = useAllOrNothingPendingCardQuery({
    variables: {
      cardId,
    },
  });
  const cardData = data?.gameCards?.cards[0] ?? null;

  const cardPointsAnimationInitial =
    points - boosterPoints.reduce((acc, booster) => acc + booster.points, 0);

  const { value: animatedPoints } = useAnimatedNumber({
    initialValue: cardPointsAnimationInitial,
    target: points,
    duration: 1500,
  });

  if (loading) {
    return <GameCard.Loading />;
  }

  if (!cardData) {
    log.logError(`No card data for card id ${aonState.cardId}`);
    return null;
  }

  return (
    <div className={classNames(styles.allOrNothingPendingRoot, className)}>
      <GameCard card={{ ...cardData, pointsMin: parseInt(animatedPoints, 10) }} />
      {!!boosterPoints.length && (
        <div className={styles.allOrNothingPendingBoostersWrapper}>
          {boosterPoints.map((booster, index) => {
            const duration = 1000;
            const inbetweenDelay = 300;
            const delay =
              // duration
              index * duration +
              // delay
              index * inbetweenDelay;

            return (
              <CardHighlightBooster
                booster={booster}
                className={styles.allOrNothingPendingBooster}
                delay={delay}
                duration={duration}
                key={booster.boosterId}
                // The booster are highlighted top to down so make sure the highlight
                // is on top of the next one
                style={{
                  zIndex: `var(--noi-z-index-level-${boosterPoints.length - index})`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
