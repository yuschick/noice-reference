import { DateAndTimeUtils, StringUtils } from '@noice-com/utils';
import { RefObject, useEffect, useRef, useState } from 'react';

import styles from './ClipTimeController.module.css';
import {
  getMaxHours,
  getMaxMinutes,
  getMaxSeconds,
  getMinHours,
  getMinMinutes,
  getMinSeconds,
} from './utils';

import { Button } from '@common/button';
import { TextField } from '@common/input';

interface Props {
  value: number;
  label: string;
  min?: number;
  max?: number;
  videoDuration: number;
  isDisabled?: boolean;
  onSet(): void;
  onChange(value: number): void;
}

const pad = (num: number) => StringUtils.padStart(num.toString(), '0', 2);

export function ClipTimeController({
  isDisabled,
  label,
  min,
  max,
  videoDuration,
  onChange: onChangeProp,
  onSet,
  value,
}: Props) {
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!hoursInputRef.current || !minutesInputRef.current || !secondsInputRef.current) {
      return;
    }

    const timeInMilliSeconds = value * 1000;

    const hours = DateAndTimeUtils.getHours(timeInMilliSeconds);
    const minutes = DateAndTimeUtils.getMinutes(timeInMilliSeconds);
    const seconds = DateAndTimeUtils.getSeconds(timeInMilliSeconds);

    setHours(hours);
    setMinutes(minutes);

    hoursInputRef.current.value = pad(hours);
    minutesInputRef.current.value = pad(minutes);
    secondsInputRef.current.value = pad(seconds);
  }, [value]);

  const onChange = (value: string, ref: RefObject<HTMLInputElement>) => {
    if (!ref.current) {
      return;
    }

    if (parseInt(value, 10) < 10) {
      ref.current.value = `0${parseInt(value, 10)}`;
    } else {
      ref.current.value = `${parseInt(value, 10)}`;
    }

    const hours = parseInt(hoursInputRef.current?.value ?? '0', 10);
    const minutes = parseInt(minutesInputRef.current?.value ?? '0', 10);
    const seconds = parseInt(secondsInputRef.current?.value ?? '0', 10);

    setHours(hours);
    setMinutes(minutes);

    onChangeProp(hours * 60 * 60 + minutes * 60 + seconds);
  };

  return (
    <div className={styles.clipTimeController}>
      <div className={styles.timeInputWrapper}>
        <TextField
          className={styles.timeInput}
          defaultValue="00"
          label={`${label} hours`}
          max={getMaxHours(videoDuration, max)}
          min={getMinHours(min)}
          ref={hoursInputRef}
          type="number"
          hideLabel
          onChange={(value) => onChange(value, hoursInputRef)}
        />

        <span>:</span>

        <TextField
          className={styles.timeInput}
          defaultValue="00"
          label={`${label} minutes`}
          max={getMaxMinutes(videoDuration, hours, max)}
          min={getMinMinutes(hours, min)}
          ref={minutesInputRef}
          type="number"
          hideLabel
          onChange={(value) => onChange(value, minutesInputRef)}
        />

        <span>:</span>

        <TextField
          className={styles.timeInput}
          defaultValue="00"
          label={`${label} seconds`}
          max={getMaxSeconds(videoDuration, hours, minutes, max)}
          min={getMinSeconds(hours, minutes, min)}
          ref={secondsInputRef}
          type="number"
          hideLabel
          onChange={(value) => onChange(value, secondsInputRef)}
        />
      </div>

      <Button
        buttonType="ghost"
        disabled={isDisabled}
        text={`Set ${label}`}
        onClick={onSet}
      />
    </div>
  );
}
