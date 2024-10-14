import { useAuthentication } from '@noice-com/common-ui';
import { useEffect, useRef } from 'react';

type AfterAuthCb = (isAuthed: boolean) => void | Promise<void>;

export function useAfterAuth(callback: AfterAuthCb): void {
  const auth = useAuthentication();
  const triggered = useRef(false);

  useEffect(() => {
    if (auth.initialized && !triggered.current) {
      triggered.current = true;
      callback(auth.isAuthenticated());
    }
  }, [auth, callback]);
}
