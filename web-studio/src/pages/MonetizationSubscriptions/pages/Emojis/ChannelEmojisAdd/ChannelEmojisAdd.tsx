import { gql } from '@apollo/client';
import { getFieldsVariables } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  Button,
  Callout,
  IconButtonLink,
  useEmojiMediaUpload,
} from '@noice-com/common-ui';
import { DeepPartial, Nullable } from '@noice-com/utils';
import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { generatePath, useNavigate } from 'react-router';

import { useSubscriptionsLinks } from '../../../hooks/useSubscriptionsLinks.hook';
import { ChannelEmojiFormContent } from '../ChannelEmojiFormContent/ChannelEmojiFormContent';
import { useChannelEmoji } from '../context/ChannelEmojiProvider';

import styles from './ChannelEmojisAdd.module.css';

import { useChannelContext } from '@common/channel';
import { LayoutBox, PageHeading } from '@common/layout';
import { SubscriptionsSubRoutes } from '@common/route';
import {
  EmojiListChannelEmojisResponse,
  QueryChannelEmojisArgs,
  useAddEmojiChannelQuery,
  useCreateEmojiMutation,
  useEnableCreatedEmojiMutation,
} from '@gen';

gql`
  query AddEmojiChannel($id: ID!) {
    channel(id: $id) {
      id
      name
    }
  }

  mutation CreateEmoji($label: String!, $channelId: ID!) {
    createChannelEmoji(label: $label, channelId: $channelId) {
      id
      label
      channelId
      disabled
    }
  }

  mutation EnableCreatedEmoji($id: ID!, $channelId: ID!) {
    updateChannelEmoji(body: { id: $id, channelId: $channelId, disabled: false }) {
      id
      disabled
    }
  }
`;

export function ChannelEmojisAdd() {
  const { channelId } = useChannelContext();
  const navigate = useNavigate();
  const { isMaxEmojiAmountReached } = useChannelEmoji();
  const { toEmojis } = useSubscriptionsLinks();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiLabel, setEmojiLabel] = useState('');
  const [emojiFile, setEmojiFile] = useState<Nullable<File>>(null);
  const [emojiDisabled, setEmojiDisabled] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const emojiIdRef = useRef<Nullable<string>>(null);

  const { data } = useAddEmojiChannelQuery({
    variables: {
      id: channelId,
    },
  });

  const navigateToEmojisPage = () => {
    navigate(toEmojis);
  };

  const navigateToEditPage = () => {
    if (!emojiIdRef.current) {
      navigateToEmojisPage();
      return;
    }

    navigate(
      generatePath(`${toEmojis}/${SubscriptionsSubRoutes.EmojiEdit}`, {
        emojiId: emojiIdRef.current,
      }),
    );
  };

  const onEmojiCreated = () => {
    setIsSubmitting(false);

    // Navigate to emoji list page after creating emoji
    navigateToEmojisPage();
    toast.success('Emoji created successfully');
  };

  const [enableCreatedEmoji] = useEnableCreatedEmojiMutation({
    onError(error) {
      setIsSubmitting(false);
      toast.error(`Something went wrong with enabling the emoji: ${error.message}`);
      navigateToEditPage();
    },
    onCompleted: onEmojiCreated,
  });

  const { uploadFile } = useEmojiMediaUpload({
    onError() {
      setIsSubmitting(false);
      navigateToEditPage();
      toast.error(
        'Something went wrong with uploading the emoji, emoji created without image',
      );
    },
    onSuccess() {
      // If emoji is wanted to be disabled, emoji creation is done
      if (emojiDisabled) {
        onEmojiCreated();
        return;
      }

      if (!emojiIdRef.current) {
        setIsSubmitting(false);
        toast.error('Something went wrong with creating the emoji.');
        return;
      }

      // Enabled emoji
      enableCreatedEmoji({
        variables: {
          id: emojiIdRef.current,
          channelId,
        },
      });
    },
  });

  const [createEmoji] = useCreateEmojiMutation({
    onCompleted(data) {
      const emojiId = data.createChannelEmoji?.id;

      if (!emojiId) {
        toast.error('Something went wrong with creating the emoji.');
        setIsSubmitting(false);
        return;
      }

      emojiIdRef.current = emojiId;

      if (!emojiFile) {
        setIsSubmitting(false);

        // Naivgate to edit page if new emoji was created but file is missing
        navigateToEditPage();
        toast.error('Emoji file is missing');

        return;
      }

      uploadFile(emojiId, emojiFile);
    },
    onError(error) {
      setIsSubmitting(false);
      toast.error(`Something went wrong with creating the emoji: ${error.message}`);
    },
    update(cache, { data }) {
      if (!data?.createChannelEmoji) {
        return;
      }

      cache.modify({
        fields: {
          channelEmojis(
            existingChannelEmojis: DeepPartial<EmojiListChannelEmojisResponse>,
            { storeFieldName, fieldName, toReference },
          ) {
            const { channelId: fieldChannelId } =
              getFieldsVariables<QueryChannelEmojisArgs>(storeFieldName, fieldName);

            if (fieldChannelId !== channelId) {
              return existingChannelEmojis;
            }

            const emojiId = data.createChannelEmoji?.id;

            const emojiRef = toReference({ id: emojiId, __typename: 'EmojiEmoji' });

            return {
              ...existingChannelEmojis,
              count: existingChannelEmojis.count
                ? {
                    ...existingChannelEmojis.count,
                    total: existingChannelEmojis.count.total
                      ? existingChannelEmojis.count.total + 1
                      : undefined,
                  }
                : undefined,
              emojis: [...(existingChannelEmojis.emojis ?? []), emojiRef],
            };
          },
        },
      });
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!emojiLabel || !emojiFile) {
      toast.error('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);

    createEmoji({
      variables: {
        channelId,
        label: emojiLabel,
      },
    });
  };

  const onReset = () => {
    navigate(toEmojis);
  };

  if (!data?.channel) {
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

        <PageHeading title="New emoji" />
      </div>

      <form
        ref={formRef}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <LayoutBox>
          {isMaxEmojiAmountReached && (
            <Callout
              message="Max amount of emojis is reached, adding new emojis is disabled."
              theme="gray"
              type="error"
              variant="bordered"
            />
          )}

          <ChannelEmojiFormContent
            channel={data?.channel}
            defaultEmojiEnabled={!emojiDisabled}
            formRef={formRef}
            isDisabled={isMaxEmojiAmountReached}
            onCodeValueChange={setEmojiLabel}
            onDisabledValueChange={setEmojiDisabled}
            onImageValueChange={setEmojiFile}
          />

          <div className={styles.buttons}>
            <Button
              fit="content"
              isDisabled={isMaxEmojiAmountReached}
              isLoading={isSubmitting}
              size="sm"
              type="submit"
              variant="cta"
            >
              Create emoji
            </Button>

            <Button
              fit="content"
              isDisabled={isSubmitting || isMaxEmojiAmountReached}
              level="secondary"
              size="sm"
              type="reset"
            >
              Cancel
            </Button>
          </div>
        </LayoutBox>
      </form>
    </>
  );
}
