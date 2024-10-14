import { IMatchGroupDelegate } from '@noice-com/platform-client';
import { defaultQueue } from '@noice-com/utils';

type PromisifiedMatchGroupDelegate = {
  [EventName in keyof IMatchGroupDelegate]: (
    ...args: Parameters<IMatchGroupDelegate[EventName]>
  ) => void | Promise<void>;
};

export const makeEnqueuedMatchHandler = (
  handler: PromisifiedMatchGroupDelegate,
): IMatchGroupDelegate => {
  return {
    initialized(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.initialized(...args));
    },
    onGameInit(...args) {
      defaultQueue.enqueueHandler(async () => await handler.onGameInit(...args));
    },
    onMatchStarted(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onMatchStarted(...args));
    },
    onMatchPauseStateChanged(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onMatchPauseStateChanged(...args),
      );
    },
    onMatchEnded(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onMatchEnded(...args));
    },
    onRoundPhaseChanged(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onRoundPhaseChanged(...args));
    },
    onCardDealingStarted(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onCardDealingStarted(...args),
      );
    },
    onCardDealingEnded(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onCardDealingEnded(...args));
    },
    onActiveCardSet(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onActiveCardSet(...args));
    },
    onActiveCardPointsUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onActiveCardPointsUpdated(...args),
      );
    },
    onActiveCardTargetValueChanged(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onActiveCardTargetValueChanged(...args),
      );
    },
    onSettingActiveCardFailed(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onSettingActiveCardFailed(...args),
      );
    },
    onHandShuffled(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onHandShuffled(...args));
    },
    onReshuffleCostUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onReshuffleCostUpdated(...args),
      );
    },
    onShufflingHandFailed(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onShufflingHandFailed(...args),
      );
    },
    onPlayerPointsUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onPlayerPointsUpdated(...args),
      );
    },
    onPlayerCoinsUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onPlayerCoinsUpdated(...args),
      );
    },
    onPlayerJoined(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onPlayerJoined(...args));
    },
    onPlayerLeft(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onPlayerLeft(...args));
    },
    onGroupPointsUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onGroupPointsUpdated(...args),
      );
    },
    onBoosterCooldownStarted(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onBoosterCooldownStarted(...args),
      );
    },
    onBoosterAvailable(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onBoosterAvailable(...args));
    },
    onBoosterUsed(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onBoosterUsed(...args));
    },
    onBoosterRequested(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onBoosterRequested(...args));
    },
    onBoosterRequestCancelled(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onBoosterRequestCancelled(...args),
      );
    },
    onBoosterRemoved(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onBoosterRemoved(...args));
    },
    onBoosterPointsReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onBoosterPointsReceived(...args),
      );
    },
    onCardSwitchOutTimerStarted(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onCardSwitchOutTimerStarted(...args),
      );
    },
    onCardSwitchOutAvailable(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onCardSwitchOutAvailable(...args),
      );
    },
    onCardVoteAdded(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onCardVoteAdded(...args));
    },
    onCardVoteRemoved(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onCardVoteRemoved(...args));
    },
    onBestPlayPointsReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onBestPlayPointsReceived(...args),
      );
    },
    onAonPointsCollected(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onAonPointsCollected(...args),
      );
    },
    onAonPointsCollectFailed(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onAonPointsCollectFailed(...args),
      );
    },
    onGroupBonusPointsReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onGroupBonusPointsReceived(...args),
      );
    },
    onActiveCardSucceeded(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onActiveCardSucceeded(...args),
      );
    },
    onActiveCardFailed(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onActiveCardFailed(...args));
    },
    onPlayerCardUpgraded(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onPlayerCardUpgraded(...args),
      );
    },
    onDebug(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onDebug(...args));
    },
    onConnectionStatusChanged(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onConnectionStatusChanged(...args),
      );
    },
    onGroupCreated(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onGroupCreated(...args));
    },
    onStreamEnded(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onStreamEnded(...args));
    },
    onHighScoringCardSucceeded(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onHighScoringCardSucceeded(...args),
      );
    },
    onHighScoringCardPromoted(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onHighScoringCardPromoted(...args),
      );
    },
    onContextualTeamActionUpdate(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onContextualTeamActionUpdate(...args),
      );
    },
    onMatchBonusReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onMatchBonusReceived(...args),
      );
    },
    onInactivityTimerUpdated(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onInactivityTimerUpdated(...args),
      );
    },
    onInactivityTimerCancelled(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onInactivityTimerCancelled(...args),
      );
    },
    onInactivityKickReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onInactivityKickReceived(...args),
      );
    },
    onTeamMergeExecuted(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onTeamMergeExecuted(...args));
    },
    onTeamMergeWarningReceived(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onTeamMergeWarningReceived(...args),
      );
    },
    onRetryMatchMaking(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onRetryMatchMaking(...args));
    },
    onAvailableChallenges(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onAvailableChallenges(...args),
      );
    },
    onSetActiveChallenge(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onSetActiveChallenge(...args),
      );
    },
    onChallengeEvent(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onChallengeEvent(...args));
    },
    onChallengePickRatesUpdate(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onChallengePickRatesUpdate(...args),
      );
    },
    onChallengePicksLocked(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onChallengePicksLocked(...args),
      );
    },
    onSettingActiveChallengeFailed(...args): void {
      defaultQueue.enqueueHandler(
        async () => await handler.onSettingActiveChallengeFailed(...args),
      );
    },
    onGlobalsUpdated(...args): void {
      defaultQueue.enqueueHandler(async () => await handler.onGlobalsUpdated(...args));
    },
  };
};
