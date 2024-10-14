import { SubscriptionSectionLink } from '../MonetizationSubscriptions/SubscriptionSection/SubscriptionSection';

import { useCreatorCardLinks } from './hooks';

import { PageHeading } from '@common/layout';

export function MonetizationCreatorCards() {
  const { toCreatorCardList } = useCreatorCardLinks();

  return (
    <>
      <PageHeading
        headingLevel="h2"
        title="Creator Cards"
      />

      <SubscriptionSectionLink
        description="Your creator cards that channel viewers can purchase and play Noice Prediction with."
        label="Creator cards"
        to={toCreatorCardList}
      />
    </>
  );
}
