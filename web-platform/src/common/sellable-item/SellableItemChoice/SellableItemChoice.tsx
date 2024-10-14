import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import { SellableItem } from './SellableItem';
import styles from './SellableItemChoice.module.css';

export interface SelectableSellableItem
  extends React.ComponentProps<typeof SellableItem> {
  id: string;
}

export interface Props {
  items: SelectableSellableItem[];
  selectedItemId: string;
  onSelect: (itemId: string) => void;
}

export const SellableItemChoice = ({
  items,
  selectedItemId,
  onSelect: onSelectProp,
}: Props) => {
  const [selectedId, setSelectedItemId] = useState(selectedItemId);
  const onSelect = (id: string) => {
    setSelectedItemId(id);
    onSelectProp(id);
  };

  return (
    <ul className={styles.items}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;

        return (
          <li key={item.id}>
            <label className={styles.selectableItem}>
              <input
                aria-describedby={item.id}
                type="radio"
                onClick={() => onSelect(item.id)}
              />
              <SellableItem
                {...item}
                className={classNames({
                  [styles.selected]: isSelected,
                })}
              />
              {isSelected && (
                <div className={styles.selectedIcon}>
                  <Icon
                    color="violet-magenta-main"
                    icon={CoreAssets.Icons.CheckCircle}
                  />
                </div>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
};
