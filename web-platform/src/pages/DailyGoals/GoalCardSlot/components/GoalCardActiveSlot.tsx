import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  WalletCurrencyId,
  CurrencyIcon,
  HorizontalProgressBar,
  Button,
  Icon,
  WithChildren,
  useAnalytics,
  ConfirmDialog,
  useTriggerFTUEAction,
  FTUEActionType,
} from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';
import { AnalyticsEventClientInsufficientCreditsSource } from '@noice-com/schemas/analytics/analytics.pb';
import classNames from 'classnames';

import { useDailyGoalState } from '../../context';
import { GoalCard } from '../../GoalCard/GoalCard';
import { useDailyGoalClaimRewardMutation } from '../../hooks/useDailyGoalClaimRewardMutation.hook';
import { useDailyGoalSounds } from '../../hooks/useDailyGoalSounds';

import styles from './GoalCardActiveSlot.module.css';

import { useConditionalWalletCanNotAffordDialog } from '@common/wallet';
import { GoalCardActiveSlotGoalCardSlotFragment } from '@gen';

interface Props {
  slot: GoalCardActiveSlotGoalCardSlotFragment;
  state: GoalCardSlotState;
  switchOutCurrency: WalletCurrencyId;
  switchOutCost: number;
  soloPlayActive?: boolean;
}

export function GoalCardActiveSlot({
  slot,
  switchOutCurrency,
  switchOutCost,
  soloPlayActive,
  state,
}: WithChildren<Props>) {
  const { id: slotId, goalCard: card, reward } = slot;

  const { setCurrentStateToSwitchOut } = useDailyGoalState();
  const {
    playDailyGoalCardHoverSound,
    playOpenDailyGoalCardSwitchSound,
    playDailyGoalCollectCoinsSound,
  } = useDailyGoalSounds();
  const { trackEvent } = useAnalytics();
  const triggerFTUEAction = useTriggerFTUEAction();

  const [claimReward] = useDailyGoalClaimRewardMutation({
    slotId,
    rewardId: reward?.id,
  });

  const onMouseEnter = () => {
    // no sounds when no action
    if (state === GoalCardSlotState.COLLECTED) {
      return;
    }

    playDailyGoalCardHoverSound();
  };

  const onSwitchOut = () => {
    if (!card) {
      return;
    }

    const cardId = card.id;

    playOpenDailyGoalCardSwitchSound();

    trackEvent({
      clientDailyGoalCardSlotClicked: {
        selectedCardId: cardId,
      },
    });

    setCurrentStateToSwitchOut(slotId, cardId);
  };

  const onRewardCollection = () => {
    playDailyGoalCollectCoinsSound();
    claimReward();
  };

  const { onPurchaseClick, dialogStore } = useConditionalWalletCanNotAffordDialog({
    currencyAmount: switchOutCost,
    currencyId: switchOutCurrency,
    onCanAffordPurchase: onSwitchOut,
    source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_DAILY_GOAL_CARD,
    skus: ['switchout'],
  });

  const onCardClick = () => {
    if (requiresTeam) {
      triggerFTUEAction(FTUEActionType.DailyGoalsGroupCardClicked);
    }
    onPurchaseClick();
  };

  if (!card) {
    return null;
  }

  const slotSelected = state === GoalCardSlotState.SELECTED;
  const slotCompleted = state === GoalCardSlotState.COMPLETED;
  const slotCollected = state === GoalCardSlotState.COLLECTED;

  const { target, description, requiresTeam } = card;
  const cannotComplete = slotSelected && soloPlayActive && requiresTeam;
  const progress = slot.progress?.value ?? 0;

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.shine} />

      <div className={classNames(slotCollected && styles.faded)}>
        <GoalCard card={card} />
      </div>

      <div className={styles.detailsWrapper}>
        {slotSelected && (
          <div className={styles.progressWrapper}>
            <span aria-hidden="true">
              <strong className={styles.progressValue}>{progress}</strong> / {target}
            </span>

            <HorizontalProgressBar
              max={target}
              progress={progress}
              title={`Daily goal ${
                description?.replace(
                  '{targetValue}',
                  `${card.target ?? '[Unknown target]'}`,
                ) ?? 'No description available!'
              }`}
            />
          </div>
        )}
        {slotCompleted && (
          <Button
            variant="cta"
            onClick={onRewardCollection}
          >
            Collect
          </Button>
        )}

        {slotCollected && (
          <div className={styles.collectedContainer}>
            <span className={styles.collectedLabel}>Collected</span>
            <Icon
              icon={CoreAssets.Icons.CheckCircle}
              size={24}
            />
          </div>
        )}

        {cannotComplete && <p>Can be completed only in team play mode</p>}

        {slotSelected && (
          <button
            className={styles.switchoutOverlayButton}
            type="button"
            onClick={onCardClick}
          >
            <span className={styles.switchoutLabel}>Click to switch out</span>
            <div className={styles.switchoutCostWrapper}>
              <CurrencyIcon type={switchOutCurrency} />
              <span className={styles.switchoutCurrencyAmount}>{switchOutCost}</span>
            </div>
          </button>
        )}
      </div>

      <ConfirmDialog store={dialogStore} />
    </div>
  );
}

GoalCardActiveSlot.fragments = {
  entry: gql`
    fragment GoalCardActiveSlotGoalCardSlot on GoalCardGoalCardSlot {
      id
      goalCard {
        id
        target
        description
        requiresTeam
        ...GoalCardCard
      }
      progress {
        value
      }
      reward {
        id
      }
    }
  `,
};
