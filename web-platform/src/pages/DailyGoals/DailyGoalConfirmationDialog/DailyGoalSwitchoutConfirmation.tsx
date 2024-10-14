import { gql } from '@apollo/client';
import { WalletCurrencyId } from '@noice-com/common-ui';

import { useDailyGoalState } from '../context';
import { GoalCard } from '../GoalCard/GoalCard';
import { useDailyGoalReshuffleMutation } from '../hooks/useDailyGoalReshuffleMutation.hook';

import { DailyGoalConfirmationDialog } from './DailyGoalConfirmationDialog';

import { useDailyGoalSwitchOutConfirmationCardQuery } from '@gen';

gql`
  query DailyGoalSwitchOutConfirmationCard($id: ID!) {
    goalCard(id: $id) {
      id
      ...GoalCardCard
    }
  }
`;

export interface SwitchOutProps {
  cardId: string;
  slotId: string;
  currency: {
    currencyId: WalletCurrencyId;
    currencyAmount: number;
  };
}

export function DailyGoalSwitchoutConfirmation({
  cardId,
  slotId,
  currency,
}: SwitchOutProps) {
  const { setCurrentStateToDefault, setCurrentStateToSelect } = useDailyGoalState();

  const { data } = useDailyGoalSwitchOutConfirmationCardQuery({
    variables: {
      id: cardId,
    },
  });

  const [reshuffleOptions] = useDailyGoalReshuffleMutation({
    slotId,
    onCompleted() {
      setCurrentStateToSelect(slotId);
    },
  });

  const card = data?.goalCard;

  return (
    <DailyGoalConfirmationDialog
      canceled={setCurrentStateToDefault}
      confirmed={reshuffleOptions}
      currency={currency}
      title="Switchout this daily goal card?"
      warning="You will lose progress on the current card."
    >
      {card && <GoalCard card={card} />}
    </DailyGoalConfirmationDialog>
  );
}
