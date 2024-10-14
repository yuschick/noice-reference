import { WithChildren } from '@noice-com/common-ui';
import { FriendsView } from '@noice-com/social';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

interface Context {
  onExpandSocialSidebarOnView(friendsView: FriendsView): void;
}

const SocialSidebarStateContext = createContext<Nullable<Context>>(null);

export function SocialSidebarStateProvider({
  children,
  onExpandSocialSidebarOnView,
}: WithChildren<Context>) {
  return (
    <SocialSidebarStateContext.Provider value={{ onExpandSocialSidebarOnView }}>
      {children}
    </SocialSidebarStateContext.Provider>
  );
}

export function useSocialSidebarState() {
  const context = useContext(SocialSidebarStateContext);

  if (!context) {
    throw new Error(
      'useSocialSidebarState must be used within a SocialSidebarStateProvider',
    );
  }

  return context;
}
