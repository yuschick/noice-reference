import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import EventEmitter, { EventArgs, EventNames } from 'eventemitter3';
import { createContext, useCallback, useContext, useState } from 'react';

import { SendGiftButtonModel } from '@social-types';

interface APIEvents {
  onProfileBlocked: [profileId: string];
  onFriendRequestAccepted: [profileId: string];
  onFriendRequestRemoved: [profileId: string];
  onFriendRequestSent: [profileId: string];
}

interface ContextState {
  events: {
    addListener: EventEmitter<APIEvents>['addListener'];
    removeListener: EventEmitter<APIEvents>['removeListener'];
  };
  giftButtonModel?: SendGiftButtonModel;
  setGiftButtonModel(model?: SendGiftButtonModel): void;
  createProfileRoutePath(userTag: string): string;
}

interface SocialPackageInternal extends ContextState {
  emitAPIEvent(...args: Parameters<EventEmitter<APIEvents>['emit']>): Promise<void>;
}

type SocialPackageExternal = Pick<ContextState, 'setGiftButtonModel'>;

const Context = createContext<Nullable<ContextState>>(null);

const events = new EventEmitter<APIEvents>();
const addListener = events.addListener.bind(events);
const removeListener = events.removeListener.bind(events);
const listeners = {
  addListener,
  removeListener,
};

type Props = Pick<ContextState, 'createProfileRoutePath'>;

export function SocialPackageProvider({
  children,
  createProfileRoutePath,
}: WithChildren<Props>) {
  const [giftButtonModel, setGiftButtonModel] = useState<SendGiftButtonModel>();

  return (
    <Context.Provider
      value={{
        createProfileRoutePath,
        giftButtonModel,
        setGiftButtonModel,
        events: listeners,
      }}
    >
      {children}
    </Context.Provider>
  );
}

const useSocialContext = (): ContextState => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('Trying to access social context without SocialProvider');
  }

  return context;
};

export function useSocialPackageInternal(): SocialPackageInternal {
  const context = useSocialContext();

  // Make a version of emit that can be awaited until listener callbacks are done
  const emitAPIEvent = useCallback(
    async (
      event: EventNames<APIEvents>,
      ...args: EventArgs<APIEvents, EventNames<APIEvents>>
    ): Promise<void> => {
      const promises = events.listeners(event);
      await Promise.all(promises.map((fn) => fn(...args)));
    },
    [],
  );

  return {
    ...context,
    emitAPIEvent,
  };
}

export function useSocialPackageExternal(): SocialPackageExternal {
  const context = useSocialContext();

  return {
    setGiftButtonModel: context.setGiftButtonModel,
  };
}

export function useSocialPackageEvents(): ContextState['events'] {
  const context = useSocialContext();

  return context.events;
}
