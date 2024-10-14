import { gql } from '@apollo/client';

import type { CGPlayer } from '../player';
import { GameTimer } from '../timer';
import type { GameStateProvider } from '../types';

import type { CgActiveBoosterFragment } from '@game-gen';

interface Props {
  ownerId: string;
  originalOwnerId: string;
  schema: CgActiveBoosterFragment;
  attachedTimestamp: number;
  stateProvider: GameStateProvider;
}

export class CGActiveBooster {
  public static Fragments = {
    activeBooster: gql`
      fragment CgActiveBooster on GameLogicBooster {
        id
        timeActive
        valueSelf
        valueOther
        image
        name
      }
    `,
  };

  public readonly ownerId: string;
  public readonly givenById: string;
  public readonly schema: CgActiveBoosterFragment;
  public readonly activeTimer: GameTimer | null;

  private readonly _attachedAt: number;
  private readonly _stateProvider: GameStateProvider;

  public get boosterId(): number {
    return this.schema.id;
  }

  constructor({
    ownerId,
    originalOwnerId,
    schema,
    attachedTimestamp,
    stateProvider,
  }: Props) {
    this.ownerId = ownerId;
    this.givenById = originalOwnerId;
    this.schema = schema;
    this._attachedAt = attachedTimestamp;
    this._stateProvider = stateProvider;

    this.activeTimer = this._initTimer(attachedTimestamp, schema);
  }

  private _initTimer(
    startTime: number,
    schema: CgActiveBoosterFragment,
  ): GameTimer | null {
    if (schema.timeActive <= 0) {
      return null;
    }

    return new GameTimer(schema.timeActive, startTime, true);
  }

  public getOwner(): CGPlayer | null {
    return this._stateProvider.getPlayer(this.ownerId);
  }

  public getOriginalOwner(): CGPlayer | null {
    return this._stateProvider.getPlayer(this.givenById);
  }

  public getNormalizedTime(): number {
    if (!this.activeTimer) {
      return 0;
    }

    return this.activeTimer.getClampedProgress();
  }
}
