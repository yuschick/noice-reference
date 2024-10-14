import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { BiTrash } from 'react-icons/bi';
import { Operation } from 'rfc6902';

import { ChannelFeatureFlagConditions } from '../ChannelFeatureFlagConditions/ChannelFeatureFlagConditions';
import { useFeatureFlagGroupUpdate } from '../FeatureFlag/context/FeatureFlagGroupProvider';
import { FeatureFlagValues } from '../FeatureFlagValues/FeatureFlagValues';
import { filter } from '../patch';
import { FlagCategory, GroupData } from '../types';
import { UserFeatureFlagConditions } from '../UserFeatureFlagConditions/UserFeatureFlagConditions';

import styles from './FeatureFlagGroup.module.css';

import { Button, Toggle } from '@common/button';
import { FeatureFlagGroupSchemaFragment } from '@gen';

interface Props {
  group: GroupData;
  flagValueSchema: Nullable<FeatureFlagGroupSchemaFragment>;
  isFlagEnabled: boolean;
  updates: Operation[];
  flagCategory: FlagCategory;
  isDisabled: boolean;
  onFlagGroupRemove(): void;
}

export function FeatureFlagGroup({
  group,
  flagValueSchema,
  isFlagEnabled,
  updates,
  flagCategory,
  isDisabled,
  onFlagGroupRemove,
}: Props) {
  const { onFlagGroupEnableToggle } = useFeatureFlagGroupUpdate();

  const { enabled, values, conditions, order } = group;

  return (
    <fieldset className={updates.length ? styles.hasChanges : undefined}>
      <legend className={styles.legend}>
        <Toggle
          disabled={isDisabled}
          hasChanges={!!filter(updates, '/enabled').length}
          label="Enabled"
          value={enabled}
          hideLabel
          onChange={onFlagGroupEnableToggle}
        />

        {group.default ? 'Default group' : `Group ${order}`}
      </legend>

      {enabled && !isFlagEnabled && (
        <div className={styles.warning}>
          <Icon
            icon={CoreAssets.Icons.Exclamation}
            size={16}
          />
          <span>Feature flag is disabled</span>
        </div>
      )}

      <div className={styles.content}>
        {!group.default ? (
          <>
            {flagCategory === 'user' && (
              <UserFeatureFlagConditions
                conditions={Object.values(conditions)}
                isDisabled={isDisabled}
                updates={filter(updates, `/conditions`)}
              />
            )}

            {flagCategory === 'channel' && (
              <ChannelFeatureFlagConditions
                conditions={Object.values(conditions)}
                isDisabled={isDisabled}
                updates={filter(updates, `/conditions`)}
              />
            )}
          </>
        ) : (
          <fieldset>
            <legend>Conditions</legend>

            <span className={styles.defaultGroupText}>
              Conditions are disabled in default group
            </span>
          </fieldset>
        )}

        <FeatureFlagValues
          existingValues={Object.keys(values)}
          flagValueSchema={flagValueSchema}
          flagValues={values}
          isDisabled={isDisabled}
          updates={filter(updates, `/values`)}
        />
      </div>

      {!group.default && (
        <Button
          buttonType="link"
          disabled={isDisabled}
          icon={BiTrash}
          text="Remove group"
          onClick={onFlagGroupRemove}
        />
      )}
    </fieldset>
  );
}

FeatureFlagGroup.fragments = {
  entry: gql`
    fragment FeatureFlagGroupSchema on FlagJSONSchema {
      ...FeatureFlagNewValueSchema
    }
  `,
};
