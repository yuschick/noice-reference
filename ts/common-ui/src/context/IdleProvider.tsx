import { createContext, useContext, useEffect, useState } from 'react';

import { WithChildren } from '@common-types';

export enum IdleState {
  ACTIVE,
  IDLE,

  OFFLINE,
}

interface Context {
  idleState: IdleState;
}

interface Props {
  offlineTimeoutMs: number;
  onIdleStateChange?(idleState: IdleState): void;
}

const IdleContext = createContext<Context>({
  idleState: IdleState.ACTIVE,
});

export function IdleProvider({
  children,
  offlineTimeoutMs,
  onIdleStateChange,
}: WithChildren<Props>) {
  const [state, setState] = useState(IdleState.ACTIVE);

  useEffect(() => {
    let hiddenTimeout: NodeJS.Timeout;

    const visibilityChangeListener = () => {
      const hidden = document.visibilityState === 'hidden';
      setState(hidden ? IdleState.IDLE : IdleState.ACTIVE);
      clearTimeout(hiddenTimeout);

      if (!hidden) {
        return;
      }

      hiddenTimeout = setTimeout(() => {
        setState(IdleState.OFFLINE);
      }, offlineTimeoutMs);
    };

    visibilityChangeListener();

    document.addEventListener('visibilitychange', visibilityChangeListener);
    return () => {
      document.removeEventListener('visibilitychange', visibilityChangeListener);
      clearTimeout(hiddenTimeout);
    };
  }, [offlineTimeoutMs]);

  useEffect(() => {
    onIdleStateChange?.(state);
  }, [state, onIdleStateChange]);

  return (
    <IdleContext.Provider value={{ idleState: state }}>{children}</IdleContext.Provider>
  );
}

export function useIdleState(): IdleState {
  const context = useContext(IdleContext);

  if (!context) {
    return IdleState.ACTIVE;
  }
  return context.idleState;
}
