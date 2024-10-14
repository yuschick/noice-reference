import { gql } from '@apollo/client';
import { Nullable } from '@noice-com/utils';

import { useSeasonEndDialogData } from './hooks/useSeasonEndDialogData.hook';
import { useSeasonEndSeasons } from './hooks/useSeasonEndSeasons.hook';
import { SeasonEndDialog } from './SeasonEndDialog';

import { SeasonEndDialogWrapperProfileFragment } from '@gen';

gql`
  fragment SeasonEndDialogWrapperProfile on ProfileProfile {
    ...UseEndSeasonEndDialogsProfile
  }
`;

interface Props {
  profile: Nullable<SeasonEndDialogWrapperProfileFragment>;
}

export function SeasonEndDialogWrapper({ profile: propProfile }: Props) {
  const { season: dialogSeason, onClose } = useSeasonEndSeasons({ profile: propProfile });
  const { items, profile, season, stats, loading } = useSeasonEndDialogData({
    seasonId: dialogSeason?.id ?? null,
    gameId: dialogSeason?.gameId ?? null,
  });

  if (loading || !items || !profile || !season || !stats) {
    return null;
  }

  return (
    <SeasonEndDialog
      inventory={items}
      profile={profile}
      season={season}
      stats={stats}
      onClose={onClose}
    />
  );
}
