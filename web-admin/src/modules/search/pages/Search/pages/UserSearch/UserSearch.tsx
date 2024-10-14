import { gql } from '@apollo/client';
import { useParams, generatePath } from 'react-router';

import { PaginatedQueryTableModulePage } from '@common/page-components';
import { hideEmailDomain, UsernameTableCell } from '@common/profile';
import { TableData } from '@common/table';
import { UserSearchQuery, UserSearchQueryVariables, useUserSearchQuery } from '@gen';

gql`
  query UserSearch($query: String, $cursor: APICursorInput) {
    search(query: $query, entityTypes: [ENTITY_TYPE_USER], cursor: $cursor) {
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      resultItems {
        entityId
        entity {
          ... on ProfileProfile {
            userId
            account {
              email
            }
            ...UsernameTableCellProfile
          }
        }
      }
    }
  }
`;

export function UserSearch() {
  const { query } = useParams();

  const dataTransform = (data: UserSearchQuery) => {
    return data.search?.resultItems
      .map((resultItem) => {
        if (resultItem.entity?.__typename !== 'ProfileProfile') {
          return null;
        }

        const profile = resultItem.entity;

        return (({ userId, account }) => ({
          username: <UsernameTableCell profile={profile} />,
          userId,
          emailAddress: hideEmailDomain(account?.email ?? ''),
        }))(profile);
      })
      .filter((resultItem) => !!resultItem) as TableData;
  };

  const generateLinkToFromId = (userId: string) =>
    generatePath('/users/:userId', { userId });

  const getPageInfo = (data: UserSearchQuery) => data.search?.pageInfo ?? null;

  return (
    <PaginatedQueryTableModulePage<UserSearchQuery, UserSearchQueryVariables>
      caption="Search results"
      dataTransform={dataTransform}
      generateLinkToFromId={generateLinkToFromId}
      getPageInfo={getPageInfo}
      hook={useUserSearchQuery}
      idField="userId"
      variables={{ query }}
      includeIdField
    />
  );
}
