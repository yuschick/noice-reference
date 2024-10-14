import { useEffect, useState } from 'react';

import { CGPlayerOnScoreUpdated } from '../types';

import { useCardGamePlayer } from './useCardGamePlayer.hook';

export function usePlayerScore(playerId: string): [newScore: number, prevScore: number] {
  const player = useCardGamePlayer(playerId);
  const [score, setScore] = useState(player?.score ?? -1);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    const updateScore = ({ scoreTotal }: CGPlayerOnScoreUpdated) => {
      setScore((prev) => {
        setPrevScore(prev);
        return scoreTotal;
      });
    };

    player?.addListener('onScoreUpdated', updateScore);

    return () => {
      player?.removeListener('onScoreUpdated', updateScore);
    };
  }, [player]);

  useEffect(() => {
    if (!player) {
      return;
    }

    setScore((prev) => {
      setPrevScore(prev);
      return player.score;
    });
  }, [player]);

  return [score, prevScore];
}
