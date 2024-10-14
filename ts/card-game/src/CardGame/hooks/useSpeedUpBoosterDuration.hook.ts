import { gql } from '@apollo/client';

import { useUseSpeedUpBoosterDurationQuery } from '@game-gen';
import { BoosterType } from '@game-types';

gql`
  query useSpeedUpBoosterDuration($id: Int!) {
    booster(id: $id) {
      id
      timeActive
    }
  }
`;

export function useSpeedUpBoosterDuration() {
  const { data } = useUseSpeedUpBoosterDurationQuery({
    variables: { id: BoosterType.SpeedUp },
  });

  return data?.booster?.timeActive ?? 0;
}
