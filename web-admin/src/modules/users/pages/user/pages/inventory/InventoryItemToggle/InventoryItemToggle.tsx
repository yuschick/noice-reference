import { gql } from '@apollo/client';
import { Icon } from '@noice-com/common-ui';
import { useId, useRef, useState } from 'react';
import { BiCheckCircle, BiEditAlt, BiMinusCircle } from 'react-icons/bi';
import { useParams } from 'react-router';

import { useEditInventoryItemCount } from '../hooks';

import styles from './InventoryItemToggle.module.css';

import { Button, IconButton, Toggle } from '@common/button';
import { Popout } from '@common/dialog';
import { Textarea } from '@common/input';
import {
  InventoryItemToggleInventoryItemFragment,
  InventoryItemToggleItemFragment,
} from '@gen';

interface Props {
  item: InventoryItemToggleItemFragment;
  inventoryItem: InventoryItemToggleInventoryItemFragment;
  toggleLabel: string;
}

export function InventoryItemToggle({ item, inventoryItem, toggleLabel }: Props) {
  const { userId } = useParams();
  const [toggleValue, setToggleValue] = useState(inventoryItem.itemCount > 0);
  const [showPopover, setShowPopover] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const { editInventoryItemCount, loading } = useEditInventoryItemCount(item);

  const id = useId();

  const handleSaveClick = () => {
    if (!userId || !reasonRef.current?.value) {
      return;
    }

    let itemCount = 0;

    // If there were items and the toggle is off, remove all items
    if (inventoryItem.itemCount > 0 && !toggleValue) {
      itemCount = inventoryItem.itemCount * -1;
    }

    // If there were no items and the toggle is on, reset to zero and add one item
    if (inventoryItem.itemCount <= 0 && toggleValue) {
      itemCount = inventoryItem.itemCount * -1 + 1;
    }

    editInventoryItemCount({
      userId,
      itemId: item.id,
      itemCount,
      reason: {
        administrative: {
          reason: reasonRef.current.value,
        },
      },
    });

    setShowPopover(false);
  };

  return (
    <div className={styles.wrapper}>
      {inventoryItem.itemCount > 0 ? (
        <Icon
          aria-label="Active"
          className={styles.enabledIcon}
          icon={BiCheckCircle}
          size={18}
        />
      ) : (
        <Icon
          aria-label="Inactive"
          className={styles.disabledIcon}
          icon={BiMinusCircle}
          size={18}
        />
      )}

      <IconButton
        aria-controls={id}
        aria-expanded={showPopover ? 'true' : 'false'}
        className={styles.inventoryEditButton}
        icon={BiEditAlt}
        ref={triggerButtonRef}
        text="Edit the item amount"
        onClick={() => setShowPopover(!showPopover)}
      />

      <Popout
        anchor={triggerButtonRef}
        id={id}
        isOpen={showPopover}
        placement="bottom-end"
        onOutsideClickCallback={() => setShowPopover(false)}
      >
        <form
          className={styles.editWrapper}
          onSubmit={handleSaveClick}
        >
          <div>
            <Toggle
              disabled={loading}
              label={toggleLabel}
              value={toggleValue}
              hideLabel
              onChange={(value) => setToggleValue(value)}
            />
          </div>

          <Textarea
            disabled={loading}
            label="Reason"
            ref={reasonRef}
            required
          />

          <div className={styles.buttonsWrapper}>
            <Button
              disabled={loading}
              text="Save"
              type="submit"
            />

            <Button
              buttonType="ghost"
              disabled={loading}
              text="Cancel"
              type="reset"
              onClick={() => setShowPopover(false)}
            />
          </div>
        </form>
      </Popout>
    </div>
  );
}

InventoryItemToggle.fragments = {
  entry: gql`
    fragment InventoryItemToggleInventoryItem on InventoryInventoryItem {
      itemId
      itemCount
    }
  `,
  item: gql`
    fragment InventoryItemToggleItem on ItemItem {
      ...EditedInventoryItem
    }
  `,
};
