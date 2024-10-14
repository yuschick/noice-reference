import { gql } from '@apollo/client';
import { CommonUtils } from '@noice-com/common-ui';
import { DateAndTimeUtils } from '@noice-com/utils';
import { useParams } from 'react-router';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import {
  UserChannelBansQuery,
  UserChannelBansQueryVariables,
  useUserChannelBansQuery,
} from '@gen';

gql`
  query UserChannelBans($userId: ID!, $cursor: APICursorInput) {
    userChannelBans(userId: $userId, cursor: $cursor) {
      bans {
        userId
        channelId
        channel {
          id
          name
        }
        bannedAt
        violation
        description
        moderator {
          userId
          userTag
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
`;

export function UserChannelBans() {
  const { userId } = useParams();

  const dataTransform = (data: UserChannelBansQuery) => {
    return (
      data.userChannelBans?.bans.map((ban) =>
        (({ channel, violation, description, bannedAt, moderator }) => ({
          channel: channel.name,
          violation: CommonUtils.getChannelViolationText(violation),
          description,
          bannedAt: DateAndTimeUtils.getShortDate(bannedAt),
          moderator: moderator.userTag,
        }))(ban),
      ) || []
    );
  };

  const getPageInfo = (data: UserChannelBansQuery) =>
    data.userChannelBans?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<UserChannelBansQuery, UserChannelBansQueryVariables>
      caption="User channel bans"
      dataTransform={dataTransform}
      getPageInfo={getPageInfo}
      hook={useUserChannelBansQuery}
      skip={!userId}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      variables={{ userId: userId! }}
    />
  );
}
