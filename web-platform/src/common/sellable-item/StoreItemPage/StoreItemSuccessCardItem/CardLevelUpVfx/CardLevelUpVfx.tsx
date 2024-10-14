import { VfxVideo } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './CardLevelUpVfx.module.css';

import vfxLoopUrlMp4 from '@assets/vfx/card-level-up-vfx-loop.mp4';
import vfxLoopUrlWebm from '@assets/vfx/card-level-up-vfx-loop.webm';
import vfxUrlMp4 from '@assets/vfx/card-level-up-vfx-simple.mp4';
import vfxUrlWebm from '@assets/vfx/card-level-up-vfx-simple.webm';

export interface Props {
  className?: string;
}

const vfxLoopVideos = [vfxLoopUrlWebm, vfxLoopUrlMp4];
const vfxVideos = [vfxUrlWebm, vfxUrlMp4];

export function CardLevelUpVfx({ className }: Props) {
  const classCustomName = className;

  return (
    <div className={classNames(classCustomName, styles.cardLevelUpVfx)}>
      <VfxVideo
        className={styles.videoWrapper}
        src={vfxVideos}
        isPlaying
      />
      <VfxVideo
        className={styles.videoWrapper}
        delay={2800}
        src={vfxLoopVideos}
        isPlaying
        loop
      />
    </div>
  );
}
