import { VfxVideo } from '@noice-com/common-ui';

import styles from './CardLevelUpProgressBarVfx.module.css';

import vfxUrlMp4 from '@assets/vfx/card-progressbar-level-up-vfx.mp4';
import vfxUrlWebm from '@assets/vfx/card-progressbar-level-up-vfx.webm';

const vfxVideos = [vfxUrlWebm, vfxUrlMp4];

export function CardLevelUpProgressBarVfx() {
  return (
    <div className={styles.progressBarVfx}>
      <VfxVideo
        className={styles.videoWrapper}
        src={vfxVideos}
        isPlaying
      />
    </div>
  );
}
