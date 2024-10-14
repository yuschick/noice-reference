import { createPortal } from 'react-dom';

import { useNotifications } from '../context/NotificationProvider';

import { PopNotifications } from './PopNotifications';

export function PopNotificationsWrapper() {
  const portal = document.querySelector('#portals');

  const { notifications, actions } = useNotifications();

  if (!portal) {
    return null;
  }

  return (
    <>
      {createPortal(
        <PopNotifications
          notifications={notifications}
          removeNotification={actions.removeNotification}
        />,
        portal,
      )}
    </>
  );
}
