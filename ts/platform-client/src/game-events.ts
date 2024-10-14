import {
  GameStreamEvent,
  GameStreamEventService,
} from '@noice-com/schemas/game-stream-events/game_stream_events.pb';

import { SubService } from './types';

export class GameEventsService extends SubService {
  public async sendEvent(req: GameStreamEvent) {
    await GameStreamEventService.SendEvent(req, await this._getInitReq());
  }
}
