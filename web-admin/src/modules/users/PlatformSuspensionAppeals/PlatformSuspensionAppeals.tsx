import { gql, QueryResult } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';

import { PlatformSuspensionAppealDrawer } from '../PlatformSuspensionAppealDrawer/PlatformSuspensionAppealDrawer';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { UsernameTableCell } from '@common/profile';
import {
  PlatformSuspensionAppealsQuery,
  PlatformSuspensionAppealsQueryVariables,
  usePlatformSuspensionAppealsQuery,
} from '@gen';

gql`
  query PlatformSuspensionAppeals($cursor: APICursorInput) {
    platformBanAppeals(cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      appeals {
        banId
        ban {
          banId
          bannedAt
          moderator {
            userId
            ...UsernameTableCellProfile
          }
        }
        createdAt
        user {
          userId
          ...UsernameTableCellProfile
        }
      }
    }
  }
`;

export function PlatformSuspensionAppeals() {
  const dataTransform = (data: PlatformSuspensionAppealsQuery) => {
    return (
      data?.platformBanAppeals?.appeals.map((appeal) =>
        (({ ban: { bannedAt, moderator }, createdAt, user }) => ({
          userId: user.userId,
          user: <UsernameTableCell profile={user} />,
          appealSent: DateAndTimeUtils.ShortDates.format(new Date(createdAt)),
          suspensionGivenBy: <UsernameTableCell profile={moderator} />,
          suspensionTime: DateAndTimeUtils.ShortDates.format(new Date(bannedAt)),
        }))(appeal),
      ) || []
    );
  };

  const getPageInfo = (data: PlatformSuspensionAppealsQuery) =>
    data.platformBanAppeals?.pageInfo ?? null;

  const getDrawerContent = (
    queryResult: QueryResult<
      PlatformSuspensionAppealsQuery,
      PlatformSuspensionAppealsQueryVariables
    >,
  ) => {
    return <PlatformSuspensionAppealDrawer refetchTable={queryResult.refetch} />;
  };

  return (
    <PaginatedQueryTableModulePage<
      PlatformSuspensionAppealsQuery,
      PlatformSuspensionAppealsQueryVariables
    >
      caption="Suspension appeals"
      dataTransform={dataTransform}
      drawerFromQueryResult={{
        title: 'Suspension appeal',
        getContentUsingQueryHook: getDrawerContent,
      }}
      getPageInfo={getPageInfo}
      hook={usePlatformSuspensionAppealsQuery}
      idField="userId"
      variables={{}}
      openDrawerOnRowClick
    />
  );
}
