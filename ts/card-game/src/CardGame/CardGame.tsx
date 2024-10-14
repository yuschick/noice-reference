import classNames from 'classnames';
import { ReactNode } from 'react';

import styles from './CardGame.module.css';
import { ChallengesDialog } from './ChallengesDialog';
import { GameStateLabels } from './GameStateLabels';
import { useGameSounds, useCardGameState, useMatchStartAnalytics } from './hooks';
import { MatchEnd } from './MatchEnd/MatchEnd';
import { MatchGroupWaiting } from './MatchGroupWaiting';
import { MatchView } from './MatchView';
import { MatchWaiting } from './MatchWaiting';

import { CardGameUIStateProvider } from '@game-context';

export interface Props {
  hideContent?: boolean;
  showMatchEnd?: boolean;
  isSpectatorMode?: boolean;
  highScoringCardsClassName?: string;
  slots?: {
    cardContainerSmAction: ReactNode;
  };
}

export function CardGame({
  hideContent,
  isSpectatorMode,
  highScoringCardsClassName,
  showMatchEnd: showMatchEndProp,
  slots,
}: Props) {
  useGameSounds();
  useMatchStartAnalytics();

  const {
    state: { isMatchRunning, showMatchEnd, showWaitingForMatch },
    onMatchEndCompleted,
  } = useCardGameState({ showMatchEnd: showMatchEndProp, hideContent });

  return (
    <CardGameUIStateProvider
      hideContent={hideContent}
      showWaitingForMatch={showWaitingForMatch}
    >
      <div
        className={classNames(styles.cardGameRoot, {
          [styles.hidden]: hideContent,
        })}
      >
        <GameStateLabels hideContent={hideContent} />
        <ChallengesDialog />

        <MatchEnd
          showResultsSummary={showMatchEnd && !isMatchRunning}
          onMatchEndCompleted={onMatchEndCompleted}
        />

        {!hideContent && (
          <>
            {showWaitingForMatch && <MatchWaiting />}

            {showWaitingForMatch && (
              <div className={styles.cardGameBottomContent}>
                <MatchGroupWaiting slots={slots} />
              </div>
            )}
          </>
        )}

        {isMatchRunning && (
          <div className={styles.cardGameBottomContent}>
            <MatchView
              cardsHidden={hideContent}
              highScoringCardsClassName={highScoringCardsClassName}
              isSpectator={isSpectatorMode}
              slots={slots}
            />
          </div>
        )}
      </div>
    </CardGameUIStateProvider>
  );
}
