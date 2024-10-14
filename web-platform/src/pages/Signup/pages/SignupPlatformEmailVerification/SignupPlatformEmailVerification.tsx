import { SignupEmailVerification } from '@noice-com/common-ui';

import { useEnvironmentCheck } from '@common/environment';

export const SignupPlatformEmailVerification = () => {
  const { isMobile } = useEnvironmentCheck();

  return <SignupEmailVerification isMobile={isMobile} />;
};
