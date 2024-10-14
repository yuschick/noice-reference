import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import {
  WalletCurrencyId,
  useTriggerFTUEAction,
  Modal,
  CurrencyButton,
  FTUEActionType,
  ConfirmDialog,
  useMediaQuery,
  CommonUtils,
} from '@noice-com/common-ui';
import {
  AnalyticsEventClientInsufficientCreditsSource,
  AnalyticsEventClientShuffleUsedShuffleContext,
} from '@noice-com/schemas/analytics/analytics.pb';
import { CSSProperties } from 'react';

import { useDailyGoalState } from '../context';
import { GoalCard } from '../GoalCard/GoalCard';
import { useDailyGoalAnalytics } from '../hooks/useDailyGoalAnalytics.hook';
import { useDailyGoalReshuffleMutation } from '../hooks/useDailyGoalReshuffleMutation.hook';
import { useDailyGoalSetGoalCardMutation } from '../hooks/useDailyGoalSetGoalCardMutation.hook';
import { useDailyGoalSounds } from '../hooks/useDailyGoalSounds';

import styles from './DailyGoalSelectModal.module.css';

import {
  useConditionalWalletCanNotAffordDialog,
  UserWalletDisplay,
} from '@common/wallet';
import { GoalCardCardFragment, useDailyGoalSelectModalGoalCardOptionsQuery } from '@gen';

gql`
  query DailyGoalSelectModalGoalCardOptions($slotId: ID!) {
    goalCardSlotOptions(slotId: $slotId) {
      cardOptions {
        id
        ...GoalCardCard
      }
    }
  }
`;

export interface Props {
  slotId: string;
  reshuffleCurrency: WalletCurrencyId;
  reshuffleCost: number;
}

export function DailyGoalSelectModal({
  slotId,
  reshuffleCurrency,
  reshuffleCost,
}: Props) {
  const { playDailyGoalCardSelectionReshuffleSound, playPickDailyGoalCardSound } =
    useDailyGoalSounds();
  const { sendShuffleUsedEvent } = useDailyGoalAnalytics();
  const triggerFTUEAction = useTriggerFTUEAction();
  const { setCurrentStateToDefault } = useDailyGoalState();
  const isFullView = useMediaQuery(`(min-width: ${CommonUtils.getRem(730)})`);

  const [reshuffle] = useDailyGoalReshuffleMutation({
    slotId,
    onCompleted() {
      sendShuffleUsedEvent(
        AnalyticsEventClientShuffleUsedShuffleContext.SHUFFLE_CONTEXT_DGC,
        reshuffleCost,
      );
    },
  });

  const [setCard] = useDailyGoalSetGoalCardMutation({});

  const { data } = useDailyGoalSelectModalGoalCardOptionsQuery({
    variables: {
      slotId,
    },
  });

  const cards = data?.goalCardSlotOptions?.cardOptions;

  const isOpen = !!cards?.length;

  const onGoalCardClicked = async (card: GoalCardCardFragment) => {
    await triggerFTUEAction(FTUEActionType.DailyGoalCardClicked);
    if (card.requiresTeam) {
      await triggerFTUEAction(FTUEActionType.DailyGoalsGroupCardClicked);
    }
    playPickDailyGoalCardSound();

    setCard({
      variables: {
        slotId,
        cardId: card.id,
      },
    });

    setCurrentStateToDefault();
  };

  const onReshuffleClicked = () => {
    playDailyGoalCardSelectionReshuffleSound();
    reshuffle();
  };

  const { onPurchaseClick, dialogStore } = useConditionalWalletCanNotAffordDialog({
    currencyAmount: reshuffleCost,
    currencyId: reshuffleCurrency,
    onCanAffordPurchase: onReshuffleClicked,
    source: AnalyticsEventClientInsufficientCreditsSource.SOURCE_DAILY_GOAL_CARD,
    skus: ['reshuffle'],
  });

  return (
    <Modal
      ariaLabel="Pick a new daily goal"
      isOpen={isOpen}
    >
      <div
        className={styles.wrapper}
        style={
          {
            '--_dgc-modal-bg': `url(${CoreAssets.Images.StreamSemitransparentBg})`,
          } as CSSProperties
        }
      >
        <header className={styles.header}>
          <UserWalletDisplay />
        </header>

        <article className={styles.container}>
          <div className={styles.titleWrapper}>
            <h1
              className={styles.title}
              data-ftue-anchor="dgc-modal-title"
            >
              <span className={styles.titleSpecialEffect}>Pick</span> a Daily Goal
            </h1>

            <div>
              <CurrencyButton
                currency={{
                  type: 'in-game',
                  value: reshuffleCost,
                  currency: WalletCurrencyId.ReshuffleToken,
                }}
                data-ftue-anchor="dgc-modal-reshuffle-button"
                level="secondary"
                size={isFullView ? 'md' : 'sm'}
                onClick={onPurchaseClick}
              >
                Reshuffle
              </CurrencyButton>
            </div>
          </div>

          <div
            className={styles.cardsContainer}
            data-ftue-anchor="dgc-modal-cards"
          >
            {cards?.map((card, index) => {
              return (
                <div
                  className={styles.cardWrapper}
                  key={`card_${index}`}
                >
                  <div className={styles.cardWrapperBackground} />

                  <GoalCard
                    card={card}
                    onClick={onGoalCardClicked}
                  />
                </div>
              );
            })}
          </div>
        </article>

        <ConfirmDialog store={dialogStore} />
      </div>
    </Modal>
  );
}
