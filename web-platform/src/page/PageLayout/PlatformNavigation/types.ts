import { FTUEActionType, NavigationLinkModel } from '@noice-com/common-ui';

import { Routes } from '@common/route';

export interface PlatformNavigationLinkModel extends NavigationLinkModel {
  highlightReason?: string;
  ftueAction?: FTUEActionType;
  to: Routes;
}
