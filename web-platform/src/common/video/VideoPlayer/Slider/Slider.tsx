import { VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useCallback, useEffect, useState } from 'react';

import styles from './Slider.module.css';

export interface SliderProps {
  min: number;
  max: number;
  value: number;
  color: 'white' | 'red';
  label: string;
  className?: string;
  onChange?(value: number): void;
}

export function Slider({
  min,
  max,
  value,
  color,
  label,
  className,
  onChange,
}: SliderProps) {
  const [current, setCurrent] = useState<number>(value);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  const onValueChanged = useCallback(
    (value: number) => {
      setCurrent(value);
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <label
      className={classNames(styles.wrapper, className, styles[color])}
      style={
        {
          '--video-slider-progress': `${(current / max) * 100}%`,
        } as CSSProperties
      }
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      <div className={styles.track} />

      <div className={classNames(styles.track, styles.fill)} />

      <div className={styles.thumb} />

      <input
        className={styles.input}
        max={max}
        min={min}
        step={0.01}
        type="range"
        value={current}
        onChange={(event) => onValueChanged(event.target.valueAsNumber ?? 0)}
      />
    </label>
  );
}
