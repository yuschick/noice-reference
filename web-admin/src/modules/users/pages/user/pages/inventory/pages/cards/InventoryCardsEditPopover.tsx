import { gql } from '@apollo/client';
import { useId, useRef, useState } from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { useParams } from 'react-router';

import { useEditInventoryItemCount } from '../../hooks';

import styles from './InventoryCards.module.css';

import { Button, IconButton } from '@common/button';
import { Popout } from '@common/dialog';
import { TextField, Textarea } from '@common/input';
import {
  InventoryCardsEditPopoverInventoryItemFragment,
  InventoryCardsEditPopoverItemFragment,
} from '@gen';

interface Props {
  activeCardToEdit: InventoryCardsEditPopoverInventoryItemFragment;
  item: InventoryCardsEditPopoverItemFragment;
}

export function InventoryCardsEditPopover({ activeCardToEdit, item }: Props) {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const countInputRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const { userId } = useParams();
  const id = useId();
  const { editInventoryItemCount, loading } = useEditInventoryItemCount(item);

  const handleSaveClick = () => {
    if (
      !countInputRef.current ||
      !reasonRef.current?.value ||
      !userId ||
      !activeCardToEdit
    ) {
      return;
    }

    editInventoryItemCount({
      itemCount: Number(countInputRef.current.value) - activeCardToEdit.itemCount,
      itemId: activeCardToEdit?.itemId,
      userId,
      reason: {
        administrative: {
          reason: reasonRef.current.value,
        },
      },
    });

    setShowPopover(false);
  };

  if (!activeCardToEdit) {
    return null;
  }

  return (
    <>
      <IconButton
        aria-controls={id}
        aria-expanded={showPopover ? 'true' : 'false'}
        className={styles.inventoryCardEditButton}
        icon={BiEditAlt}
        ref={triggerButtonRef}
        text="Edit the card amount"
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
          <TextField
            defaultValue={activeCardToEdit.itemCount}
            disabled={loading}
            label="Amount"
            min={0}
            ref={countInputRef}
            type="number"
            required
          />

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
    </>
  );
}

InventoryCardsEditPopover.fragments = {
  item: gql`
    fragment InventoryCardsEditPopoverItem on ItemItem {
      ...EditedInventoryItem
    }
  `,
  inventoryItem: gql`
    fragment InventoryCardsEditPopoverInventoryItem on InventoryInventoryItem {
      itemId
      itemCount
    }
  `,
};
