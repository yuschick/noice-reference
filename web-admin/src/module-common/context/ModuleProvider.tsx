import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';

import {
  ContextualPageWithPath,
  Module,
  ModuleBreadcrumb,
  PageParam,
  PageWithPath,
} from '@common/module';
import { moduleBreadCrumbs, modules, routes } from '@modules';

interface Context {
  activeModule: Nullable<Module>;
  activePage: Nullable<PageWithPath>;
  activeContextPage: Nullable<ContextualPageWithPath>;
  activeBreadcrumb: Nullable<ModuleBreadcrumb>;
  activePathParams: PageParam[];
  setActivePathParams(value: PageParam[]): void;
}

const ModuleContext = createContext<Nullable<Context>>(null);

export const ModuleProvider = ({ children }: WithChildren) => {
  const [activeModule, setActiveModule] = useState<Nullable<Module>>(null);
  const [activePage, setActivePage] = useState<Nullable<PageWithPath>>(null);
  const [activeContextPage, setActiveContextPage] =
    useState<Nullable<ContextualPageWithPath>>(null);
  const [activePathParams, setActivePathParams] = useState<PageParam[]>([]);
  const [activeBreadcrumb, setActiveBreadcrumb] =
    useState<Nullable<ModuleBreadcrumb>>(null);

  const location = useLocation();

  useEffect(() => {
    const activeModule = modules.find((module) =>
      location.pathname.substring(1).startsWith(module.id),
    );

    if (!activeModule) {
      return;
    }

    setActiveModule(activeModule);

    setActiveBreadcrumb(
      moduleBreadCrumbs
        .find((module) => module.id === activeModule.id)
        ?.breadcrumbs.find(
          (breadcrumb) =>
            !!matchPath(breadcrumb.page.path, location.pathname) ||
            (breadcrumb.subPage &&
              !!matchPath(breadcrumb.subPage.path, location.pathname)) ||
            (breadcrumb.subSubPage &&
              !!matchPath(breadcrumb.subSubPage.path, location.pathname)),
        ) ?? null,
    );

    setActivePage(
      // Find exact match
      routes.find((page) => page.path === location.pathname.substring(1)) ??
        // Find path pattern match
        routes.find((page) => !!matchPath(page.path, location.pathname)) ??
        null,
    );
  }, [location]);

  useEffect(() => {
    setActiveContextPage(() => {
      if (!activeBreadcrumb) {
        return null;
      }

      if (activeBreadcrumb.page.id.startsWith(':')) {
        return activeBreadcrumb.page;
      }

      if (activeBreadcrumb.subPage?.id.startsWith(':')) {
        return activeBreadcrumb.subPage;
      }

      return null;
    });
  }, [activeBreadcrumb]);

  return (
    <ModuleContext.Provider
      value={{
        activeModule,
        activePage,
        activeBreadcrumb: activeBreadcrumb,
        activeContextPage,
        activePathParams,
        setActivePathParams,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = (): Context => {
  const context = useContext(ModuleContext);

  if (!context) {
    throw new Error('Trying to access module state from context without ModuleContext');
  }

  return context;
};
