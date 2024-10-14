import { SignupContent, SignupMethod as CommonSignupMethod } from '@noice-com/common-ui';
import { useSearchParams } from 'react-router-dom';

import { useNavigateOnLogin } from '@common/navigation/hooks/useNavigateOnLogin.hook';

export function SignupMethod() {
  const [searchParams] = useSearchParams();

  useNavigateOnLogin({ to: searchParams.get('from'), defaultTo: '/' });

  return (
    <SignupContent>
      <SignupContent.Main>
        <CommonSignupMethod />
      </SignupContent.Main>
    </SignupContent>
  );
}
