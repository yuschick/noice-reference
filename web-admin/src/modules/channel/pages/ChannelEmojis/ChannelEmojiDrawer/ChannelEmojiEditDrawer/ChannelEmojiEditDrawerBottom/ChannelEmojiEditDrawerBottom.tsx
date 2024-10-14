import { gql } from '@apollo/client';
import { useState } from 'react';
import { BiTrash } from 'react-icons/bi';

import styles from './ChannelEmojiEditDrawerBottom.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { showSnackbar } from '@common/snackbar';
import { ChannelEmojisDocument, useDeleteChannelEmojiMutation } from '@gen';

gql`
  mutation DeleteChannelEmoji($id: ID!, $channelId: ID!) {
    deleteChannelEmoji(id: $id, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  channelId: string;
  emojiId: string;
}

export function ChannelEmojiEditDrawerBottom({ channelId, emojiId }: Props) {
  const [showDeleteView, setShowDeleteView] = useState(false);

  const { forceCloseDrawer } = useDrawer();

  const [deleteEmoji, { loading }] = useDeleteChannelEmojiMutation({
    variables: {
      id: emojiId,
      channelId,
    },
    refetchQueries: [ChannelEmojisDocument],
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
