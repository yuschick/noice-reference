import { Button, Checkbox, SignupContent } from '@noice-com/common-ui';
import { FormEvent, useState } from 'react';

import styles from './MarketingConsentForm.module.css';

import { useMarketingConsentMutation } from '@common/user-settings';
import { AuthConsentStatus } from '@gen';

interface Props {
  onCompleted(): void;
  onError(error: string): void;
}

export function MarketingConsentForm({ onCompleted, onError }: Props) {
  const [hasAcceptedMarketing, setHasAcceptedMarketing] = useState(false);

  const [updateConsent, { loading }] = useMarketingConsentMutation({
    variables: {
      consent: hasAcceptedMarketing
        ? AuthConsentStatus.ConsentStatusAccepted
        : AuthConsentStatus.ConsentStatusDeclined,
    },
    onCompleted,
    onError(err) {
      setHasAcceptedMarketing(false);
      onError(err.message);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateConsent();
  };

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <SignupContent.SubWrapper>
        <SignupContent.Title>Don’t miss out</SignupContent.Title>
      </SignupContent.SubWrapper>

      <SignupContent.TextSection>
        <Checkbox
          label="Tick this box to receive relevant marketing, updates, alerts, and surveys from Noice about our products and services."
          name="marketing"
          onChange={(event) => setHasAcceptedMarketing(event.target.checked)}
        />
      </SignupContent.TextSection>

      <Button
        isLoading={loading}
        level="primary"
        theme="dark"
        type="submit"
      >
        Continue
      </Button>
    </form>
  );
}
