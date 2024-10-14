import { createContext, useContext } from 'react';

import { UseTabsResult } from './useTabs.hook';

import { WithChildren } from '@common-types';

interface TabsProps extends WithChildren {
  activeTabIndex?: number;
  store: UseTabsResult;
}

interface Props extends WithChildren {
  index: number;
}

export const TabsContext = createContext<TabsProps | undefined>(undefined);
export const TabContext = createContext<Props | undefined>(undefined);
export const PanelContext = createContext<Props | undefined>(undefined);

const TabsProvider = ({ activeTabIndex, children, store }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ activeTabIndex, store }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabProvider = ({ children, index }: Props) => {
  return <TabContext.Provider value={{ index }}>{children}</TabContext.Provider>;
};

const PanelProvider = ({ children, index }: Props) => {
  return <PanelContext.Provider value={{ index }}>{children}</PanelContext.Provider>;
};
export const useTab = () => useContext(TabContext);
export const usePanel = () => useContext(PanelContext);

export { TabsProvider, TabProvider, PanelProvider };
