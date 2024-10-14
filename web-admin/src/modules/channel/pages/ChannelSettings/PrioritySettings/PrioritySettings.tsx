import { gql } from '@apollo/client';
import { useRef } from 'react';
import { useParams } from 'react-router';

import styles from './PrioritySettings.module.css';

import { Select } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { priorityOptions } from '@common/priority';
import { showSnackbar } from '@common/snackbar';
import { useChannelUpdatePriorityMutation } from '@gen';

gql`
  mutation ChannelUpdatePriority($channelId: ID!, $priority: Int) {
    updateChannelDetails(body: { id: $channelId, priority: $priority }) {
      id
      priority
    }
  }
`;

interface Props {
  currentPriority: number;
}

export function PrioritySettings({ currentPriority }: Props) {
  const { channelId } = useParams();
  const selectRef = useRef<HTMLSelectElement>(null);

  const [updateChannelPriority] = useChannelUpdatePriorityMutation({
    update(cache, _result, { variables }) {
      cache.updateFragment(
        {
          id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment PriorityUpdateChannel on ChannelChannel {
              id
              priority
            }
          `,
        },
        (existingChannel) => ({
          ...existingChannel,
          priority: variables?.priority,
        }),
      );
    },
    onCompleted() {
      showSnackbar('positive', 'Channel priority updated successfully.');
    },
    onError(error) {
      showSnackbar(
        'error',
        `Error occurred while updating channel priority: ${error.message}`,
      );
    },
  });

  const onSelectChange = (priority: string) => {
    if (!channelId) {
      showSnackbar('error', 'Missing channel id!');
      return;
    }

    updateChannelPriority({
      variables: {
        channelId: channelId,
        priority: parseInt(priority, 10),
      },
    });
  };

  return (
    <ContentModulePage.Content title="Channel priority">
      <div className={styles.selectWrapper}>
        <span className={styles.selectLabel}>Channel priority</span>

        <Select
          className={styles.select}
          defaultValue={currentPriority.toString()}
          label="Channel priority"
          options={priorityOptions.map((option) => ({
            value: option.value.toString(),
            label: option.label,
          }))}
          ref={selectRef}
          hideLabel
          onChange={onSelectChange}
        />
      </div>
    </ContentModulePage.Content>
  );
}
