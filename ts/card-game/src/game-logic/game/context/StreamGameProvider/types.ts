import { Nullable } from '@noice-com/utils';

import { CardGame } from '@game-logic/game';

export interface StreamGameState {
  streamId: Nullable<string>;
  channelId: Nullable<string>;
  matchGroupId: Nullable<string>;
  gameInstance: Nullable<CardGame>;
  isSolo: boolean;
  gameError: Nullable<string>;
}
