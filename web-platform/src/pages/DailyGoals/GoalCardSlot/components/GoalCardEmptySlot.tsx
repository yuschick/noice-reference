import { useAnalytics } from '@noice-com/common-ui';
import { HiOutlinePlusCircle } from 'react-icons/hi';

import { useDailyGoalState } from '../../context';
import { useDailyGoalSounds } from '../../hooks/useDailyGoalSounds';

import styles from './GoalCardEmptySlot.module.css';

export interface Props {
  text: string;
  slotId: string;
}

export function GoalCardEmptySlot({ text, slotId }: Props) {
  const { playDailyGoalCardEmptySlotHoverSound, playOpenDailyGoalCardSelectionSound } =
    useDailyGoalSounds();
  const { setCurrentStateToSelect } = useDailyGoalState();
  const { trackEvent } = useAnalytics();

  const onMouseEnter = () => {
    playDailyGoalCardEmptySlotHoverSound();
  };

  const onClick = () => {
    playOpenDailyGoalCardSelectionSound();

    setCurrentStateToSelect(slotId);

    trackEvent({
      clientDailyGoalCardSlotClicked: {},
    });
  };

  return (
    <button
      className={styles.wrapper}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.emptyShine} />
      <div className={styles.innerWrapper}>
        <HiOutlinePlusCircle size={32} />
        <span>{text}</span>
      </div>
    </button>
  );
}
