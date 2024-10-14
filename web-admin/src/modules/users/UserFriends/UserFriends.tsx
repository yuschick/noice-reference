import { gql } from '@apollo/client';
import { generatePath, useParams } from 'react-router';

import { QueryTableModulePage } from '@common/page-components';
import { hideEmailDomain, UsernameTableCell } from '@common/profile';
import { UserFriendsQuery, UserFriendsQueryVariables, useUserFriendsQuery } from '@gen';

gql`
  query UserFriends($userId: ID) {
    friends(userId: $userId) {
      users {
        userId
        profile {
          userId
          ...UsernameTableCellProfile
          account {
            email
          }
        }
      }
    }
  }
  ${UsernameTableCell.fragment.entry}
`;

export function UserFriends() {
  const { userId } = useParams();

  const queryResult = useUserFriendsQuery({
    variables: { userId },
    skip: !userId,
  });

  const dataTransform = (data: UserFriendsQuery) => {
    return (
      data.friends?.users.map((user) =>
        (({ userId, profile }) => ({
          username: <UsernameTableCell profile={profile} />,
          userId,
          emailAddress: hideEmailDomain(profile.account?.email ?? ''),
        }))(user),
      ) ?? []
    );
  };

  const generateLinkToFromId = (userId: string) =>
    generatePath('/users/:userId', { userId });

  return (
    <QueryTableModulePage<UserFriendsQuery, UserFriendsQueryVariables>
      caption="User's friends"
      dataTransform={dataTransform}
      generateLinkToFromId={generateLinkToFromId}
      idField="userId"
      labels={[
        {
          label: 'Friends',
          value: queryResult.data?.friends?.users.length ?? 0,
        },
      ]}
      queryResult={queryResult}
      includeIdField
    />
  );
}
