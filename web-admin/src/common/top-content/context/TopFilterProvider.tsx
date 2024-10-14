import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { TopFilter } from '../types';

interface Context {
  filters: TopFilter[];
  setFilters(filters: TopFilter[]): void;
}

const TopFilterContext = createContext<Nullable<Context>>(null);

export const TopFilterProvider = ({ children }: WithChildren) => {
  const [filters, setFilters] = useState<TopFilter[]>([]);

  return (
    <TopFilterContext.Provider
      value={{
        filters,

        setFilters,
      }}
    >
      {children}
    </TopFilterContext.Provider>
  );
};

export const useTopFilter = (): Context => {
  const context = useContext(TopFilterContext);

  if (!context) {
    throw new Error('Trying to access top content from context without TopFilterContext');
  }

  return context;
};
