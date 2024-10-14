import { gql } from '@apollo/client';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';

import styles from './PlatformEmojiEditDrawerBottom.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { showSnackbar } from '@common/snackbar';
import { PlatformEmojisDocument, useDeletePlatformEmojiMutation } from '@gen';

gql`
  mutation DeletePlatformEmoji($id: ID!) {
    deletePlatformEmoji(id: $id) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  emojiId: string;
}

export function PlatformEmojiEditDrawerBottom({ emojiId }: Props) {
  const [showDeleteView, setShowDeleteView] = useState(false);

  const { forceCloseDrawer } = useDrawer();

  const [deleteEmoji, { loading }] = useDeletePlatformEmojiMutation({
    variables: {
      id: emojiId,
    },
    refetchQueries: [PlatformEmojisDocument],
    onCompleted() {
      showSnackbar('positive', 'Emoji deleted');
      forceCloseDrawer();
    },
    onError(error) {
      showSnackbar('error', `Something went wrong when deleting emoji: ${error.message}`);
    },
  });

  return (
    <div className={styles.bottom}>
      {showDeleteView ? (
        <div className={styles.deleteContent}>
          <span>Delete the emoji?</span>

          <div className={styles.deleteButtons}>
            <Button
              buttonType="danger"
              disabled={loading}
              text="Delete"
              onClick={() => deleteEmoji()}
            />

            <Button
              buttonType="ghost"
              disabled={loading}
              text="Cancel"
              onClick={() => setShowDeleteView(false)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.bottomButtons}>
          <Button
            buttonType="success"
            text="Update Emoji"
            type="submit"
          />

          <Button
            buttonType="danger"
            icon={BiTrash}
            text="Delete emoji"
            type="button"
            hideText
            onClick={() => setShowDeleteView(true)}
          />
        </div>
      )}
    </div>
  );
}
