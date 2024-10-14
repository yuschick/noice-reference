import { QueryResult, gql } from '@apollo/client';
import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';

import { PlatformEmojiDrawer } from './PlatformEmojiDrawer/PlatformEmojiDrawer';

import { useDrawer } from '@common/drawer';
import { emojiTableEmojisTransform } from '@common/emojis';
import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  ItemItemTotalCount,
  PlatformEmojisQuery,
  PlatformEmojisQueryVariables,
  usePlatformEmojisQuery,
} from '@gen';

gql`
  query PlatformEmojis($cursor: APICursorInput, $includeDisabled: Boolean) {
    platformEmojis(
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
`;

export function PlatformEmojis() {
  const { activeId } = useDrawer();

  const [showDisabledEmojis, setShowDisabledEmojis] = useState(false);

  const dataTransform = (data: PlatformEmojisQuery) => {
    return emojiTableEmojisTransform(data.platformEmojis?.emojis ?? []);
  };

  const getPageInfo = (data: PlatformEmojisQuery) =>
    data.platformEmojis?.pageInfo ?? null;

  const getLabelValue = (
    countType: keyof ItemItemTotalCount,
    queryResult: QueryResult<PlatformEmojisQuery, PlatformEmojisQueryVariables>,
  ) => {
    const value = Number(queryResult.data?.platformEmojis?.count?.[countType]) ?? 0;

    if (countType === 'total') {
      return value - (queryResult.data?.platformEmojis?.count?.disabled ?? 0);
    }

    if (countType === 'disabled') {
      return value;
    }

    return 0;
  };

  return (
    <PaginatedQueryTableModulePage<PlatformEmojisQuery, PlatformEmojisQueryVariables>
      actions={[
        {
          onChange: () => setShowDisabledEmojis((prev) => !prev),
          type: 'toggle',
          label: 'Show disabled',
          value: showDisabledEmojis,
        },
      ]}
      caption="Platform emojis"
      dataTransform={dataTransform}
      drawer={{
        title: activeId ? 'Edit Emoji' : 'New Emoji',
        content: <PlatformEmojiDrawer />,
      }}
      drawerAction={{
        icon: BiPlus,
        text: 'New Emoji',
      }}
      getPageInfo={getPageInfo}
      hook={usePlatformEmojisQuery}
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
      variables={{ includeDisabled: showDisabledEmojis }}
      openDrawerOnRowClick
    />
  );
}
