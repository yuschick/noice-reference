import { GameCardPoints, GameCardPointsProps } from '@game-card';
import { useCardPoints } from '@game-logic/card/hooks';

interface Props extends GameCardPointsProps {
  playerId: string;
}

export function PlayerActiveCardPoints({ playerId, ...pointProps }: Props) {
  const { card } = pointProps;
  const { points: activePoints } = useCardPoints(playerId);

  return (
    <GameCardPoints
      {...pointProps}
      card={{ ...card, pointsMin: activePoints }}
    />
  );
}
