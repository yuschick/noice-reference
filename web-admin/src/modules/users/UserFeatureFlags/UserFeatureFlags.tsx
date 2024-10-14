import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useParams } from 'react-router';

import { QueryTableModulePage } from '@common/page-components';
import {
  UserFeatureFlagsQuery,
  UserFeatureFlagsQueryVariables,
  useUserFeatureFlagsQuery,
} from '@gen';

gql`
  query UserFeatureFlags($userId: ID!) {
    userFeatureFlags(userId: $userId) {
      flags {
        name
        value
      }
    }
  }
`;

export function UserFeatureFlags() {
  const { userId } = useParams();

  const queryResult = useUserFeatureFlagsQuery({
    ...variablesOrSkip({ userId }),
  });

  return (
    <QueryTableModulePage<UserFeatureFlagsQuery, UserFeatureFlagsQueryVariables>
      caption="Feature Flags"
      dataTransform={dataTransform}
      queryResult={queryResult}
    />
  );
}

function dataTransform(data: UserFeatureFlagsQuery) {
  return data.userFeatureFlags?.flags.map(({ name, value }) => ({ name, value })) || [];
}
