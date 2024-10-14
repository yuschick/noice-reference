import { useHighScoringCardSounds, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { SyntheticEvent, useRef, useState, useEffect } from 'react';

import { CardState, OverlayView } from '../types';

import { VFXCardAnimationState, GameCardWithVFX } from './GameCardWithVFX';
import styles from './HighScoringCard.module.css';
import { HighScoringCardOverlay } from './HighScoringCardOverlay';
import { useHighScoringCardData } from './hooks';

import { GameCard } from '@game-card';
import { Booster } from '@game-common/booster';
import { useCardGameGroup } from '@game-logic/group/hooks';
import { CGHighScoringCardsSystemOnHighScoringCard } from '@game-logic/systems';

export interface HighScoringCardProps extends CGHighScoringCardsSystemOnHighScoringCard {
  forceState?: CardState;
  onCompleted?(cardId: string): void;
}

function CardLabelWrapper({ visible, children }: { visible: boolean } & WithChildren) {
  return (
    <div
      className={classNames(styles.cardLabelWrapper, {
        [styles.visible]: visible,
        [styles.notVisible]: !visible,
      })}
    >
      {children}
    </div>
  );
}

export function HighScoringCard({
  cardId,
  playerId,
  boosterIds,
  groupId,
  points,
  isPromoted,
  countdownDuration,
  forceState,
  onCompleted,
}: HighScoringCardProps) {
  const group = useCardGameGroup();
  const isOwnGroup = group?.groupID === groupId;

  const [cardAnimationState, setCardAnimationState] = useState<VFXCardAnimationState>(
    isPromoted ? VFXCardAnimationState.Success : VFXCardAnimationState.None,
  );
  const [showTitle, setShowTitle] = useState<boolean>(false);
  const [state, setState] = useState<Nullable<CardState>>(null);
  const [overlayView, setOverlayView] = useState<OverlayView>(
    isPromoted ? 'hidden' : 'countdown',
  );
  const [showTopScoreTitle, setShowTopScoreTitle] = useState<boolean>(false);
  const [showTopScoreComingTitle, setShowTopScoreComingTitle] = useState<boolean>(false);
  const { playCardPromotedSound } = useHighScoringCardSounds();
  const wrapperRef = useRef(null);

  const { card, player, loading } = useHighScoringCardData(cardId, playerId);

  const onWrapperAnimationEnd = (event: SyntheticEvent<HTMLDivElement>) => {
    if (event.target !== wrapperRef.current) {
      return;
    }

    if (!state) {
      return;
    }

    if (state === 'disappear') {
      onCompleted?.(cardId);
    } else if (state === 'appear') {
      // Show correct label after card has appeared
      if (isPromoted) {
        setShowTopScoreTitle(true);
      } else {
        setShowTopScoreComingTitle(true);
      }

      // Allow showing the title after card has appeared
      setShowTitle(true);
    }
  };

  // When card is promoted
  useEffect(() => {
    const hideCallback = () => {
      setState('disappear');
    };

    // If card is not promoted and is appearing, setup a backup timer
    // to hide the card if for some reason the promotion message
    // doesn't come through
    if (!isPromoted && state === 'appear') {
      const backupHandler = setInterval(hideCallback, 10000);

      return () => clearInterval(backupHandler);
    }

    // Only set card to promoted state if it is promoted AND the card state
    // is in some sort of appear state (even though card has already appeared
    // its state remains as appear)
    if (!isPromoted || state !== 'appear') {
      return;
    }

    // Play card promoted sound
    playCardPromotedSound();

    // Show success animation
    setCardAnimationState(VFXCardAnimationState.Success);

    // Set overlay (countdown) hidden
    setOverlayView('hidden');

    // Show correct label if card is promoted
    setShowTopScoreComingTitle(false);
    setShowTopScoreTitle(true);

    // Add a timer that animates the card away after 6sec
    const hideHandler = setInterval(hideCallback, 6000);

    // Add a timer that changes the card state back to normal
    // after some time so that it can be hovered and inspected
    const animStateHandler = setInterval(
      () => setCardAnimationState(VFXCardAnimationState.None),
      4500,
    );

    return () => {
      clearInterval(hideHandler);
      clearInterval(animStateHandler);
    };
  }, [isPromoted, state, playCardPromotedSound]);

  useEffect(() => {
    if (!forceState) {
      return;
    }

    setState(forceState);
  }, [forceState]);

  if (!state || loading || !player || !card) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.appearFromBottom]: state === 'appear',
        [styles.disappearToBottom]: state === 'disappear',
        [styles.ghostCard]: !isPromoted,
      })}
      ref={wrapperRef}
      onAnimationEnd={onWrapperAnimationEnd}
    >
      <div className={styles.cardRowWrapper}>
        <div className={styles.avatarWrapper}>
          <div
            className={styles.avatarImageContainer}
            style={{ backgroundImage: `url(${player.avatars?.avatarFullbody})` }}
          />
        </div>
        <div className={styles.cardWrapper}>
          <GameCardWithVFX
            animation={cardAnimationState}
            className={styles.cardWithBoosters}
            duration={2000}
          >
            <GameCard
              card={{ ...card, pointsMin: points }}
              streamerVideoPlayMode={isPromoted ? 'auto' : 'hover'}
            />
            {!!boosterIds?.length && (
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

          <div className={styles.overlayWrapper}>
            <HighScoringCardOverlay
              countDownDuration={overlayView === 'countdown' ? countdownDuration : 0}
              view={overlayView}
            />
          </div>
        </div>
      </div>
      <div className={styles.cardLabelsWrapper}>
        <CardLabelWrapper visible={showTopScoreTitle && showTitle}>
          <span className={styles.cardLabel}>New top score!</span>
          <span className={styles.darkCardLabel}>
            By {player.userTag}{' '}
            {isOwnGroup && <span className={styles.greenBadge}>My Team</span>}
          </span>
        </CardLabelWrapper>
        <CardLabelWrapper visible={showTopScoreComingTitle && showTitle}>
          <span className={styles.cardLabel}>Top score coming up</span>
          <span className={styles.darkCardLabel}>
            By {player.userTag}{' '}
            {isOwnGroup && <span className={styles.greenBadge}>My Team</span>}
          </span>
        </CardLabelWrapper>
      </div>
    </div>
  );
}
