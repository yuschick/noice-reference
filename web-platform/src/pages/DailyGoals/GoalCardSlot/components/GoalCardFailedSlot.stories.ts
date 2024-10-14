import { Props as DailyGoalCardDefaultProps } from '../../GoalCard/GoalCard';
import { Default as DailyGoalCardDefault } from '../../GoalCard/GoalCard.stories';

import { DailyGoalCardFailedSlot } from './GoalCardFailedSlot';

export default {
  title: 'Goal Card/Failed Slot',
  component: DailyGoalCardFailedSlot,
};

export const Default = {
  args: {
    card: { ...(DailyGoalCardDefault.args as Required<DailyGoalCardDefaultProps>) },
  },
};
