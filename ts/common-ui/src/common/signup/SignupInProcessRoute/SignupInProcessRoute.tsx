import { useMountEffect } from '@noice-com/common-react-core';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useSignup } from '../context';

import { FullscreenSpinner } from '@common-components';
import { WithChildren } from '@common-types';

export function SignupInProcessRoute({ children }: WithChildren) {
  const { signupData, routes } = useSignup();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState<boolean>(false);

  useMountEffect(() => {
    if (Object.keys(signupData).length > 0) {
      setInitialized(true);
      return;
    }

    navigate(routes.signupRootRoute, { replace: true });
  });

  if (!initialized) {
    return <FullscreenSpinner />;
  }

  return <>{children}</>;
}
