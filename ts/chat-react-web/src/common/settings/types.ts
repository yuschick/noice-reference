import { FontSize } from '@noice-com/common-ui';

export const chatMessageTimestampTypeOptions = ['relative', 'static'] as const;
export type ChatMessageTimestampType = (typeof chatMessageTimestampTypeOptions)[number];

export const chatMessageAvatarTypeOptions = ['visible', 'hidden'] as const;
export type ChatMessageAvatarType = (typeof chatMessageAvatarTypeOptions)[number];

export interface ChatSettingsModel {
  showModerationTools?: boolean;
  /** @default 'relative' */
  timestampType?: ChatMessageTimestampType;
  /** @default 'small' */
  fontSize?: FontSize;
  /** @default 'visible' */
  avatarType?: ChatMessageAvatarType;
}

/** Settings that are given via prop to Chat component and from there to chat settings provider */
export type ChatPropSettings = Pick<ChatSettingsModel, 'timestampType'>;
