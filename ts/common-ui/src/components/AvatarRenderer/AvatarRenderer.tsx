import { useConditionalOnce } from '@noice-com/common-react-core';
import { Nullable } from '@noice-com/utils';
// eslint-disable-next-line no-restricted-imports
import { AvatarViewerFromUrl, Graphics } from '@noice-com/web-renderer/src/legacy';
import classNames from 'classnames';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

import { RenderCanvasContainer } from '../RendererCanvasContainer';

import styles from './AvatarRenderer.module.css';

import { useFeatureFlags } from '@common-context';
import { useAvatarAnimations } from '@common-hooks';

interface Props {
  url: string;
  className?: string;
  disableLoadingContainer?: boolean;
}

export function AvatarRenderer({
  url,
  className,
  disableLoadingContainer = false,
}: Props) {
  const sceneRef = useRef<Nullable<AvatarViewerFromUrl>>(null);
  const [graphics, setGraphics] = useState<Graphics>();
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [featureFlags] = useFeatureFlags();

  const { animations, loading: isLoadingAnimations } = useAvatarAnimations();

  const onLoadingStateChanged = useCallback((loading: boolean) => {
    setIsLoadingAvatar(loading);

    if (!loading) {
      setLoadingPercent(0);
    }
  }, []);

  const flags = featureFlags?.values() || {};

  useConditionalOnce(() => {
    const g = new Graphics(null, flags);
    setGraphics(g);

    const applyShoeOffset =
      featureFlags?.get('avatars_applyShoeOffset', 'false') === 'true';
    const scene = new AvatarViewerFromUrl(g, animations || [], {
      loadBackgroundMesh: false,
      loadShadowCatcher: false,
      applyShoeOffset: applyShoeOffset,
    });
    scene.onLoadingHandler = onLoadingStateChanged;

    sceneRef.current = scene;

    g.getRenderer().registerSandbox(scene);

    return () => {
      scene.onLoadingHandler = undefined;
      scene.onLoadingProgressHandler = undefined;
      scene.destruct();

      g.destruct();
    };
  }, !isLoadingAnimations);

  useEffect(() => {
    if (sceneRef.current === null) {
      return;
    }

    // Create a new loading handler for this particular avatar
    sceneRef.current.onLoadingProgressHandler = (avatar, current, total) => {
      if (avatar === url) {
        setLoadingPercent(current / total);
      }
    };

    sceneRef.current.setAvatarFromUrl(url);
  }, [url, isLoadingAnimations]);

  return (
    <div className={className}>
      <div
        className={classNames(styles.loadingContainer, {
          [styles.hide]: disableLoadingContainer || !isLoadingAvatar,
        })}
      >
        <div className={styles.loadingLabel}>Loading avatar</div>
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={loadingPercent}
          className={styles.barContainer}
          role="progressbar"
          title="Loading avatars"
        >
          <div
            className={styles.barProgress}
            style={{ '--loading-percent': loadingPercent } as CSSProperties}
          />
        </div>
      </div>
      {graphics && <RenderCanvasContainer graphics={graphics} />}
    </div>
  );
}
