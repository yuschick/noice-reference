import { createContext } from 'react';

import { UsePopoverMenuResult } from './usePopoverMenu.hook';

import { WithChildren } from '@common-types';

interface Props extends WithChildren {
  store: UsePopoverMenuResult;
}

export const PopoverMenuContext = createContext<UsePopoverMenuResult | undefined>(
  undefined,
);

const PopoverMenuProvider = ({ children, store }: Props) => {
  return (
    <PopoverMenuContext.Provider value={store}>{children}</PopoverMenuContext.Provider>
  );
};

export { PopoverMenuProvider };
