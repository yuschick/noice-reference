import { gql } from '@apollo/client';
import { useAnimatedNumber, useAuthenticatedUser } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import cs from 'classnames';
import { useCallback, useRef } from 'react';

import styles from './PlayerScore.module.css';

import { CardHighlightStateType } from '@game-common/card';
import { PlayerScoreProfileFragment } from '@game-gen';

gql`
  fragment PlayerScoreProfile on ProfileProfile {
    userId
    userTag
  }
`;

export interface Props {
  classNames?: {
    root?: string;
    scoreAnimatingClassName?: string;
  };
  player: PlayerScoreProfileFragment;
  score: number;
  scoreAnimationDuration?: number;
  highlightStateType?: Nullable<CardHighlightStateType>;
  isCardHovered: boolean;
}

export function PlayerScore({
  classNames,
  player,
  score,
  highlightStateType,
  isCardHovered,
  scoreAnimationDuration = 500,
}: Props) {
  const { userId: playerId, userTag } = player;

  const { userId } = useAuthenticatedUser();
  const isLocalPlayer = userId === playerId;
  const previousScore = useRef(score);

  const showName = isCardHovered || isLocalPlayer || highlightStateType;

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
      className={cs(styles.container, classNames?.root, {
        [styles.cardSuccess]: highlightStateType === CardHighlightStateType.Success,
        [styles.bestPlay]: highlightStateType === CardHighlightStateType.BestPlay,
      })}
    >
      <div
        className={cs(styles.nameLabel, {
          [styles.showName]: showName,
        })}
      >
        {userTag}
      </div>
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
  );
}

PlayerScore.Loading = ({ classNames }: Pick<Props, 'classNames'>) => {
  return <div className={cs(styles.loadingContainer, classNames?.root)} />;
};
