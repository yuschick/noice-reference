import { gql } from '@apollo/client';

import { useFeatureFlagGameConditionGameQuery } from '@gen';

gql`
  query FeatureFlagGameConditionGame($gameId: ID!) {
    game(id: $gameId) {
      id
      name
    }
  }
`;

interface Props {
  gameId: string;
}

export function ConditionRowGame({ gameId }: Props) {
  const { data } = useFeatureFlagGameConditionGameQuery({
    variables: {
      gameId,
    },
  });

  return <span>{data?.game?.name ?? gameId}</span>;
}
