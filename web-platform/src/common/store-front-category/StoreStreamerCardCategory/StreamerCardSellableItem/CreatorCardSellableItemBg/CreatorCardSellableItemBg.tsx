import CreatorCardsBg from '../../../common/assets/NoiceCreditsCreatorCardsBg.webp';

import { CardItemBg } from '@common/store-front-category/common/CardItemBg/CardItemBg';

export function CreatorCardSellableItemBg() {
  return (
    <CardItemBg
      image={CreatorCardsBg}
      shouldDarkenBackground
      showBorder
    />
  );
}
