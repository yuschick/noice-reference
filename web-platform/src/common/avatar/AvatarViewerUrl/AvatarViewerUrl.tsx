import { LoadingSpinner } from '@noice-com/common-ui';
// We need to import this directly because of threejs related importing issue
// eslint-disable-next-line no-restricted-imports
import { RenderCanvasContainer } from '@noice-com/common-ui/src/components/RendererCanvasContainer';
import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { useEffect, useState } from 'react';

import { useAvatarViewerUrl as useAvatarViewerFromUrl } from '../hooks/useAvatarViewerUrl.hook';

import styles from './AvatarViewerUrl.module.css';

interface Props {
  url: string;
}

export function AvatarViewerUrl({ url }: Props) {
  const { avatarViewer, graphics, ready } = useAvatarViewerFromUrl();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!avatarViewer || avatarViewer.loadingAvatar || !ready || !url) {
      return;
    }

    setLoading(true);

    avatarViewer.setAvatarFromUrl(
      url,
      () => {
        setLoading(false);
      },
      AnimationCategory.CATEGORY_PLAYER_JOIN,
      false,
    );
  }, [avatarViewer, ready, url]);

  return (
    <div className={styles.avatarViewerUrlContainer}>
      {loading && (
        <div className={styles.loadingSpinnerWrapper}>
          <LoadingSpinner />
        </div>
      )}
      {graphics ? <RenderCanvasContainer graphics={graphics} /> : null}
    </div>
  );
}
