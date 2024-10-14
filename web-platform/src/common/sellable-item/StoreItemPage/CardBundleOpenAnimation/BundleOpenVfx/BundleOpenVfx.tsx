import { VfxVideo } from '@noice-com/common-ui';

import styles from './BundleOpenVfx.module.css';

export interface Props {
  vfxVideo: string | string[];
}

export function BundleOpenVfx({ vfxVideo }: Props) {
  return (
    <div className={styles.bundleOpenVfx}>
      <VfxVideo
        className={styles.bundleOpenVfxVideo}
        src={vfxVideo}
        isPlaying
      />
    </div>
  );
}
