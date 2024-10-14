import { WalletCurrencyId } from '@noice-com/common-ui';
import {
  ChallengeState,
  Group,
  MatchEndedMsg,
  Player,
} from '@noice-com/schemas/game-logic/game_logic.pb';

import { PostMatchLevelReward, PostMatchWalletReward, PostMatchXPReward } from '../types';

function createPlayer(
  id: string,
  name: string,
  points: number,
  bestPlayPoints = 0,
): Player {
  return {
    userId: id,
    userName: name,
    name,
    points,
    isOnline: true,
    usedBoosterCount: Math.floor(Math.random() * 10),
    bestPlay: {
      cardId: 'card-id',
      points: bestPlayPoints,
    },
  };
}

interface EndedMsgHelper {
  groupName: string;
  bestCardId: string;
  bestCardPoints: number;
  numPlayers?: number;
  partyGroup?: boolean;
}

export function createMatchEndedMsg({
  groupName,
  bestCardId,
  bestCardPoints,
  numPlayers = 4,
  partyGroup = false,
}: EndedMsgHelper): MatchEndedMsg {
  const players = [
    createPlayer('player-1', 'Bobby', 19320),
    createPlayer('player-2', 'Franny', 16500),
    createPlayer('player-3', 'Jammy', 14200),
    createPlayer('player-4', 'Grammy', 300),
  ].slice(0, numPlayers);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groupPoints = players.reduce((acc, player) => acc + player.points!, 0);

  const group: Group = {
    id: groupName,
    name: groupName,
    points: groupPoints,
    isSolo: numPlayers === 1,
    isParty: partyGroup,
  };

  return {
    streamId: 'stream-id',
    matchId: 'match-id',
    groupId: 'group-id',
    group,
    players,
    bestGroup: {
      group,
      players,
    },
    bestPlayer: {
      id: players[0].userId,
      points: players[0].points,
      groupName: group.name,
    },
    bestCard: {
      groupName: group.name,
      succeedingCard: {
        userId: players[0].userId,
        groupId: group.id,
        cardId: bestCardId,
        points: bestCardPoints,
        streamId: 'stream-id',
        bestPlay: {
          points: bestCardPoints,
          cardId: bestCardId,
        },
      },
    },
    challengeStatuses: [
      {
        challengeId: '1',
        challengeState: ChallengeState.CHALLENGE_STATE_FAILURE,
        targetValues: [],
        pickRate: 0.5,
      },
      {
        challengeId: '2',
        challengeState: ChallengeState.CHALLENGE_STATE_SUCCESS,
        targetValues: [{ label: 'amount', value: 2000 }],
        pickRate: 0.3,
      },
      {
        challengeId: '3',
        challengeState: ChallengeState.CHALLENGE_STATE_SUCCESS,
        targetValues: [],
        pickRate: 0.2,
      },
    ],
  };
}

interface MockProps {
  thresholds: number[];
  levelDiff: [old: number, new: number];
  xpDiff: [old: number, new: number];
  walletDiff: [old: number, new: number];
  teamBonus: boolean;
  participationBonus: boolean;
  dailyBoost: boolean;
}

export const mockUseMatchEndPlayerRewards = ({
  levelDiff,
  xpDiff,
  walletDiff,
  thresholds,
  teamBonus,
  participationBonus,
  dailyBoost,
}: MockProps) => {
  const [oldLevel, newLevel] = levelDiff;
  const [oldXp, newXp] = xpDiff;
  const [oldWallet, newWallet] = walletDiff;

  const levelRewards: PostMatchLevelReward = {
    oldLevel,
    newLevel,
    levelThresholds: thresholds,
  };

  const teamBonusModifier = teamBonus ? 0.25 : 0;
  const participationBonusModifier = participationBonus ? 0.1 : 0;
  const dailyBoostModifier = dailyBoost ? 0.1 : 0;

  const receivedXp = newXp - oldXp;
  const xpFromBonuses =
    receivedXp * (dailyBoostModifier + participationBonusModifier + teamBonusModifier);
  const xpRewards: PostMatchXPReward = {
    newTotal: newXp,
    received: receivedXp,
    dailyBoost: receivedXp * dailyBoostModifier,
    remainingDailyBoost: dailyBoost ? 500 : 0,
    participationBonus: receivedXp * participationBonusModifier,
    teamPlayerBonus: receivedXp * teamBonusModifier,
    receivedExcludingBonuses: receivedXp - xpFromBonuses,
  };

  const receivedWallet = newWallet - oldWallet;
  const walletFromBonuses =
    receivedWallet *
    (dailyBoostModifier + participationBonusModifier + teamBonusModifier);
  const walletRewards: PostMatchWalletReward = {
    currencyType: WalletCurrencyId.SoftCurrency,
    received: receivedWallet,
    receivedExcludingBonuses: receivedWallet - walletFromBonuses,
    participationBonus: receivedWallet * participationBonusModifier,
    teamPlayerBonus: receivedWallet * teamBonusModifier,
  };

  return {
    xpRewards,
    levelRewards,
    walletRewards,
  };
};
