/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as GameLogic from '@noice-com/schemas/game-logic/game_logic.pb';
import { ObjectUtils } from '@noice-com/utils';

const defaultInitMessage: GameLogic.GameInitMsg = {
  serverTime: `${Date.now()}`,
  streamId: 'abcdefg',
  matchConfiguration: {},
  matchData: {
    boosters: [],
    cards: [],
  },
  matchStateData: {
    group: {
      id: 'group-id',
      name: 'Example Group',
      points: 0,
    },
    players: [
      {
        userId: 'user-id',
        points: 0,
      },
    ],
  },
};

export class GameInitBuilder {
  public static readonly DefaultInitMsg = defaultInitMessage;
  public initMsg: GameLogic.GameInitMsg;

  constructor() {
    this.initMsg = ObjectUtils.deepMerge(defaultInitMessage, {
      serverTime: `${Date.now()}`,
    });
  }

  public withStreamId(streamId: string) {
    this.initMsg.streamId = streamId;
    return this;
  }

  public withConfig(config: GameLogic.MatchConfiguration) {
    this.initMsg!.matchConfiguration = ObjectUtils.deepMerge(
      this.initMsg!.matchConfiguration!,
      config,
    );
    return this;
  }

  public withGroup(group: GameLogic.Group) {
    this.initMsg!.matchStateData!.group = ObjectUtils.deepMerge(
      this.initMsg!.matchStateData!.group,
      group,
    );
    return this;
  }

  public withGroupId(groupId: string) {
    return this.withGroup({ id: groupId });
  }

  public withGroupName(groupName: string) {
    return this.withGroup({ name: groupName });
  }

  public withGroupScore(points: number) {
    return this.withGroup({ points });
  }

  public withSoloGroup(isSolo: boolean) {
    return this.withGroup({ isSolo });
  }

  public withLocalPlayer(player: GameLogic.Player) {
    const current = this.initMsg!.matchStateData!.players!.shift() ?? {};
    const merged: GameLogic.Player = ObjectUtils.deepMerge(current, player);
    this.initMsg!.matchStateData!.players!.unshift(merged);
    return this;
  }

  public withLocalPlayerId(playerId: string) {
    return this.withLocalPlayer({ userId: playerId });
  }

  public withLocalPlayerScore(points: number) {
    return this.withLocalPlayer({ points });
  }

  public withLocalPlayerActiveCard(activeCard: GameLogic.ActiveCard) {
    return this.withLocalPlayer({ activeCard });
  }

  public withTeamMate(player: GameLogic.Player) {
    const playerCopy = ObjectUtils.deepMerge(player, {});
    this.initMsg!.matchStateData!.players!.push(playerCopy);
    return this;
  }

  public withCardData(card: GameLogic.Card) {
    const cardCopy = ObjectUtils.deepMerge(card, {});
    this.initMsg!.matchData!.cards!.push(cardCopy);
    return this;
  }

  public withBoosterData(booster: GameLogic.Booster) {
    const boosterCopy = ObjectUtils.deepMerge(booster, {});
    this.initMsg!.matchData!.boosters!.push(boosterCopy);
    return this;
  }

  public withChallengeStates(challenges: GameLogic.ChallengeStatesData) {
    this.initMsg!.challengeStatesData = challenges;
    return this;
  }

  public result(): GameLogic.GameInitMsg {
    return this.initMsg;
  }
}
