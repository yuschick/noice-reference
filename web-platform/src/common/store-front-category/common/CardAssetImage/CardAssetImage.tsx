import { Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './CardAssetImage.module.css';

import { getUnopenedSellableItemImage } from '@common/sellable-item';
import { StoreV2ItemType } from '@gen';

interface Props {
  className?: string;
  type: StoreV2ItemType;
  size?: 'sm' | 'm';
}

export function CardAssetImage({ type, className, size }: Props) {
  const imageSrc = getUnopenedSellableItemImage(type);

  return (
    <div className={classNames(className, styles.wrapper)}>
      {!!imageSrc && (
        <Image
          alt=""
          className={classNames(styles.card, {
            [styles.sizeM]: !size || size === 'm',
            [styles.sizeSm]: size === 'sm',
          })}
          src={imageSrc}
        />
      )}
    </div>
  );
}
