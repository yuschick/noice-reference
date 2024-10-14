import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, ReactElement, useCallback, useContext, useState } from 'react';

import { useSelectedSeasonWithDefault, useSelectedGameIdWithDefault } from './hooks';

// eslint-disable-next-line import/no-restricted-paths
import { useAppLocalStorage } from '@common/localstorage';

interface Context {
  selectedChannelId: Nullable<string>;
  selectedGameId: Nullable<string>;
  selectedSeasonId: Nullable<string>;
  setSelectedChannel(channelId: Nullable<string>): void;
  setSelectedGame(gameId: string): void;
  setSelectedSeason(seasonId: Nullable<string>): void;
}

const SelectedUIStateContext = createContext<Context | null>(null);

export function SelectedUIStateProvider({ children }: WithChildren): ReactElement {
  const localStorage = useAppLocalStorage();

  const [selectedChannelId, setSelectedChannelId] = useState<Nullable<string>>(() =>
    localStorage.GetValue('channel.selected'),
  );

  const setSelectedChannel = useCallback(
    (channelId: string) => {
      localStorage.SetValue('channel.selected', channelId);
      setSelectedChannelId(channelId);
    },
    [localStorage],
  );

  const { selectedGameId, setSelectedGameId } = useSelectedGameIdWithDefault();

  const { selectedSeasonId, setSelectedSeason } =
    useSelectedSeasonWithDefault(selectedGameId);

  return (
    <SelectedUIStateContext.Provider
      value={{
        selectedGameId,
        selectedChannelId,
        selectedSeasonId,
        setSelectedGame: setSelectedGameId,
        setSelectedChannel,
        setSelectedSeason,
      }}
    >
      {children}
    </SelectedUIStateContext.Provider>
  );
}

export const useSelectedUIState = (): Context => {
  const context = useContext(SelectedUIStateContext);

  if (!context) {
    throw new Error(
      'Trying to access selected ui state from context without SelectedUIStateProvider',
    );
  }

  return context;
};

export function MockSelectedUIStateProvider({ children }: WithChildren): ReactElement {
  const [selectedGameId, setSelectedGame] = useState<Nullable<string>>(null);
  const [selectedChannelId, setSelectedChannel] = useState<Nullable<string>>(null);
  const [selectedSeasonId, setSelectedSeason] = useState<Nullable<string>>(null);

  return (
    <SelectedUIStateContext.Provider
      value={{
        selectedGameId,
        selectedChannelId,
        selectedSeasonId,
        setSelectedGame,
        setSelectedChannel,
        setSelectedSeason,
      }}
    >
      {children}
    </SelectedUIStateContext.Provider>
  );
}
