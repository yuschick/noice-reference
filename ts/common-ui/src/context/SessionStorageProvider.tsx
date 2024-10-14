import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { SessionData } from '@common-classes';
import { CommonSessionDataKeys, WithChildren } from '@common-types';

const SessionStorageContext = createContext<Nullable<SessionData>>(null);

interface Props<Keys extends CommonSessionDataKeys> {
  defaultData: Keys;
}

export function SessionStorageProvider<Keys extends CommonSessionDataKeys>({
  defaultData,
  children,
}: WithChildren<Props<Keys>>) {
  // @ts-expect-error: Typing this is tricky, and I don't want to spend the time on it right now.
  // For now, this is completely safe as the API's are so strongly typed. And this error is only
  // because of how we have to type the context.
  const [sessionStorageData] = useState<SessionData>(new SessionData<Keys>(defaultData));

  return (
    <SessionStorageContext.Provider value={sessionStorageData}>
      {children}
    </SessionStorageContext.Provider>
  );
}

export function useSessionStorage<Keys extends CommonSessionDataKeys>() {
  const sessionStorageData = useContext(SessionStorageContext);

  if (!sessionStorageData) {
    throw new Error('Session Storage Data is NULL');
  }

  return sessionStorageData as unknown as SessionData<Keys>;
}
