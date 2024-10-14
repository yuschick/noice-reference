import { useClient } from '@noice-com/common-react-core';
import { useAnalytics, useUpdateAvatar } from '@noice-com/common-ui';
import {
  AvatarPart,
  AvatarPartCustomization,
  GenerateAvatarEventProgress,
} from '@noice-com/schemas/avatar/avatar.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
import { useCallback, useRef } from 'react';

import { AvatarComposition, AvatarCustomisations } from '../../types';

interface AvatarSaveCallbacks {
  onError?: SaveAvatarErrorCallback;
  onSaved?(): void;
  onProgress?(progress: GenerateAvatarEventProgress): void;
  onSaveStarted?(): void;
}

export interface AvatarSaveProps {
  avatarComposition: AvatarComposition;
  customisations: Nullable<AvatarCustomisations>;
}

export type SaveAvatarFunc = (
  sessionId: string,
  avatar: AvatarSaveProps,
  callbacks: AvatarSaveCallbacks,
) => Promise<boolean>;

type GenerateAvatarFunc = (
  avatar: AvatarSaveProps,
  callbacks: AvatarSaveCallbacks,
) => Promise<string>;

export type SaveAvatarErrorCallback = (
  sessionId: string,
  avatarComposition: AvatarComposition,
  customisations: Nullable<AvatarCustomisations>,
) => void;

interface HookResult {
  saveAvatar: SaveAvatarFunc;
}

const { logInfo, logError } = makeLoggers('AvatarSave');

export function useAvatarSave(): HookResult {
  const saving = useRef<boolean>(false);
  const [changeAvatarId] = useUpdateAvatar();
  const client = useClient();
  const { trackEvent } = useAnalytics();

  const generateAvatar: GenerateAvatarFunc = useCallback(
    async (avatar, callbacks) => {
      saving.current = true;

      const avatarPartIds: string[] = [];
      const { avatarComposition, customisations } = avatar;
      const { onProgress, onSaveStarted } = callbacks;

      for (const [_key, value] of avatarComposition) {
        value.id && avatarPartIds.push(value.id);
      }

      const avatarPartCustomizations: AvatarPartCustomization[] = [];

      if (customisations) {
        for (const [_key, value] of customisations) {
          avatarPartCustomizations.push(value);
        }
      }

      logInfo(
        `Generating avatar: `,
        JSON.stringify(avatarPartIds),
        JSON.stringify(avatarPartCustomizations),
      );

      const handleProgress = (progress: GenerateAvatarEventProgress) => {
        if (progress.progress === 0 && progress.stepIndex === 0) {
          onSaveStarted?.();
        }

        onProgress?.(progress);
      };

      const avatarId = await client.AvatarService.generateAvatar(
        avatarPartIds,
        avatarPartCustomizations,
        handleProgress,
      );

      logInfo(`Generated ${avatarId}`);

      return avatarId;
    },
    [client.AvatarService],
  );

  const saveAvatar: SaveAvatarFunc = useCallback(
    async (sessionId, avatar, callbacks): Promise<boolean> => {
      if (saving.current) {
        return false;
      }

      const { customisations, avatarComposition } = avatar;
      const { onError, onSaved } = callbacks;

      const customisationsArray = Array.from(customisations?.values() ?? []);

      const avatarParts: AvatarPart[] = [];

      for (const [_key, value] of avatarComposition) {
        !!value && avatarParts.push(value);
      }

      trackEvent({
        clientAvatarEditorSaveStarted: {
          avatarParts,
          avatarEditorSessionId: sessionId,
          customisations: customisationsArray,
        },
      });

      try {
        const avatarId = await generateAvatar(avatar, callbacks);
        await changeAvatarId({
          variables: {
            avatarId,
          },
          errorPolicy: 'all',
        });

        trackEvent({
          clientAvatarEditorSaveCompleted: {
            avatarId,
            avatarParts,
            avatarEditorSessionId: sessionId,
            customisations: customisationsArray,
          },
        });

        logInfo(`Saved ${avatarId}`);

        saving.current = false;
        onSaved?.();
        return true;
      } catch {
        logError('Failed to save avatar');
        saving.current = false;
        onError?.(sessionId, avatarComposition, customisations);
        return false;
      }
    },
    [changeAvatarId, generateAvatar, trackEvent],
  );

  return {
    saveAvatar,
  };
}
