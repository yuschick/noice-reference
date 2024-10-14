import { gql } from '@apollo/client';
import { ContentModeUserSpotlight } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { BestPlay } from './BestPlay';

import { useSpotlightBestPlayDataQuery } from '@stream-gen';
import { useClientSideRenderingEnabled } from '@stream-hooks';
// eslint-disable-next-line no-restricted-imports

interface Props {
  userSpotlight: ContentModeUserSpotlight;
}

gql`
  query SpotlightBestPlayData($cardIds: [String!], $userId: ID) {
    gameCards(cardIds: $cardIds) {
      cards {
        ...SpotlightBestPlayCard
      }
    }

    profile(userId: $userId) {
      ...SpotlightBestPlayProfile
    }
  }

  ${BestPlay.fragments.entry}
`;

export function BestPlayWrapper({ userSpotlight }: Props) {
  const { data, loading } = useSpotlightBestPlayDataQuery({
    variables: {
      cardIds: [userSpotlight.card?.succeedingCard?.cardId ?? ''],
      userId: userSpotlight.userId,
    },
    skip: !userSpotlight.userId || !userSpotlight.card?.succeedingCard?.cardId,
  });

  const [duration, setDuration] = useState<Nullable<number>>(null);

  const [clientSideRendering, clientSideRenderingLoading] =
    useClientSideRenderingEnabled();

  useEffect(() => {
    const getDuration = async () => {
      if (clientSideRenderingLoading) {
        return null;
      }

      const duration = clientSideRendering ? 6800 : 5000;
      setDuration(duration);
    };

    getDuration();
  }, [clientSideRendering, clientSideRenderingLoading]);

  // @todo: loading state
  if (loading || !data?.gameCards || !data.profile || !duration) {
    return null;
  }

  return (
    <BestPlay
      card={data.gameCards.cards[0]}
      cardPoints={userSpotlight.card?.succeedingCard?.points ?? 0}
      duration={duration}
      groupName={userSpotlight.card?.groupName}
      profile={data.profile}
    />
  );
}
