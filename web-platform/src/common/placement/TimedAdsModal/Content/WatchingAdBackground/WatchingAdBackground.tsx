import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { LoadingSpinner, useMuteAudio } from '@noice-com/common-ui';
import { useRef } from 'react';

import styles from './WatchingAdBackground.module.css';

import { Notifications, useNotifications } from '@common/notification';
import {
  AD_DISMISSED_EVENT_NAME,
  AD_INTERRUPTED_EVENT_NAME,
  AD_VIEWED_EVENT_NAME,
} from '@common/placement/constants';

interface Props {
  giveReward(isAdWatched: boolean): void;
  onAdDismissed(): void;
}

export function WatchingAdBackground({ giveReward, onAdDismissed }: Props) {
  const [muted, setMuted] = useMuteAudio();
  const originalMutedValue = useRef<boolean>(muted);

  const {
    actions: { addNotification },
  } = useNotifications();

  useMountEffect(() => {
    originalMutedValue.current = muted;
    setMuted(true);

    return () => {
      setMuted(originalMutedValue.current);
    };
  });

  const onAdWatched = () => {
    giveReward(true);
  };

  const onAdInterrupted = () => {
    addNotification({
      component: {
        type: Notifications.GenericNotificationContent,
        props: {
          icon: CoreAssets.Icons.Exclamation,
          description: 'Ad Dismissed',
          subtext:
            'This could be because the browser window was resized or there was an error loading the ad',
        },
      },
    });
  };

  useMountEffect(() => {
    window.addEventListener(AD_VIEWED_EVENT_NAME, onAdWatched);
    window.addEventListener(AD_DISMISSED_EVENT_NAME, onAdDismissed);
    window.addEventListener(AD_INTERRUPTED_EVENT_NAME, onAdInterrupted);

    return () => {
      window.removeEventListener(AD_VIEWED_EVENT_NAME, onAdWatched);
      window.removeEventListener(AD_DISMISSED_EVENT_NAME, onAdDismissed);
      window.removeEventListener(AD_INTERRUPTED_EVENT_NAME, onAdInterrupted);
    };
  });

  return (
    <div className={styles.wrapper}>
      <LoadingSpinner size="lg" />
    </div>
  );
}
