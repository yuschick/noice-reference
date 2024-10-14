import { gql } from '@apollo/client';
import { ContentModeGroupSpotlight } from '@noice-com/schemas/rendering/transitions.pb';
import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { BestGroup } from './BestGroup';

import { useSpotlightBestGroupDataQuery } from '@stream-gen';
import { useClientSideRenderingEnabled } from '@stream-hooks';

interface Props {
  groupSpotlight: ContentModeGroupSpotlight;
}

gql`
  query SpotlightBestGroupData($userIds: [String!]) {
    profileBatch(userIds: $userIds) {
      profiles {
        ...SpotlightBestGroupProfile
      }
    }
  }

  ${BestGroup.fragments.entry}
`;

export function BestGroupWrapper({ groupSpotlight }: Props) {
  const userIds = groupSpotlight.players?.map((player) => player.userId ?? '') ?? [];
  const { data, loading } = useSpotlightBestGroupDataQuery({
    variables: { userIds },
    skip: userIds.length < 1,
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

  if (loading || !data?.profileBatch?.profiles || !duration) {
    return null;
  }

  return (
    <BestGroup
      duration={duration}
      groupName={groupSpotlight.groupName ?? 'unknown'}
      groupPoints={groupSpotlight.points ?? 0}
      players={groupSpotlight.players ?? []}
      profiles={data.profileBatch.profiles}
    />
  );
}
