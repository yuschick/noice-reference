import { useClient } from '@noice-com/common-react-core';
import { useAuthentication } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useEffect } from 'react';
import { To, useNavigate } from 'react-router';

interface Props {
  to: Nullable<To>;
}

export function useNavigateOnLogout({ to }: Props) {
  const { isAuthenticated, initialized } = useAuthentication();
  const navigate = useNavigate();
  const client = useClient();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const redirect = () => {
      if (!to) {
        return;
      }

      navigate(to);
    };

    if (!isAuthenticated()) {
      redirect();
      return;
    }

    return client.onLogout(() => {
      redirect();
    });
  }, [initialized, client, to, navigate, isAuthenticated]);
}
