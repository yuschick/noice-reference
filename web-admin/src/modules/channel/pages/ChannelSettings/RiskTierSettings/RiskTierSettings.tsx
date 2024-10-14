import { gql } from '@apollo/client';
import { useRef } from 'react';
import { useParams } from 'react-router';

import styles from './RiskTierSettings.module.css';

import { Select } from '@common/input';
import { ContentModulePage } from '@common/page-components';
import { showSnackbar } from '@common/snackbar';
import { ChannelRiskTier, useChannelUpdateRiskTierMutation } from '@gen';

gql`
  mutation ChannelUpdateRiskTier($channelId: ID!, $riskTier: ChannelRiskTier!) {
    updateChannelDetails(body: { id: $channelId, riskTier: $riskTier }) {
      id
      riskTier
    }
  }
`;

interface Props {
  currentRiskTier: ChannelRiskTier;
}

export function RiskTierSettings({ currentRiskTier }: Props) {
  const { channelId } = useParams();
  const selectRef = useRef<HTMLSelectElement>(null);

  const [updateChannelRiskTier] = useChannelUpdateRiskTierMutation({
    update(cache, _result, { variables }) {
      cache.updateFragment(
        {
          id: cache.identify({ id: channelId, __typename: 'ChannelChannel' }),
          fragment: gql`
            fragment RiskTierUpdateChannel on ChannelChannel {
              id
              riskTier
            }
          `,
        },
        (existingChannel) => ({
          ...existingChannel,
          riskTier: variables?.riskTier,
        }),
      );
    },
    onCompleted() {
      showSnackbar('positive', 'Channel risk tier updated successfully.');
    },
    onError(error) {
      showSnackbar(
        'error',
        `Error occurred while updating channel risk tier: ${error.message}`,
      );
    },
  });

  const onSelectChange = (riskTier: string) => {
    if (!channelId) {
      showSnackbar('error', 'Missing channel id!');
      return;
    }

    updateChannelRiskTier({
      variables: {
        channelId: channelId,
        riskTier: riskTier as ChannelRiskTier,
      },
    });
  };

  return (
    <ContentModulePage.Content title="Channel risk tier">
      <div className={styles.selectWrapper}>
        <span className={styles.selectLabel}>Channel risk tier</span>

        <Select
          className={styles.select}
          defaultValue={currentRiskTier}
          label="Channel risk tier"
          options={[
            { value: ChannelRiskTier.RiskTier_1, label: 'Tier 1' },
            { value: ChannelRiskTier.RiskTier_2, label: 'Tier 2' },
          ]}
          ref={selectRef}
          hideLabel
          onChange={onSelectChange}
        />
      </div>
    </ContentModulePage.Content>
  );
}
