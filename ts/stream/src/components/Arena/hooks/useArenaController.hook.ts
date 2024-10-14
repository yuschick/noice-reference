import { useConditionalOnce } from '@noice-com/common-react-core';
import {
  useAuthenticatedUser,
  useAvatarAnimations,
  useFeatureFlags,
} from '@noice-com/common-ui';
import { makeLoggers, Nullable } from '@noice-com/utils';
import { useState } from 'react';

import { ArenaController } from '../classes/ArenaController';

const { logError } = makeLoggers('UseArenaController');

interface HookResult {
  canvas: Nullable<HTMLCanvasElement>;
  overlay: Nullable<HTMLDivElement>;
  controller: Nullable<ArenaController>;
}

export function useArenaController(): HookResult {
  const { userId } = useAuthenticatedUser();
  const [featureFlags, loadingFeatureFlags] = useFeatureFlags();
  const [canvas, setCanvas] = useState<Nullable<HTMLCanvasElement>>(null);
  const [overlay, setOverlay] = useState<Nullable<HTMLDivElement>>(null);
  const [controller, setController] = useState<Nullable<ArenaController>>(null);
  const { animations: avatarAnimations, loading: animationsLoading } =
    useAvatarAnimations();

  useConditionalOnce(() => {
    let worker: Worker;

    const controller = new ArenaController(
      featureFlags?.values() || {},
      userId,
      avatarAnimations ?? [],
    );
    controller.initialize().catch(() => {
      logError('Error initializing ArenaController');
    });

    setCanvas(controller.canvas);
    setOverlay(controller.overlay);

    setController(controller);

    return () => {
      worker?.terminate();
    };
  }, !!userId && !loadingFeatureFlags && !animationsLoading);

  return { controller, canvas, overlay };
}
