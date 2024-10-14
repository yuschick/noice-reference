import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

export function getPlayerIdsFromMatchEnd(msg: MatchEndedMsg) {
  return (
    msg.players?.reduce<string[]>((prevIds, player) => {
      if (!player.userId) {
        return prevIds;
      }

      prevIds.push(player.userId);
      return prevIds;
    }, []) ?? []
  );
}

export function getBestPlayCardIdsFromMatchEnd(msg: MatchEndedMsg) {
  return (
    msg.players?.reduce<string[]>((prevIds, player) => {
      if (!player.bestPlay?.cardId) {
        return prevIds;
      }

      prevIds.push(player.bestPlay.cardId);
      return prevIds;
    }, []) ?? []
  );
}

export const getProgression = (thresh1: number, thresh2: number, value: number) => {
  return (value - thresh1) / (thresh2 - thresh1);
};
