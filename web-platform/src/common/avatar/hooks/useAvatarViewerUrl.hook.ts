import { useConditionalOnce } from '@noice-com/common-react-core';
import { useFeatureFlags, useAvatarAnimations } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { AvatarViewerFromUrl, Graphics } from '@noice-com/web-renderer/src/legacy';
import { useRef, useState } from 'react';

interface HookResult {
  avatarViewer: Nullable<AvatarViewerFromUrl>;
  graphics: Nullable<Graphics>;
  ready: boolean;
}

export function useAvatarViewerUrl(): HookResult {
  const sceneRef = useRef<Nullable<AvatarViewerFromUrl>>(null);
  const [graphics, setGraphics] = useState<Nullable<Graphics>>(null);
  const [featureFlags, loadingFeatureFlags] = useFeatureFlags();
  const { animations, loading: isLoadingAnimations } = useAvatarAnimations();
  const [ready, setReady] = useState<boolean>(false);

  useConditionalOnce(() => {
    setReady(false);

    const flags = featureFlags?.values() || {};
    const g = new Graphics(null, flags, { compositor: { usePostProcessMask: false } });
    setGraphics(g);

    const scene = new AvatarViewerFromUrl(g, animations ?? [], {
      loadBackgroundMesh: false,
      loadShadowCatcher: true,
      applyShoeOffset: false,
    });
    sceneRef.current = scene;
    g.getRenderer().registerSandbox(scene);

    setReady(true);

    return () => {
      scene.destruct();
      g.destruct();
      sceneRef.current = null;
      setReady(false);
    };
  }, !loadingFeatureFlags && !isLoadingAnimations);

  return {
    avatarViewer: sceneRef.current,
    graphics,
    ready,
  };
}
