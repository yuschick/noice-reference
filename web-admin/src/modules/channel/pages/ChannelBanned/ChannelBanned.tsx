import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';

import { ChannelBannedDrawer } from './ChannelBannedDrawer/ChannelBannedDrawer';

import { QueryTableModulePage } from '@common/page-components';
import {
  ChannelBannedUsersQuery,
  ChannelBannedUsersQueryVariables,
  useChannelBannedUsersQuery,
} from '@gen';

gql`
  query ChannelBannedUsers($channelId: ID!) {
    channelBannedUsers(channelId: $channelId) {
      users {
        userId
        channelId
        bannedAt
        violation
        description
        user {
          userId
          userTag
        }
        moderator {
          userId
          userTag
        }
      }
    }

    channel(id: $channelId) {
      id
      name
    }
  }
`;

export function ChannelBanned() {
  const { channelId } = useParams();

  const queryResult = useChannelBannedUsersQuery({
    ...variablesOrSkip({ channelId }),
  });

  const dataTransform = (data: ChannelBannedUsersQuery) => {
    return (
      data.channelBannedUsers?.users.map((user) => {
        return (({ bannedAt, violation, description, user, userId, moderator }) => ({
          userId,
          username: user.userTag,
          violation: CommonUtils.getChannelViolationText(violation),
          description,
          bannedAt: `${DateAndTimeUtils.getShortDate(
            bannedAt,
          )} ${DateAndTimeUtils.getTime(bannedAt)}`,
          moderator: moderator.userTag,
        }))(user);
      }) ?? []
    );
  };

  return (
    <QueryTableModulePage<ChannelBannedUsersQuery, ChannelBannedUsersQueryVariables>
      caption={`Users banned from channel ${queryResult.data?.channel?.name}`}
      dataTransform={dataTransform}
      drawer={{
        title: 'Banned user',
        content: <ChannelBannedDrawer />,
      }}
      idField="userId"
      queryResult={queryResult}
      tableUnit="Banned users"
      openDrawerOnRowClick
    />
  );
}
