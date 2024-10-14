import { VfxVideo } from '@noice-com/common-ui';

import styles from './CollectVfx.module.css';

import vfxUrlMp4 from '@assets/vfx/seasons-reward-collect-vfx.mp4';
import vfxUrlWebm from '@assets/vfx/seasons-reward-collect-vfx.webm';

const vfxVideos = [vfxUrlWebm, vfxUrlMp4];

export function CollectVfx() {
  return (
    <div className={styles.collectRewardVfx}>
      <VfxVideo
        className={styles.rewardCollectVideo}
        src={vfxVideos}
        isPlaying
      />

      <div className={styles.collectVfxBgWrapper}>
        <div className={styles.collectVfxBg} />
        {'  '}
      </div>
    </div>
  );
}
