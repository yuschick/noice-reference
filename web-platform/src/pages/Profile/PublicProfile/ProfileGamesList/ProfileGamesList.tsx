import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';

import styles from './ProfileGamesList.module.css';

import { GameProgression } from '@common/game-progression';
import { ProfileGamesListItemFragment, useProfileGamesPublicListQuery } from '@gen';

gql`
  query ProfileGamesPublicList {
    listGames {
      games {
        id
      }
    }
  }
`;

interface Props {
  games: ProfileGamesListItemFragment[];
  isOwnProfile: boolean;
}

export function ProfileGamesList({ games, isOwnProfile }: Props) {
  /**
   * Note:
   * The below logic for fetching listGames and filtering the games list
   * is a temporary solution. This filtering should and will be done on the backend.
   * Do not copy / replicate this logic elsewhere.
   * https://linear.app/noice/issue/NOI-10249
   */
  const { data } = useProfileGamesPublicListQuery();
  const publicGameIds = data?.listGames?.games.map((game) => game.id) ?? [];
  const publicProfileGames = games.filter((game) => publicGameIds.includes(game.id));

  return (
    <div className={styles.profileSectionWrapper}>
      <h3 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.GamePad}
        />
        <span>Games</span>
      </h3>

      {publicProfileGames.length ? (
        <ul className={styles.list}>
          {publicProfileGames.map((game) => (
            <li
              className={styles.listItem}
              key={game.id}
            >
              <GameProgression
                key={game.id}
                progression={game}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <span>
            {isOwnProfile
              ? 'You have not played any games yet.'
              : 'This player has not played any games yet.'}
          </span>
        </div>
      )}
    </div>
  );
}

ProfileGamesList.Loading = () => {
  return (
    <div className={styles.loading}>
      <h2 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.GamePad}
        />
        <span>Games</span>
      </h2>

      <ul className={styles.list}>
        {Array(2)
          .fill(null)
          .map((_, index) => (
            <li key={index}>
              <GameProgression.Loading />
            </li>
          ))}
      </ul>
    </div>
  );
};

ProfileGamesList.fragments = {
  entry: gql`
    fragment ProfileGamesListItem on GameGame {
      id
      name
      ...GameProgressionGame
    }
  `,
};
