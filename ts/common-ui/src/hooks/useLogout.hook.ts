import { useClient } from '@noice-com/common-react-core';
import { useCallback } from 'react';

import { clearSession } from '../utils/session';

export function useLogout(): () => Promise<boolean> {
  const client = useClient();

  const logOut = useCallback(async (): Promise<boolean> => {
    const result = await clearSession(client);

    return result;
  }, [client]);

  return logOut;
}
