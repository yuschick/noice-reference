import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { useMatchGroupChatIdQuery } from '@gen';

gql`
  query MatchGroupChatId($streamId: ID!, $groupId: ID!) {
    matchGroupChatID(streamId: $streamId, groupId: $groupId) {
      chatId
    }
  }
`;

export function useMatchGroupChatId(
  streamID: Nullable<string>,
  matchGroupId: Nullable<string>,
): string | undefined {
  const { data } = useMatchGroupChatIdQuery({
    variables: {
      streamId: streamID || '',
      groupId: matchGroupId || '',
    },
    skip: !streamID || !matchGroupId,
  });

  return data?.matchGroupChatID?.chatId;
}
