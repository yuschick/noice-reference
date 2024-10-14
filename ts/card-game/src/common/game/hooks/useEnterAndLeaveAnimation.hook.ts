import { useEffect, useState } from 'react';

type AnimationState = 'none' | 'enter' | 'leave';

interface Props {
  delay?: number;
  durations: {
    enter: number;
    wait?: number;
    leave: number;
  };
  onLeavingCompleted?: () => void;
}

export function useEnterAndLeaveAnimation({
  delay,
  durations,
  onLeavingCompleted,
}: Props): AnimationState {
  const [animationState, setAnimationState] = useState<AnimationState>('none');

  const enterDuration = durations.enter;
  const waitDuration = durations.wait ?? 0;
  const startToLeave = enterDuration + waitDuration;
  const leaveDuration = durations.leave;

  // Handle triggering the enter and leave animations
  useEffect(() => {
    const enterTimeout = setTimeout(() => setAnimationState('enter'), delay ?? 0);
    const leaveTimeout = setTimeout(
      () => setAnimationState('leave'),
      (delay ?? 0) + startToLeave,
    );

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(leaveTimeout);
    };
  }, [startToLeave, delay]);

  // Handle calling onLeavingCompleted after the leave animation has finished
  useEffect(() => {
    if (!onLeavingCompleted) {
      return;
    }

    if (animationState !== 'leave') {
      return;
    }

    const leaveTimeout = setTimeout(onLeavingCompleted, leaveDuration);

    return () => clearTimeout(leaveTimeout);
  }, [animationState, leaveDuration, onLeavingCompleted]);

  return animationState;
}
