import { To } from 'react-router-dom';

import { SvgComponent } from '@common-types';

export interface NavigationLinkModel {
  label: string;
  to: To;
  icon?: SvgComponent;
  highlight?: boolean;
  highlightReason?: string;
  dataAttributeId?: string;
}
