import { CoreAssets } from '@noice-com/assets-core';
import { CommonUtils, CurrencyIcon, Icon } from '@noice-com/common-ui';
import {
  RewardDescriptionPrizeDescription,
  RewardDescriptionPrizeDescriptionKind,
} from '@noice-com/schemas/ads/ads.pb';

import styles from './RewardIcon.module.css';

export interface RewardProps {
  item: RewardDescriptionPrizeDescription;
}

export function RewardIcon({ item }: RewardProps) {
  if (item.kind === RewardDescriptionPrizeDescriptionKind.KIND_CURRENCY) {
    const currencyId = CommonUtils.getWalletCurrencyId(item.value);

    if (!currencyId) {
      return null;
    }

    return (
      <CurrencyIcon
        size="lg"
        type={currencyId}
      />
    );
  }

  if (item.kind === RewardDescriptionPrizeDescriptionKind.KIND_EXPERIENCE_POINTS) {
    return (
      <Icon
        className={styles.xpBadge}
        icon={CoreAssets.Icons.XpBadge}
      />
    );
  }

  return null;
}
