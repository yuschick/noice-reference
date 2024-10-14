import { CoreAssets } from '@noice-com/assets-core';
import { useConditionalOnce } from '@noice-com/common-react-core';

import { useSoftwareRendering } from './useSoftwareRendering.hook';

import { Notifications, useNotifications } from '@common/notification';

export function useSoftwareRenderingNotification() {
  const { isSoftwareRendering, loading } = useSoftwareRendering();
  const {
    actions: { addNotification },
  } = useNotifications();

  useConditionalOnce(() => {
    addNotification({
      component: {
        type: Notifications.GenericNotificationContent,
        props: {
          icon: CoreAssets.Icons.Alert,
          description: 'Please enable hardware acceleration on your browser',
          subtext:
            "Your browser's hardware acceleration is turned off and you can only watch Noice in Theater mode. Please enable browser hardware acceleration and reload this page to use Arena mode",
        },
      },
      options: {
        duration: 10000,
      },
    });
  }, !loading && isSoftwareRendering);
}
