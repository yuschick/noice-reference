import { useMountEffect } from '@noice-com/common-react-core';
import { Tabs, useTabs } from '@noice-com/common-ui';
import { useEffect } from 'react';

import { useGameSelector } from '@common/navigation';
import { useSelectedUIState } from '@context';

interface Props {
  gameIds: string[];
}

export function GameSelector({ gameIds }: Props) {
  const tabs = useTabs({ variant: 'page' });
  const { games, selectedGameId } = useGameSelector(gameIds);

  const { setSelectedGame } = useSelectedUIState();

  // Set first game selected incase selectedGameId is not available
  useEffect(() => {
    if (!gameIds.length) {
      return;
    }

    const selectedPartOfAvailableIds = gameIds.find((id) => id === selectedGameId);
    if (!selectedPartOfAvailableIds) {
      setSelectedGame(gameIds[0]);
    }
  }, [gameIds, selectedGameId, tabs, setSelectedGame]);

  useMountEffect(() => {
    tabs.actions.setSelectedTabIndex(
      gameIds.findIndex((gameId) => gameId === selectedGameId),
    );
  });

  return (
    <Tabs
      store={tabs}
      title="Game selector"
    >
      <Tabs.List>
        {games.map((game) => (
          <Tabs.TabButton
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
          >
            <div>
              <span translate="no">{game.name} </span> Creators
            </div>
          </Tabs.TabButton>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
