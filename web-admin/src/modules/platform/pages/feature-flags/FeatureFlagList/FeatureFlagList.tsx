import { gql } from '@apollo/client';
import { Operation } from 'rfc6902';

import { FeatureFlag } from '../FeatureFlag/FeatureFlag';
import { filter } from '../patch';
import { FlagCategory, FlagListData } from '../types';

import { FeatureFlagUpdateProvider } from './context/FeatureFlagUpdateProvider';
import styles from './FeatureFlagList.module.css';

import { FeatureFlagListSchemaFlagFragment } from '@gen';

interface Props {
  updates: Operation[];
  flagsData: FlagListData;
  flagsSchema: FeatureFlagListSchemaFlagFragment[];
  flagCategory: FlagCategory;
  onUpdate(flags: FlagListData): void;
}

export function FeatureFlagList({
  flagsData,
  onUpdate,
  updates,
  flagCategory,
  flagsSchema,
}: Props) {
  const flags = Object.entries(flagsData.flags).sort(([a], [b]) => {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }
    return 0;
  });

  if (!flags.length) {
    return <span className={styles.empty}>No feature flags</span>;
  }

  const onRemoveFlag = (name: string) => {
    const { [name]: _, ...flags } = flagsData.flags;
    onUpdate({
      flags,
    });
  };

  return (
    <div className={styles.wrapper}>
      {flags.map(([name, flag]) => (
        <FeatureFlagUpdateProvider
          flagName={name}
          flagsData={flagsData}
          key={name}
          onUpdate={onUpdate}
        >
          <FeatureFlag
            className={styles.flag}
            flag={flag}
            flagCategory={flagCategory}
            flagSchema={flagsSchema.find((schemaFlag) => schemaFlag.key === name) ?? null}
            updates={filter(updates, `/flags/${name}`)}
            onRemoveFlag={() => onRemoveFlag(name)}
          />
        </FeatureFlagUpdateProvider>
      ))}
    </div>
  );
}

FeatureFlagList.fragments = {
  entry: gql`
    fragment FeatureFlagListSchemaFlag on FlagFeatureFlagSchemaFlagsEntry {
      key
      ...FeatureFlagSchemaFlag
    }
  `,
};
