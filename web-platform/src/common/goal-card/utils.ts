import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { GoalCardSlotState } from '@noice-com/platform-client';

import {
  RarityRarity,
  GoalCardSlotStateGoalCardSlotFragment,
  GoalCardSlotResetTimePastGoalCardSlotFragment,
  GoalCardSlotReadyForPickGoalCardCardSlotFragment,
} from '@gen';

gql`
  fragment GoalCardSlotStateGoalCardSlot on GoalCardGoalCardSlot {
    id
    goalCard {
      id
    }
    progress {
      completed
    }
    reward {
      id
    }

    ...GoalCardSlotResetTimePastGoalCardSlot
  }

  fragment GoalCardSlotResetTimePastGoalCardSlot on GoalCardGoalCardSlot {
    id
    resetTime
  }

  fragment GoalCardSlotReadyForPickGoalCardCardSlot on GoalCardGoalCardSlot {
    id
    ...GoalCardSlotResetTimePastGoalCardSlot
    ...GoalCardSlotStateGoalCardSlot
  }
`;

export function isGoalCardSlotResetTimePast(
  slot: GoalCardSlotResetTimePastGoalCardSlotFragment,
) {
  return slot.resetTime ? new Date(slot.resetTime).getTime() < Date.now() : false;
}

export function getGoalCardSlotState(slot: GoalCardSlotStateGoalCardSlotFragment) {
  // Slot has no card
  if (!slot.goalCard) {
    return GoalCardSlotState.EMPTY;
  }

  // Card has failed
  if (!slot.progress?.completed && isGoalCardSlotResetTimePast(slot)) {
    return GoalCardSlotState.FAILED;
  }

  // Card is not completed
  if (!slot.progress?.completed) {
    return GoalCardSlotState.SELECTED;
  }

  // Get all unclaimed reward for this slot and card
  return !slot.reward ? GoalCardSlotState.COLLECTED : GoalCardSlotState.COMPLETED;
}

export function isGoalCardSlotReadyForPick(
  slot: GoalCardSlotReadyForPickGoalCardCardSlotFragment,
) {
  const slotState = getGoalCardSlotState(slot);
  const resetTimePast = isGoalCardSlotResetTimePast(slot);

  return (
    slotState === GoalCardSlotState.EMPTY ||
    slotState === GoalCardSlotState.FAILED ||
    (slotState === GoalCardSlotState.COLLECTED && resetTimePast)
  );
}

export function getRarityIcon(rarity: RarityRarity) {
  if (rarity === RarityRarity.RarityEpic) {
    return CoreAssets.Icons.DGCEpic;
  }

  if (rarity === RarityRarity.RarityLegendary) {
    return CoreAssets.Icons.DGCLegendary;
  }

  if (rarity === RarityRarity.RarityRare) {
    return CoreAssets.Icons.DGCRare;
  }

  if (rarity === RarityRarity.RarityUncommon) {
    return CoreAssets.Icons.DGCUncommon;
  }

  return CoreAssets.Icons.DGCCommon;
}
