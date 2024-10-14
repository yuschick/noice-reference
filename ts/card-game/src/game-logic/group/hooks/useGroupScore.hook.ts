import { useEffect, useState } from 'react';

import { CGGroupOnScoreUpdated } from '../types';

import { useCardGameGroup } from './useCardGameGroup.hook';

export function useGroupScore(): [score: number, previousScore: number] {
  const group = useCardGameGroup();
  const [score, setScore] = useState(group?.score ?? 0);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (!group) {
      return;
    }

    const onUpdated = ({ scoreTotal }: CGGroupOnScoreUpdated) => {
      setScore((prev) => {
        setPrevScore(prev);
        return scoreTotal;
      });
    };

    onUpdated({ scoreTotal: group.score });
    group?.addListener('onScoreUpdated', onUpdated);

    return () => {
      group?.removeListener('onScoreUpdated', onUpdated);
    };
  }, [group]);

  return [score, prevScore];
}
