import { CoreAssets } from '@noice-com/assets-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { FormEvent, useState } from 'react';
/* Package types seem to be incorrect, although the import works as expected */
/* eslint-disable-next-line import/default */
import AppleSignInButton from 'react-apple-signin-auth';
import { FaApple } from 'react-icons/fa';

import { useSignup } from '../context';
import { useSignupAnalytics } from '../hooks';
import { SignupContent } from '../SignupContent';

import { useAppleSignup } from './hooks/useAppleSignin.hook';
import { useDiscordButtonClick } from './hooks/useDiscordButtonClick.hook';
import { useEmailSignupSubmit } from './hooks/useEmailSignupSubmit.hook';
import styles from './SignupMethod.module.css';

import { Button, InputField } from '@common-components';

interface Props {
  emailOnly?: boolean;
}

export function SignupMethod({ emailOnly = false }: Props) {
  const { appleRedirectUrl, showError, executeCaptcha, excludeNewAccountCreation } =
    useSignup();
  const [isLoading, setIsLoading] = useState(false);

  const onDiscordButtonClick = useDiscordButtonClick();
  const { emailInputRef, onEmailSubmit } = useEmailSignupSubmit();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();

  const { handleSuccess } = useAppleSignup();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_LOGIN_OR_SIGNUP_CLICK,
    );
    setIsLoading(true);
    event.preventDefault();
    onEmailSubmit();
    executeCaptcha();
  };

  const submitButtonLabel = `Login${
    !excludeNewAccountCreation ? ' or create account' : ''
  }`;

  return (
    <>
      <form
        name="signup"
        onSubmit={onSubmit}
      >
        <div className={styles.formGrid}>
          <InputField
            data-testid="signup-email"
            inputMode="email"
            label="Email"
            ref={emailInputRef}
            size="lg"
            type="email"
            required
          />
          <Button
            data-testid="signup-email-submit"
            isLoading={isLoading}
            size="lg"
            type="submit"
            variant="cta"
          >
            {submitButtonLabel}
          </Button>
        </div>
      </form>

      {!emailOnly && (
        <>
          <div className={styles.orDivider}>Or</div>

          <SignupContent.SubWrapper>
            <Button
              iconStart={CoreAssets.Icons.Discord}
              size="lg"
              theme="dark"
              onClick={onDiscordButtonClick}
            >
              Continue with Discord
            </Button>

            <AppleSignInButton
              authOptions={{
                clientId: 'com.noice.platform.web',
                scope: 'name',
                redirectURI: appleRedirectUrl,
                state: '',
                nonce: 'nonce',
                usePopup: true,
              }}
              render={(props: any) => (
                <Button
                  {...props}
                  iconStart={FaApple}
                  size="lg"
                  theme="dark"
                  onClick={() => {
                    props.onClick?.();
                    sendAnalyticsStepEvent(
                      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_APPLE_CLICK,
                    );
                  }}
                >
                  Continue with Apple
                </Button>
              )}
              uiType="dark"
              onError={() => showError()}
              onSuccess={handleSuccess}
            />
          </SignupContent.SubWrapper>
        </>
      )}
    </>
  );
}
