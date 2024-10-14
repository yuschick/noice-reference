import { gql } from '@apollo/client';
import { VfxVideo, useAnalytics, useFeatureFlag } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { CardHighlightBooster } from '../CardHighlightBooster';
import { useSwitchOut } from '../hooks';
import { CardHighlightState, CardHighlightStateType } from '../types';

import styles from './CardWithHighlightState.module.css';

import { GameCard } from '@game-card';
import { useCardWithHighlightStateCardQuery } from '@game-gen';
import { useCardGameState } from '@game-logic/game/context';
import { useIsRoundBasedGame } from '@game-logic/game/hooks';

const log = makeLoggers('CardWithHighlightState');

gql`
  query CardWithHighlightStateCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        ...GameCard
      }
    }
  }
`;

interface FnParams {
  stateType?: CardHighlightStateType;
  vfxVersionCdnFolder: string;
}

const getVfxWebmUrl = ({ stateType, vfxVersionCdnFolder }: FnParams): string[] => {
  let file: string;
  if (stateType === CardHighlightStateType.BestPlay) {
    file = `${NOICE.CDN_URL}/card-vfx/${vfxVersionCdnFolder}/bestplay`;
  } else if (stateType === CardHighlightStateType.Failure) {
    file = `${NOICE.CDN_URL}/card-vfx/${vfxVersionCdnFolder}/fail`;
  } else {
    file = `${NOICE.CDN_URL}/card-vfx/${vfxVersionCdnFolder}/success`;
  }

  return ['mp4', 'webm'].map((ext) => `${file}.${ext}`);
};

const getStickyHighlightText = (stateType: CardHighlightStateType): string => {
  if (
    stateType === CardHighlightStateType.Success ||
    stateType === CardHighlightStateType.BestPlay
  ) {
    return 'WIN';
  }

  return 'FAIL';
};

interface Props {
  className?: string;
  state: CardHighlightState;
}

export function CardWithHighlightState({ className, state }: Props) {
  const [vfxVersionCdnFolder] = useFeatureFlag('vfxVersionCdnFolder', 'v1');
  const [showStickyHighlight, setShowStickyHighlight] = useState(false);
  const isRoundBasedGame = useIsRoundBasedGame();
  const { trackEvent } = useAnalytics();
  const { isReady, isLocked, timer } = useSwitchOut();
  const gameInstance = useCardGameState();

  const { data, loading } = useCardWithHighlightStateCardQuery({
    variables: {
      cardId: state.cardId,
    },
  });
  const cardData = data?.gameCards?.cards[0] ?? null;

  // For active rounds, we show sticky (=stays visible) highlight
  useEffect(() => {
    if (!cardData || !isRoundBasedGame) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowStickyHighlight(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [cardData, isRoundBasedGame]);

  if (loading) {
    return <GameCard.Loading />;
  }

  if (!cardData) {
    log.logError(`No card data for card id ${state.cardId}`);
    return null;
  }

  const sources = getVfxWebmUrl({
    stateType: state.type,
    vfxVersionCdnFolder,
  });

  const { boosterAnimationTimings, boosters } = state;

  const onHighlightClick = () => {
    trackEvent({
      clientCardHighlightClicked: {
        cardId: state.cardId,
        isCardSelectAvailable: isReady,
        isSwitchOutLocked: isLocked,
        isSwitchOutCoolingDown: !isReady && !!timer?.hasTimeLeft,
        roundPhase: gameInstance?.roundPhase,
        isRoundBasedGame: gameInstance?.isRoundBasedGame(),
        gameId: gameInstance?.getGameId(),
      },
    });
  };

  return (
    // This element is never meant to be clickable but we want to track the clicks to understand the user behavior
    // so we are adding the click event here without making it visible for screen readers (=making it button).
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={classNames(styles.cardHighlightRoot, className, {
        [styles.success]: state.type === CardHighlightStateType.Success,
        [styles.bestPlay]: state.type === CardHighlightStateType.BestPlay,
        [styles.failure]: state.type === CardHighlightStateType.Failure,
      })}
      onClick={onHighlightClick}
    >
      <GameCard
        card={{
          ...cardData,
          pointsMin: state.points,
        }}
        slots={{
          customFrontLayer: isRoundBasedGame
            ? () => (
                <div
                  className={classNames(styles.cardHighlightStickyHighlight, {
                    [styles.appear]: showStickyHighlight,
                  })}
                >
                  <span className={styles.cardHighlightStickyHighlightText}>
                    {getStickyHighlightText(state.type)}
                  </span>
                </div>
              )
            : undefined,
        }}
      />

      {boosterAnimationTimings && !!boosters.length && (
        <div className={styles.cardHighlightBoostersWrapper}>
          {boosters.map((booster, index) => {
            const {
              playerScoreDuration,
              highlightBoosterDuration,
              highlightBoosterDelay,
            } = boosterAnimationTimings;

            // Calculate delay for each booster:
            // 1. Always include playerScoreDuration since we always wait
            //    first the points to update for card (without boosters)
            // 2. Take in account the animation durations of previous boosters
            // 3. Take in account the delays between the boosters.
            const delay =
              playerScoreDuration +
              index * highlightBoosterDuration +
              index * highlightBoosterDelay;

            return (
              <CardHighlightBooster
                booster={booster}
                className={styles.cardHighlightBooster}
                delay={delay}
                duration={highlightBoosterDuration}
                key={booster.boosterId}
                // The booster are highlighted top to down so make sure the highlight
                // is on top of the next one
                style={{
                  zIndex: `var(--noi-z-index-level-${boosters.length - index})`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className={styles.cardHighlightVfxVideoWrapper}>
        <VfxVideo
          className={styles.cardHighlightVideo}
          src={sources}
          isPlaying
        />
      </div>
    </div>
  );
}
