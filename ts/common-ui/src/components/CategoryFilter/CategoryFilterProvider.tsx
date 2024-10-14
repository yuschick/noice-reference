import { createContext } from 'react';

import { WithChildren } from '@common-types';

export const CategoryFilterContext = createContext<object>({});

const CategoryFilterProvider = ({ children }: WithChildren) => {
  return (
    <CategoryFilterContext.Provider value={{}}>{children}</CategoryFilterContext.Provider>
  );
};

export { CategoryFilterProvider };
