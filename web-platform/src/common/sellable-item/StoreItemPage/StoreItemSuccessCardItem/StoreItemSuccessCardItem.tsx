import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { HorizontalProgressBar } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useState } from 'react';

import { ProgressBarLabel } from '../../ProgressBarLabel/ProgressBarLabel';
import { StoreItemGameCard } from '../../StoreItemGameCard/StoreItemGameCard';
import { UpgradedCardInfo } from '../../UpgradedCardInfo/UpgradedCardInfo';

import { CardLevelUpProgressBarVfx } from './CardLevelUpProgressBarVfx/CardLevelUpProgressBarVfx';
import { CardLevelUpVfx } from './CardLevelUpVfx/CardLevelUpVfx';
import {
  HIGHLIGHT_ANIMATION_DURATION_MS,
  useStoreItemSuccessCardItemStates,
} from './hooks/useStoreItemSuccessCardItemStates.hook';
import styles from './StoreItemSuccessCardItem.module.css';

import { usePlaySound, AppSoundKeys } from '@common/sound';
import { StoreItemSuccessCardItemRefFragment } from '@gen';

interface Props {
  itemRef: StoreItemSuccessCardItemRefFragment;
  skipAnimation?: boolean;
  onAnimationEnd(): void;
}

export function StoreItemSuccessCardItem({
  itemRef,
  skipAnimation,
  onAnimationEnd,
}: Props) {
  const { count } = itemRef;

  const [playProgressCardValueUp, stopProgressCardValueUp] = usePlaySound(
    AppSoundKeys.ProgressionCardDuplicateValueUp,
    {
      loop: true,
      maxLoopDuration: 2000,
    },
  );

  const [cardIsRevealed, setCardIsRevealed] = useState(false);
  const [showFrontSide, setShowFrontSide] = useState(false);

  const {
    showUpgradeInfo,
    showCardAsUpgraded,
    showUpgradeAnimation,
    updatedCardDetails,
    inventoryCardDetails,
    cardProgress,
    cards,
    onHorizontalBarMountAnimationEnd,
    onHorizontalBarProgressAnimationEnd,
    onUpgradeInfoAnimationEndWrapper,
    onUpgradeAnimationStart,
  } = useStoreItemSuccessCardItemStates({
    itemRef,
    skipAnimation,
    onAnimationEnd,
    stopProgressCardValueUp,
  });

  useEffect(() => {
    if (skipAnimation) {
      startAnimation();
      stopProgressCardValueUp();
      return;
    }
  }, [playProgressCardValueUp, skipAnimation, stopProgressCardValueUp]);

  if (!cards?.gameCard) {
    return null;
  }

  function startAnimation() {
    setShowFrontSide(true);
    setCardIsRevealed(true);
  }

  const { gameCard, streamerCard } = cards;

  const isNewStreamerCard = !!streamerCard && !inventoryCardDetails;

  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.cardWrapper, {
          [styles.showUpgradeAnimation]: showUpgradeAnimation && cardIsRevealed,
          [styles.streamerCard]: !!streamerCard,
        })}
        style={
          {
            '--game-card-with-vfx-duration': `1000ms`,
            '--game-card-with-vfx-sprite-image': `url(${CoreAssets.Images.SpriteLightning})`,
          } as CSSProperties
        }
      >
        {showUpgradeAnimation && cardIsRevealed && !streamerCard && (
          <>
            {/* TODO: Would be nice to get <...cssTransformVars> from GameCard so this effect rotates together with the card on hover */}
            <CardLevelUpVfx className={styles.cardLevelUpVfxWrapper} />

            <div className={styles.highlightWrapper}>
              <div
                className={styles.highlight}
                style={
                  {
                    '--_highlight-duration': `${HIGHLIGHT_ANIMATION_DURATION_MS}ms`,
                  } as CSSProperties
                }
                onAnimationStart={onUpgradeAnimationStart}
              />
            </div>
          </>
        )}

        <div className={styles.cardV3}>
          <StoreItemGameCard
            card={{ ...gameCard, activeStreamerCard: streamerCard }}
            cardClassName={styles.cardAnimator}
            cardCount={count}
            cardIsRevealed={cardIsRevealed}
            isNewStreamerCard={isNewStreamerCard}
            isOldStreamerCard={!!streamerCard && !isNewStreamerCard}
            showBackside={!showFrontSide}
            onReveal={startAnimation}
          />
        </div>
      </div>

      {cardProgress && cardIsRevealed && (
        <div className={styles.progressBarWrapper}>
          {cardProgress.max > 0 && (
            <>
              {showUpgradeAnimation && <CardLevelUpProgressBarVfx />}
              <HorizontalProgressBar
                className={classNames({
                  [styles.upgradedProgressBar]: showCardAsUpgraded,
                  [styles.newProgressBar]: !showCardAsUpgraded,
                })}
                key={showCardAsUpgraded ? 'step2' : 'step1'}
                max={cardProgress.max}
                progress={cardProgress.progress}
                start={skipAnimation ? cardProgress.progress : cardProgress.start}
                title={`Progress on ${gameCard.name} in level ${gameCard.leveling.currentLevel}`}
                showHighlightOnMaxReached
                onMountAnimationEnd={onHorizontalBarMountAnimationEnd}
                onProgressAnimationEnd={onHorizontalBarProgressAnimationEnd}
              />

              <ProgressBarLabel
                aria-hidden="true"
                max={cardProgress.max}
                progress={cardProgress.progress}
                start={skipAnimation ? cardProgress.progress : cardProgress.start}
              />
            </>
          )}
        </div>
      )}

      <UpgradedCardInfo
        isNewStreamerCard={isNewStreamerCard}
        maxLevel={(cardProgress?.max ?? 1) < 0}
        newLevelDetails={updatedCardDetails}
        oldLevelDetails={inventoryCardDetails}
        show={showUpgradeInfo || (isNewStreamerCard && cardIsRevealed)}
        skipAnimation={skipAnimation}
        onMountAnimationEnd={() => !skipAnimation && onUpgradeInfoAnimationEndWrapper()}
      />
    </div>
  );
}

StoreItemSuccessCardItem.fragments = {
  entry: gql`
    fragment StoreItemSuccessCardItemRef on StoreV2ItemRef {
      count
      item {
        id
        ...StoreSuccessCardItemItem
      }
      inventoryState {
        itemId
        item {
          id
          ...StoreSuccessCardItemItem
        }
      }
    }

    fragment StoreSuccessCardItemItem on ItemItem {
      id
      details {
        ... on GameLogicCard {
          ...StoreSuccessCardGameLogicCard
        }

        ... on GameLogicStreamerCard {
          ...StoreSuccessCardStreamerLogicCard
        }
      }
    }

    fragment StoreSuccessCardGameLogicCard on GameLogicCard {
      id
      familyId
      ...StoreSuccessCardBaseCard
      ...GameCard
    }

    fragment StoreSuccessCardStreamerLogicCard on GameLogicStreamerCard {
      id
      familyId
      ...GameStreamerCard
      baseCard {
        id
        ...StoreSuccessCardBaseCard
        ...GameStreamerBaseCard
      }
    }

    fragment StoreSuccessCardBaseCard on GameLogicCard {
      id
      familyId
      leveling {
        nextLevelLimit
        progressToNextLevel
        currentLevel
      }
      name
      ...UpgradedCardLevelDetails
    }
  `,
};
