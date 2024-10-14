import { gql } from '@apollo/client';
import { WalletCurrencyId } from '@noice-com/common-ui';
import { GoalCardSlotState } from '@noice-com/platform-client';

import { GoalCardActiveSlot } from './components/GoalCardActiveSlot';
import { GoalCardEmptySlot } from './components/GoalCardEmptySlot';
import styles from './GoalCardSlot.module.css';

import { getGoalCardSlotState, isGoalCardSlotResetTimePast } from '@common/goal-card';
import { GoalCardSlotSlotFragment } from '@gen';

GoalCardSlot.fragments = {
  entry: gql`
    fragment GoalCardSlotSlot on GoalCardGoalCardSlot {
      id
      ...GoalCardActiveSlotGoalCardSlot
      ...GoalCardSlotStateGoalCardSlot
      ...GoalCardSlotResetTimePastGoalCardSlot
    }
  `,
};

interface Props {
  slot: GoalCardSlotSlotFragment;
  switchOutCurrency: WalletCurrencyId;
  switchOutCost: number;
  soloPlayActive?: boolean;
}

export function GoalCardSlot({
  slot,
  switchOutCurrency,
  switchOutCost,
  soloPlayActive,
}: Props) {
  const state = getGoalCardSlotState(slot);
  const resetTimePast = isGoalCardSlotResetTimePast(slot);

  const showEmptySlot =
    state === GoalCardSlotState.FAILED ||
    state === GoalCardSlotState.EMPTY ||
    (state === GoalCardSlotState.COLLECTED && resetTimePast);

  return (
    <div>
      {!showEmptySlot && (
        <GoalCardActiveSlot
          slot={slot}
          soloPlayActive={soloPlayActive}
          state={state}
          switchOutCost={switchOutCost}
          switchOutCurrency={switchOutCurrency}
        />
      )}

      {showEmptySlot && (
        <GoalCardEmptySlot
          slotId={slot.id}
          text="Add card"
        />
      )}
    </div>
  );
}

GoalCardSlot.Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loading} />
    </div>
  );
};
