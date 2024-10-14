import { SvgComponent } from '@noice-com/common-ui';

import { PillType } from '@common/text';

export interface TabModel {
  title: string;
  to: string;
  icon?: SvgComponent;
  /** defaults to 'info' */
  type?: PillType;
  totalAmount?: number;
}
