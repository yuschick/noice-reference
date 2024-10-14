import { useMountEffect } from '@noice-com/common-react-core';
import { LoadingSpinner, useFeatureFlags } from '@noice-com/common-ui';
// We need to import this directly because of threejs related importing issue
// eslint-disable-next-line no-restricted-imports
import { RenderCanvasContainer } from '@noice-com/common-ui/src/components/RendererCanvasContainer';
import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Nullable, makeLoggers } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import type { AvatarViewer, Graphics } from '@noice-com/web-renderer/src/legacy';
import { useEffect, useState } from 'react';

import { CameraSettings } from '../CategorySelect/types';

import { AnimatedEditorAvatar } from './AnimatedEditorAvatar';
import styles from './AvatarPreview.module.css';
import { useCameraZoom } from './hooks/useCameraZoom.hook';

const { logError } = makeLoggers('AvatarPreview');

interface Props {
  animatedAvatar: Nullable<AnimatedEditorAvatar>;
  cameraSettings: Nullable<CameraSettings>;
  isLoading: boolean;
}

export function AvatarPreview({ cameraSettings, animatedAvatar, isLoading }: Props) {
  const [graphics, setGraphics] = useState<Nullable<Graphics>>(null);
  const [scene, setScene] = useState<Nullable<AvatarViewer>>(null);
  const [featureFlags] = useFeatureFlags();

  useEffect(() => {
    if (!scene || !animatedAvatar) {
      return;
    }

    scene.setAvatar(animatedAvatar);
    animatedAvatar.triggerAnimationByCategory(AnimationCategory.CATEGORY_EDITOR_IDLE);
  }, [animatedAvatar, scene]);

  useCameraZoom({
    cameraSettings,
    avatarViewer: scene,
    avatar: animatedAvatar?.avatarComposition ?? null,
  });

  useMountEffect(() => {
    const flags = featureFlags?.values() || {};

    const promise = import('@noice-com/web-renderer/src/legacy')
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .then(({ AvatarViewer, Graphics }) => {
        const g = new Graphics(null, flags);
        setGraphics(g);

        const scene = new AvatarViewer(g, {
          loadBackgroundMesh: true,
          loadShadowCatcher: true,
          applyShoeOffset: false,
          setCameraYForDistance: true,
        });

        setScene(scene);

        g.getRenderer().registerSandbox(scene);

        return () => {
          scene.destruct();
          g.destruct();
        };
      });

    return () => {
      promise
        .then((destroy) => destroy())
        .catch((e) => logError('Failed to destroy AvatarPreview', e));
      setScene(null);
    };
  });

  return (
    <div className={styles.rendererWrapper}>
      {graphics && (
        <RenderCanvasContainer
          data-ftue-anchor="avatar-editor-3d-avatar"
          graphics={graphics}
        />
      )}

      {isLoading && (
        <div className={styles.avatarBuilderLoadingWrapper}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
