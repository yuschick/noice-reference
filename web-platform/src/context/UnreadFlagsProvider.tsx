import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useReducer, useContext, useCallback } from 'react';

export interface Flags {
  groupMessages: boolean;
  streamMessages: boolean;
}

interface IUnreadFlagsContext extends Flags {
  markFlagRead: (flag: keyof Flags) => void;
  markFlagUnread: (flag: keyof Flags) => void;
}

const DefaultFlags: Flags = {
  groupMessages: false,
  streamMessages: false,
};

const UnreadFlagsContext = createContext<Nullable<IUnreadFlagsContext>>(null);

type UpdateFlagAction = {
  flag: keyof Flags;
  read: boolean;
};

const reducer = (flags: Flags, action: UpdateFlagAction): Flags => ({
  ...flags,
  [action.flag]: !action.read,
});

export function UnreadFlagsProvider({ children }: WithChildren) {
  const [flags, updateFlag] = useReducer(reducer, DefaultFlags);

  window.NOICE.updateReadFlag = (flag: keyof Flags, read: boolean) => {
    updateFlag({ flag, read });
  };

  const markFlagRead = useCallback(
    (flag: keyof Flags) => updateFlag({ flag, read: true }),
    [updateFlag],
  );

  const markFlagUnread = useCallback(
    (flag: keyof Flags) => updateFlag({ flag, read: false }),
    [updateFlag],
  );

  return (
    <UnreadFlagsContext.Provider value={{ ...flags, markFlagRead, markFlagUnread }}>
      {children}
    </UnreadFlagsContext.Provider>
  );
}

export function useUnreadFlags(): IUnreadFlagsContext {
  const context = useContext(UnreadFlagsContext);

  if (!context) {
    throw new Error('Trying to use useUnreadFlags without having UnreadFlagsProvider');
  }

  return context;
}
