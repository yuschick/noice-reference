import { useMountEffect } from '@noice-com/common-react-core';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { Nullable } from '@noice-com/utils';
import {
  useCallback,
  useRef,
  useState,
  ClipboardEvent,
  FormEvent,
  useEffect,
  useId,
} from 'react';

import { useSignup } from '../context';
import { useSignupAnalytics } from '../hooks';
import { SignupChannel } from '../SignupChannel';
import { SignupContent } from '../SignupContent';
import { SignupInProcessRoute } from '../SignupInProcessRoute';

import { SignupEmailVerificationCodeInput } from './components/SignupEmailVerificationCodeInput';
import { useEmailVerificationActions } from './hooks/useEmailVerificationActions.hook';
import styles from './SignupEmailVerification.module.css';
import { VerificationCode } from './types';
import { getVerificationCodeAsString } from './utils';

import { Button } from '@common-components';

const INPUTS = [0, 1, 2, 3, 4, 5];

interface Props {
  isMobile?: boolean;
}

export function SignupEmailVerification({ isMobile }: Props) {
  const {
    signupData: { email },
    channel,
  } = useSignup();
  const {
    hasErrorWithCode,
    onResendCodeClick,
    onInputChangeValidationReset,
    onVerifyEmailFormSubmit,
  } = useEmailVerificationActions(isMobile);
  const { sendAnalyticsStepEvent } = useSignupAnalytics();
  const formId = useId();

  const [verificationCode, setVerificationCode] = useState<VerificationCode>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const inputRefs = useRef<Nullable<HTMLInputElement>[]>([]);

  useMountEffect(() => {
    sendAnalyticsStepEvent(
      AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_EMAIL_VERIFICATION,
    );
  });

  useEffect(() => {
    if (!hasErrorWithCode) {
      return;
    }

    inputRefs.current[inputRefs.current.length - 1]?.focus();
  }, [hasErrorWithCode]);

  const onInputChange = useCallback(
    (index: number, value: string) => {
      onInputChangeValidationReset();

      setVerificationCode((prev) => {
        const newCode = [...prev] as VerificationCode;

        // If the value is bigger then one char, we need to split it
        // and fill the new code inputs with the rest of the chars
        [...value].forEach((char, i) => {
          if (index + i >= newCode.length) {
            return;
          }

          // If value has more than one char, we need to fill the next inputs
          if (!i) {
            const codeInput = inputRefs.current[index + i];

            if (codeInput) {
              codeInput.value = char;
            }
          }

          newCode[index + i] = char;
        });

        return newCode;
      });

      inputRefs.current[!value ? index - 1 : index + 1]?.focus();
    },
    [onInputChangeValidationReset],
  );

  const onPaste = (event: ClipboardEvent) => {
    onInputChangeValidationReset();
    event.preventDefault();

    const pastedString = event.clipboardData.getData('text').trim();
    const newCode: VerificationCode = [...verificationCode];

    inputRefs.current.forEach((input, index) => {
      if (!input) {
        return;
      }

      const value = pastedString[index];

      input.value = value;
      newCode[index] = value;
    });

    setVerificationCode(newCode);
  };

  const onFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const codeString = getVerificationCodeAsString(verificationCode);

      if (!codeString) {
        return;
      }
      sendAnalyticsStepEvent(
        AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_VERIFY_EMAIL_CLICK,
      );
      onVerifyEmailFormSubmit(codeString);
    },
    [onVerifyEmailFormSubmit, sendAnalyticsStepEvent, verificationCode],
  );

  return (
    <SignupInProcessRoute>
      <SignupContent>
        {channel && (
          <SignupContent.Header>
            <SignupChannel channel={channel} />
          </SignupContent.Header>
        )}

        <SignupContent.Main>
          <form
            className={styles.wrapper}
            id={formId}
            name="email-verification"
            onSubmit={onFormSubmit}
          >
            <SignupContent.SubWrapper>
              <SignupContent.Title>
                Great, check your inbox! And verify your email
              </SignupContent.Title>

              <SignupContent.Description>
                Enter the 6 digit code we sent to
                <br />
                <span className={styles.dataPointText}>{email}</span>
              </SignupContent.Description>
            </SignupContent.SubWrapper>

            <SignupContent.SubWrapper>
              <div className={styles.verificationDigitsWrapper}>
                {INPUTS.map((index) => (
                  <SignupEmailVerificationCodeInput
                    error={hasErrorWithCode}
                    index={index}
                    key={`codeInput_${index}`}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={onInputChange}
                    onPaste={onPaste}
                  />
                ))}
              </div>

              {!!hasErrorWithCode && (
                <span className={styles.errorText}>Wrong code, try again</span>
              )}
            </SignupContent.SubWrapper>
          </form>
        </SignupContent.Main>

        <SignupContent.Actions>
          <Button
            data-testid="signup-email-verification-submit"
            form={formId}
            size="lg"
            type="submit"
            variant="cta"
          >
            Continue
          </Button>

          <SignupContent.Description>Didn&apos;t get the code?</SignupContent.Description>

          <Button onClick={onResendCodeClick}>Resend</Button>
        </SignupContent.Actions>
      </SignupContent>
    </SignupInProcessRoute>
  );
}
