import { Nullable } from '@noice-com/utils';
import { createContext, useContext } from 'react';

import { SoundController } from '@common-classes';
import { CommonUserDataKeys, WithChildren } from '@common-types';

interface ContextState {
  // @todo: figure out a way to avoid any...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  soundController: SoundController<any>;
}

export const SoundControllerContext = createContext<Nullable<ContextState>>(null);

interface Props<LocalStorageKeys extends CommonUserDataKeys> {
  soundController: SoundController<LocalStorageKeys>;
}

export function SoundControllerProvider<LocalStorageKeys extends CommonUserDataKeys>({
  soundController,
  children,
}: WithChildren<Props<LocalStorageKeys>>) {
  return (
    <SoundControllerContext.Provider value={{ soundController }}>
      {children}
    </SoundControllerContext.Provider>
  );
}

export function useSoundController(): SoundController {
  const context = useContext(SoundControllerContext);

  if (!context) {
    throw new Error(
      'Trying to access sound controller context without SoundControllerProvider',
    );
  }

  const soundController = context.soundController;

  if (!soundController) {
    throw new Error(
      'Trying to access SoundController class from context but the class is null',
    );
  }

  return soundController;
}
