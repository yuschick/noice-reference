import { useCallback, useEffect, useRef, useState } from 'react';

interface HookResult {
  value: string;
  isAnimating: boolean;
}

interface Props {
  initialValue: number;
  target: number;
  duration: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  isPaused?: boolean;
  onStart?(): void;
  onEnd?(): void;
  onStepEnd?(value: number): void;
}

export function useAnimatedNumber({
  initialValue,
  duration,
  delay,
  target,
  prefix,
  suffix,
  isPaused,
  onStart,
  onEnd,
  onStepEnd,
}: Props): HookResult {
  const delayRef = useRef<number>(-1);
  const animationFrameRef = useRef<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number>(initialValue);
  const currentValueRef = useRef(initialValue);

  // if initial value changes, reset the current value
  useEffect(() => {
    setCurrentValue(initialValue);
    currentValueRef.current = initialValue;
    setIsAnimating(false);
  }, [initialValue]);

  const animate = (target: number) => {
    let startTimestamp: number;

    const tick = (timestamp: number) => {
      startTimestamp ??= timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (target - initialValue) + initialValue);
      setCurrentValue(value);
      currentValueRef.current = value;

      if (progress >= 1) {
        animationFrameRef.current = -1;
        onEnd?.();
        setIsAnimating(false);
        return;
      }

      onStepEnd?.(value);
      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    onStart?.();
    animationFrameRef.current = window.requestAnimationFrame(tick);
  };

  const updateTo = useCallback(
    (target: number) => {
      if (initialValue - target === 0 || target === currentValueRef.current) {
        return () => {};
      }

      if (delay) {
        delayRef.current = window.setTimeout(() => {
          setIsAnimating(true);
          animate(target);
        }, delay);
      } else {
        setIsAnimating(true);
        animate(target);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValue, onEnd, onStepEnd],
  );

  // trigger calculation if target or updateTo (initialValue) changes
  useEffect(() => {
    if (isPaused) {
      window.clearTimeout(delayRef.current);
      window.cancelAnimationFrame(animationFrameRef.current);
      setIsAnimating(false);
      return;
    }

    updateTo(target);

    return () => {
      window.clearTimeout(delayRef.current);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, target, updateTo]);

  return { value: `${prefix ?? ''}${currentValue}${suffix ?? ''}`, isAnimating };
}
