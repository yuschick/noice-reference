import { gql, useApolloClient } from '@apollo/client';
import {
  useCardGameAPI,
  usePlayerActiveCard,
  useCardGamePlayer,
  BoosterType,
  useLeaderboards,
  LeaderboardGroup,
} from '@noice-com/card-game';
import { useChatAPI } from '@noice-com/chat-react-web';
import { useAuthenticatedUser } from '@noice-com/common-ui';
import { IMatchGroupDelegate } from '@noice-com/platform-client';
import { StreamStateMatchState } from '@noice-com/schemas/game-logic/game_logic.pb';
import { DeepPartial, Nullable } from '@noice-com/utils';
import { useEffect, useMemo, useState } from 'react';

import { FTUEPlayerStats, UiContext } from '../types';

import { useHasUnclaimedSeasonRewards } from '@common/season';
import { useStoreHasBundlesToBuy } from '@common/store-bundle';
import { useStreamGame } from '@common/stream';
import { useListenToUIEvent, AppUIEventType } from '@common/ui-event';
import {
  useFtuePlayerDataQuery,
  useFtueCriteriaDataCardLazyQuery,
  useFtuePlayerDataMatchProfileLazyQuery,
  ProfileProfile,
  useFtuePlayerDataBoosterProfileLazyQuery,
} from '@gen';

interface HookResult {
  uiContext: Nullable<UiContext>;
  playerStats: Nullable<FTUEPlayerStats>;
}

gql`
  query FTUEPlayerData($userId: ID!) {
    profile(userId: $userId) {
      userId
      stats {
        adsWatched
        matchesPlayed
        soloMatchesPlayed
        partyMatchesPlayed
        timePlayed
        dailyGoalCardsCompleted
        cardsPlayed
        shufflesUsed
        cardBundlesPurchased
        cardsSucceeded
        boosterUsage {
          total
          doubt
          goodCall
          letsGo
          nextUp
          scavenge
          speedUp
        }
        currencySpending {
          hardCurrency
          softCurrency
          channelCurrency
        }
        dailyGoalCardsSet
        cardLevelUps
      }
      avatarConfig {
        modelId
        model {
          id
          selectable
        }
      }
      playedGames {
        id
        userId
        progression {
          level
        }
      }
    }
  }

  query FTUEPlayerDataMatchProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      stats {
        matchesPlayed
        soloMatchesPlayed
        partyMatchesPlayed
        timePlayed
      }
    }
  }

  query FTUEPlayerDataBoosterProfile($userId: ID!) {
    profile(userId: $userId) {
      userId
      stats {
        boosterUsage {
          total
          doubt
          goodCall
          letsGo
          nextUp
          scavenge
          speedUp
        }
      }
    }
  }

  query FTUECriteriaDataCard($cardId: String!) {
    gameCards(cardIds: [$cardId]) {
      cards {
        id
        isMatchCard
        isAllOrNothing
      }
    }
  }
`;

export function useFTUECriteriaData(preventListeningProp: boolean): HookResult {
  const { userId, hasRole, isImplicitAccount } = useAuthenticatedUser();
  const { isSolo: isPlayingSolo, gameInstance } = useStreamGame();
  const activeCard = usePlayerActiveCard(userId);
  const localPlayer = useCardGamePlayer(userId);
  const { canBuyPremiumBundles, canBuyStandardBundles } = useStoreHasBundlesToBuy();
  const leaderboards = useLeaderboards();
  const { hasUnclaimedSeasonRewards } = useHasUnclaimedSeasonRewards();
  const { cache } = useApolloClient();

  const [matchState, setMatchState] = useState<StreamStateMatchState>();
  const [maxPointsInCard, setMaxPointsInCard] = useState(false);
  const [cardSelected, setCardSelected] = useState(false);
  const [playerInTeam, setPlayerInTeam] = useState(false);
  const [leaderboardPosition, setLeaderboardPosition] = useState(0);
  const [cardActivityMessageAmount, setCardActivityMessageAmount] = useState(0);
  const [teamChatMessageAmount, setTeamChatMessageAmount] = useState(0);
  const [availableBoosterType, setAvailableBoosterType] =
    useState<Nullable<BoosterType>>(null);
  const [applyingBooster, setApplyingBooster] = useState(false);
  const [startingCardsDialogOpen, setStartingCardsDialogOpen] = useState(false);
  const [aonCardSelected, setAonCardSelected] = useState(false);
  const [cardStandardCardSelected, setCardStandardCardSelected] = useState(false);
  const [matchCardSelected, setMatchCardSelected] = useState(false);
  const [isRoundBasedGame, setIsRoundBasedGame] = useState(false);

  const [fetchCard] = useFtueCriteriaDataCardLazyQuery();

  const preventListening = preventListeningProp || hasRole('bot');

  useListenToUIEvent(
    preventListening ? undefined : AppUIEventType.CardActivationAmount,
    setCardActivityMessageAmount,
  );
  useListenToUIEvent(
    preventListening ? undefined : AppUIEventType.StartingCardsDialogOpen,
    setStartingCardsDialogOpen,
  );

  // Game events
  const { events: gameEvents } = useCardGameAPI();

  useEffect(() => {
    if (preventListening) {
      return;
    }

    gameEvents.addListener('onToggleApplyingBooster', setApplyingBooster);

    return () => {
      gameEvents.removeListener('onToggleApplyingBooster', setApplyingBooster);
    };
  }, [preventListening, gameEvents]);

  // Chat events
  const { events: chatEvents } = useChatAPI();

  useEffect(() => {
    if (preventListening) {
      return;
    }

    chatEvents.addListener('onTeamChatMessagesAmountChange', setTeamChatMessageAmount);

    return () => {
      chatEvents.removeListener(
        'onTeamChatMessagesAmountChange',
        setTeamChatMessageAmount,
      );
    };
  }, [preventListening, chatEvents]);

  const { data, loading: loadingPlayerData } = useFtuePlayerDataQuery({
    variables: {
      userId,
    },
    skip: preventListening,
  });

  const [fetchMatchData] = useFtuePlayerDataMatchProfileLazyQuery({
    variables: {
      userId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [fetchBoosterData] = useFtuePlayerDataBoosterProfileLazyQuery({
    variables: {
      userId,
    },
    fetchPolicy: 'cache-and-network',
  });

  // User has customized avatar
  const customizedAvatar = !data?.profile?.avatarConfig?.model?.selectable;

  // Match connection state management
  useEffect(() => {
    // Do nothing when listening is prevented
    if (preventListening) {
      return;
    }

    if (!gameInstance) {
      return;
    }

    const fetchMatchState = () => {
      setMatchState(gameInstance.matchState);
      setPlayerInTeam((gameInstance.getLocalGroup()?.getGroupPlayers().length ?? 0) > 1);

      const ownPlayer = gameInstance.getPlayer(userId);
      const activeCard = gameInstance.getPlayerActiveCard(userId);

      setAvailableBoosterType(ownPlayer?.availableBoosterID ?? null);

      // If card has not gain anohting, lets not count it to be in max points (e.g. AoN)
      if (activeCard && activeCard.currentPoints > 0) {
        setMaxPointsInCard(activeCard.currentPoints >= activeCard.maxPoints);
        setCardSelected(true);
      }
    };

    const checkTeamStatus = () => {
      const group = gameInstance.getLocalGroup();

      return (group?.getGroupPlayers().length ?? 0) > 1;
    };

    const checkGameType = () => {
      setIsRoundBasedGame(gameInstance.isRoundBasedGame());
    };

    const checkCardType = async (cardId?: string) => {
      if (!cardId) {
        return;
      }

      const card = await fetchCard({ variables: { cardId: cardId } });

      const isAllOrNothing = card?.data?.gameCards?.cards?.[0]?.isAllOrNothing ?? false;
      const isMatchCard = card?.data?.gameCards?.cards?.[0]?.isMatchCard ?? false;
      const isStandard = !isAllOrNothing && !isMatchCard;

      setAonCardSelected(isAllOrNothing);
      setCardStandardCardSelected(isStandard);
      setMatchCardSelected(isMatchCard);
    };

    const initialise = () => {
      fetchMatchState();
      setPlayerInTeam(checkTeamStatus());
      checkCardType(gameInstance.getPlayerActiveCard(userId)?.cardId);
      checkGameType();
    };

    const delegate: Partial<IMatchGroupDelegate> = {
      onMatchStarted() {
        setMatchState(StreamStateMatchState.MATCH_STATE_ACTIVE);
      },
      onMatchEnded() {
        setMatchState(StreamStateMatchState.MATCH_STATE_ENDED);
        setMaxPointsInCard(false);
        setCardSelected(false);
        setPlayerInTeam(false);
        setAvailableBoosterType(null);
        setApplyingBooster(false);
        setAonCardSelected(false);
        setCardStandardCardSelected(false);
        setMatchCardSelected(false);
        fetchMatchData();
      },
      onGameInit() {
        initialise();
      },
      onConnectionStatusChanged() {
        // Either error or close, reset match related contexts
        setCardSelected(false);
        setMatchState(undefined);
        setMaxPointsInCard(false);
        setPlayerInTeam(false);
        setAvailableBoosterType(null);
        setLeaderboardPosition(0);
        setApplyingBooster(false);
        setAonCardSelected(false);
        setCardStandardCardSelected(false);
        setMatchCardSelected(false);
        fetchMatchData();
      },
      onActiveCardSet(_, { cardId, userId: playerId }) {
        if (userId !== playerId) {
          return;
        }

        checkCardType(cardId);
      },
      onActiveCardSucceeded(_, { userId: playerId }) {
        if (userId !== playerId) {
          return;
        }

        setAonCardSelected(false);
        setCardStandardCardSelected(false);
        setMatchCardSelected(false);
      },
      onActiveCardFailed(_, { userId: playerId }) {
        if (userId !== playerId) {
          return;
        }

        setAonCardSelected(false);
        setCardStandardCardSelected(false);
        setMatchCardSelected(false);
      },
      onPlayerLeft(_, { userId: leftUserId }) {
        if (userId === leftUserId) {
          return;
        }

        setPlayerInTeam(checkTeamStatus());
      },
      onPlayerJoined() {
        setPlayerInTeam(checkTeamStatus());
      },
    };

    gameInstance.attachDelegate(delegate);

    // Also trigger initialize on mount so we get current state of game
    initialise();
    return () => {
      gameInstance.detachDelegate(delegate);
    };
  }, [gameInstance, preventListening, userId, fetchCard, fetchMatchData]);

  // Local Player events
  useEffect(() => {
    const handlePointsUpdated = () => setMaxPointsInCard(activeCard?.isMaxed ?? false);

    const handleCardChanged = () => {
      setMaxPointsInCard(false);
      setCardSelected(true);
    };

    const handleOnCardSucceeded = () => {
      setMaxPointsInCard(false);
      setCardSelected(false);

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment CardSucceededStatsUpdateProfile on ProfileProfile {
              stats {
                cardsPlayed
                cardsSucceeded
              }
            }
          `,
        },
        (existing) => {
          if (!existing) {
            return existing;
          }

          return {
            ...existing,
            stats: {
              ...existing.stats,
              cardsPlayed: (existing.stats?.cardsPlayed ?? 0) + 1,
              cardsSucceeded: (existing.stats?.cardsSucceeded ?? 0) + 1,
            },
          };
        },
      );
    };

    const handleOnCardFailed = () => {
      setMaxPointsInCard(false);
      setCardSelected(false);

      cache.updateFragment<DeepPartial<ProfileProfile>>(
        {
          id: cache.identify({ userId, __typename: 'ProfileProfile' }),
          fragment: gql`
            fragment CardFailedStatsUpdateProfile on ProfileProfile {
              stats {
                cardsPlayed
              }
            }
          `,
        },
        (existing) => {
          if (!existing) {
            return existing;
          }

          return {
            ...existing,
            stats: {
              ...existing.stats,
              cardsPlayed: (existing.stats?.cardsPlayed ?? 0) + 1,
            },
          };
        },
      );
    };

    const handleBoosterAvailable = () => {
      setAvailableBoosterType(localPlayer?.availableBoosterID ?? null);
      fetchBoosterData();
    };

    const handleBoosterUsed = () => {
      setAvailableBoosterType(null);
    };

    activeCard?.addListener('onPointsUpdated', handlePointsUpdated);
    activeCard?.addListener('onSwitchedOut', handleCardChanged);
    activeCard?.addListener('onSucceeded', handleOnCardSucceeded);
    activeCard?.addListener('onFailed', handleOnCardFailed);
    localPlayer?.addListener('onBoosterAvailable', handleBoosterAvailable);
    localPlayer?.addListener('onBoosterCooldownTimer', handleBoosterUsed);

    return () => {
      activeCard?.removeListener('onPointsUpdated', handlePointsUpdated);
      activeCard?.removeListener('onSwitchedOut', handleCardChanged);
      activeCard?.removeListener('onSucceeded', handleOnCardSucceeded);
      activeCard?.removeListener('onFailed', handleOnCardFailed);
      localPlayer?.removeListener('onBoosterAvailable', handleBoosterAvailable);
      localPlayer?.removeListener('onBoosterCooldownTimer', handleBoosterUsed);
    };
  }, [activeCard, cache, fetchBoosterData, localPlayer, userId]);

  useEffect(() => {
    // Do nothing when listening is prevented
    if (preventListening) {
      return;
    }

    const getPlayersLeaderboardRank = (groups: LeaderboardGroup[]) =>
      groups.find((group) =>
        group.players.map((player) => player.playerId).includes(userId),
      )?.rank ?? 0;

    setLeaderboardPosition(
      getPlayersLeaderboardRank(leaderboards.currentState?.groups ?? []),
    );

    return leaderboards.addEventListener({
      onReset(msg) {
        setLeaderboardPosition(getPlayersLeaderboardRank(msg.groups));
      },
      onPlayerLeft(msg) {
        setLeaderboardPosition(getPlayersLeaderboardRank(msg.groups));
      },
      onGroupUpdate(msg) {
        setLeaderboardPosition(getPlayersLeaderboardRank(msg.groups));
      },
      onPlayerUpdate(msg) {
        setLeaderboardPosition(getPlayersLeaderboardRank(msg.groups));
      },
    });
  }, [leaderboards, preventListening, userId]);

  const uiContext = useMemo<Nullable<UiContext>>(() => {
    if (loadingPlayerData || preventListening) {
      return null;
    }

    return {
      customizedAvatar,
      matchNotStarted: matchState === StreamStateMatchState.MATCH_STATE_UNSPECIFIED,
      matchOngoing: matchState === StreamStateMatchState.MATCH_STATE_ACTIVE,
      matchEnd: matchState === StreamStateMatchState.MATCH_STATE_ENDED,
      maxPointsInCard,
      cardSelected,
      canBuyPremiumBundles,
      canBuyStandardBundles,
      teamChatMessageAmount,
      cardActivityMessageAmount,
      leaderboardPosition,
      playerInTeam,
      aonCardSelected,
      cardStandardCardSelected,
      matchCardSelected,
      boosterAvailable: cardSelected && !!availableBoosterType,
      goodCallBoosterAvailable:
        cardSelected && availableBoosterType === BoosterType.GoodCall,
      letsGoBoosterAvailable: cardSelected && availableBoosterType === BoosterType.LetsGo,
      doubtBoosterAvailable: cardSelected && availableBoosterType === BoosterType.Doubt,
      nextUpBoosterAvailable: cardSelected && availableBoosterType === BoosterType.NextUp,
      scavengeBoosterAvailable:
        cardSelected && availableBoosterType === BoosterType.Scavenge,
      speedUpBoosterAvailable:
        cardSelected && availableBoosterType === BoosterType.SpeedUp,
      applyingBooster,
      hasUnclaimedSeasonRewards,
      startingCardsDialogOpen,
      soloPlayState: isPlayingSolo,
      isImplicitAccount,
      isRoundBasedGame,
    };
  }, [
    preventListening,
    loadingPlayerData,
    customizedAvatar,
    applyingBooster,
    availableBoosterType,
    canBuyPremiumBundles,
    canBuyStandardBundles,
    cardActivityMessageAmount,
    cardSelected,
    hasUnclaimedSeasonRewards,
    leaderboardPosition,
    matchState,
    maxPointsInCard,
    playerInTeam,
    startingCardsDialogOpen,
    teamChatMessageAmount,
    isPlayingSolo,
    aonCardSelected,
    cardStandardCardSelected,
    matchCardSelected,
    isImplicitAccount,
    isRoundBasedGame,
  ]);

  const playerStats = useMemo<Nullable<FTUEPlayerStats>>(() => {
    if (!data?.profile?.stats || !data?.profile.playedGames) {
      return null;
    }

    const seasonRank =
      data.profile.playedGames
        .map((playedGame) => playedGame.progression.level)
        .sort((a, z) => a - z)?.[0] ?? 0;

    return {
      ...data.profile.stats,
      seasonRank,
    };
  }, [data?.profile?.playedGames, data?.profile?.stats]);

  useEffect(() => {
    if (!uiContext) {
      return;
    }

    NOICE.UI_CONTEXT = uiContext;
  }, [uiContext]);

  return { uiContext, playerStats };
}
