import { useMountEffect } from '@noice-com/common-react-core';
import { SetTimeoutId } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';

import { usePlaySound, AppSoundKeys } from '@common/sound';
import {
  StoreItemSuccessCardItemRefFragment,
  StoreSuccessCardBaseCardFragment,
  StoreSuccessCardGameLogicCardFragment,
  StoreSuccessCardItemItemFragment,
  StoreSuccessCardStreamerLogicCardFragment,
} from '@gen';

interface HookResult {
  showUpgradeInfo: boolean;
  showCardAsUpgraded: boolean;
  showUpgradeAnimation: boolean;
  updatedCardDetails: Nullable<StoreSuccessCardBaseCardFragment>;
  inventoryCardDetails: Nullable<StoreSuccessCardBaseCardFragment>;
  cardProgress: Nullable<{ max: number; progress: number; start: number }>;
  cards: {
    gameCard?: StoreSuccessCardGameLogicCardFragment;
    streamerCard?: StoreSuccessCardStreamerLogicCardFragment;
  };
  onHorizontalBarMountAnimationEnd(): void;
  onHorizontalBarProgressAnimationEnd(): void;
  onUpgradeInfoAnimationEndWrapper(): void;
  onUpgradeAnimationStart(): void;
}

interface Props {
  itemRef: StoreItemSuccessCardItemRefFragment;
  skipAnimation?: boolean;
  onAnimationEnd(): void;
  stopProgressCardValueUp(): void;
}

const getItemGameLogicCard = (
  item: Nullable<StoreSuccessCardItemItemFragment>,
): Nullable<StoreSuccessCardBaseCardFragment> => {
  if (!item?.details) {
    return null;
  }

  if (item.details.__typename === 'GameLogicCard') {
    return item.details;
  }

  if (item.details.__typename === 'GameLogicStreamerCard') {
    return item.details.baseCard;
  }

  return null;
};

export const HIGHLIGHT_ANIMATION_DURATION_MS = 600;

export function useStoreItemSuccessCardItemStates({
  itemRef,
  skipAnimation,
  onAnimationEnd,
  stopProgressCardValueUp,
}: Props): HookResult {
  const { item, inventoryState } = itemRef;

  const [showUpgradeInfo, setShowUpgradeInfo] = useState(false);
  const [showCardAsUpgraded, setShowCardAsUpgraded] = useState(false);
  const [showUpgradeAnimation, setShowUpgradeAnimation] = useState(false);

  const timeout = useRef<SetTimeoutId>();

  const [playCardLevelUp] = usePlaySound(AppSoundKeys.ProgressionCardLevelUp);

  const updatedCardDetails = getItemGameLogicCard(item);
  const inventoryCardDetails = getItemGameLogicCard(inventoryState?.item ?? null);

  const isUpgraded = useMemo(() => {
    if (!inventoryCardDetails || !updatedCardDetails) {
      return false;
    }

    // If bundle card level is higher than inventory, lets upgrade
    if (
      (inventoryCardDetails.leveling.currentLevel ?? 1) <
      (updatedCardDetails.leveling.currentLevel ?? 1)
    ) {
      return true;
    }

    // Ignore others
    return false;
  }, [inventoryCardDetails, updatedCardDetails]);

  const cardProgress = useMemo(() => {
    if (!updatedCardDetails) {
      return null;
    }

    // New card
    if (!inventoryCardDetails) {
      return {
        max: updatedCardDetails.leveling.nextLevelLimit,
        progress: updatedCardDetails.leveling.progressToNextLevel,
        start: 0,
      };
    }

    // Existing card without upgrading
    if (!isUpgraded) {
      return {
        max: updatedCardDetails.leveling.nextLevelLimit,
        progress: updatedCardDetails.leveling.progressToNextLevel,
        start: inventoryCardDetails.leveling.progressToNextLevel,
      };
    }

    // Existing card with upgrading on first step
    if (!showCardAsUpgraded) {
      return {
        max: inventoryCardDetails.leveling.nextLevelLimit,
        progress: inventoryCardDetails.leveling.nextLevelLimit,
        start: inventoryCardDetails.leveling.progressToNextLevel,
      };
    }

    return {
      max: updatedCardDetails.leveling.nextLevelLimit,
      progress: updatedCardDetails.leveling.progressToNextLevel,
      start: 0,
    };
  }, [inventoryCardDetails, isUpgraded, showCardAsUpgraded, updatedCardDetails]);

  const cards = useMemo(() => {
    // Cards when now upgrade
    if (!isUpgraded || showCardAsUpgraded) {
      // No streamer card
      if (itemRef.item?.details?.__typename === 'GameLogicCard') {
        return {
          gameCard: itemRef.item.details,
          streamerCard: undefined,
        };
      }

      // With streamer card
      if (itemRef.item?.details?.__typename === 'GameLogicStreamerCard') {
        return {
          gameCard: itemRef.item.details.baseCard,
          streamerCard: itemRef.item.details,
        };
      }
    }

    // Show the first level
    if (!showCardAsUpgraded) {
      // No streamer card
      if (inventoryState?.item?.details?.__typename === 'GameLogicCard') {
        return {
          gameCard: inventoryState.item.details,
          streamerCard: undefined,
        };
      }

      // With streamer card
      if (inventoryState?.item?.details?.__typename === 'GameLogicStreamerCard') {
        return {
          gameCard: inventoryState.item.details.baseCard,
          streamerCard: inventoryState.item.details,
        };
      }
    }

    return {
      gameCard: undefined,
      streamerCard: undefined,
    };
  }, [
    inventoryState?.item.details,
    isUpgraded,
    itemRef.item.details,
    showCardAsUpgraded,
  ]);

  useEffect(() => {
    // Do nothing if card is not upgraded or it is already shown as upgraded
    if (!inventoryCardDetails || !updatedCardDetails || !isUpgraded) {
      return;
    }

    if (skipAnimation) {
      setShowUpgradeInfo(true);
      setShowUpgradeAnimation(true);
    }
  }, [inventoryCardDetails, isUpgraded, skipAnimation, updatedCardDetails]);

  const onHorizontalBarMountAnimationEnd = useCallback(() => {
    if (!isUpgraded) {
      onAnimationEnd();
    }

    if (showUpgradeAnimation) {
      onAnimationEnd();
    }
  }, [isUpgraded, onAnimationEnd, showUpgradeAnimation]);

  const onHorizontalBarProgressAnimationEnd = useCallback(() => {
    if (skipAnimation) {
      return;
    }

    stopProgressCardValueUp();

    // Do nothing if card is not upgraded or it is already shown as upgraded
    if (!isUpgraded || showCardAsUpgraded) {
      return;
    }

    playCardLevelUp();
    setShowUpgradeAnimation(true);
    setShowUpgradeInfo(true);
  }, [
    isUpgraded,
    playCardLevelUp,
    showCardAsUpgraded,
    skipAnimation,
    stopProgressCardValueUp,
  ]);

  const onUpgradeInfoAnimationEndWrapper = useCallback(() => {
    if (skipAnimation) {
      return;
    }
  }, [skipAnimation]);

  const onUpgradeAnimationStart = useCallback(() => {
    timeout.current = setTimeout(() => {
      setShowCardAsUpgraded(true);
    }, HIGHLIGHT_ANIMATION_DURATION_MS);
  }, []);

  useMountEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  });

  return {
    showUpgradeInfo,
    showCardAsUpgraded,
    showUpgradeAnimation,
    updatedCardDetails,
    inventoryCardDetails,
    cardProgress,
    cards,
    onHorizontalBarMountAnimationEnd,
    onHorizontalBarProgressAnimationEnd,
    onUpgradeInfoAnimationEndWrapper,
    onUpgradeAnimationStart,
  };
}
