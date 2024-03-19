import { createContext } from 'react';

import { UseDialogResult } from './useDialog.hook';

import { WithChildren } from '@common-types';

interface Props extends WithChildren {
  store: UseDialogResult;
}

export const DialogContext = createContext<UseDialogResult | undefined>(undefined);

const DialogProvider = ({ children, store }: Props) => {
  return <DialogContext.Provider value={store}>{children}</DialogContext.Provider>;
};

export { DialogProvider };
