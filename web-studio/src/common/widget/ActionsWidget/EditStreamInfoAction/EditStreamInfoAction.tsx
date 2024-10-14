import { useAnalytics, useDialog } from '@noice-com/common-ui';
import {
  AnalyticsEventStudioWidgetActionsAction,
  AnalyticsEventStudioWidgetActionsOrigin,
} from '@noice-com/schemas/analytics/analytics.pb';

import { ActionButton } from '../ActionButton/ActionButton';

import { useChannelContext } from '@common/channel';
import { ModalDialog } from '@common/modal';
import {
  EditCategory,
  EditStreamTitle,
  MatureRatedContentSwitch,
} from '@common/settings';

export function EditStreamInfoAction() {
  const { channelId } = useChannelContext();
  const { trackEvent } = useAnalytics();
  const store = useDialog({
    title: 'Edit Stream Info',
  });

  const handleActionClick = () => {
    trackEvent({
      clientStudioWidgetActions: {
        action: AnalyticsEventStudioWidgetActionsAction.ACTION_EDIT_STREAM_INFO,
        channelId,
        origin: window.externalStudioWidget
          ? AnalyticsEventStudioWidgetActionsOrigin.ORIGIN_EXTERNAL
          : AnalyticsEventStudioWidgetActionsOrigin.ORIGIN_STUDIO,
      },
    });

    store.actions.open();
  };

  return (
    <>
      <ActionButton
        color="teal"
        onClick={handleActionClick}
      >
        Edit stream info
      </ActionButton>

      <ModalDialog store={store}>
        <EditStreamTitle />

        <EditCategory />

        <MatureRatedContentSwitch />
      </ModalDialog>
    </>
  );
}
