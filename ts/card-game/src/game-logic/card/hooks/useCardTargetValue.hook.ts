import { Nullable } from '@noice-com/utils';
import { useEffect, useState } from 'react';

import { CGActiveCardOnTargetValueChanged, CGActiveCardTargetValue } from '../types';

import { usePlayerActiveCard } from './usePlayerActiveCard.hook';

interface TargetValueState {
  targetValue: Nullable<number>;
  timerDuration: Nullable<number>;
  targetValues: Nullable<CGActiveCardTargetValue[]>;
}

export function useCardTargetValue(playerID: string): TargetValueState {
  const card = usePlayerActiveCard(playerID);
  const [state, setState] = useState<TargetValueState>({
    targetValue: null,
    timerDuration: null,
    targetValues: null,
  });

  useEffect(() => {
    if (!card) {
      return;
    }

    setState({
      targetValue: card.currentTargetValue,
      timerDuration: card.currentTimerDuration,
      targetValues: card.currentTargetValues,
    });

    const onUpdated = ({
      targetValue,
      timerDuration,
      targetValues,
    }: CGActiveCardOnTargetValueChanged) => {
      setState({ targetValue, timerDuration, targetValues });
    };

    card.addListener('onTargetValueChanged', onUpdated);

    return () => {
      card.removeListener('onTargetValueChanged', onUpdated);
    };
  }, [card]);

  return {
    ...state,
  };
}
