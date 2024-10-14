import { gql } from '@apollo/client';
import { ButtonLink, Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import { NotificationComponentBaseProps } from '../../types';

import styles from './StoreItemNotificationContent.module.css';

import { Routes } from '@common/route';
import { getUnopenedSellableItemImage } from '@common/sellable-item';
import {
  StoreItemNotificationContentStoreV2SellableItemFragment,
  StoreV2ItemType,
} from '@gen';

gql`
  fragment StoreItemNotificationContentStoreV2SellableItem on StoreV2SellableItem {
    name
    type
  }
`;

interface Props extends NotificationComponentBaseProps {
  storeItem: StoreItemNotificationContentStoreV2SellableItemFragment;
  onLinkClick(notificationId: string): void;
}

const getItemName = (
  name: StoreItemNotificationContentStoreV2SellableItemFragment['name'],
  type: StoreItemNotificationContentStoreV2SellableItemFragment['type'],
) => {
  if (type === StoreV2ItemType.ItemTypePremiumCardBundle) {
    return (
      <>
        a <span className={styles.bold}>premium card bundle</span>
      </>
    );
  }

  if (type === StoreV2ItemType.ItemTypeStandardCardBundle) {
    return (
      <>
        a <span className={styles.bold}>standard card bundle</span>
      </>
    );
  }

  return name;
};

export function StoreItemNotificationContent({
  notificationId,
  theme = 'light',
  storeItem,
  onLinkClick,
}: Props) {
  const { name, type } = storeItem;
  const image = getUnopenedSellableItemImage(type);

  return (
    <div className={classNames(styles.wrapper, styles[theme])}>
      <div className={styles.imageContainer}>
        {!!image && (
          <Image
            alt=""
            className={styles.image}
            loadingType="none"
            src={image}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.textContent}>
          <span>You have enough to purchase {getItemName(name, type)}!</span>
        </div>

        <ButtonLink
          size="sm"
          theme={theme === 'light' ? 'dark' : 'light'}
          to={Routes.Store}
          onClick={() => onLinkClick(notificationId)}
        >
          Go to the store
        </ButtonLink>
      </div>
    </div>
  );
}
