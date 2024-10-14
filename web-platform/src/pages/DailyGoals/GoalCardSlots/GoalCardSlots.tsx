import { gql } from '@apollo/client';
import { WalletCurrencyId } from '@noice-com/common-ui';

import { GoalCardSlot } from '../GoalCardSlot/GoalCardSlot';

import { GoalCardSlotsGoalSlotFragment } from '@gen';

interface Props {
  slots: GoalCardSlotsGoalSlotFragment[];
  switchOutCurrency: WalletCurrencyId;
  switchOutCost: number;
  soloPlayActive?: boolean;
}

export function GoalCardSlots({
  slots,
  switchOutCost,
  switchOutCurrency,
  soloPlayActive,
}: Props) {
  return (
    <>
      {slots?.map((slot) => {
        return (
          <GoalCardSlot
            key={`slot_${slot.id}`}
            slot={slot}
            soloPlayActive={soloPlayActive}
            switchOutCost={switchOutCost}
            switchOutCurrency={switchOutCurrency}
          />
        );
      })}
    </>
  );
}

GoalCardSlots.Loading = () => {
  return (
    <>
      <GoalCardSlot.Loading />
      <GoalCardSlot.Loading />
      <GoalCardSlot.Loading />
    </>
  );
};

GoalCardSlots.fragments = {
  entry: gql`
    fragment GoalCardSlotsGoalSlot on GoalCardGoalCardSlot {
      ...GoalCardSlotSlot
    }
  `,
};
