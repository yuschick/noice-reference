"use strict";
/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeStreamerMessagePayloadDelegate = exports.routeServerMessagePayloadDelegate = exports.routeClientMessagePayloadDelegate = exports.Presence = void 0;
var Presence;
(function (Presence) {
    Presence["UNSPECIFIED"] = "UNSPECIFIED";
    Presence["LEFT"] = "LEFT";
    Presence["JOINED"] = "JOINED";
})(Presence || (exports.Presence = Presence = {}));
function routeClientMessagePayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.setActiveCard) && delegate.onSetActiveCard(ctx, val.setActiveCard);
    (val === null || val === void 0 ? void 0 : val.shuffleHand) && delegate.onShuffleHand(ctx, val.shuffleHand);
    (val === null || val === void 0 ? void 0 : val.useBooster) && delegate.onUseBooster(ctx, val.useBooster);
    (val === null || val === void 0 ? void 0 : val.requestBooster) && delegate.onRequestBooster(ctx, val.requestBooster);
    (val === null || val === void 0 ? void 0 : val.cancelBoosterRequest) && delegate.onCancelBoosterRequest(ctx, val.cancelBoosterRequest);
    (val === null || val === void 0 ? void 0 : val.collectAonPoints) && delegate.onCollectAonPoints(ctx, val.collectAonPoints);
    (val === null || val === void 0 ? void 0 : val.triggerEmoji) && delegate.onTriggerEmoji(ctx, val.triggerEmoji);
    (val === null || val === void 0 ? void 0 : val.triggerEmote) && delegate.onTriggerEmote(ctx, val.triggerEmote);
    (val === null || val === void 0 ? void 0 : val.requestHand) && delegate.onRequestHand(ctx, val.requestHand);
    (val === null || val === void 0 ? void 0 : val.joinTeamAction) && delegate.onJoinTeamAction(ctx, val.joinTeamAction);
    (val === null || val === void 0 ? void 0 : val.setDebug) && delegate.onSetDebug(ctx, val.setDebug);
}
exports.routeClientMessagePayloadDelegate = routeClientMessagePayloadDelegate;
function routeServerMessagePayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.gameInit) && delegate.onGameInit(ctx, val.gameInit);
    (val === null || val === void 0 ? void 0 : val.matchStarted) && delegate.onMatchStarted(ctx, val.matchStarted);
    (val === null || val === void 0 ? void 0 : val.matchEnded) && delegate.onMatchEnded(ctx, val.matchEnded);
    (val === null || val === void 0 ? void 0 : val.cardDealingStarted) && delegate.onCardDealingStarted(ctx, val.cardDealingStarted);
    (val === null || val === void 0 ? void 0 : val.cardDealingEnded) && delegate.onCardDealingEnded(ctx, val.cardDealingEnded);
    (val === null || val === void 0 ? void 0 : val.activeCardSet) && delegate.onActiveCardSet(ctx, val.activeCardSet);
    (val === null || val === void 0 ? void 0 : val.activeCardPointsUpdated) && delegate.onActiveCardPointsUpdated(ctx, val.activeCardPointsUpdated);
    (val === null || val === void 0 ? void 0 : val.activeCardTargetValueChanged) && delegate.onActiveCardTargetValueChanged(ctx, val.activeCardTargetValueChanged);
    (val === null || val === void 0 ? void 0 : val.settingActiveCardFailed) && delegate.onSettingActiveCardFailed(ctx, val.settingActiveCardFailed);
    (val === null || val === void 0 ? void 0 : val.handShuffled) && delegate.onHandShuffled(ctx, val.handShuffled);
    (val === null || val === void 0 ? void 0 : val.shufflingHandFailed) && delegate.onShufflingHandFailed(ctx, val.shufflingHandFailed);
    (val === null || val === void 0 ? void 0 : val.playerPointsUpdated) && delegate.onPlayerPointsUpdated(ctx, val.playerPointsUpdated);
    (val === null || val === void 0 ? void 0 : val.playerCoinsUpdated) && delegate.onPlayerCoinsUpdated(ctx, val.playerCoinsUpdated);
    (val === null || val === void 0 ? void 0 : val.playerJoined) && delegate.onPlayerJoined(ctx, val.playerJoined);
    (val === null || val === void 0 ? void 0 : val.playerLeft) && delegate.onPlayerLeft(ctx, val.playerLeft);
    (val === null || val === void 0 ? void 0 : val.groupPointsUpdated) && delegate.onGroupPointsUpdated(ctx, val.groupPointsUpdated);
    (val === null || val === void 0 ? void 0 : val.boosterCooldownStarted) && delegate.onBoosterCooldownStarted(ctx, val.boosterCooldownStarted);
    (val === null || val === void 0 ? void 0 : val.boosterAvailable) && delegate.onBoosterAvailable(ctx, val.boosterAvailable);
    (val === null || val === void 0 ? void 0 : val.boosterUsed) && delegate.onBoosterUsed(ctx, val.boosterUsed);
    (val === null || val === void 0 ? void 0 : val.boosterRequested) && delegate.onBoosterRequested(ctx, val.boosterRequested);
    (val === null || val === void 0 ? void 0 : val.boosterRequestCancelled) && delegate.onBoosterRequestCancelled(ctx, val.boosterRequestCancelled);
    (val === null || val === void 0 ? void 0 : val.boosterRemoved) && delegate.onBoosterRemoved(ctx, val.boosterRemoved);
    (val === null || val === void 0 ? void 0 : val.boosterPointsReceived) && delegate.onBoosterPointsReceived(ctx, val.boosterPointsReceived);
    (val === null || val === void 0 ? void 0 : val.cardSwitchOutTimerStarted) && delegate.onCardSwitchOutTimerStarted(ctx, val.cardSwitchOutTimerStarted);
    (val === null || val === void 0 ? void 0 : val.cardSwitchOutAvailable) && delegate.onCardSwitchOutAvailable(ctx, val.cardSwitchOutAvailable);
    (val === null || val === void 0 ? void 0 : val.cardVoteAdded) && delegate.onCardVoteAdded(ctx, val.cardVoteAdded);
    (val === null || val === void 0 ? void 0 : val.cardVoteRemoved) && delegate.onCardVoteRemoved(ctx, val.cardVoteRemoved);
    (val === null || val === void 0 ? void 0 : val.bestPlayPointsReceived) && delegate.onBestPlayPointsReceived(ctx, val.bestPlayPointsReceived);
    (val === null || val === void 0 ? void 0 : val.aonPointsCollected) && delegate.onAonPointsCollected(ctx, val.aonPointsCollected);
    (val === null || val === void 0 ? void 0 : val.aonPointsCollectFailed) && delegate.onAonPointsCollectFailed(ctx, val.aonPointsCollectFailed);
    (val === null || val === void 0 ? void 0 : val.groupBonusPointsReceived) && delegate.onGroupBonusPointsReceived(ctx, val.groupBonusPointsReceived);
    (val === null || val === void 0 ? void 0 : val.activeCardSucceeded) && delegate.onActiveCardSucceeded(ctx, val.activeCardSucceeded);
    (val === null || val === void 0 ? void 0 : val.activeCardFailed) && delegate.onActiveCardFailed(ctx, val.activeCardFailed);
    (val === null || val === void 0 ? void 0 : val.playerCardUpgraded) && delegate.onPlayerCardUpgraded(ctx, val.playerCardUpgraded);
    (val === null || val === void 0 ? void 0 : val.reshuffleCostUpdated) && delegate.onReshuffleCostUpdated(ctx, val.reshuffleCostUpdated);
    (val === null || val === void 0 ? void 0 : val.groupCreated) && delegate.onGroupCreated(ctx, val.groupCreated);
    (val === null || val === void 0 ? void 0 : val.streamEnded) && delegate.onStreamEnded(ctx, val.streamEnded);
    (val === null || val === void 0 ? void 0 : val.highScoringCardSucceeded) && delegate.onHighScoringCardSucceeded(ctx, val.highScoringCardSucceeded);
    (val === null || val === void 0 ? void 0 : val.highScoringCardPromoted) && delegate.onHighScoringCardPromoted(ctx, val.highScoringCardPromoted);
    (val === null || val === void 0 ? void 0 : val.contextualTeamActionUpdate) && delegate.onContextualTeamActionUpdate(ctx, val.contextualTeamActionUpdate);
    (val === null || val === void 0 ? void 0 : val.matchBonusReceived) && delegate.onMatchBonusReceived(ctx, val.matchBonusReceived);
    (val === null || val === void 0 ? void 0 : val.inactivityTimerUpdated) && delegate.onInactivityTimerUpdated(ctx, val.inactivityTimerUpdated);
    (val === null || val === void 0 ? void 0 : val.inactivityTimerCancelled) && delegate.onInactivityTimerCancelled(ctx, val.inactivityTimerCancelled);
    (val === null || val === void 0 ? void 0 : val.inactivityKickReceived) && delegate.onInactivityKickReceived(ctx, val.inactivityKickReceived);
    (val === null || val === void 0 ? void 0 : val.matchPauseStateChanged) && delegate.onMatchPauseStateChanged(ctx, val.matchPauseStateChanged);
    (val === null || val === void 0 ? void 0 : val.teamMergeWarningReceived) && delegate.onTeamMergeWarningReceived(ctx, val.teamMergeWarningReceived);
    (val === null || val === void 0 ? void 0 : val.teamMergeExecuted) && delegate.onTeamMergeExecuted(ctx, val.teamMergeExecuted);
    (val === null || val === void 0 ? void 0 : val.debug) && delegate.onDebug(ctx, val.debug);
}
exports.routeServerMessagePayloadDelegate = routeServerMessagePayloadDelegate;
function routeStreamerMessagePayloadDelegate(ctx, val, delegate) {
    (val === null || val === void 0 ? void 0 : val.activateContextualTeamAction) && delegate.onActivateContextualTeamAction(ctx, val.activateContextualTeamAction);
}
exports.routeStreamerMessagePayloadDelegate = routeStreamerMessagePayloadDelegate;
//# sourceMappingURL=messaging.pb.js.map