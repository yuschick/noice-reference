import {
  Group,
  MatchEndedMsg,
  Player,
} from '@noice-com/schemas/game-logic/game_logic.pb';
import { v4 as uuid } from 'uuid';

interface MockGroupProps {
  name: string;
  players: Player[];
  isSolo: boolean;
}

export const mockGroup = ({ name, players, isSolo }: MockGroupProps): Group => {
  return {
    id: uuid(),
    isParty: false,
    isSolo,
    name,
    points: players.reduce<number>((total, player) => total + (player.points ?? 0), 0),
  };
};

interface MockPlayerProps {
  isLocalPlayer?: boolean;
  name: string;
  hasBestPlay: boolean;
}

export const mockPlayer = ({
  isLocalPlayer = false,
  name,
  hasBestPlay,
}: MockPlayerProps): Player => {
  const points = Math.round(Math.random() * 16000);

  return {
    name,
    userId: isLocalPlayer ? 'me' : name,
    points,
    ...(hasBestPlay
      ? {
          bestPlay: {
            cardId: uuid(),
            points: Math.round(points * 0.2),
          },
        }
      : {}),
  };
};

interface MockMatchEndMessageProps {
  players: Player[];
  group: Group;
  gameId: string;
}

export const mockMatchEndMessage = ({
  players,
  group,
  gameId,
}: MockMatchEndMessageProps): MatchEndedMsg => {
  return { players, group, gameId };
};
