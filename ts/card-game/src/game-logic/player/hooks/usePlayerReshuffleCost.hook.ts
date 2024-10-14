import {
  FTUEActionType,
  WalletCurrencyId,
  useTriggerFTUEAction,
  useWallet,
} from '@noice-com/common-ui';
import { useCallback, useEffect, useState } from 'react';

import { CGPlayerOnReshuffleCostUpdated } from '../types';

import { useCardGameLocalPlayer } from './useCardGamePlayer.hook';

import { usePlaySound } from '@game-common/sound/hooks';
import { GameSoundKeys } from '@game-types';

interface HookResult {
  currentTokens: number;
  nextReshuffleCost: number;
  onShuffleClicked(): Promise<void>;
}

export function usePlayerReshuffleCost(): HookResult {
  const { currencies } = useWallet();
  const player = useCardGameLocalPlayer();

  const [nextReshuffleCost, setNextReshuffleCost] = useState(
    player?.nextReshuffleCost ?? -1,
  );

  const currentTokens =
    currencies?.find((cur) => cur.currencyId === WalletCurrencyId.ReshuffleToken)
      ?.currencyAmount ?? 0;

  const triggerFTUEAction = useTriggerFTUEAction();
  const [playReshuffleSpent] = usePlaySound(GameSoundKeys.PlayerUseReshuffleToken);

  const onShuffleClicked = useCallback(async () => {
    if (!player) {
      return;
    }

    triggerFTUEAction(FTUEActionType.Reshuffle);
    playReshuffleSpent();
    await player.requestHand(true);
  }, [player, playReshuffleSpent, triggerFTUEAction]);

  useEffect(() => {
    const handleReshuffleCostUpdated = ({
      nextReshuffleCost,
    }: CGPlayerOnReshuffleCostUpdated) => setNextReshuffleCost(nextReshuffleCost);

    player?.addListener('onReshuffleCostUpdated', handleReshuffleCostUpdated);

    return () => {
      player?.removeListener('onReshuffleCostUpdated', handleReshuffleCostUpdated);
    };
  }, [player]);

  useEffect(() => {
    if (!player) {
      return;
    }

    setNextReshuffleCost(player.nextReshuffleCost);
  }, [player]);

  return {
    currentTokens,
    nextReshuffleCost,
    onShuffleClicked,
  };
}
