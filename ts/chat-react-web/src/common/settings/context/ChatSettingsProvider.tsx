import { WithChildren, useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientChatSettingsChatSettingType } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useCallback } from 'react';

import { ChatPropSettings, ChatSettingsModel } from '../types';

import { useListenChatLocalStorageValue } from '@chat-common/localstorage';

const defaultSettingsValues: Required<ChatSettingsModel> = {
  showModerationTools: false,
  timestampType: 'relative',
  fontSize: 'small',
  avatarType: 'visible',
};

interface Context extends Required<ChatSettingsModel>, Required<ChatPropSettings> {
  channelId: Nullable<string>;
  setShowModerationTools(value: Required<ChatSettingsModel>['showModerationTools']): void;
  setFontSize(value: Required<ChatSettingsModel>['fontSize']): void;
  setAvatarType(value: Required<ChatSettingsModel>['avatarType']): void;
}

const ChatSettingsContext = createContext<Nullable<Context>>(null);

type SettingAnalyticsEvent = keyof Omit<ChatSettingsModel, 'timestampType'>;

const settingTypeMap: Record<
  SettingAnalyticsEvent,
  AnalyticsEventClientChatSettingsChatSettingType
> = {
  showModerationTools:
    AnalyticsEventClientChatSettingsChatSettingType.CHAT_SETTING_TYPE_SHOW_MODERATION_TOOLS,
  fontSize: AnalyticsEventClientChatSettingsChatSettingType.CHAT_SETTING_TYPE_FONT_SIZE,
  avatarType:
    AnalyticsEventClientChatSettingsChatSettingType.CHAT_SETTING_TYPE_AVATAR_VISIBILITY,
};

interface Props extends ChatPropSettings {
  chatId: Nullable<string>;
  channelId: Nullable<string>;
}

export function ChatSettingsProvider({
  channelId,
  children,
  timestampType,
  chatId,
}: WithChildren<Props>) {
  const { trackEvent } = useAnalytics();

  const [showModerationTools, setShowModerationTools] = useListenChatLocalStorageValue(
    'chat.settings.showModerationTools',
  );
  const [fontSize, setFontSize] = useListenChatLocalStorageValue(
    'chat.settings.messageFontSize',
  );
  const [avatarType, setAvatarType] = useListenChatLocalStorageValue(
    'chat.settings.avatarType',
  );

  const chatSettings: ChatSettingsModel = {
    showModerationTools,
    timestampType,
    fontSize,
    avatarType,
  };

  // Remove undefined values from the settings object
  Object.keys(chatSettings).forEach((key) => {
    if (chatSettings[key as keyof ChatSettingsModel] === undefined) {
      delete chatSettings[key as keyof ChatSettingsModel];
    }
  });

  const setValue = useCallback(
    <T extends SettingAnalyticsEvent = SettingAnalyticsEvent>(
      key: T,
      value: Required<ChatSettingsModel>[T],
    ) => {
      // Track setting change event
      trackEvent({
        clientChatSettings: {
          settingType: settingTypeMap[key],
          value: `${value}`,
          chatId: chatId ?? undefined,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const setFunctionMap: Record<SettingAnalyticsEvent, (value: any) => void> = {
        showModerationTools: setShowModerationTools,
        fontSize: setFontSize,
        avatarType: setAvatarType,
      };

      // Call correct set function
      setFunctionMap[key](value);
    },
    [chatId, setAvatarType, setFontSize, setShowModerationTools, trackEvent],
  );

  return (
    <ChatSettingsContext.Provider
      value={{
        ...defaultSettingsValues,
        ...chatSettings,
        channelId,
        setShowModerationTools: (value) => setValue('showModerationTools', value),
        setFontSize: (value) => setValue('fontSize', value),
        setAvatarType: (value) => setValue('avatarType', value),
      }}
    >
      {children}
    </ChatSettingsContext.Provider>
  );
}

export function useChatSettings(): Context {
  const context = useContext(ChatSettingsContext);

  if (!context) {
    throw new Error('useChatSettings must be used within a ChatSettingsProvider');
  }

  return context;
}
