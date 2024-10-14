import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { useListenStudioLocalStorageValue } from '@common/local-storage';

export type TimestampFormat = 'absolute' | 'relative';
export type Direction = 'top' | 'bottom';

interface ChatUserListSettingsResult {
  showUserBadges: boolean;

  setShowUserBadges: (show: boolean) => void;
}

const ChatUserListSettingsContext =
  createContext<Nullable<ChatUserListSettingsResult>>(null);

export const ChatUserListSettingsProvider = ({ children }: WithChildren) => {
  const [showUserBadges, setShowUserBadges] = useListenStudioLocalStorageValue(
    'chatUserList.showUserBadges',
  );

  return (
    <ChatUserListSettingsContext.Provider
      value={{
        setShowUserBadges,
        showUserBadges: showUserBadges ?? true,
      }}
    >
      {children}
    </ChatUserListSettingsContext.Provider>
  );
};

export const useChatUserListSettings = () => {
  const context = useContext(ChatUserListSettingsContext);

  if (!context) {
    throw new Error(
      'useChatUserListSettings must be used within a ChatUserListSettingsProvider',
    );
  }

  return context;
};
