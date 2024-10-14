import { CoreAssets } from '@noice-com/assets-core';
import { WithChildren } from '@noice-com/common-ui';
import { GenerateAvatarEventProgress } from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable } from '@noice-com/utils';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

import { AvatarSavingErrorNotificationContent } from './AvatarSavingErrorNotificationContent/AvatarSavingErrorNotificationContent';
import {
  AvatarSavingProgressNotificationContent,
  AvatarSavingProgressNotificationProps,
} from './AvatarSavingProgressNotificationContent/AvatarSavingProgressNotificationContent';
import {
  AvatarSaveProps,
  useAvatarSave as useAvatarSaveService,
} from './hooks/useAvatarSave.hook';

import { Notifications, useNotifications } from '@common/notification';
import { AddNotificationResult } from '@common/notification/types';

interface AvatarSaveProviderActions {
  saveAvatar(analyticsSessionId: string, avatar: AvatarSaveProps): void;
}

interface Context {
  actions: AvatarSaveProviderActions;
}

const AvatarSaveContext = createContext<Nullable<Context>>(null);
export function AvatarSaveProvider({ children }: WithChildren) {
  const progressNotification =
    useRef<Nullable<AddNotificationResult<AvatarSavingProgressNotificationProps>>>(null);
  const errorNotificationId = useRef<Nullable<string>>(null);
  const successNotificationId = useRef<Nullable<string>>(null);

  const { saveAvatar } = useAvatarSaveService();
  const {
    actions: { addNotification, removeNotification },
  } = useNotifications();

  const handleAvatarSave = useCallback(
    (analyticsSessionId: string, avatar: AvatarSaveProps) => {
      const removeNotifications = () => {
        progressNotification.current?.actions.remove();
        errorNotificationId.current && removeNotification(errorNotificationId.current);
        successNotificationId.current &&
          removeNotification(successNotificationId.current);
      };

      const onProgress = (progress: GenerateAvatarEventProgress) => {
        const totalProgress = Math.round(
          (((progress.stepIndex ?? 0) + (progress.progress ?? 0)) /
            (progress.stepCount ?? 0)) *
            100,
        );

        progressNotification?.current?.actions.update({ progress: totalProgress });
      };

      const onError = () => {
        removeNotifications();

        const { id } = addNotification({
          component: {
            type: AvatarSavingErrorNotificationContent,
            props: {
              onRetry: () => {
                handleAvatarSave(analyticsSessionId, avatar);
              },
            },
          },
          options: {
            duration: 0,
          },
          events: {
            onRemoved: () => {
              errorNotificationId.current = null;
            },
          },
        });

        errorNotificationId.current = id;
      };

      const onSaveStarted = () => {
        removeNotifications();

        progressNotification.current = addNotification({
          component: {
            type: AvatarSavingProgressNotificationContent,
            props: {
              progress: 0,
            },
          },
          options: {
            duration: 0,
          },
          events: {
            onRemoved: () => {
              progressNotification.current = null;
            },
          },
        });
      };

      const onSaved = () => {
        removeNotifications();

        const { id } = addNotification({
          component: {
            type: Notifications.GenericNotificationContent,
            props: {
              description: 'Avatar save completed',
              subtext: 'Your avatar was successfully saved',
              icon: CoreAssets.Icons.Check,
            },
          },
          events: {
            onRemoved: () => {
              successNotificationId.current = null;
            },
          },
        });

        successNotificationId.current = id;
      };

      saveAvatar(analyticsSessionId, avatar, {
        onProgress,
        onError,
        onSaveStarted,
        onSaved,
      });
    },
    [saveAvatar, addNotification, removeNotification],
  );

  const actions = useMemo<AvatarSaveProviderActions>(() => {
    return {
      saveAvatar: handleAvatarSave,
    };
  }, [handleAvatarSave]);

  return (
    <AvatarSaveContext.Provider
      value={{
        actions,
      }}
    >
      {children}
    </AvatarSaveContext.Provider>
  );
}

export function useAvatarSave() {
  const context = useContext(AvatarSaveContext);

  if (!context) {
    throw new Error('Trying to access avatar saving without AvatarSaveProvider');
  }

  return context;
}
