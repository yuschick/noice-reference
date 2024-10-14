import { useClient, useMountEffect } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { ConsentStatus } from '@noice-com/schemas/auth/auth.pb';
import { EmailVerificationMode } from '@noice-com/schemas/auth/authv4.pb';
import { FormEvent, useCallback, useId, useRef } from 'react';

import { useSignup } from '../context';
import { useSignupAnalytics, useSignupStages } from '../hooks';
import { SignupBirthday } from '../SignupBirthday';
import { SignupChannel } from '../SignupChannel';
import { SignupContent } from '../SignupContent';
import { SignupInProcessRoute } from '../SignupInProcessRoute';
import { SignupStage } from '../types';

import { useAcceptTermChange } from './hooks/useAcceptTermChange.hook';
import { useBirthdayChangeAndValidation } from './hooks/useBirthdayChangeAndValidation.hook';
import { useEmailAndUsernameValidation } from './hooks/useEmailAndUsernameValidation.hook';
import styles from './SignupCompleteAccount.module.css';

import { UsernameInputField } from '@common-common/username';
import { Anchor, Button, Checkbox, InputField, Switch } from '@common-components';
import { useLoadingPromise } from '@common-hooks';
import { NoiceSupportLinks } from '@common-types';

const getMarketingConsent = (hasAcceptedMarketing: boolean) => {
  if (hasAcceptedMarketing) {
    return ConsentStatus.CONSENT_STATUS_ACCEPTED;
  }

  return ConsentStatus.CONSENT_STATUS_DECLINED;
};

export function SignupCompleteAccount() {
  const {
    signupData: { email, verifiedCaptchaToken, verifyEmailToken },
    appendSignupData,
    channel,
    showError,
    executeCaptcha,
  } = useSignup();
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const { updateSignupStage } = useSignupStages();
  const client = useClient();

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const marketingRef = useRef<HTMLInputElement>(null);

  const {
    usernameError,
    emailAddressError,
    onEmailChange,
    onSubmitEmailAndUsernameValidation,
  } = useEmailAndUsernameValidation();

  const { onDayChange, onMonthChange, onYearChange, onSubmitBirthdayValidation } =
    useBirthdayChangeAndValidation();

  const { onAcceptTermChange } = useAcceptTermChange();

  useMountEffect(() => {
    usernameInputRef.current?.focus();

    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETE_ACCOUNT,
    );
  });

  const onSubmitPromise = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!email) {
        return;
      }

      // Do not continue if birthday is invalid
      if (!onSubmitBirthdayValidation()) {
        return;
      }

      // Do not continue if username or email is invalid
      if (!(await onSubmitEmailAndUsernameValidation())) {
        return;
      }

      sendAnalyticsStepEvent(
        AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_VERIFY_ACCOUNT_CLICK,
      );
      // Set marketing consent
      appendSignupData({
        marketingConsent: getMarketingConsent(!!marketingRef.current?.checked),
      });

      // If there is no captcha token, run the verification
      if (!verifiedCaptchaToken) {
        executeCaptcha();
        return;
      }

      // If we don't already have a verifyEmailToken,
      // then we need to request email verification
      if (!verifyEmailToken) {
        try {
          const token = await client.AuthService.verifyEmail(
            email,
            EmailVerificationMode.EMAIL_VERIFICATION_MODE_SIGNUP,
            verifiedCaptchaToken,
          );

          appendSignupData({
            verifyEmailToken: token,
          });
        } catch (e) {
          showError({
            header: 'Error requesting email verification',
            message: 'Something went wrong while requesting email verification',
          });
          return;
        }
      }

      // Update to the next stage
      updateSignupStage(SignupStage.VerifyEmail);
    },
    [
      appendSignupData,
      client.AuthService,
      email,
      executeCaptcha,
      onSubmitBirthdayValidation,
      onSubmitEmailAndUsernameValidation,
      sendAnalyticsStepEvent,
      showError,
      updateSignupStage,
      verifiedCaptchaToken,
      verifyEmailToken,
    ],
  );

  const [onSubmit, isSubmitting] = useLoadingPromise(onSubmitPromise);

  return (
    <SignupInProcessRoute>
      <SignupContent>
        {channel && (
          <SignupContent.Header>
            <SignupChannel channel={channel} />
          </SignupContent.Header>
        )}

        <SignupContent.Main>
          <SignupContent.Title>Complete your account</SignupContent.Title>

          <form
            className={styles.completeAccountForm}
            id={formId}
            onSubmit={onSubmit}
          >
            <SignupContent.SubWrapper>
              <InputField
                autoComplete="email"
                defaultValue={email}
                error={
                  emailAddressError
                    ? { message: emailAddressError, type: 'visible' }
                    : undefined
                }
                inputMode="email"
                label="Email"
                size="lg"
                type="email"
                required
                onChange={onEmailChange}
              />

              <UsernameInputField
                data-testid="signup-username"
                label="Username"
                ref={usernameInputRef}
                size="lg"
                usernameError={usernameError}
                onUsernameChange={(username) => appendSignupData({ username })}
              />
            </SignupContent.SubWrapper>

            <div className={styles.completeAccountBdayWrapper}>
              <SignupBirthday
                onDayChange={onDayChange}
                onMonthChange={onMonthChange}
                onYearChange={onYearChange}
              />
            </div>

            <div>
              <Checkbox
                data-testid="signup-accept-terms"
                label="I have read and agree to the Terms of Service, which include the Noice Community Guidelines."
                name="accept-terms"
                required
                onChange={onAcceptTermChange}
              />

              <div className={styles.acceptTermLinks}>
                <Anchor
                  color="dark"
                  href={NoiceSupportLinks.TermsOfService}
                >
                  Terms of Service
                </Anchor>

                <Anchor
                  color="dark"
                  href={NoiceSupportLinks.CommunityGuidelines}
                >
                  Community Guidelines
                </Anchor>
              </div>
            </div>

            <hr className={styles.divider} />

            <Switch
              label="Receive relevant marketing, updates, alerts, and surveys from Noice about our products and services."
              ref={marketingRef}
            />
          </form>
        </SignupContent.Main>

        <SignupContent.Actions>
          <Button
            data-testid="signup-complete-account-submit"
            form={formId}
            isLoading={isSubmitting}
            size="lg"
            type="submit"
            variant="cta"
          >
            Verify account
          </Button>

          <p className={styles.completeAccountActionNote}>
            For information about how we collect and use personal information, please see
            our{' '}
            <Anchor
              color="dark"
              href={NoiceSupportLinks.PrivacyPolicy}
            >
              Privacy Policy
            </Anchor>
            .
          </p>
        </SignupContent.Actions>
      </SignupContent>
    </SignupInProcessRoute>
  );
}
