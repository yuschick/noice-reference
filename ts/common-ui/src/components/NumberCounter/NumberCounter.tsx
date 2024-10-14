import { useAnimatedNumber } from '@common-hooks';

export interface Props {
  targetValue: number;
  duration: number;
  initialValue?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  onTargetReached?(): void;
  onCounterStart?(): void;
  onStepEnd?(timeLeft: number): void;
}

export function NumberCounter({
  targetValue,
  duration,
  className,
  initialValue,
  prefix,
  suffix,
  delay,
  onTargetReached,
  onCounterStart,
  onStepEnd,
}: Props) {
  const { value: animatedValue } = useAnimatedNumber({
    initialValue: initialValue ?? 0,
    target: targetValue,
    duration,
    delay,
    prefix,
    suffix,
    onStart: onCounterStart,
    onEnd: onTargetReached,
    onStepEnd,
  });

  return <div className={className}>{animatedValue}</div>;
}
