import { gql } from '@apollo/client';

import { ContentModulePage } from '@common/page-components';
import { AuthConsentStatus, TermsAndAgreementsAuthAccountFragment } from '@gen';

interface TermAndAgreementModel {
  name: string;
  revision: string;
  signature: string;
  accepted: boolean;
}

const getTermsAndAgreementModels = (account: TermsAndAgreementsAuthAccountFragment) => {
  const acceptedTerms = account.acceptedTerms.map<TermAndAgreementModel>((item) => ({
    name: item.name,
    revision: item.revision,
    signature: item.signature,
    accepted: true,
  }));

  const pendingAgreements = account.pendingAgreements.map<TermAndAgreementModel>(
    (item) => ({
      name: item.name,
      revision: item.revision,
      signature: '',
      accepted: false,
    }),
  );

  const marketingConsent = [
    {
      name: 'marketing consent',
      revision: '',
      signature: '',
      accepted: account.marketingConsent === AuthConsentStatus.ConsentStatusAccepted,
    },
  ];

  return [...acceptedTerms, ...pendingAgreements, ...marketingConsent];
};

interface Props {
  account: TermsAndAgreementsAuthAccountFragment;
}

export function TermsAndAgreements({ account }: Props) {
  const data = getTermsAndAgreementModels(account).map((item) =>
    (({ accepted, name, revision, signature }) => ({
      term: name,
      revision,
      signature,
      accepted,
    }))(item),
  );

  return (
    <ContentModulePage.TableContent
      data={data}
      title="Terms and agreements"
    />
  );
}

TermsAndAgreements.fragments = {
  entry: gql`
    fragment TermsAndAgreementsAuthAccount on AuthAccount {
      acceptedTerms {
        name
        revision
        signature
      }
      pendingAgreements {
        name
        revision
      }
      marketingConsent
    }
  `,
};
