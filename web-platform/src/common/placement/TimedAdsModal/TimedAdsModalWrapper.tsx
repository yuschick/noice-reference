import { gql } from '@apollo/client';
import { useClient, useMountEffect } from '@noice-com/common-react-core';
import {
  FTUEActionType,
  useStreamVolume,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { Operation, OperationType } from '@noice-com/schemas/wallet/wallet.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeUnload } from 'react-router-dom';

import { TIMED_REWARDS_PLACEMENT_ID } from '../constants';

import { TimedAdsModal } from './TimedAdsModal';

import { useTimedAdsPlacementQuery, useTimedAdsRewardPlacementMutation } from '@gen';

gql`
  query TimedAdsPlacement($placementId: ID!) {
    placement(placementId: $placementId) {
      placementId
      ...TimedAdsModalAd
    }
  }

  mutation TimedAdsRewardPlacement($placementId: ID!) {
    rewardPlacement(placementId: $placementId) {
      emptyTypeWorkaround
    }
  }
`;

interface Props {
  onClose(): void;
}

export function TimedAdsModalWrapper({ onClose }: Props) {
  const client = useClient();
  const triggerFTUEAction = useTriggerFTUEAction();

  const [volume, setVolume] = useStreamVolume();
  const originalStreamVolume = useRef<number>(volume);

  const { data } = useTimedAdsPlacementQuery({
    variables: { placementId: TIMED_REWARDS_PLACEMENT_ID },
  });

  const handleClose = () => {
    setRewardWalletTransactions(null);
    onClose();
  };

  const handleRewardPlacement = async () => {
    await rewardPlacement();
  };

  const handleWatchedAd = () => {
    triggerFTUEAction(FTUEActionType.TimedAdsClaimReward);
    setRewardWalletTransactions(null);
  };

  const [rewardPlacement] = useTimedAdsRewardPlacementMutation({
    variables: { placementId: TIMED_REWARDS_PLACEMENT_ID },
  });

  const [rewardWalletTransactions, setRewardWalletTransactions] =
    useState<Nullable<Operation[]>>(null);

  useMountEffect(() => {
    originalStreamVolume.current = volume;
    setVolume(0);

    return () => {
      setVolume(originalStreamVolume.current);
    };
  });

  useBeforeUnload(
    useCallback(() => {
      setVolume(originalStreamVolume.current);
    }, [setVolume]),
  );

  useEffect(() => {
    return client.NotificationService.notifications({
      onWalletTransaction: (_ctx, ev) => {
        // Wallet transaction is not an ad watch
        if (!ev.transaction?.reason?.adWatched) {
          return;
        }

        // We do not care about the transaction that are not add operations
        const adWatchedUpdate = ev.transaction?.operations?.filter(
          (operation) => operation.type === OperationType.TYPE_ADD,
        );

        if (!adWatchedUpdate || !adWatchedUpdate.length) {
          return;
        }

        setRewardWalletTransactions(adWatchedUpdate);
      },
    });
  }, [client]);

  const placement = data?.placement ?? null;

  if (!placement) {
    return null;
  }

  return (
    <TimedAdsModal
      placement={placement}
      rewardedWalletTransactions={rewardWalletTransactions}
      onClose={handleClose}
      onRewardPlacement={handleRewardPlacement}
      onWatchedAd={handleWatchedAd}
    />
  );
}
