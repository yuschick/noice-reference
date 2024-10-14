import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';
import { CSSProperties, useRef } from 'react';
import { MdPause } from 'react-icons/md';

import { MATCH_VIEW_TRANSITION_TIME } from '../const';
import {
  useMatchViewAnimations,
  useMatchViewCardActionsEvents,
  useProgressionPaused,
} from '../hooks';
import { MatchViewSmProps } from '../types';

import { CardRow } from './CardRow';
import { CardSelect } from './CardSelect';
import styles from './MatchViewSm.module.css';

import { GameStateBottomBar } from '@game-common/game/GameStateBottomBar/GameStateBottomBar';
import { RoundPhasesBottomBar } from '@game-common/round';
import { useIsMatchPaused, useIsRoundBasedGame } from '@game-logic/game/hooks';

export function MatchViewSm({ cardsHidden, slots }: MatchViewSmProps) {
  const cardRowElement = useRef<HTMLDivElement>(null);
  const cardSelectElement = useRef<HTMLDivElement>(null);

  useMatchViewCardActionsEvents();

  const {
    isCardSelectAppearing,
    isCardSelectLeaving,
    isCardRowAppearing,
    isCardRowLeaving,
    onCardRowTransitionEnd,
    onCardSelectTransitionEnd,
  } = useMatchViewAnimations({
    cardsHidden,
    cardRowElement,
    cardSelectElement,
  });

  const isPaused = useIsMatchPaused();
  const { isProgressionPaused, progressionPauseReason } = useProgressionPaused();
  const isRoundBasedGame = useIsRoundBasedGame();

  const showProgressionPaused = !isPaused && isProgressionPaused;

  return (
    <div
      className={classNames(styles.matchViewRoot, {
        [styles.cardsHidden]: cardsHidden,
      })}
      style={
        {
          '--match-view-transition-time': `${MATCH_VIEW_TRANSITION_TIME}ms`,
        } as CSSProperties
      }
    >
      <div className={styles.cardContainerWrapper}>
        <div
          className={classNames(styles.matchViewAnimatedContainer, {
            [styles.appear]: isCardSelectAppearing,
            [styles.leaving]: isCardSelectLeaving,
          })}
          hidden={cardsHidden}
          ref={cardSelectElement}
          onTransitionEnd={onCardSelectTransitionEnd}
        >
          {(isCardSelectAppearing || isCardSelectLeaving) && <CardSelect />}
        </div>

        <div
          className={classNames(styles.matchViewAnimatedContainer, {
            [styles.appear]: isCardRowAppearing,
            [styles.leaving]: isCardRowLeaving,
          })}
          hidden={cardsHidden}
          ref={cardRowElement}
          onTransitionEnd={onCardRowTransitionEnd}
        >
          <CardRow slots={slots} />
        </div>
      </div>

      {isPaused && (
        <GameStateBottomBar
          icon={MdPause}
          reason="Noice Predictions Paused"
        />
      )}
      {showProgressionPaused && (
        <GameStateBottomBar
          icon={CoreAssets.Icons.Alert}
          reason={`Progression is currently disabled due to: ${progressionPauseReason}`}
        />
      )}
      {isRoundBasedGame && <RoundPhasesBottomBar />}
    </div>
  );
}
