import { gql } from '@apollo/client';
import { TabNav } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import styles from './GameSelector.module.css';

import { StreamedGameFragment } from '@gen';

interface Props {
  games: StreamedGameFragment[];
  selectedGameId: Nullable<string>;
  handleSelectGameId: (gameId: string) => void;
}

export function GameSelector({ games, handleSelectGameId, selectedGameId }: Props) {
  return (
    <div className={styles.gameSelector}>
      <TabNav
        selectedId={selectedGameId}
        tabs={games.map((g) => ({
          id: g.id,
          title: g.name,
          subtitle: 'Creators',
        }))}
        onSelect={handleSelectGameId}
      />
    </div>
  );
}

GameSelector.fragments = {
  entry: gql`
    fragment StreamedGame on GameGame {
      id
      name
    }
  `,
};
