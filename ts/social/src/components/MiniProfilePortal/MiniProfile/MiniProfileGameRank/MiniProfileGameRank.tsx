import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { SeasonRankBadge } from '@noice-com/common-ui';

import { useMiniProfileContext } from '../../context';

import styles from './MiniProfileGameRank.module.css';

import {
  MiniProfileGameRankProfileFragment,
  useMiniProfileGameRankChannelQuery,
} from '@social-gen';

gql`
  fragment MiniProfileGameRankProfile on ProfileProfile {
    playedGames {
      id
      userId
      seasonId
      game {
        id
        name
      }
      progression {
        level
      }
      season {
        id
        name
      }
    }
  }

  query MiniProfileGameRankChannel($channelId: ID!) {
    channel(id: $channelId) {
      id
      gameId
      game {
        id
        activeSeasonId
      }
    }
  }
`;

interface Props {
  profile: MiniProfileGameRankProfileFragment;
}

export function MiniProfileGameRank({ profile }: Props) {
  const { playedGames } = profile;

  const { channelId } = useMiniProfileContext();

  const { data } = useMiniProfileGameRankChannelQuery({
    ...variablesOrSkip({ channelId }),
  });

  const playedGame = playedGames.find(
    (game) =>
      game.id === data?.channel?.gameId &&
      game.seasonId === data?.channel?.game?.activeSeasonId,
  );

  if (!playedGame) {
    return null;
  }

  const { progression, game, season } = playedGame;

  return (
    <section className={styles.miniProfileGameRankSection}>
      <SeasonRankBadge rank={progression.level} />

      <div className={styles.rankTextWrapper}>
        <span>{season.name} for</span>
        <span className={styles.rankGameName}>{game.name} Creators</span>
      </div>
    </section>
  );
}
