import { useMountEffect } from '@noice-com/common-react-core';
import {
  useEffectsVolume,
  useMuteAudio,
  useStreamVolume,
  useToggle,
  IconButton,
  useOnOutsideClick,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { IoVolumeHigh, IoVolumeLow, IoVolumeMedium, IoVolumeMute } from 'react-icons/io5';

import styles from './VolumeControl.module.css';

interface Props {
  className?: string;
  label: string;
  volume: number;
  setVolume: (volume: number) => void;
}

export function StreamVolumeControl({ className }: { className?: string }) {
  const [streamVolume, setStreamVolume] = useStreamVolume();

  return (
    <VolumeControl
      className={className}
      label="Stream"
      setVolume={setStreamVolume}
      volume={streamVolume}
    />
  );
}

export function EffectsVolumeControl() {
  const [effectsVolume, setEffectsVolume] = useEffectsVolume();

  useMountEffect(() => {
    setEffectsVolume(Math.min(0.5, effectsVolume));
  });

  return (
    <VolumeControl
      label="Stream Highlights"
      setVolume={setEffectsVolume}
      volume={effectsVolume}
    />
  );
}

const getVolumeIcon = (volume: number) => {
  if (volume === 0) {
    return IoVolumeMute;
  }

  if (volume < 0.33) {
    return IoVolumeLow;
  }

  if (volume < 0.66) {
    return IoVolumeMedium;
  }

  return IoVolumeHigh;
};

function VolumeControl({ className, label, setVolume, volume }: Props) {
  const [showVolumeControl, toggle, _open, close] = useToggle(false);
  const [, setMuted] = useMuteAudio();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const onOutsideClickCallback = useCallback(
    (event: MouseEvent) => {
      if (!showVolumeControl) {
        return;
      }

      if (!buttonRef?.current) {
        return;
      }

      // If the element clicked on is the action element opening the wrapper,
      // let's do nothing here
      if (buttonRef.current.contains(event.target as Node)) {
        return;
      }

      close();
    },
    [close, showVolumeControl],
  );

  useOnOutsideClick(panelRef, onOutsideClickCallback);

  useMountEffect(() => {
    setMuted(false);
  });

  const onChange = (value: number) => {
    setVolume(value);
  };

  return (
    <div className={classNames(styles.volumeControl, className)}>
      <IconButton
        icon={getVolumeIcon(volume)}
        label={`Control ${label} volume`}
        ref={buttonRef}
        size="xs"
        variant="ghost"
        onClick={toggle}
      />

      {showVolumeControl && (
        <div
          className={styles.panel}
          ref={panelRef}
        >
          <label className={styles.inputWrapper}>
            <span className={styles.value}>{volume.toFixed(2)}</span>

            <input
              aria-label={`Set ${label} volume`}
              aria-orientation="vertical"
              className={styles.range}
              max={1}
              min={0}
              step={0.02}
              type="range"
              value={volume}
              onChange={(event) => onChange(event.target.valueAsNumber ?? 0)}
            />
          </label>
        </div>
      )}
    </div>
  );
}
