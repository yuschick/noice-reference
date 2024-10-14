import { gql } from '@apollo/client';
import { FormEvent, useState } from 'react';

import styles from './DeleteChannelModal.module.css';

import { Button } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { TextField } from '@common/input';
import { showSnackbar } from '@common/snackbar';
import { useDeleteChannelMutation, DeleteChannelModalChannelFragment } from '@gen';

gql`
  mutation DeleteChannel($id: ID!) {
    deleteChannel(id: $id) {
      emptyTypeWorkaround
    }
  }

  fragment DeleteChannelModalChannel on ChannelChannel {
    id
    name
  }
`;

interface Props {
  channel: DeleteChannelModalChannelFragment;
  onClose(): void;
  onAfterDeleting(): void;
}

export const DeleteChannelModal = ({ channel, onClose, onAfterDeleting }: Props) => {
  const [confirmationText, setConfirmationText] = useState('');

  const { name, id } = channel;

  const [deleteChannel, { loading }] = useDeleteChannelMutation({
    variables: { id },
    onError: (err) => {
      showSnackbar('error', `Failed to delete channel. Reason: ${err.message}`);
    },
    onCompleted: () => {
      showSnackbar('info', 'Channel is deleted.');
      onAfterDeleting();
      onClose();
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    deleteChannel();
  };

  return (
    <ModalDialog
      title="Confirm delete channel"
      isOpen
      onClose={onClose}
    >
      <form onSubmit={onSubmit}>
        <div className={styles.textWrapper}>
          <p>Deleting the channel will</p>

          <ul className={styles.list}>
            <li>Delete all channel followers</li>
            <li>Cancel renewal of all channel subscriptions</li>
            <li>Mark channel as deleted and private</li>
            <li>
              Revoke all channel specific roles including <code>streamer</code>
            </li>
            <li>
              Change channel name to <code>{name}_deleted_XX</code>
            </li>
            <li>Suspend streaming to the channel</li>
            <li>Are you sure you want to delete channel {name}?</li>
          </ul>
        </div>

        <TextField
          className={styles.confirmationInput}
          label="Type channel name to confirm deletion"
          placeholder={name}
          onChange={setConfirmationText}
        />
        <div className={styles.actions}>
          <Button
            buttonType="danger"
            disabled={confirmationText !== name || loading}
            size="small"
            text="Yes, delete channel"
            type="submit"
          />

          <Button
            buttonType="ghost"
            color="red"
            size="small"
            text="No"
            type="button"
            onClick={onClose}
          />
        </div>
      </form>
    </ModalDialog>
  );
};
