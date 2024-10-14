import { SignupMethod as CommonSignupMethod, SignupContent } from '@noice-com/common-ui';
import { useSearchParams } from 'react-router-dom';

import { useNavigateOnLogin } from '../../../navigation/hooks/useNavigateOnLogin.hook';

export function SignupMethod() {
  const [searchParams] = useSearchParams();

  useNavigateOnLogin({ to: searchParams.get('from') });

  return (
    <SignupContent>
      <SignupContent.Main>
        <CommonSignupMethod emailOnly />
      </SignupContent.Main>
    </SignupContent>
  );
}
