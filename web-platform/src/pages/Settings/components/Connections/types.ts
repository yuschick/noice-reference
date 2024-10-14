import { SvgComponent } from '@noice-com/common-ui';

export enum ExternalAccountLabel {
  Apple = 'Apple',
  Discord = 'Discord',
  NightBot = 'NightBot',
}

export interface AccountConnection {
  label: ExternalAccountLabel;
  icon?: SvgComponent;
  color?: string;
  connected: boolean;
}

export interface DialogConnection {
  account: ExternalAccountLabel;
  action: 'connect' | 'disconnect';
}
