import { gql } from '@apollo/client';
import { Switch } from '@noice-com/common-ui';

import { SettingsItem } from '../../../SettingsGroup';

import { useMarketingConsentMutation } from '@common/user-settings';
import { AuthConsentStatus, MarketingNotificationProfileFragment } from '@gen';

gql`
  fragment MarketingNotificationProfile on ProfileProfile {
    account {
      uid
      marketingConsent
    }
  }
`;

interface Props {
  profile: MarketingNotificationProfileFragment;
}

export function MarketingNotifications({ profile }: Props) {
  const hasAcceptedMarketing =
    profile.account?.marketingConsent === AuthConsentStatus.ConsentStatusAccepted;

  const [updateConsent, { loading }] = useMarketingConsentMutation({
    variables: {
      consent: hasAcceptedMarketing
        ? AuthConsentStatus.ConsentStatusDeclined
        : AuthConsentStatus.ConsentStatusAccepted,
    },
  });

  return (
    <SettingsItem
      description="Receive relevant marketing, updates, alerts, and surveys from Noice about our products and services."
      state={hasAcceptedMarketing ? 'enabled' : 'disabled'}
    >
      <span>Marketing</span>

      <SettingsItem.Control>
        <Switch
          checked={hasAcceptedMarketing}
          isLoading={loading}
          label="Marketing"
          labelType="hidden"
          onChange={() => updateConsent()}
        />
      </SettingsItem.Control>
    </SettingsItem>
  );
}
