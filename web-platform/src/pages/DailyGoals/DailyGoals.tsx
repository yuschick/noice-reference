import { gql } from '@apollo/client';
import { VisuallyHidden, WalletCurrencyId } from '@noice-com/common-ui';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { DailyGoalStateProvider } from './context';
import { DailyGoalSwitchoutConfirmation } from './DailyGoalConfirmationDialog/DailyGoalSwitchoutConfirmation';
import styles from './DailyGoals.module.css';
import { DailyGoalSelectModal } from './DailyGoalSelectModal/DailyGoalSelectModal';
import { DailyGoalsHeaderWrapper } from './DailyGoalsHeader/DailyGoalsHeaderWrapper';
import { GoalCardSlots } from './GoalCardSlots/GoalCardSlots';
import { ParticipationBonusTime } from './ParticipationBonus/ParticipationBonusTime';
import { CurrentState, DailyGoalState } from './types';

import { useStreamGame } from '@common/stream';
import { useDailyGoalsPageDataQuery } from '@gen';

const RESHUFFLE_COST = 1;

gql`
  query DailyGoalsPageData {
    goalCardSlots {
      slots {
        id
        ...GoalCardSlotsGoalSlot
        cardOptions {
          id
        }
      }
    }

    dailyParticipationLimit {
      remainingDailyParticipationMinutes
    }
  }
`;

export function DailyGoals() {
  const { isSolo } = useStreamGame();

  const [currentState, setCurrentState] = useState<CurrentState>({
    state: DailyGoalState.Default,
  });

  const { data, error, loading } = useDailyGoalsPageDataQuery({
    fetchPolicy: 'cache-and-network',
  });

  const slots = data?.goalCardSlots?.slots ?? [];
  const remainingDailyParticipationMinutes =
    data?.dailyParticipationLimit?.remainingDailyParticipationMinutes ?? null;

  // If any of the slots have the cardOptions set we must show the card
  // picker dialog because the selection hasn't completed for some reason
  useEffect(() => {
    data?.goalCardSlots?.slots?.forEach((slot) => {
      if (!slot?.cardOptions?.length) {
        return;
      }

      setCurrentState({
        state: DailyGoalState.Select,
        slotId: slot.id,
      });
    });
  }, [data?.goalCardSlots?.slots]);

  if (error) {
    return null;
  }

  return (
    <DailyGoalStateProvider
      currentState={currentState}
      setCurrentState={setCurrentState}
    >
      <div
        className={styles.responsiveWrapper}
        data-ftue-anchor="dailyGoalsView"
      >
        <Helmet>
          <title>Daily Goals</title>
        </Helmet>
        <VisuallyHidden>
          <h1>Daily Goals</h1>
        </VisuallyHidden>

        <div className={styles.innerContentWrapper}>
          <DailyGoalsHeaderWrapper />

          <div className={styles.slotsWrapper}>
            {!loading ? (
              <GoalCardSlots
                slots={slots}
                soloPlayActive={isSolo}
                switchOutCost={RESHUFFLE_COST}
                switchOutCurrency={WalletCurrencyId.ReshuffleToken}
              />
            ) : (
              <GoalCardSlots.Loading />
            )}
          </div>
        </div>

        <hr className={styles.horizontalDivider} />

        <ParticipationBonusTime
          remainingDailyParticipationMinutes={remainingDailyParticipationMinutes}
        />

        {currentState.state === DailyGoalState.Select && (
          <DailyGoalSelectModal
            reshuffleCost={RESHUFFLE_COST}
            reshuffleCurrency={WalletCurrencyId.ReshuffleToken}
            slotId={currentState.slotId ?? null}
          />
        )}

        {currentState.state === DailyGoalState.SwitchOut && (
          <DailyGoalSwitchoutConfirmation
            cardId={currentState.cardId}
            currency={{
              currencyId: WalletCurrencyId.ReshuffleToken,
              currencyAmount: RESHUFFLE_COST,
            }}
            slotId={currentState.slotId}
          />
        )}
      </div>
    </DailyGoalStateProvider>
  );
}
