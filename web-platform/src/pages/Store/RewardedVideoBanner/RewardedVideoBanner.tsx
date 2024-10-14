import { Image } from '@noice-com/common-ui';

import styles from './RewardedVideoBanner.module.css';

import SmallRewardBoxes from '@assets/images/timed-ads-small-reward-boxes.webp';
import { AdContext, TimedAdsModal, useTimedAdsModal } from '@common/placement';
import { usePlaySound, AppSoundKeys } from '@common/sound';

export function RewardedVideoBanner() {
  const [playGenericHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const { isOpen, onOpen, onClose } = useTimedAdsModal(AdContext.TIMED_ADS_CONTEXT_STORE);

  return (
    <section>
      <button
        className={styles.rewardWrapper}
        type="button"
        onClick={onOpen}
        onMouseEnter={() => playGenericHoverSound()}
      >
        <div className={styles.content}>
          <div className={styles.boxWrapper}>
            <Image
              alt={'Reward box'}
              className={styles.boxImage}
              draggable={false}
              src={SmallRewardBoxes}
            />
          </div>

          <div className={styles.text}>
            <div className={styles.title}>Get more rewards</div>
            <div className={styles.subtitle}>by watching video ads</div>
          </div>
        </div>
      </button>

      {isOpen && <TimedAdsModal onClose={onClose} />}
    </section>
  );
}
