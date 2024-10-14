import { GameCardInfo, GameCardInfoProps } from '@game-card';
import { useCardTargetValue } from '@game-logic/card/hooks';

interface Props extends GameCardInfoProps {
  playerId: string;
}

export function PlayerActiveCardInfo({ playerId, ...infoProps }: Props) {
  const { card } = infoProps;
  const { timerDuration, targetValue, targetValues } = useCardTargetValue(playerId);

  return (
    <GameCardInfo
      {...infoProps}
      card={{
        ...card,
        timerDuration: timerDuration ?? card.timerDuration,
        targetValue: targetValue ?? card.targetValue,
        targetValues: targetValues ?? card.targetValues,
      }}
    />
  );
}
