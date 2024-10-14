import { gql } from '@apollo/client';
import {
  Button,
  Checkbox,
  Anchor,
  SignupContent,
  NoiceSupportLinks,
} from '@noice-com/common-ui';
import { ClientToS } from '@noice-com/utils';
import { FormEvent, useState } from 'react';

import styles from './TermsOfServiceAgreementForm.module.css';

import { useSignAgreementMutation } from '@gen';

gql`
  mutation SignAgreement($agreement: AuthTermsVersionInput!) {
    signAgreements(agreements: [$agreement]) {
      emptyTypeWorkaround
    }
  }
`;

const Label = () => {
  return (
    <span>
      I have read and agree to the{' '}
      <Anchor href={NoiceSupportLinks.TermsOfService}>Terms of Service</Anchor>, which
      include the{' '}
      <Anchor href={NoiceSupportLinks.CommunityGuidelines}>
        Noice Community Guidelines
      </Anchor>
      .
    </span>
  );
};

interface Props {
  userTag: string;
  onCompleted(): void;
  onError(error: string): void;
}

export function TermsOfServiceAgreement({ userTag, onCompleted, onError }: Props) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const [signAgreement, { loading }] = useSignAgreementMutation({
    variables: {
      agreement: {
        ...ClientToS.currentAgreement,
        signature: userTag,
      },
    },
    onCompleted,
    onError(err) {
      setHasAcceptedTerms(false);
      onError(err.message);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signAgreement();
  };

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <SignupContent.SubWrapper>
        <SignupContent.Title>Please review and accept terms</SignupContent.Title>

        <SignupContent.Description>
          For information about how we collect and use personal information, please see
          our <Anchor href={NoiceSupportLinks.PrivacyPolicy}>Privacy Policy</Anchor>.
        </SignupContent.Description>
      </SignupContent.SubWrapper>

      <SignupContent.TextSection>
        <Checkbox
          label={<Label />}
          name="accept-terms"
          onChange={(event) => setHasAcceptedTerms(event.target.checked)}
        />
      </SignupContent.TextSection>

      <Button
        isDisabled={!hasAcceptedTerms}
        isLoading={loading}
        type="submit"
        variant="cta"
      >
        Continue
      </Button>
    </form>
  );
}
