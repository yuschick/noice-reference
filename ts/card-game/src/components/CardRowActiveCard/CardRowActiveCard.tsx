import { CoreAssets } from '@noice-com/assets-core';
import { Icon, useAnalytics, useAuthenticatedUser } from '@noice-com/common-ui';
import { AnalyticsEventClientCardSelectOpenedCardSelectOpenedContext as CardSelectOpenedContext } from '@noice-com/schemas/analytics/analytics.pb';
import { StreamStateRoundPhase } from '@noice-com/schemas/game-logic/game_logic.pb';
import classNames from 'classnames';
import { RefObject } from 'react';

import { LocalPlayerCardPlaceholder } from '../LocalPlayerCardPlaceholder';
import { PlayerActiveCard } from '../PlayerActiveCard';

import { ActiveBoosters } from './ActiveBoosters';
import { ActiveBoostersPreview } from './ActiveBoostersPreview';
import { ActiveBoostersVFX } from './ActiveBoostersVFX';
import styles from './CardRowActiveCard.module.css';
import { OfflineCard } from './OfflineCard';
import { PausedCard } from './PausedCard';
import { TeamMateCardPlaceholder } from './TeamMateCardPlaceholder';

import { useSwitchOut } from '@game-common/card';
import { useCardGameUIState } from '@game-context';
import { useIsBoosterTarget, usePlayerBoosterApply } from '@game-logic/boosters/hooks';
import { usePlayerActiveCard } from '@game-logic/card/hooks';
import { useCardGameState } from '@game-logic/game/context';
import { useIsMatchPaused, useRoundPhase } from '@game-logic/game/hooks';
import { useCardGamePlayer } from '@game-logic/player/hooks';

export interface Props {
  className?: string;
  playerId: string;
  isHovered?: boolean;
  activeCardRef?: RefObject<HTMLDivElement>;
  onIdleActiveCardClick?: () => void;
}

export function CardRowActiveCard({
  className,
  playerId,
  isHovered,
  activeCardRef,
  onIdleActiveCardClick,
}: Props) {
  const { userId: localPlayerId } = useAuthenticatedUser();
  const activeCard = usePlayerActiveCard(playerId);
  const cardId = activeCard?.cardId ?? null;

  const { applyModeActive, applyBooster } = usePlayerBoosterApply();
  const { isBoosterTarget, hasRequestedBooster } = useIsBoosterTarget(playerId);
  const { trackEvent } = useAnalytics();
  const { isReady, isLocked, timer } = useSwitchOut();
  const gameInstance = useCardGameState();

  const handleCardClicked =
    applyModeActive && isBoosterTarget
      ? () => applyBooster(playerId)
      : onIdleActiveCardClick;

  const { openCardSelect } = useCardGameUIState();
  const player = useCardGamePlayer(playerId);
  const isMatchPaused = useIsMatchPaused();
  const roundPhase = useRoundPhase();

  const isOffline = player && player.isOnline === false;
  const isLocalPlayer = localPlayerId === playerId;

  const canPickCard =
    isLocalPlayer &&
    !isMatchPaused &&
    !applyModeActive &&
    (roundPhase === StreamStateRoundPhase.ROUND_PHASE_UNSPECIFIED ||
      roundPhase === StreamStateRoundPhase.ROUND_PHASE_PREPARATION);

  const onLocalPlayerEmptyCardClick = () => {
    trackEvent({
      clientEmptyCardClicked: {
        isCardSelectAvailable: isReady,
        isSwitchOutLocked: isLocked,
        isSwitchOutCoolingDown: !isReady && !!timer?.hasTimeLeft,
        roundPhase: gameInstance?.roundPhase,
        isRoundBasedGame: gameInstance?.isRoundBasedGame(),
        gameId: gameInstance?.getGameId(),
      },
    });

    if (!canPickCard) {
      return;
    }

    openCardSelect(CardSelectOpenedContext.CARD_SELECT_OPENED_CONTEXT_PICK_A_CARD);
  };

  return (
    <div
      className={classNames(styles.cardRowCardRoot, className, {
        [styles.isHovered]: isHovered,
      })}
    >
      {isMatchPaused ? (
        <PausedCard playerId={playerId} />
      ) : isOffline ? (
        <OfflineCard playerId={playerId} />
      ) : cardId ? (
        <div ref={activeCardRef}>
          <ActiveBoostersPreview
            cardOwnerId={playerId}
            className={styles.cardRowCardActiveBoostersPreview}
          />
          <ActiveBoosters
            backgroundClassName={styles.cardRowCardActiveBoosters}
            boostersClassName={classNames(
              styles.cardRowCardActiveBoosters,
              styles.cardRowCardActiveBoostersBoosters,
            )}
            cardOwnerId={playerId}
            isCardHovered={isHovered}
          />
          <PlayerActiveCard
            cardId={cardId}
            ftueAnchor={isLocalPlayer ? 'player-card' : undefined}
            playerId={playerId}
            onClick={handleCardClicked}
          />
          <ActiveBoostersVFX
            className={styles.cardRowCardActiveBoostersVfx}
            playerId={playerId}
          />
        </div>
      ) : isLocalPlayer ? (
        <LocalPlayerCardPlaceholder
          aria-disabled={!canPickCard}
          data-ftue-anchor={'player-empty-card'}
          onCardPick={onLocalPlayerEmptyCardClick}
        />
      ) : (
        <TeamMateCardPlaceholder />
      )}

      {applyModeActive && hasRequestedBooster && (
        <div className={styles.cardRowCardBoosterRequestedWrapper}>
          <div className={styles.cardRowCardBoosterRequestedLabel}>Requested</div>
          <div className={styles.cardRowCardBoosterRequestedIconWrapper}>
            <Icon
              className={styles.cardRowCardBoosterRequestedIcon}
              icon={CoreAssets.Icons.Finger}
            />
          </div>
        </div>
      )}
    </div>
  );
}
