import { CommonUserDataKeys, FontSize } from '@noice-com/common-ui';

import { ChatMessageAvatarType } from '../settings/types';

export interface ChatLocalStorageKeys extends CommonUserDataKeys {
  'chat.settings.showModerationTools': boolean;
  'chat.settings.messageFontSize': FontSize;
  'chat.settings.avatarType': ChatMessageAvatarType;
}
