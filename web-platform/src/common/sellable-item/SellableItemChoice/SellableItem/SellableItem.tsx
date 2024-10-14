import { Icon, SvgComponent, VisuallyHidden } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './SellableItem.module.css';

interface Props {
  id?: string;
  className?: string;
  icon?: SvgComponent;
  iconColor?: string;
  itemName: string;
  formattedPrice: undefined | string;
  formattedOriginalPrice: undefined | string;
}

export const SellableItem = ({
  id,
  className,
  icon,
  iconColor,
  itemName,
  formattedPrice,
  formattedOriginalPrice,
}: Props) => {
  return (
    <div
      className={classNames(styles.sellableItemContent, className)}
      id={id}
    >
      <div className={styles.itemLabel}>
        {icon && (
          <Icon
            color={iconColor}
            icon={icon}
          />
        )}
        <p>{itemName}</p>
      </div>

      <div className={styles.sellableItemPrice}>
        {formattedPrice !== formattedOriginalPrice && (
          <s className={styles.sellableItemOriginalPrice}>
            {formattedOriginalPrice}
            <VisuallyHidden>Original price</VisuallyHidden>
          </s>
        )}
        {formattedPrice}
      </div>
    </div>
  );
};
