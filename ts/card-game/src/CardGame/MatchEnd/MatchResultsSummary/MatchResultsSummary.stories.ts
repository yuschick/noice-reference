import { WalletCurrencyId, StoryHelpers } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { mockGroup, mockMatchEndMessage, mockPlayer } from '../story-mocks';
import { MatchEndRewards } from '../types';

import { MatchResultsSummary } from './MatchResultsSummary';
import { mockMatchResultsSummary } from './mocks';

export default {
  component: MatchResultsSummary,
  argTypes: {},
  title: 'Match End/Results Summary',
};

function getMocks(matchEndMessage: MatchEndedMsg) {
  return StoryHelpers.Apollo.addMocks([...mockMatchResultsSummary({ matchEndMessage })]);
}

const players = [
  mockPlayer({ name: 'Bob Sagget', hasBestPlay: true, isLocalPlayer: true }),
  mockPlayer({ name: 'Team Member 1', hasBestPlay: true }),
  mockPlayer({ name: 'Team Member 2', hasBestPlay: false }),
  mockPlayer({ name: 'Team Member 3', hasBestPlay: true }),
];

const defaultMatchEndMessage = mockMatchEndMessage({
  players,
  group: mockGroup({ name: '4 Players Group', players, isSolo: false }),
  gameId: 'apex_legends',
});

const rewards: MatchEndRewards = {
  currency: [{ currencyId: WalletCurrencyId.SoftCurrency, amount: 2345 }],
  seasonProgresion: {
    level: 6,
    currentLevelXp: 400,
    nextLevelXp: 800,
    currentXp: 600,
    rankUp: true,
  },
  bonuses: {
    participation: true,
    teamPlayer: true,
  },
};

export const FourPlayersGroup = {
  args: {
    matchEndMessage: defaultMatchEndMessage,
    rewards,
    enableCountdown: true,
  },
  parameters: getMocks(defaultMatchEndMessage),
};

const threePlayersMatchEndMessage = mockMatchEndMessage({
  players: players.slice(0, 3),
  group: mockGroup({
    name: '3 Players Group',
    players: players.slice(0, 3),
    isSolo: false,
  }),
  gameId: 'apex_legends',
});

export const ThreePlayersGroup = {
  args: {
    matchEndMessage: threePlayersMatchEndMessage,
    rewards,
    enableCountdown: true,
  },
  parameters: getMocks(threePlayersMatchEndMessage),
};

const twoPlayersMatchEndMessage = mockMatchEndMessage({
  players: players.slice(0, 2),
  group: mockGroup({
    name: '2 Players Group',
    players: players.slice(0, 2),
    isSolo: false,
  }),
  gameId: 'apex_legends',
});

export const TwoPlayersGroup = {
  args: {
    matchEndMessage: twoPlayersMatchEndMessage,
    rewards,
    enableCountdown: true,
  },
  parameters: getMocks(twoPlayersMatchEndMessage),
};

const onePlayerMatchEndMessage = mockMatchEndMessage({
  players: [players[0]],
  group: mockGroup({
    name: '1 Player Group',
    players: [players[0]],
    isSolo: false,
  }),
  gameId: 'apex_legends',
});

export const OnePlayerGroup = {
  args: {
    matchEndMessage: onePlayerMatchEndMessage,
    rewards,
    enableCountdown: true,
  },
  parameters: getMocks(onePlayerMatchEndMessage),
};

const soloPlayerMatchEndMessage = mockMatchEndMessage({
  players: [players[0]],
  group: mockGroup({
    name: '1 Player Group',
    players: [players[0]],
    isSolo: true,
  }),
  gameId: 'apex_legends',
});

export const Solo = {
  args: {
    matchEndMessage: soloPlayerMatchEndMessage,
    rewards,
    enableCountdown: true,
  },
  parameters: getMocks(soloPlayerMatchEndMessage),
};

export const MultipleCurrencyRewards = {
  args: {
    enableCountdown: true,
    matchEndMessage: defaultMatchEndMessage,
    rewards: {
      ...rewards,
      currency: [
        ...rewards.currency,
        { currencyId: WalletCurrencyId.HardCurrency, amount: 233 },
      ],
    },
  },
  parameters: getMocks(defaultMatchEndMessage),
};
