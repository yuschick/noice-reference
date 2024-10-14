import { Button } from '@noice-com/common-ui';

import { SubscriptionSettingItem } from '../../SubscriptionSettingItem/SubscriptionSettingItem';

import styles from './SubscriptionsList.module.css';

import { SubscriptionSettingItemSubscriptionFragment } from '@gen';

interface Props {
  subscriptions: SubscriptionSettingItemSubscriptionFragment[];
  onLoadMoreSubscriptions: () => void;
  hasNextPage: boolean;
  noSubscriptionsMessage: { title?: string; description: string };
}

export const SubscriptionsList = ({
  subscriptions,
  onLoadMoreSubscriptions,
  hasNextPage,
  noSubscriptionsMessage,
}: Props) => {
  if (!subscriptions.length) {
    return (
      <div className={styles.emptyWrapper}>
        {!!noSubscriptionsMessage.title && <p>{noSubscriptionsMessage.title}</p>}
        <p className={styles.emptySecondaryParagraph}>
          {noSubscriptionsMessage.description}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.list}>
        {subscriptions.map((subscription) => (
          <SubscriptionSettingItem
            key={subscription.id}
            subscription={subscription}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className={styles.loadMoreButtonWrapper}>
          <Button
            size="sm"
            onClick={onLoadMoreSubscriptions}
          >
            Show more subscriptions
          </Button>
        </div>
      )}
    </>
  );
};
