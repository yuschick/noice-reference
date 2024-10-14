import { useLegacyBooleanFeatureFlag } from '@noice-com/common-ui';
import { useEffect, useMemo, useState } from 'react';

import { useChannelContext } from '@common/channel';
import { ChannelRole } from '@common/profile';
import { useWidgetLayout } from '@common/widget/context';
import { ActionType, ActionsWidgetOptions, WidgetId } from '@common/widget/types';

interface HookResult {
  enabledActions: ActionType[];
  availableActions: ActionType[];
  toggleAction: (actionType: ActionType) => void;
}

const defaultActions = [ActionType.StreamInfo, ActionType.CameraDriveTransition];

const actionRoles: Record<ActionType, ChannelRole[]> = {
  [ActionType.StreamInfo]: [],
  [ActionType.CameraDriveTransition]: [ChannelRole.Moderator],
};

export function useActionsWidgetActions(): HookResult {
  const { userChannelRoles } = useChannelContext();
  const { layout, onOptionsChanged } = useWidgetLayout();
  const [widgetOptions, setWidgetOptions] = useState<ActionsWidgetOptions>();

  const [cameraTransitionsEnabled] = useLegacyBooleanFeatureFlag(
    'studioCameraTransitions',
    false,
  );

  const toggleAction = (actionType: ActionType) => {
    setWidgetOptions((prev) => {
      const enabledActions = prev?.enabledActions.includes(actionType)
        ? [...prev.enabledActions].filter((value) => value !== actionType)
        : [...(prev?.enabledActions ?? []), actionType];

      onOptionsChanged(WidgetId.Actions, { enabledActions });

      return { enabledActions };
    });
  };

  const availableActions = useMemo(() => {
    const actionEnabledMap: Record<ActionType, boolean> = {
      [ActionType.StreamInfo]: true,
      [ActionType.CameraDriveTransition]: cameraTransitionsEnabled,
    };

    return Object.values(ActionType)
      .filter((actionType) => actionEnabledMap[actionType])
      .filter((actionType) => {
        // Show all actions to admins
        if (userChannelRoles.includes(ChannelRole.Admin)) {
          return true;
        }

        // Show all actions to creator
        if (userChannelRoles.includes(ChannelRole.Streamer)) {
          return true;
        }

        // Show actions that user has permission for
        return actionRoles[actionType].some((role) => userChannelRoles.includes(role));
      });
  }, [cameraTransitionsEnabled, userChannelRoles]);

  useEffect(() => {
    const widgetOptionActions = (
      layout?.options?.[WidgetId.Actions] as ActionsWidgetOptions
    )?.enabledActions;

    if (!widgetOptionActions) {
      setWidgetOptions({
        enabledActions: defaultActions.filter((actionType) =>
          availableActions.includes(actionType),
        ),
      });
      return;
    }

    const filteredWidgetOptionActions = widgetOptionActions.filter((actionType) =>
      availableActions.includes(actionType),
    );

    // Update widget options if they are not the same as the filtered ones
    onOptionsChanged(WidgetId.Actions, {
      enabledActions: filteredWidgetOptionActions,
    });
    setWidgetOptions({ enabledActions: filteredWidgetOptionActions });
  }, [availableActions, layout?.options, onOptionsChanged]);

  return {
    enabledActions: widgetOptions?.enabledActions ?? [],
    availableActions,
    toggleAction,
  };
}
