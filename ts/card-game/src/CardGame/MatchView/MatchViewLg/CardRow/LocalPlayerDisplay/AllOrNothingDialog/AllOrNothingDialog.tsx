import { gql } from '@apollo/client';
import { useAnimatedNumber, Button } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties, useCallback, useRef, useState } from 'react';

import styles from './AllOrNothingDialog.module.css';

import { AllOrNothingPending, AllOrNothingState } from '@game-common/card';
import { useAonSounds } from '@game-common/sound/hooks';
import { useAllOrNothingDialogCardQuery } from '@game-gen';

const { logInfoVerbose } = makeLoggers('AllOrNothingDialog');

gql`
  query AllOrNothingDialogCard($cardId: String!) {
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
  onCollect: () => void;
  onPlayAgain: () => void;
}

export function AllOrNothingDialog({
  className,
  aonState,
  onCollect,
  onPlayAgain,
}: Props) {
  const countdownSoundPlaying = useRef(false);

  const { cardId, allOrNothing, timer } = aonState;
  const { totalPoints, nextPoints } = allOrNothing;

  const [timeLeft] = useState(timer.timeLeft);
  const { playAonAllOrNothing } = useAonSounds();

  const { data } = useAllOrNothingDialogCardQuery({
    variables: {
      cardId,
    },
  });
  const cardData = data?.gameCards?.cards[0] ?? null;

  const onCollectionTimerEnd = useCallback(() => {
    logInfoVerbose('AoN decision timer has completed, auto-collecting points.');
    countdownSoundPlaying.current = false;
    onCollect();
  }, [onCollect]);

  const onStepEnd = useCallback(
    (timeLeft: number) => {
      if (timeLeft <= 10 && !countdownSoundPlaying.current) {
        playAonAllOrNothing();
        countdownSoundPlaying.current = true;
      }
    },
    [playAonAllOrNothing],
  );

  const { value: animatedValue } = useAnimatedNumber({
    initialValue: Math.floor(timeLeft / 1000),
    target: 0,
    duration: timeLeft,
    suffix: '...',
    onStepEnd,
    onEnd: onCollectionTimerEnd,
  });

  if (!cardData) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, className)}
      style={
        {
          '--aon-button-progress-duration': `${timeLeft}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.leftColumn}>
        <AllOrNothingPending aonState={aonState} />
      </div>

      <div className={styles.rightColumn}>
        <h3 className={styles.title}>Play card again?</h3>
        <p className={styles.description}>You will not score any points if card fails</p>
        <div className={styles.actions}>
          <Button
            level="secondary"
            size="sm"
            onClick={() => onPlayAgain()}
          >
            Play card again
          </Button>

          <p className={styles.description}>Increase points to {nextPoints}</p>

          <div className={styles.divider} />
          <div className={styles.progressWrapper}>
            <Button
              level="secondary"
              size="sm"
              onClick={() => onCollect()}
            >
              Collect {totalPoints} points
            </Button>
            <div className={styles.buttonProgress} />
          </div>
          <p className={styles.description}>Autocollecting in {animatedValue}</p>
        </div>
      </div>
    </div>
  );
}
