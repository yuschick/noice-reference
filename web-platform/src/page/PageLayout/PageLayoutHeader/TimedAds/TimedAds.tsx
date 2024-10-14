import { gql } from '@apollo/client';

import { ButtonExpanded } from './ButtonExpanded/ButtonExpanded';
import { ButtonIcon } from './ButtonIcon/ButtonIcon';
import styles from './TimedAds.module.css';

import {
  AdContext,
  TIMED_REWARDS_PLACEMENT_ID,
  TimedAdsModal,
  filterAvailableRewards,
  useTimedAdsModal,
} from '@common/placement';
import { useTimeAdsRewardsQuery } from '@gen';

gql`
  query TimeAdsRewards($placementId: ID!) {
    placement(placementId: $placementId) {
      placementId
      rewards {
        ...AvailableRewardsReward
      }
    }
  }
`;

export function TimedAds() {
  const { isOpen, onClose, onOpen } = useTimedAdsModal(
    AdContext.TIMED_ADS_CONTEXT_NAV_SIDEBAR,
  );

  const { data } = useTimeAdsRewardsQuery({
    variables: { placementId: TIMED_REWARDS_PLACEMENT_ID },
  });

  const availableRewardsAmount = filterAvailableRewards(
    data?.placement?.rewards ?? [],
  ).length;

  return (
    <>
      <div className={styles.iconWrapper}>
        <ButtonIcon
          adsExist={!!data?.placement}
          maxSegments={data?.placement?.rewards.length ?? 0}
          numSegments={availableRewardsAmount}
          onOpen={onOpen}
        />
      </div>

      <div className={styles.expandedWrapper}>
        <ButtonExpanded
          adsExist={!!data?.placement}
          numSegments={availableRewardsAmount}
          onOpen={onOpen}
        />
      </div>

      {isOpen && <TimedAdsModal onClose={onClose} />}
    </>
  );
}
