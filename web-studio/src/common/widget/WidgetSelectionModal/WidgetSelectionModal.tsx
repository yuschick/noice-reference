import { useFeatureFlags, useMountEffect } from '@noice-com/common-react-core';
import { Button, UseDialogResult, Dialog } from '@noice-com/common-ui';
import { IFeatureFlags } from '@noice-com/platform-client';
import { useMemo } from 'react';
import { getLeaves } from 'react-mosaic-component';

import { AvailableWidgets } from '../constants';
import { useWidgetLayout } from '../context';
import { WidgetId } from '../types';

import styles from './WidgetSelectionModal.module.css';

interface WidgetSelectionModalProps {
  dialog: UseDialogResult;
  resetFirst?: boolean;
}

const getAvailabeWidgets = (featureFlags: IFeatureFlags) => {
  const availableWidgets = { ...AvailableWidgets };

  const checkRights = (flag: string) => featureFlags.get(flag, 'false') === 'true';

  if (!checkRights('universalMatchChallenges')) {
    // @ts-ignore
    delete availableWidgets[WidgetId.Challenges];
  }

  // @ts-ignore
  delete availableWidgets[WidgetId.StreamHighlights];

  return availableWidgets;
};

export function WidgetSelectionModal({ dialog, resetFirst }: WidgetSelectionModalProps) {
  const { layout, removeWidget, addWidget, resetAll } = useWidgetLayout();
  const [featureFlags, loadingFeatureFlags] = useFeatureFlags();

  const enabledWidgets = useMemo(
    () => (layout ? getLeaves(layout?.widgets) : []),
    [layout],
  );

  useMountEffect(() => {
    resetFirst && setTimeout(resetAll, 100);
  });

  if (loadingFeatureFlags || !featureFlags) {
    return null;
  }

  const widgets = Object.keys(getAvailabeWidgets(featureFlags)).sort((a, b) => {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    return 0;
  });

  return (
    <Dialog store={dialog}>
      <Dialog.Header />
      <Dialog.Close />
      <Dialog.Content>
        <div className={styles.widgetSelectionModal}>
          <ul className={styles.widgetList}>
            {widgets.map((widgetId) => {
              const enabled = enabledWidgets.includes(widgetId as WidgetId);

              return (
                <li
                  className={styles.widgetListItem}
                  key={widgetId}
                >
                  <div className={styles.actionButton}>
                    <Button
                      fit="container"
                      level={enabled ? 'secondary' : 'primary'}
                      size="sm"
                      theme="dark"
                      onClick={() =>
                        enabled
                          ? removeWidget(widgetId as WidgetId)
                          : addWidget(widgetId as WidgetId)
                      }
                    >
                      {enabled ? 'Remove' : 'Add'}
                    </Button>
                  </div>
                  <span className={styles.widgetName}>{widgetId}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          variant="cta"
          onClick={dialog.actions.close}
        >
          Done
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
