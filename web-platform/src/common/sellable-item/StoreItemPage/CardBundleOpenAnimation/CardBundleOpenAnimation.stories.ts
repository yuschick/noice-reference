import { CardBundleOpenAnimation } from './CardBundleOpenAnimation';

import { StoreV2ItemType } from '@gen';

export default {
  title: 'Store/Card Bundle Open Animation',
  component: CardBundleOpenAnimation,
};

export const Default = {
  args: {
    bundleType: StoreV2ItemType.ItemTypeStandardCardBundle,
    cardAmount: 5,
  },
};
