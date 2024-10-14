import { Nullable } from '@noice-com/utils';
import { RefObject, useCallback, useRef } from 'react';

import { useSignup } from '../../context';

interface HookResult {
  emailInputRef: RefObject<HTMLInputElement>;
  onEmailSubmit(): void;
}

export function useEmailSignupSubmit(): HookResult {
  const { initSignupProcess } = useSignup();

  const emailInputRef = useRef<Nullable<HTMLInputElement>>(null);

  const onSubmit = useCallback(() => {
    if (!emailInputRef.current) {
      return;
    }

    initSignupProcess(emailInputRef.current.value);
  }, [initSignupProcess]);

  return {
    emailInputRef,
    onEmailSubmit: onSubmit,
  };
}
