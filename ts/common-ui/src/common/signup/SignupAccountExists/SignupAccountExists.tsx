import { CoreAssets } from '@noice-com/assets-core';
import { useMountEffect } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useCallback } from 'react';

import { useSignup } from '../context';
import { useSignupAnalytics } from '../hooks';
import { SignupChannel } from '../SignupChannel';
import { SignupContent } from '../SignupContent';
import { SignupInProcessRoute } from '../SignupInProcessRoute';

import styles from './SignupAccountExists.module.css';

import { Button } from '@common-components';

export function SignupAccountExists() {
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const {
    signupData: { email },
    channel,
    initSignupProcess,
    executeCaptcha,
  } = useSignup();

  useMountEffect(() => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_ACCOUNT_EXISTS,
    );
  });

  const onEmailLoginClick = useCallback(() => {
    if (!email) {
      return;
    }

    initSignupProcess(email);
    executeCaptcha();
  }, [email, executeCaptcha, initSignupProcess]);

  const handleConnectionLoginClick = useCallback(() => {
    executeCaptcha();
  }, [executeCaptcha]);

  return (
    <SignupInProcessRoute>
      <SignupContent>
        {channel && (
          <SignupContent.Header>
            <SignupChannel channel={channel} />
          </SignupContent.Header>
        )}

        <SignupContent.Main>
          <SignupContent.SubWrapper>
            <SignupContent.Title>Account exists</SignupContent.Title>

            <SignupContent.Description>
              Account already exists with email
              <br />
              <span className={styles.dataPointText}>{email}</span>
            </SignupContent.Description>
          </SignupContent.SubWrapper>

          <SignupContent.SubWrapper>
            <Button
              iconStart={CoreAssets.Icons.Discord}
              size="lg"
              theme="dark"
              onClick={handleConnectionLoginClick}
            >
              Enable Discord login
            </Button>

            <Button
              level="secondary"
              size="lg"
              theme="dark"
              onClick={onEmailLoginClick}
            >
              Login with email
            </Button>
          </SignupContent.SubWrapper>
        </SignupContent.Main>
      </SignupContent>
    </SignupInProcessRoute>
  );
}
