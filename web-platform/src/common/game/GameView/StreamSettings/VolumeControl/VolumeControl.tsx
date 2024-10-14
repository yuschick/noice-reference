import {
  Switch,
  useEffectsVolume,
  useMasterVolume,
  useMuteAudio,
  useStreamVolume,
  IconButton,
  useTriggerFTUEAction,
  FTUEActionType,
  usePopoverMenu,
  PopoverMenu,
  Tooltip,
} from '@noice-com/common-ui';
import { useCallback, useMemo } from 'react';
import { IoVolumeHigh, IoVolumeLow, IoVolumeMedium, IoVolumeMute } from 'react-icons/io5';

import styles from './VolumeControl.module.css';

export function VolumeControl() {
  const popover = usePopoverMenu({ placement: 'bottom' });
  const { toggle } = popover.actions;

  const [volumeMaster, setVolumeMaster] = useMasterVolume();
  const [volumeEffects, setVolumeEffects] = useEffectsVolume();
  const [volumeStream, setVolumeStream] = useStreamVolume();
  const [muted, setMuted] = useMuteAudio();
  const triggerFTUEAction = useTriggerFTUEAction();

  const volumeIcon = useMemo(() => {
    if (muted || !volumeMaster) {
      return IoVolumeMute;
    }

    if (volumeMaster < 0.33) {
      return IoVolumeLow;
    }

    if (volumeMaster < 0.66) {
      return IoVolumeMedium;
    }

    return IoVolumeHigh;
  }, [muted, volumeMaster]);

  const onToggleClick = useCallback(() => {
    if (!popover.state.popoverMenuIsOpen) {
      triggerFTUEAction(FTUEActionType.VolumeControlOpen);
    }

    toggle();
  }, [popover.state.popoverMenuIsOpen, toggle, triggerFTUEAction]);

  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const onMasterChanged = useCallback(
    (value: number) => {
      setVolumeMaster(value);

      if (muted) {
        setMuted(false);
      }
    },
    [muted, setMuted, setVolumeMaster],
  );

  const onEffectsChanged = useCallback(
    (value: number) => {
      setVolumeEffects(value);

      if (muted) {
        setMuted(false);
      }
    },
    [muted, setMuted, setVolumeEffects],
  );

  const onStreamChanged = useCallback(
    (value: number) => {
      setVolumeStream(value);

      if (muted) {
        setMuted(false);
      }
    },
    [muted, setMuted, setVolumeStream],
  );

  const volumeRanges = useMemo(
    () => [
      {
        label: 'Master',
        value: muted ? 0 : volumeMaster,
        onChange: onMasterChanged,
      },
      {
        label: 'Effects',
        value: muted ? 0 : volumeEffects,
        onChange: onEffectsChanged,
      },
      {
        label: 'Stream',
        value: muted ? 0 : volumeStream,
        onChange: onStreamChanged,
      },
    ],
    [
      muted,
      onEffectsChanged,
      onMasterChanged,
      onStreamChanged,
      volumeEffects,
      volumeMaster,
      volumeStream,
    ],
  );

  return (
    <>
      <Tooltip
        content="Volume"
        forceState={popover.state.popoverMenuIsOpen ? 'hide' : undefined}
        placement="top"
        triggerRef={popover.state.popoverMenuTriggerRef}
      >
        <IconButton
          data-ftue-anchor="volumeAdjustIcon"
          icon={volumeIcon}
          label="Volume Control"
          variant="ghost"
          onClick={onToggleClick}
        />
      </Tooltip>

      <PopoverMenu store={popover}>
        <PopoverMenu.Section>
          <div className={styles.muteWrapper}>
            <span className={styles.label}>Volume on</span>
            <Switch
              checked={!muted}
              label="Toggle volume"
              labelType="hidden"
              onChange={toggleMute}
            />
          </div>
        </PopoverMenu.Section>

        <PopoverMenu.Divider />

        <PopoverMenu.Section>
          {volumeRanges.map(({ label, value, onChange }) => (
            <label key={label}>
              <span className={styles.rangeTitleWrapper}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value.toFixed(2)}</span>
              </span>

              <input
                className={styles.range}
                max={1}
                min={0}
                step={0.02}
                type="range"
                value={value}
                onChange={(event) => onChange(event.target.valueAsNumber ?? 0)}
              />
            </label>
          ))}
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
