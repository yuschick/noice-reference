import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';

import { GameCardProps } from '@game-card';
import { useBestPlaysDataQuery, BestPlayProfileFragment } from '@game-gen';
import { useBestPlays } from '@game-logic/game/hooks';

gql`
  query BestPlaysData($cardIds: [String!]!, $userIds: [String!]!) {
    gameCards(cardIds: $cardIds) {
      cards {
        ...GameCard
      }
    }
    profileBatch(userIds: $userIds) {
      profiles {
        ...BestPlayProfile
      }
    }
  }

  fragment BestPlayProfile on ProfileProfile {
    userId
    userTag
    avatars {
      avatarFullbody
    }
  }
`;

type GameCardData = GameCardProps['card'];

interface BestPlay {
  card: GameCardData;
  profile: BestPlayProfileFragment;
}

interface HookResult {
  bestPlays: BestPlay[];
  loading: boolean;
}

export function useBestPlaysData(): HookResult {
  const { hasBestPlays, bestPlays } = useBestPlays();

  const cardIds = bestPlays.map((bp) => bp.cardId);
  const userIds = bestPlays.map((bp) => bp.ownerId);

  const [state, setState] = useState<BestPlay[]>([]);

  const { loading } = useBestPlaysDataQuery({
    variables: {
      cardIds,
      userIds,
    },
    skip: cardIds.length === 0 || userIds.length === 0,
    onCompleted: (data) => {
      const cards = data.gameCards?.cards ?? [];
      const profiles = data.profileBatch?.profiles ?? [];
      if (cards.length !== profiles.length) {
        throw new Error("useBestPlaysData: Card and profile counts don't match");
      }

      const newState: BestPlay[] = [];
      bestPlays.forEach((bestPlay) => {
        const card = cards.find((c) => c.id === bestPlay.cardId);
        const profile = profiles.find((p) => p.userId === bestPlay.ownerId);

        if (!card || !profile) {
          throw new Error("useBestPlaysData: Couldn't find card or profile");
        }

        newState.push({
          card: {
            ...card,
            pointsMin: bestPlay.currentPoints,
          },
          profile,
        });
      });

      setState(newState);
    },
  });

  useEffect(() => {
    if (hasBestPlays) {
      return;
    }

    setState([]);
  }, [hasBestPlays]);

  return {
    bestPlays: state,
    loading,
  };
}
