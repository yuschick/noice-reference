import { useLayoutEffect, useState } from 'react';

interface Props {
  duration: number;
  delay?: number;
  animationCount?: number;
  infinite?: boolean;
  onCompleted?: () => void;
}

export function useApngPlayerVisible({
  duration,
  delay,
  animationCount,
  infinite,
  onCompleted,
}: Props): boolean {
  const [visible, setVisible] = useState(false);

  // 1. Handle case of infinite animation
  useLayoutEffect(() => {
    if (!infinite) {
      return;
    }
    const startTimeout = setTimeout(() => setVisible(true), delay || 0);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [infinite, delay]);

  // 2. Handle case of finite animation
  useLayoutEffect(() => {
    if (infinite) {
      return;
    }

    const startTimeout = setTimeout(() => setVisible(true), delay || 0);
    const endTimeout = setTimeout(() => {
      setVisible(false);
      onCompleted?.();
    }, (animationCount || 1) * duration + (delay || 0));

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(endTimeout);
    };
  }, [duration, delay, animationCount, infinite, onCompleted]);

  return visible;
}
