import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { LocalUserData } from '@common-classes';
import { WithChildren, CommonUserDataKeys } from '@common-types';

// @todo: figure out a way to avoid any...
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LocalUserDataContext = createContext<Nullable<LocalUserData<any>>>(null);

interface Props<Keys extends CommonUserDataKeys> {
  localUserData: Nullable<LocalUserData<Keys>>;
}

export function LocalUserDataProvider<Keys extends CommonUserDataKeys>({
  localUserData,
  children,
}: WithChildren<Props<Keys>>) {
  return (
    <LocalUserDataContext.Provider value={localUserData}>
      {children}
    </LocalUserDataContext.Provider>
  );
}

export function useLocalStorage<Keys extends CommonUserDataKeys>(): LocalUserData<Keys> {
  const localUserData = useContext(LocalUserDataContext);

  if (!localUserData) {
    throw new Error('Local User Data is NULL');
  }

  return localUserData as unknown as LocalUserData<Keys>;
}
