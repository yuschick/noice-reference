import { SvgComponent } from '@noice-com/common-ui';

export interface NavigationLinkModel {
  dataAttributeId?: string;
  visibleWithFeatureFlag?: string;
  externalLink?: boolean;
  highlight?: boolean;
  icon?: SvgComponent;
  label: string;
  to: string;
}
