import {
  ActivatedBooster,
  GroupEventContentType,
  GroupEventContentTypeMap,
  GroupEventMessage,
  BoosterType,
} from '@noice-com/card-game';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { IMatchGroupDelegate } from '@noice-com/platform-client';
import {
  ActiveCardFailedMsgReason,
  PlayerBoosterPoints,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { Nullable } from '@noice-com/utils';
import { useCallback, useEffect, useState } from 'react';

import { useStreamGame } from '@common/stream';
import { useTriggerUIEvent, AppUIEventType } from '@common/ui-event';

const transformGainedBooster = (
  boosterPoints: PlayerBoosterPoints,
): Nullable<ActivatedBooster> => {
  if (!boosterPoints.userId || !boosterPoints.boosterId) {
    return null;
  }

  return {
    playerId: boosterPoints.userId,
    booster: boosterPoints.boosterId,
    points: boosterPoints.points ?? 0,
  };
};

interface HookResult {
  groupEvents: GroupEventMessage[];
}

// @todo: We should try to figure out if there is a more elegant way to do this.
// Currently there is a lot of duplicated logic, and while the comments help keep it
// easy-ish to follow, it's still very verbose.
export function useGroupEvents(): HookResult {
  const { userId } = useAuthenticatedUser();
  const { gameInstance } = useStreamGame();
  const triggerUIEvent = useTriggerUIEvent();

  const [groupEvents, setGroupEvents] = useState<GroupEventMessage[]>([]);

  const addGroupEvent = useCallback(
    <K extends keyof GroupEventContentTypeMap>(
      contentType: K,
      content: GroupEventContentTypeMap[K],
    ) => {
      const now = new Date();
      const id = now.getTime().toString();

      // @todo figure out better typing so no need to cast
      setGroupEvents((prev) => [
        ...prev,
        { id, contentType, content } as GroupEventMessage,
      ]);
    },
    [],
  );

  useEffect(() => {
    triggerUIEvent(AppUIEventType.CardActivationAmount, groupEvents.length);
  }, [groupEvents.length, triggerUIEvent]);

  const transformBoosterPointsGainedList = useCallback(
    (boosters: PlayerBoosterPoints[]): ActivatedBooster[] => {
      const list: ActivatedBooster[] = [];
      for (let i = 0; i < boosters.length; i++) {
        const booster = transformGainedBooster(boosters[i]);
        if (booster) {
          list.push(booster);
        }
      }
      return list;
    },
    [],
  );

  useEffect(() => {
    const handleBoosterScoredList = (
      boosters: PlayerBoosterPoints[] = [],
      cardId?: string,
      boosterOverride?: BoosterType,
    ) => {
      boosters.forEach(({ userId, boosterId = BoosterType.Unspecified, points = 0 }) => {
        if (!userId) {
          return;
        }

        addGroupEvent(GroupEventContentType.BoosterScored, {
          boosterOwnerId: userId,
          cardId,
          booster: boosterOverride ?? boosterId,
          points: points,
        });
      });
    };

    const delegate: Partial<IMatchGroupDelegate> = {
      onActiveCardSet(_, { allOrNothing, userId, cardId }) {
        if (!allOrNothing || (allOrNothing.round ?? 0) < 1) {
          return;
        }

        if (!userId || !cardId) {
          return;
        }

        // Handle All or Nothing double down
        addGroupEvent(GroupEventContentType.AonDoubleDown, {
          cardOwnerId: userId,
          cardId,
          currentTry: allOrNothing.round ?? 1,
          maxTries: allOrNothing.totalRounds ?? 1000,
        });
      },
      onBoosterPointsReceived(_, { boosterPoints }) {
        if (!boosterPoints) {
          return;
        }

        if (!boosterPoints.cardUserId || !boosterPoints.boosterId) {
          return;
        }
        const activeCard = gameInstance?.getPlayerActiveCard(boosterPoints.cardUserId);

        // Handle boosters not part of fail/success lifecycle
        if ([BoosterType.Doubt].includes(boosterPoints.boosterId)) {
          handleBoosterScoredList(
            [boosterPoints],
            activeCard?.cardId,
            boosterPoints.boosterId,
          );
          return;
        }

        // Don't separately post boosters that the card owner used on their own card
        if (boosterPoints.userId === boosterPoints.cardUserId) {
          return;
        }

        // The rest of the boosters are part of the fail/success lifecycle
        handleBoosterScoredList(
          [boosterPoints],
          activeCard?.cardId,
          boosterPoints.boosterId,
        );
      },
      onActiveCardSucceeded(
        _,
        { cardId, userId, points = 0, boosterPoints = [], bestPlay },
      ) {
        if (!userId || !cardId) {
          return;
        }

        // Handle success message
        // @todo: Unsure if we want to show this for AoN cars until the points are collected.
        // It's a bit tricky because the points collected event doesn't tell us much.
        addGroupEvent(GroupEventContentType.CardSuccess, {
          cardOwnerId: userId,
          cardId,
          points,
          isBestPlay: !!bestPlay,
          activatedBoosters: transformBoosterPointsGainedList(boosterPoints),
        });
      },
      onActiveCardFailed(_, { userId, cardId, boosterPoints = [], reason }) {
        if (!userId || !cardId) {
          return;
        }

        const wasSwitchedOut = reason === ActiveCardFailedMsgReason.REASON_SWITCHED_OUT;

        // Scavenge handling - This is handled separately from the other boosters,
        // and if it is NOT present, the fail logic changes.
        if (boosterPoints.some((booster) => booster.boosterId === BoosterType.Scavenge)) {
          const ownerPoints = boosterPoints.find((booster) => booster.userId === userId);

          addGroupEvent(GroupEventContentType.CardScavenge, {
            cardId,
            wasSwitchedOut,
            cardOwnerId: userId,
            cardOwnerPoints: ownerPoints?.points ?? 0,
            activatedBoosters: transformBoosterPointsGainedList(boosterPoints),
          });

          // SCAVENGE - OTHER PLAYERS
          const otherScavengePoints = boosterPoints.filter(
            (booster) => booster.userId !== userId,
          );
          handleBoosterScoredList(otherScavengePoints, cardId, BoosterType.Scavenge);

          return;
        }

        // NO SCAVENGE + WAS SWITCHED OUT
        if (wasSwitchedOut) {
          // Don't post anything if the card was switched out
          // AND the boosters does NOT contain a scavenge
          return;
        }

        // CARD FAILED
        addGroupEvent(GroupEventContentType.CardFailure, {
          cardOwnerId: userId,
          cardId,
          activatedBoosters: transformBoosterPointsGainedList(boosterPoints),
        });

        // DOUBT FAILURE HANDLING
        boosterPoints.forEach((booster) => {
          // Don't separately post the local players boosters
          if (!booster.userId || booster.userId === userId) {
            return;
          }

          handleBoosterScoredList([booster], cardId, BoosterType.Doubt);
        });
      },
    };

    gameInstance?.attachDelegate(delegate);
    return () => {
      gameInstance?.detachDelegate(delegate);
    };
  }, [addGroupEvent, userId, gameInstance, transformBoosterPointsGainedList]);

  return {
    groupEvents,
  };
}
