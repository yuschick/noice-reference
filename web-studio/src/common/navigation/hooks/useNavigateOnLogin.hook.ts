import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';
import { To, useNavigate } from 'react-router-dom';

interface Props {
  to: Nullable<To>;
  defaultTo?: Nullable<To>;
}

export function useNavigateOnLogin({ to = null, defaultTo = null }: Props) {
  const { initialized } = useAuthentication();
  const navigate = useNavigate();
  const client = useClient();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    return client.onAuthenticated(() => {
      const target = to ? to : defaultTo;

      if (!target) {
        return;
      }

      navigate(target);
    });
  }, [initialized, client, to, defaultTo, navigate]);
}
