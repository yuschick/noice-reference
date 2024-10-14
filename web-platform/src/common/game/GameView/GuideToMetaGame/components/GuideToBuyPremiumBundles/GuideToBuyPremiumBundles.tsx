import { useAnalytics } from '@noice-com/common-ui';

import { GuideToMetaGameCard } from '../GuideToMetaGameCard/GuideToMetaGameCard';

import styles from './GuideToBuyPremiumBundles.module.css';

import CardBundlePremium from '@assets/images/card-bundle_premium.webp';
import { Routes } from '@common/route';

export function GuideToBuyPremiumBundles() {
  const { trackEvent } = useAnalytics();

  const onClick = () => {
    trackEvent({
      clientButtonClick: { action: 'matchEndCtaStore' },
    });
  };

  return (
    <GuideToMetaGameCard
      backgroundAsset={CardBundlePremium}
      backgroundAssetClassName={styles.backgroundAsset}
      color="magenta"
      subtitle={
        <>
          You can purchase a <span className={styles.label}>Premium</span> card bundle in
          the store
        </>
      }
      title="Improve your cards!"
      to={Routes.Store}
      onClick={onClick}
    />
  );
}
