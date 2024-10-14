import { useWindowWidth, WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useModule } from './ModuleProvider';

import { Module } from '@common/module';
import { SidebarType } from '@common/sidebar';

interface Context {
  sidebarType: SidebarType;
  sidebarOpen: boolean;
  hideStaticSidebar: boolean;
  toggleSidebar(): void;
  closeSidebar(): void;
}

const SidebarContext = createContext<Nullable<Context>>(null);

const getSidebarType = (activeModule: Nullable<Module>, isActiveContextPage: boolean) => {
  if (activeModule?.isExcludedFromNavigation) {
    return SidebarType.None;
  }

  if (isActiveContextPage) {
    return SidebarType.Contextual;
  }

  return SidebarType.Static;
};

export const SidebarProvider = ({ children }: WithChildren) => {
  const { activeModule, activeContextPage } = useModule();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userHasToggled = useRef(false);

  const windowWidth = useWindowWidth();

  const sidebarType = getSidebarType(activeModule, !!activeContextPage);

  const hideStaticSidebar = sidebarType !== SidebarType.Static;

  const toggleSidebar = () => {
    userHasToggled.current = true;
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    userHasToggled.current = true;
    setSidebarOpen(false);
  };

  useEffect(() => {
    // Toggle automatically only when user has done nothing
    if (userHasToggled.current) {
      return;
    }

    setSidebarOpen(windowWidth >= 768);
  }, [windowWidth]);

  return (
    <SidebarContext.Provider
      value={{ sidebarType, sidebarOpen, hideStaticSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarState = (): Context => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('Trying to access sidebar state from context without SidebarContext');
  }

  return context;
};
