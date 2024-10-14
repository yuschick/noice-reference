import { GameCardBottomLabel, GameCardBottomLabelProps } from '@game-card';
import { useCardPoints } from '@game-logic/card/hooks';

interface Props extends GameCardBottomLabelProps {
  playerId: string;
}

export function PlayerActiveBottomLabel({ playerId, ...bottomLabelProps }: Props) {
  const { nextPointsTimer } = useCardPoints(playerId);

  return (
    <GameCardBottomLabel
      {...bottomLabelProps}
      progressBarTimer={nextPointsTimer}
    />
  );
}
