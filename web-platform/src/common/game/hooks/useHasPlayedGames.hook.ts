import { usePlayedGameIds } from './usePlayedGameIds.hook';

interface HookResult {
  hasPlayedGames: boolean;
  loading: boolean;
}

export function useHasPlayedGames(): HookResult {
  const { gameIds, loading } = usePlayedGameIds();

  return {
    hasPlayedGames: (gameIds?.length ?? 0) > 0,
    loading,
  };
}
