import {
  ReactionState,
  ReactionType,
  ReactionService as ReactionServicePb,
  ReactionEvent,
  routeReactionEventEventDelegate,
} from '@noice-com/schemas/reaction/reaction.pb';

import { IReactionDelegate, IReactionService, IStreamCancel, SubService } from './types';

export class ReactionService extends SubService implements IReactionService {
  public streamReactions(
    parentType: string,
    parentID: string,
    delegate: IReactionDelegate,
  ): IStreamCancel {
    const abortController = new AbortController();

    const req = { parentId: parentID, parentType: parentType };
    this._getInitReq()
      .then((init) => {
        return ReactionServicePb.StreamReactions(
          req,
          (e: ReactionEvent) => {
            routeReactionEventEventDelegate(req, e, {
              onInitial: (ctx, e) => {
                delegate.onInitialState(ctx, e.states);
              },
              onAdd: (ctx, e) => {
                delegate.onReactionAdded(ctx, e);
              },
              onRemove: (ctx, e) => {
                delegate.onReactionRemoved(ctx, e);
              },
            });
          },
          { ...init, signal: abortController.signal },
        );
      })
      .then(() => {
        delegate.onEnd(req);
        return;
      })
      .catch((e) => {
        delegate.onEnd(req, e);
      });

    return () => {
      abortController.abort();
    };
  }

  public async addReaction(
    parentType: string,
    parentID: string,
    resourceType: string,
    resourceID: string,
    reaction: ReactionType,
  ): Promise<ReactionState> {
    const init = await this._getInitReq();
    const state = await ReactionServicePb.AddReaction(
      {
        parentType,
        parentId: parentID,
        resourceType,
        resourceId: resourceID,
        reactionType: reaction,
      },
      init,
    );

    return state;
  }

  public async removeReaction(
    parentType: string,
    parentID: string,
    resourceType: string,
    resourceID: string,
  ): Promise<ReactionState> {
    const init = await this._getInitReq();
    const state = await ReactionServicePb.RemoveReaction(
      { parentType, parentId: parentID, resourceType, resourceId: resourceID },
      init,
    );

    return state;
  }
}
