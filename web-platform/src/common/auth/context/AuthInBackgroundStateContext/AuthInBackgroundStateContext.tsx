import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

interface Context {
  isAuthLoading: boolean;
  hasAuthFailed: boolean;
}

const AuthInBackgroundStateContext = createContext<Nullable<Context>>(null);

type Props = Context;

export const AuthInBackgroundStateProvider = ({
  children,
  ...props
}: WithChildren<Props>) => {
  return (
    <AuthInBackgroundStateContext.Provider value={props}>
      {children}
    </AuthInBackgroundStateContext.Provider>
  );
};

export const useAuthInBackgroundState = () => {
  const context = useContext(AuthInBackgroundStateContext);

  if (!context) {
    throw new Error(
      'useAuthInBackgroundState must be used within a AuthInBackgroundStateProvider',
    );
  }

  return context;
};
