import { gql } from '@apollo/client';
import { Button, InputField } from '@noice-com/common-ui';
import { useState } from 'react';
import toast from 'react-hot-toast';

import styles from './EditStreamTitle.module.css';

import { useChannelContext } from '@common/channel';
import { useEditStreamTitleChannelQuery, useUpdateStreamTitleMutation } from '@gen';

gql`
  query EditStreamTitleChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      title
    }
  }
`;

gql`
  mutation UpdateStreamTitle($channelId: ID!, $title: String) {
    updateChannelDetails(body: { id: $channelId, title: $title }) {
      title
    }
  }
`;

export function EditStreamTitle() {
  const [title, setTitle] = useState<string>('');

  const { channelId } = useChannelContext();

  const { data, loading: loadingQuery } = useEditStreamTitleChannelQuery({
    variables: { channelId },
    onCompleted: (data) => {
      setTitle(data.channel?.title ?? '');
    },
  });

  const savedTitle = data?.channel?.title;

  const [updateChannelTitle, { loading: loadingChannelTitleMutation }] =
    useUpdateStreamTitleMutation({
      update: (cache, _, { variables }) => {
        if (!variables) {
          return;
        }

        const id = cache.identify({
          id: variables.channelId,
          __typename: 'ChannelChannel',
        });
        cache.modify({
          id,
          fields: {
            title: () => variables.title,
          },
        });
      },
    });

  const onSave = async () => {
    if (!title || !title.trim().length) {
      return;
    }

    const { errors } = await updateChannelTitle({ variables: { channelId, title } });

    if (errors?.length) {
      toast.error('Error updating stream: ' + errors[0].message);
    } else {
      toast.success('Stream title updated!');
    }
  };

  const buttonDisabled =
    title === savedTitle ||
    !title?.trim().length ||
    loadingQuery ||
    loadingChannelTitleMutation;

  return (
    <div className={styles.editStreamTitleRoot}>
      <InputField
        defaultValue={title}
        description="What is your stream about?"
        label="Stream title"
        maxLength={85}
        size="lg"
        theme="gray"
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={styles.buttonContainer}>
        <Button
          isDisabled={buttonDisabled}
          size="sm"
          variant="solid"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
