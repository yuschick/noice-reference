import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useState } from 'react';

import styles from './ChannelMonetizationSettings.module.css';

import { Button, Toggle } from '@common/button';
import { ModalDialog } from '@common/dialog';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { Pill } from '@common/text';
import {
  ChannelMonetizationChannelFragment,
  useChannelUpdateMonetizationSettingsMutation,
  useChannelUserProfileQuery,
} from '@gen';

gql`
  fragment ChannelOwnerAgreements on ProfileProfile {
    account {
      acceptedTerms {
        name
      }
    }
  }

  fragment ChannelMonetizationChannel on ChannelChannel {
    id
    monetizationSettings {
      channelId
      enabled
      eligible
    }
    streamerId
    subscriptionConfig {
      channelId
      subscriptionsEnabled
    }
  }

  mutation ChannelUpdateMonetizationSettings($body: ChannelMonetizationSettingsInput!) {
    updateChannelMonetizationSettings(body: $body) {
      channelId
      enabled
      eligible
    }
  }
`;

interface Props {
  channel: ChannelMonetizationChannelFragment;
}

export function ChannelMonetizationSettings({ channel }: Props) {
  const [showEligibilityDialog, setShowEligibilityDialog] = useState(false);
  const [showEnabledDialog, setShowEnabledDialog] = useState(false);

  const { data } = useChannelUserProfileQuery({
    variables: { userId: channel.streamerId },
    ...variablesOrSkip({ userId: channel.streamerId }),
  });

  const monetizationIsEligible = channel.monetizationSettings?.eligible;
  const monetizationIsEnabled = channel.monetizationSettings?.enabled;
  const hasSignedMonetizationAgreement = data?.profile?.account?.acceptedTerms?.some(
    (term) => term.name === 'monetization-agreement',
  );

  const [updateChannelMonetizationSettings, { loading }] =
    useChannelUpdateMonetizationSettingsMutation({
      variables: {
        body: {
          channelId: channel.id,
          eligible: showEligibilityDialog
            ? !monetizationIsEligible
            : monetizationIsEligible,
          enabled: showEnabledDialog ? !monetizationIsEnabled : monetizationIsEnabled,
        },
      },
      update(cache, result) {
        cache.updateFragment(
          {
            id: cache.identify({
              id: channel.id,
              __typename: 'ChannelChannel',
            }),
            fragment: gql`
              fragment SubscriptionMonetizationUpdate on ChannelChannel {
                id
                monetizationSettings {
                  channelId
                  enabled
                  eligible
                }
              }
            `,
          },
          (existingChannel) => ({
            ...existingChannel,
            monetizationSettings: {
              ...existingChannel.monetizationSettings,
              enabled: result.data?.updateChannelMonetizationSettings?.enabled,
              eligible: result.data?.updateChannelMonetizationSettings?.eligible,
            },
          }),
        );
      },
      onCompleted() {
        showSnackbar('positive', 'Channel monetization settings updated successfully.');
        setShowEligibilityDialog(false);
        setShowEnabledDialog(false);
      },
      onError(error) {
        showSnackbar(
          'error',
          `Error occurred while updating channel monetization state: ${error.message}`,
        );
      },
    });

  return (
    <>
      <ContentModulePage.Content title="Monetization">
        <div className={styles.action}>
          <div>
            <div className={styles.title}>Channel Eligibility</div>
            <p className={styles.subtitle}>
              Allow channel creator to enable monetization on their channel.
            </p>
          </div>
          {!monetizationIsEligible && (
            <Button
              buttonType="success"
              size="small"
              text="Enable Monetization Eligibility"
              onClick={() => setShowEligibilityDialog(true)}
            />
          )}

          {monetizationIsEligible && !hasSignedMonetizationAgreement && (
            <Pill
              size="medium"
              text="Eligible for monetization"
              type="info"
            />
          )}

          {monetizationIsEligible && hasSignedMonetizationAgreement && (
            <Pill
              size="medium"
              text="Monetization agreement signed"
              type="positive"
            />
          )}
        </div>

        <Toggle
          disabled={!monetizationIsEligible || !hasSignedMonetizationAgreement}
          label="Channel monetization"
          offText="The channel supports subscriptions and the sale of creator items."
          value={monetizationIsEnabled}
          onChange={() => setShowEnabledDialog(true)}
          onText="The channel supports subscriptions and the sale of creator items."
        />

        {monetizationIsEnabled && (
          <div className={styles.action}>
            <div className={styles.title}>Subscriptions</div>
            {channel.subscriptionConfig?.subscriptionsEnabled ? (
              <Pill
                size="medium"
                text="Enabled"
                type="positive"
              />
            ) : (
              <Pill
                size="medium"
                text="Disabled"
                type="error"
              />
            )}
          </div>
        )}
      </ContentModulePage.Content>

      <ModalDialog
        isOpen={showEligibilityDialog}
        title="Monetization Eligibility"
        preventCloseOnEscape
        onClose={() => setShowEligibilityDialog(false)}
      >
        <p className={styles.modalText}>
          Are you sure you want to make this channel eligible for monetization?
        </p>

        <div className={styles.modalButtons}>
          <Button
            buttonType="ghost"
            size="medium"
            text="Cancel"
            onClick={() => setShowEligibilityDialog(false)}
          />

          <Button
            buttonType="primary"
            disabled={loading}
            size="medium"
            text="Confirm"
            onClick={() => updateChannelMonetizationSettings()}
          />
        </div>
      </ModalDialog>

      <ModalDialog
        isOpen={showEnabledDialog}
        title="Update monetization settings"
        preventCloseOnEscape
        onClose={() => setShowEligibilityDialog(false)}
      >
        {channel.monetizationSettings?.enabled ? (
          <>
            <p className={styles.modalText}>
              Are you sure you want to disable monetization for this channel?
            </p>
            <p className={styles.modalText}>
              This will affect any existing subscriptions, creator cards and other
              monetization items.
            </p>
          </>
        ) : (
          <p className={styles.modalText}>
            Are you sure you want to enable monetization for this channel?
          </p>
        )}

        <div className={styles.modalButtons}>
          <Button
            buttonType="ghost"
            size="medium"
            text="Cancel"
            onClick={() => setShowEligibilityDialog(false)}
          />

          <Button
            buttonType="primary"
            disabled={loading}
            size="medium"
            text="Confirm"
            onClick={() => updateChannelMonetizationSettings()}
          />
        </div>
      </ModalDialog>
    </>
  );
}
