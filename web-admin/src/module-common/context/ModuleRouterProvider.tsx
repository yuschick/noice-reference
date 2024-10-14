import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { AuthPlatformRole } from '@gen';

interface Context {
  modulePathPermissions: Record<string, AuthPlatformRole[]>;
}

const ModuleRouterContext = createContext<Nullable<Context>>(null);

interface Props {
  modulePathPermissions: Record<string, AuthPlatformRole[]>;
}

export const ModuleRouterProvider = ({
  children,
  modulePathPermissions,
}: WithChildren<Props>) => {
  return (
    <ModuleRouterContext.Provider value={{ modulePathPermissions }}>
      {children}
    </ModuleRouterContext.Provider>
  );
};

export const useModuleRouter = () => {
  const context = useContext(ModuleRouterContext);

  if (!context) {
    throw new Error(
      'Trying to access module router state from context without ModuleRouterContext',
    );
  }

  return context;
};
