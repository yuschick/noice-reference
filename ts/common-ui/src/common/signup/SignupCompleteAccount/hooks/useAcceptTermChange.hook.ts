import { ClientToS } from '@noice-com/utils';
import { ChangeEvent } from 'react';

import { useSignup } from '../../context';

interface HookResult {
  onAcceptTermChange(event: ChangeEvent<HTMLInputElement>): void;
}

const getAcceptTerms = (hasAcceptedTerms: boolean, username?: string) => {
  if (!hasAcceptedTerms) {
    return undefined;
  }

  return [
    {
      ...ClientToS.currentAgreement,
      signature: username ?? '',
    },
  ];
};

export function useAcceptTermChange(): HookResult {
  const {
    signupData: { username },
    appendSignupData,
  } = useSignup();

  const onAcceptTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    appendSignupData({
      acceptedTerms: getAcceptTerms(event.target.checked, username),
    });
  };

  return {
    onAcceptTermChange,
  };
}
