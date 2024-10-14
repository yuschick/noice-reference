import { gql } from '@apollo/client';

import { useUseGroupEventsBoosterDataQuery } from '@gen';

gql`
  query useGroupEventsBoosterData($id: Int!) {
    booster(id: $id) {
      id
      name
    }
  }
`;

export function useGroupEventsBoosterData(id: number) {
  const { data } = useUseGroupEventsBoosterDataQuery({
    variables: {
      id,
    },
  });

  return data?.booster;
}
