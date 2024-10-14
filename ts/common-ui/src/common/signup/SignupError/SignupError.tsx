import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';

import { useSignup } from '../context';
import { useSignupAnalytics } from '../hooks';
import { SignupContent } from '../SignupContent';

import styles from './SignupError.module.css';

import { ButtonLink, Icon } from '@common-components';

export function SignupError() {
  const { signupError, routes } = useSignup();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();

  const headerText = signupError?.header ?? 'Something unexpected happened';
  const messageText =
    signupError?.message ?? 'We are currently unable to connect to the service.';

  useMountEffect(() => {
    sendAnalyticsStepEvent(AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_ERROR);
  });

  return (
    <SignupContent>
      <SignupContent.Main>
        <div className={styles.iconWrapper}>
          <Icon
            icon={CoreAssets.Icons.Confused}
            size={80}
          />
        </div>

        <SignupContent.SubWrapper>
          <SignupContent.Title>{headerText}</SignupContent.Title>
          <SignupContent.Description>{messageText}</SignupContent.Description>
        </SignupContent.SubWrapper>
      </SignupContent.Main>

      {!signupError?.hideBackButton && (
        <SignupContent.Actions>
          <ButtonLink
            size="lg"
            theme="dark"
            to={routes.signupRootRoute}
          >
            Go back
          </ButtonLink>
        </SignupContent.Actions>
      )}
    </SignupContent>
  );
}
