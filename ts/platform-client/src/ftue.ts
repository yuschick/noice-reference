import {
  DismissalType,
  FTUEService as FTUEServicePb,
} from '@noice-com/schemas/ftue/ftue.pb';

import { IFTUEService, SubService } from './types';

export class FTUEService extends SubService implements IFTUEService {
  public async dismissTooltip(
    tooltipId: string,
    dismissalType: DismissalType,
  ): Promise<void> {
    await FTUEServicePb.DismissTooltip(
      {
        tooltipId: tooltipId,
        dismissalType: dismissalType,
      },
      await this._getInitReq(),
    );
  }

  public async deleteDismissedTooltip(tooltipId: string): Promise<void> {
    await FTUEServicePb.DeleteDismissedTooltip({ tooltipId }, await this._getInitReq());
  }

  public async listDismissedTooltips(): Promise<string[]> {
    const res = await FTUEServicePb.ListDismissedTooltips({}, await this._getInitReq());

    return res.tooltipIds;
  }
}
