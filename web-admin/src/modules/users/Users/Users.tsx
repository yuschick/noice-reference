import { gql } from '@apollo/client';
import { DateAndTimeUtils } from '@noice-com/utils';

import { UserDrawer } from './UserDrawer/UserDrawer';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { getPlatformRoleElement, hideEmailDomain } from '@common/profile';
import { UsersQuery, UsersQueryVariables, useUsersQuery } from '@gen';

gql`
  query Users($cursor: APICursorInput) {
    profiles(cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      profiles {
        userId
        userTag
        lastSeen
        account {
          email
          roles
        }
      }
    }
  }
`;

export function Users() {
  const dataTransform = (data: UsersQuery) => {
    return (
      data?.profiles?.profiles.map((user) =>
        (({ userTag, userId, lastSeen, account }) => ({
          username: userTag,
          userId,
          email: hideEmailDomain(account?.email ?? ''),
          lastSeen: lastSeen ? DateAndTimeUtils.getShortDate(lastSeen) : '',
          roles: (
            <>
              {account?.roles
                .map((role) => <>{getPlatformRoleElement(role)}</>)
                .reduce((prev, curr) => (
                  <>
                    {prev}, {curr}
                  </>
                ))}
            </>
          ),
        }))(user),
      ) || []
    );
  };

  const getPageInfo = (data: UsersQuery) => data.profiles?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<UsersQuery, UsersQueryVariables>
      caption="Users"
      dataTransform={dataTransform}
      drawer={{ title: 'User', content: <UserDrawer /> }}
      getPageInfo={getPageInfo}
      hook={useUsersQuery}
      idField="userId"
      variables={{}}
      openDrawerOnRowClick
    />
  );
}
