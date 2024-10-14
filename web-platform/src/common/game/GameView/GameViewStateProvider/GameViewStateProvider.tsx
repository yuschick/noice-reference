import { useToggle, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

interface GameViewState {
  isChannelInfoMinimized: boolean;
  onChannelInfoMinimizeToggle(): void;
}

const GameViewStateContext = createContext<Nullable<GameViewState>>(null);

export function GameViewStateProvider({ children }: WithChildren) {
  const [isChannelInfoMinimized, onChannelInfoMinimizeToggle] = useToggle(false);

  return (
    <GameViewStateContext.Provider
      value={{
        isChannelInfoMinimized,
        onChannelInfoMinimizeToggle,
      }}
    >
      {children}
    </GameViewStateContext.Provider>
  );
}

export function useGameViewState() {
  const context = useContext(GameViewStateContext);

  if (!context) {
    throw new Error(
      'Trying to access GameViewStateContext from context without GameViewStateProvider',
    );
  }

  return context;
}
