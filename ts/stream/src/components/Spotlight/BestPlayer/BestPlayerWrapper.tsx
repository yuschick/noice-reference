import { gql } from '@apollo/client';
import { ContentModeUserSpotlight } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { BestPlayer } from './BestPlayer';

import { useSpotlightBestPlayerDataQuery } from '@stream-gen';
import { useClientSideRenderingEnabled } from '@stream-hooks';

interface Props {
  userSpotlight: ContentModeUserSpotlight;
}

gql`
  query SpotlightBestPlayerData($userId: ID) {
    profile(userId: $userId) {
      ...SpotlightBestPlayerProfile
    }
  }

  ${BestPlayer.fragments.entry}
`;

export function BestPlayerWrapper({ userSpotlight }: Props) {
  const { data, loading } = useSpotlightBestPlayerDataQuery({
    variables: { userId: userSpotlight.player?.id },
    skip: !userSpotlight.player?.id,
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
  if (loading || !data?.profile || !duration) {
    return null;
  }

  return (
    <BestPlayer
      duration={clientSideRendering ? 6800 : 5000}
      groupName={userSpotlight.player?.groupName}
      points={userSpotlight.player?.points ?? 0}
      profile={data.profile}
    />
  );
}
