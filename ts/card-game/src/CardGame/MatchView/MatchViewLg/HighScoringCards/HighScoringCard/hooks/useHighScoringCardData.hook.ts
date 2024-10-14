import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { GameCardProps } from '@game-card';
import { useHighScoringCardDataQuery, HighScoringCardPlayerFragment } from '@game-gen';

interface HookResult {
  player: Nullable<HighScoringCardPlayerFragment>;
  card: Nullable<GameCardProps['card']>;
  loading: boolean;
}

gql`
  query HighScoringCardData($cardId: String!, $playerId: ID!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        ...GameCard
      }
    }
    profile(userId: $playerId) {
      ...HighScoringCardPlayer
    }
  }
  fragment HighScoringCardPlayer on ProfileProfile {
    userId
    userTag
    avatars {
      avatarFullbody
    }
  }
`;

export function useHighScoringCardData(cardId: string, playerId: string): HookResult {
  const { data, loading } = useHighScoringCardDataQuery({
    variables: {
      cardId,
      playerId,
    },
  });

  return {
    player: data?.profile ?? null,
    card: data?.gameCards?.cards[0] ?? null,
    loading,
  };
}
