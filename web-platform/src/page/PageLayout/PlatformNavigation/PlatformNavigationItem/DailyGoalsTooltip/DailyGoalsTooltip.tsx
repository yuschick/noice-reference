import styles from './DailyGoalsTooltip.module.css';
import { DailyGoalTooltipContent } from './DailyGoalTooltipContent/DailyGoalTooltipContent';
import { useDailyGoalsTooltipData } from './hooks/useDailyGoalsTooltipData.hook';

export interface Props {
  className?: string;
  inert?: string;
}

export function DailyGoalsTooltip({ className, inert }: Props) {
  const { slots, amountCompletedGoals, loading, error } = useDailyGoalsTooltipData();

  if (loading || error) {
    return null;
  }

  return (
    <div
      className={className}
      // @ts-ignore-next-line
      inert={inert}
    >
      <div className={styles.tooltipPart}>
        <span className={styles.tooltipTitle}>Daily goals</span>
        <span>
          {amountCompletedGoals}/{slots.length} completed
        </span>
      </div>

      {slots.map((slot, index) => (
        <DailyGoalTooltipContent
          className={styles.tooltipPart}
          index={index + 1}
          key={`daily-goals-${index}`}
          slot={slot}
        />
      ))}
    </div>
  );
}
