import { ChangeEvent, useCallback, ClipboardEvent, forwardRef } from 'react';

import styles from './SignupEmailVerificationCodeInput.module.css';

import { InputField } from '@common-components';

interface Props {
  index: number;
  error: boolean;
  onChange(index: number, value: string): void;
  onPaste(event: ClipboardEvent): void;
}

export const SignupEmailVerificationCodeInput = forwardRef<HTMLInputElement, Props>(
  function SignupEmailVerificationCodeInput({ index, error, onChange, onPaste }, ref) {
    const onInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(index, e.target.value);
      },
      [index, onChange],
    );

    return (
      <div className={styles.inputWrapper}>
        <InputField
          autoComplete="off"
          data-testid={`signup-email-verification-code-${index}`}
          error={error ? { message: 'Invalid code' } : undefined}
          inputMode="numeric"
          label="Input code"
          labelType="hidden"
          maxLength={1}
          ref={ref}
          size="lg"
          type="text"
          required
          onChange={onInputChange}
          onPaste={onPaste}
        />
      </div>
    );
  },
);
