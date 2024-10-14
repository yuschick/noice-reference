import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

interface Context {
  refetchStoreFrontCategories(): void;
}

const StoreFrontRefetchContext = createContext<Nullable<Context>>(null);

interface Props {
  refetchStoreFrontCategories(): void;
}

export const StoreFrontRefetchProvider = ({
  children,
  refetchStoreFrontCategories,
}: WithChildren<Props>) => {
  return (
    <StoreFrontRefetchContext.Provider value={{ refetchStoreFrontCategories }}>
      {children}
    </StoreFrontRefetchContext.Provider>
  );
};

export const useStoreFrontRefetch = () => {
  const context = useContext(StoreFrontRefetchContext);

  if (!context) {
    throw new Error(
      'Trying to use useStoreFrontRefetch without having StoreFrontRefetchProvider',
    );
  }

  return context;
};
