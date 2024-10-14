import { useCardGameState } from '../context';

export function useLocalPlayerId(): string {
  const game = useCardGameState();

  return game?.localPlayerId ?? 'unknown';
}
