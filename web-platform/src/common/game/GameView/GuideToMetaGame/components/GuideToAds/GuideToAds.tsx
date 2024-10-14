import { GuideToMetaGameCard } from '../GuideToMetaGameCard/GuideToMetaGameCard';

import styles from './GuideToAds.module.css';

import RewardBox from '@assets/images/end-screen-box.webp';

interface Props {
  rewardAmount: number;
  onClick?: () => void;
}

export function GuideToAds({ onClick, rewardAmount }: Props) {
  return (
    <>
      <GuideToMetaGameCard
        backgroundAsset={RewardBox}
        backgroundAssetClassName={styles.backgroundAsset}
        color="teal"
        subtitle={`Watch video ads to\n claim rewards!`}
        title={`${rewardAmount} rewards available!`}
        showHighlightAnimation
        showNewBadge
        onClick={onClick}
      />
    </>
  );
}
