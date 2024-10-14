import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  ConfirmDialog,
  IconButtonLink,
  useConfirmDialog,
  useEmojiMediaUpload,
} from '@noice-com/common-ui';
import { DeepPartial, Nullable, makeLoggers } from '@noice-com/utils';
import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import { useSubscriptionsLinks } from '../../../hooks/useSubscriptionsLinks.hook';
import { ChannelEmojiFormContent } from '../ChannelEmojiFormContent/ChannelEmojiFormContent';
import { useChannelEmojiMaxAmount } from '../context';

import styles from './ChannelEmojisEdit.module.css';

import { useChannelContext } from '@common/channel';
import { LayoutBox, PageHeading } from '@common/layout';
import {
  EmojiListChannelEmojisResponse,
  QueryChannelEmojisArgs,
  useChannelEmojiQuery,
  useDeleteChannelEmojiMutation,
  useEditChannelEmojiMutation,
} from '@gen';

gql`
  query ChannelEmoji($id: ID!, $channelId: ID!) {
    emoji(id: $id) {
      id
      channelId
      ...ChannelEmojiFormContentEmoji
    }

    channel(id: $channelId) {
      id
      ...ChannelEmojiFormContentChannel
    }
  }

  mutation EditChannelEmoji(
    $id: ID!
    $channelId: ID!
    $label: String
    $disabled: Boolean
  ) {
    updateChannelEmoji(
      body: { id: $id, channelId: $channelId, label: $label, disabled: $disabled }
    ) {
      id
      label
      disabled
    }
  }

  mutation DeleteChannelEmoji($id: ID!, $channelId: ID!) {
    deleteChannelEmoji(id: $id, channelId: $channelId) {
      emptyTypeWorkaround
    }
  }
`;

const { logError } = makeLoggers('ChannelEmojisEdit');

export function ChannelEmojisEdit() {
  const { channelId } = useChannelContext();
  const { toEmojis } = useSubscriptionsLinks();
  const { emojiId } = useParams();
  const navigate = useNavigate();
  const { isMaxEmojiAmountReached, refetchMaxAmount } = useChannelEmojiMaxAmount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiLabel, setEmojiLabel] = useState('');
  const [emojiDisabled, setEmojiDisabled] = useState<boolean>();
  const [emojiFile, setEmojiFile] = useState<Nullable<File>>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const errorCount = useRef(0);

  const { data } = useChannelEmojiQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: emojiId!,
      channelId,
    },
    skip: !emojiId,
    onCompleted(data) {
      if (data?.emoji?.channelId !== channelId) {
        navigate(toEmojis, {
          replace: true,
        });
      }
    },
  });

  const [deleteEmoji] = useDeleteChannelEmojiMutation({
    update(cache) {
      cache.evict({
        id: cache.identify({
          __typename: 'EmojiEmoji',
          id: emojiId,
        }),
      });

      cache.gc();
    },
    onError(error) {
      toast.error(`Error while deleting emoji: ${error.message}`);
    },
    onCompleted() {
      refetchMaxAmount();
      navigate(toEmojis, {
        replace: true,
      });
      toast.success('Emoji deleted');
    },
  });

  const deleteConfirmDialog = useConfirmDialog({
    title: 'Are you sure you want to delete this emoji?',
    onConfirm() {
      if (!emojiId) {
        logError('No emoji id found');
        return;
      }

      deleteEmoji({
        variables: {
          id: emojiId,
          channelId,
        },
      });
    },
    onCancel() {},
  });

  const [editEmoji] = useEditChannelEmojiMutation({
    onError(error) {
      errorCount.current += 1;
      toast.error(`Error while updating emoji: ${error.message}`);
    },
    update(cache, _, { variables }) {
      // Do nothing if disabled is not changed
      if (typeof variables?.disabled !== 'boolean') {
        return;
      }

      cache.modify({
        fields: {
          channelEmojis(
            existingChannelEmojis: DeepPartial<EmojiListChannelEmojisResponse>,
            { storeFieldName, fieldName },
          ) {
            const { channelId: fieldChannelId } =
              getFieldsVariables<QueryChannelEmojisArgs>(storeFieldName, fieldName);

            if (fieldChannelId !== channelId) {
              return existingChannelEmojis;
            }

            if (typeof existingChannelEmojis.count?.disabled !== 'number') {
              return existingChannelEmojis;
            }

            const newDisabledCount =
              existingChannelEmojis.count.disabled + (data?.emoji?.disabled ? -1 : 1);

            return {
              ...existingChannelEmojis,
              count: {
                ...existingChannelEmojis.count,
                disabled: newDisabledCount,
              },
            };
          },
        },
      });
    },
  });

  const { uploadFile } = useEmojiMediaUpload({
    onError() {
      errorCount.current += 1;
      toast.error('Error while uploading image');
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    errorCount.current = 0;

    const emojiId = data?.emoji?.id;

    if (!emojiId) {
      toast.error('No emoji found');
      return;
    }

    setIsSubmitting(true);

    const promises = [];

    // File has changed, lets upload that
    if (emojiFile) {
      promises.push(async () => uploadFile(emojiId, emojiFile));
    }

    const hasEmojiLabelChanged = emojiLabel && emojiLabel !== data?.emoji?.label;
    const hasEmojiDisabledChanged =
      typeof emojiDisabled === 'boolean' && emojiDisabled !== data?.emoji?.disabled;

    // Label and/or disabled has changed, lets update those
    if (hasEmojiLabelChanged || hasEmojiDisabledChanged) {
      promises.push(async () =>
        editEmoji({
          variables: {
            label: emojiLabel ? emojiLabel : undefined,
            disabled: hasEmojiDisabledChanged ? emojiDisabled : undefined,
            id: emojiId,
            channelId,
          },
        }),
      );
    }

    await Promise.all(promises.map((p) => p()));

    setIsSubmitting(false);

    if (errorCount.current) {
      return;
    }

    if (promises.length) {
      toast.success('Emoji updated');
    }

    navigate(toEmojis);
  };

  const onReset = () => {
    navigate(toEmojis);
  };

  if (!data?.channel || !data?.emoji) {
    return null;
  }

  return (
    <>
      <div className={styles.headingWrapper}>
        <IconButtonLink
          icon={CoreAssets.Icons.ChevronLeft}
          label="Back to emojis"
          level="secondary"
          size="sm"
          to={toEmojis}
        />

        <PageHeading title="Edit emoji" />
      </div>

      <form
        ref={formRef}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <LayoutBox>
          <ChannelEmojiFormContent
            channel={data?.channel}
            emoji={data?.emoji}
            formRef={formRef}
            isMaxEmojiAmountReached={!isSubmitting && isMaxEmojiAmountReached}
            onCodeValueChange={setEmojiLabel}
            onDisabledValueChange={setEmojiDisabled}
            onImageValueChange={setEmojiFile}
          />

          <div className={styles.buttons}>
            <div className={styles.formButtons}>
              <Button
                fit="content"
                isLoading={isSubmitting}
                size="sm"
                type="submit"
                variant="cta"
              >
                Save emoji
              </Button>

              <Button
                fit="content"
                isDisabled={isSubmitting}
                level="secondary"
                size="sm"
                type="reset"
              >
                Cancel
              </Button>
            </div>

            <Button
              fit="content"
              isDisabled={isSubmitting}
              level="secondary"
              size="sm"
              type="button"
              onClick={() => deleteConfirmDialog.actions.open()}
            >
              Delete emoji
            </Button>
          </div>
        </LayoutBox>
      </form>

      <ConfirmDialog store={deleteConfirmDialog} />
    </>
  );
}
