import { QueryResult, gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useParams } from 'react-router';

import { MonetizationCallout } from '../../MonetizationCallout';

import { ChannelEmojiDrawer } from './ChannelEmojiDrawer/ChannelEmojiDrawer';

import { useDrawer } from '@common/drawer';
import { MAX_ENABLED_EMOJIS, emojiTableEmojisTransform } from '@common/emojis';
import { PaginatedQueryTableModulePage } from '@common/page-components';
import { useUserPermissions } from '@common/permission';
import {
  ChannelEmojisQuery,
  ChannelEmojisQueryVariables,
  ItemItemTotalCount,
  useChannelEmojisChannelQuery,
  useChannelEmojisQuery,
} from '@gen';

gql`
  query ChannelEmojis(
    $channelId: ID!
    $cursor: APICursorInput
    $includeDisabled: Boolean
  ) {
    channelEmojis(
      channelId: $channelId
      cursor: $cursor
      includeCount: true
      includeDisabled: $includeDisabled
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      emojis {
        id
        ...EmojiTableEmoji
      }
      count {
        disabled
        total
      }
    }
  }

  query ChannelEmojisChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      ...ChannelEmojiDrawerChannel
    }
  }
`;

export function ChannelEmojis() {
  const { isAdmin } = useUserPermissions();
  const { channelId } = useParams();
  const { activeId } = useDrawer();

  const [showDisabledEmojis, setShowDisabledEmojis] = useState(false);

  const { data } = useChannelEmojisChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  const dataTransform = (data: ChannelEmojisQuery) => {
    return emojiTableEmojisTransform(data.channelEmojis?.emojis ?? []);
  };

  const getPageInfo = (data: ChannelEmojisQuery) => data.channelEmojis?.pageInfo ?? null;

  const getLabelValue = (
    countType: keyof ItemItemTotalCount,
    queryResult: QueryResult<ChannelEmojisQuery, ChannelEmojisQueryVariables>,
  ) => {
    const value = Number(queryResult.data?.channelEmojis?.count?.[countType]) ?? 0;

    if (countType === 'total') {
      return value - (queryResult.data?.channelEmojis?.count?.disabled ?? 0);
    }

    if (countType === 'disabled') {
      return value;
    }

    return 0;
  };

  const getDrawerActionUsingQueryHook = (
    queryResult: QueryResult<ChannelEmojisQuery, ChannelEmojisQueryVariables>,
  ) => {
    if (!isAdmin) {
      return undefined;
    }

    // Default to max so when loading, it is disabled
    const totalEmojis =
      queryResult.data?.channelEmojis?.count?.total ?? MAX_ENABLED_EMOJIS;
    const disabledEmojis = queryResult.data?.channelEmojis?.count?.disabled ?? 0;
    const enabledEmojis = totalEmojis - disabledEmojis;

    return {
      icon: BiPlus,
      text: 'New Emoji',
      isDisabled: enabledEmojis >= MAX_ENABLED_EMOJIS,
    };
  };

  return (
    <>
      {data?.channel && <MonetizationCallout channelId={data.channel.id} />}
      <PaginatedQueryTableModulePage<ChannelEmojisQuery, ChannelEmojisQueryVariables>
        actions={[
          {
            onChange: () => setShowDisabledEmojis((prev) => !prev),
            type: 'toggle',
            label: 'Show disabled',
            value: showDisabledEmojis,
          },
        ]}
        caption="Channel emojis"
        dataTransform={dataTransform}
        drawer={{
          title: activeId ? 'Edit Emoji' : 'New Emoji',
          content: data?.channel ? <ChannelEmojiDrawer channel={data.channel} /> : <></>,
        }}
        getDrawerActionUsingQueryHook={getDrawerActionUsingQueryHook}
        getPageInfo={getPageInfo}
        hook={useChannelEmojisQuery}
        idField="id"
        labelsFromQueryResult={[
          {
            countType: 'total',
            label: 'Enabled',
            getLabelValueUsingQueryHook: getLabelValue,
          },
          {
            countType: 'disabled',
            label: 'Disabled',
            getLabelValueUsingQueryHook: getLabelValue,
          },
        ]}
        minifyCells={['state', 'emoji']}
        skip={!channelId}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        variables={{ channelId: channelId!, includeDisabled: showDisabledEmojis }}
        openDrawerOnRowClick
      />
    </>
  );
}
