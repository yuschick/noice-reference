import { gql } from '@apollo/client';
import { useAnimatedNumber } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import cs from 'classnames';
import { useCallback, useRef } from 'react';

import styles from './SpectatorPlayerInfo.module.css';

import { CardHighlightStateType } from '@game-common/card';
import { CardRowAvatar } from '@game-components/CardRowAvatar';
import { SpectatorPlayerInfoProfileFragment } from '@game-gen';

export interface Props {
  classNames?: {
    scoreAnimatingClassName?: string;
  };
  scoreAnimationDuration?: number;
  player: SpectatorPlayerInfoProfileFragment;
  score: number;
  highlightStateType?: Nullable<CardHighlightStateType>;
}

export function SpectatorPlayerInfo({
  classNames,
  score,
  highlightStateType,
  player,
  scoreAnimationDuration = 500,
}: Props) {
  const previousScore = useRef(score);

  const onAnimatedNumberEnd = useCallback(() => {
    previousScore.current = score;
  }, [score]);

  const { value: animatedScoreValue, isAnimating } = useAnimatedNumber({
    duration: scoreAnimationDuration,
    initialValue: previousScore.current,
    target: score,
    onEnd: onAnimatedNumberEnd,
  });

  return (
    <div
      className={cs(styles.container, {
        [styles.cardSuccess]: highlightStateType === CardHighlightStateType.Success,
        [styles.bestPlay]: highlightStateType === CardHighlightStateType.BestPlay,
      })}
    >
      <CardRowAvatar player={player} />

      <div className={styles.labels}>
        <div className={styles.nameLabel}>{player.userTag}</div>

        <div
          className={cs(
            styles.scoreLabel,
            isAnimating && classNames?.scoreAnimatingClassName
              ? classNames?.scoreAnimatingClassName
              : undefined,
          )}
        >
          {animatedScoreValue}
        </div>
      </div>
    </div>
  );
}

SpectatorPlayerInfo.Loading = function () {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingLabels} />
    </div>
  );
};

SpectatorPlayerInfo.fragments = {
  entry: gql`
    fragment SpectatorPlayerInfoProfile on ProfileProfile {
      userId
      userTag
      ...CardRowAvatarProfile
    }
  `,
};
