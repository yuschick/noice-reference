import { CommonUserDataKeys } from '@noice-com/common-ui';

export interface GameLocalStorageKeys extends CommonUserDataKeys {
  'avatar-emotes.recently-used': { id: string; type: 'emote' | 'emoji' }[];
  'store.toasts.bundle-purchase.shown.soft-currency': number;
  'sidebar.channel-details.collapsed': boolean;
}
