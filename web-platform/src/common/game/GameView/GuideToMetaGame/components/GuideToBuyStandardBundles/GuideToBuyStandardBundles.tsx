import { useAnalytics } from '@noice-com/common-ui';

import { GuideToMetaGameCard } from '../GuideToMetaGameCard/GuideToMetaGameCard';

import styles from './GuideToBuyStandardBundles.module.css';

import CardBundleStandard from '@assets/images/card-bundle_standard.webp';
import { Routes } from '@common/route';

export function GuideToBuyStandardBundles() {
  const { trackEvent } = useAnalytics();

  const onClick = () => {
    trackEvent({
      clientButtonClick: { action: 'matchEndCtaStore' },
    });
  };

  return (
    <GuideToMetaGameCard
      backgroundAsset={CardBundleStandard}
      backgroundAssetClassName={styles.backgroundAsset}
      color="teal"
      subtitle={
        <>
          You can purchase a <span className={styles.label}>Standard</span> card bundle in
          the store
        </>
      }
      title="Improve your cards!"
      to={Routes.Store}
      onClick={onClick}
    />
  );
}
