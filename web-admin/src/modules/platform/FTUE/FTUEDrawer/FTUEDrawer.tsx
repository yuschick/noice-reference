import { useLoadingPromise } from '@noice-com/common-ui';
import ftueConfig from '@noice-com/ftue-config';
import { useCallback, useEffect, useState } from 'react';

import styles from './FTUEDrawer.module.css';

import { Toggle } from '@common/button';
import { useDrawer } from '@common/drawer';
import { TextField, Textarea } from '@common/input';
import { showSnackbar } from '@common/snackbar';
import {
  FtueDismissalType,
  FtueDeleteDismissTooltipMutationFn,
  FtueDismissTooltipMutationFn,
} from '@gen';

interface Props {
  dismissedTooltips: string[];
  onToggleOff: FtueDeleteDismissTooltipMutationFn;
  onToggleOn: FtueDismissTooltipMutationFn;
  onToggleFinished(): Promise<unknown>;
}

export function FTUEDrawer({
  dismissedTooltips,
  onToggleOff,
  onToggleOn,
  onToggleFinished,
}: Props) {
  const [isDismissed, setIsDismissed] = useState(false);

  const { activeId: activeFTUEId } = useDrawer();

  useEffect(() => {
    // Reset dismissed when dismissed tooltips or active ftue id changes
    setIsDismissed(!!(activeFTUEId && dismissedTooltips.includes(activeFTUEId)));
  }, [activeFTUEId, dismissedTooltips]);

  const config = ftueConfig.find((config) => config.id === activeFTUEId);

  const onTogglePromise = useCallback(
    async (value: boolean) => {
      if (!activeFTUEId) {
        return;
      }

      setIsDismissed((prev) => !prev);

      try {
        value
          ? await onToggleOn({
              variables: {
                tooltipId: activeFTUEId,
                type: FtueDismissalType.DismissalTypeUnspecified,
              },
            })
          : await onToggleOff({ variables: { tooltipId: activeFTUEId } });

        await onToggleFinished();

        showSnackbar('info', 'FTUE state updated');
      } catch (e) {
        showSnackbar('error', 'Something went wrong');
        setIsDismissed((prev) => !prev);
      }
    },
    [onToggleOn, activeFTUEId, onToggleOff, onToggleFinished],
  );

  const [onToggle, toggleLoading] = useLoadingPromise(onTogglePromise);

  if (!config) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <TextField
        defaultValue={config.id}
        label="ID"
        readOnly
      />

      <TextField
        defaultValue={`#${config.priority}`}
        label="Priority"
        readOnly
      />

      <TextField
        defaultValue={config.uiElementAnchor}
        label="Anchor element"
        readOnly
      />

      <TextField
        defaultValue={config.action || ''}
        label="Action"
        readOnly
      />

      <Textarea
        defaultValue={config.criteria || ''}
        label="Criteria"
        rows={4}
        readOnly
      />

      <TextField
        defaultValue={config.hasDismissed || ''}
        label="Required component to be dismissed"
        readOnly
      />

      <TextField
        defaultValue={config.delayedShow || ''}
        label="Delay"
        readOnly
      />

      <Toggle
        disabled={toggleLoading}
        label="FTUE dismissed"
        offText="FTUE is available to you"
        value={isDismissed}
        onChange={onToggle}
        onText="FTUE is dismissed and no longer visible to you"
      />
    </div>
  );
}
