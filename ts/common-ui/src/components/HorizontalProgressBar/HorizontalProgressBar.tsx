import { MathUtils } from '@noice-com/utils';
import classNames from 'classnames';
import {
  AnimationEventHandler,
  CSSProperties,
  useCallback,
  useMemo,
  useState,
} from 'react';

import styles from './HorizontalProgressBar.module.css';

export interface Props {
  min?: number;
  max: number;
  progress: number;
  start?: number;
  className?: string;
  title: string;
  showHighlightOnMaxReached?: boolean;
  onProgressAnimationEnd?(): void;
  onMountAnimationEnd?(): void;
}

export function HorizontalProgressBar({
  min = 0,
  start = min,
  max,
  progress,
  className,
  title,
  onMountAnimationEnd,
  showHighlightOnMaxReached,
  onProgressAnimationEnd,
}: Props) {
  const [mountAnimationEnded, setMountAnimationEnded] = useState(false);

  const progressClassName = classNames(styles.progress, {
    [styles.highlightBar]: showHighlightOnMaxReached && max === progress,
  });

  const progressStyle = useMemo(() => {
    const startPercent = start
      ? MathUtils.clamp(MathUtils.transformRange(start, min, max, 0, 1), 0, 1)
      : 0;
    const finalPercent = MathUtils.clamp(
      MathUtils.transformRange(progress, min, max, 0, 1),
      0,
      1,
    );

    return {
      '--horizontal-progress-bar-start-percent': startPercent,
      '--horizontal-progress-bar-final-percent': finalPercent,
    } as CSSProperties;
  }, [start, max, min, progress]);

  const onProgressBarAnimationEnd = useCallback<AnimationEventHandler>(
    (ev) => {
      ev.stopPropagation();
      setMountAnimationEnded(true);
      onProgressAnimationEnd?.();

      if (showHighlightOnMaxReached && max !== progress) {
        // component animation ends
        onMountAnimationEnd?.();
      }
    },
    [
      max,
      onMountAnimationEnd,
      onProgressAnimationEnd,
      progress,
      showHighlightOnMaxReached,
    ],
  );

  const onBarWrapperAnimationEnd = useCallback<AnimationEventHandler>(() => {
    onMountAnimationEnd?.();
  }, [onMountAnimationEnd]);

  return (
    <div
      className={classNames(styles.highlightWrapper, className, {
        [styles.startAnimation]: !mountAnimationEnded,
        [styles.afterAnimation]: mountAnimationEnded,
        [styles.showHighlight]: showHighlightOnMaxReached && max === progress,
      })}
      onAnimationEnd={onBarWrapperAnimationEnd}
    >
      <div className={classNames(styles.wrapper, className)}>
        <div
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={progress}
          className={progressClassName}
          role="progressbar"
          style={progressStyle}
          title={title}
          onAnimationEnd={onProgressBarAnimationEnd}
        />
      </div>
    </div>
  );
}

HorizontalProgressBar.Loading = () => (
  <div className={styles.wrapper}>
    <div className={styles.loadingBar} />
  </div>
);
