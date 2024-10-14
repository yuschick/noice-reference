import { gql } from '@apollo/client';
import { BiCheckCircle, BiCircle } from 'react-icons/bi';

import styles from './ChannelSelectorDrawer.module.css';

import { Button } from '@common/button';
import { ChannelSelectorChannelFragment, useChannelSelectorListQuery } from '@gen';

const PAGE_SIZE = 25;

gql`
  query ChannelSelectorList($cursor: String, $pageSize: Int) {
    channels(cursor: { first: $pageSize, after: $cursor }) {
      pageInfo {
        endCursor
        hasNextPage
      }
      channels {
        ...ChannelSelectorChannel
      }
    }
  }

  fragment ChannelSelectorChannel on ChannelChannel {
    id
    name
  }
`;

interface Props {
  selectedChannel?: ChannelSelectorChannelFragment;
  onChannelChange(channel: ChannelSelectorChannelFragment): void;
}

export function ChannelSelectorDrawer({ selectedChannel, onChannelChange }: Props) {
  const { data, fetchMore } = useChannelSelectorListQuery({
    variables: { pageSize: PAGE_SIZE },
  });

  const onFetchMore = async () => {
    await fetchMore({
      variables: { pageSize: PAGE_SIZE, cursor: data?.channels?.pageInfo.endCursor },
    });
  };

  return (
    <div className={styles.wrapper}>
      {data?.channels?.channels.map((channel) => (
        <Button
          buttonType="ghost"
          icon={selectedChannel?.id === channel.id ? BiCheckCircle : BiCircle}
          key={channel.id}
          text={channel.name}
          onClick={() => {
            onChannelChange(channel);
          }}
        />
      ))}

      {data?.channels?.pageInfo.hasNextPage && (
        <div>
          <Button
            text="Load more"
            onClick={onFetchMore}
          />
        </div>
      )}
    </div>
  );
}
