import { AnimatedPngPlayer } from '@noice-com/common-ui';

import styles from './CollectedCheckVfx.module.css';

import checkApng from '@assets/vfx/animated-check.png';

export function CollectedCheckVfx() {
  return (
    <div className={styles.animatedCollectedCheck}>
      <AnimatedPngPlayer
        animationCount={1}
        delay={150}
        duration={600}
        src={checkApng}
      />
    </div>
  );
}
