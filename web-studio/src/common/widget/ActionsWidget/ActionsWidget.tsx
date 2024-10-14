import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { useDialog } from '@noice-com/common-ui';

import { useWidgetMenu, isWidgetInLayout } from '../context';
import {
  ActionType,
  WidgetId,
  WidgetOfflineCheck,
  LiveChannelWidgetProps,
} from '../types';

import styles from './ActionsWidget.module.css';
import { EditStreamInfoAction } from './EditStreamInfoAction/EditStreamInfoAction';
import { useActionsWidgetActions } from './hooks/useActionsWidgetActions.hook';
import { IntermissionAction } from './IntermissionAction/IntermissionAction';
import { SelectActionsModal } from './SelectActionsModal/SelectActionsModal';

function ActionsWidget({ streamId }: LiveChannelWidgetProps) {
  const dialog = useDialog({ title: 'Select your actions' });

  const { setMenuOptions } = useWidgetMenu();

  const { availableActions, enabledActions, toggleAction } = useActionsWidgetActions();

  useMountEffect(() => {
    setMenuOptions([
      {
        icon: CoreAssets.Icons.SettingsStudio,
        text: 'Manage actions',
        onClick: dialog.actions.open,
      },
    ]);
  });

  return (
    <div className={styles.wrapper}>
      {enabledActions.includes(ActionType.StreamInfo) && <EditStreamInfoAction />}

      {enabledActions.includes(ActionType.CameraDriveTransition) && (
        <IntermissionAction streamId={streamId} />
      )}

      {/* Enabling and disabling action buttons in a dialog */}
      <SelectActionsModal
        availableActions={availableActions}
        dialog={dialog}
        enabledActions={enabledActions}
        toggleAction={toggleAction}
      />
    </div>
  );
}

export default {
  offline: ({ layout }: WidgetOfflineCheck) => {
    if (isWidgetInLayout(WidgetId.GameCrowd, layout)) {
      return null;
    }

    return {
      title: 'Widget not enabled',
      description: 'This widget needs to be used together with the Game & Crowd widget',
    };
  },
  id: WidgetId.Actions,
  Component: ActionsWidget,
} as const;
