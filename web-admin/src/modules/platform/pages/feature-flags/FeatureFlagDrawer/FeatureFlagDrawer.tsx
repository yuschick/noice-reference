import { gql } from '@apollo/client';
import { FormEvent, useRef, useState } from 'react';

import { ConfigData } from '../types';

import styles from './FeatureFlagDrawer.module.css';

import { Button } from '@common/button';
import { useDrawer } from '@common/drawer';
import { Select } from '@common/input';
import { FeatureFlagDrawerSchemaFlagFragment } from '@gen';

interface Props {
  flagConfig: ConfigData;
  flagSchema: FeatureFlagDrawerSchemaFlagFragment[];
  onAddFlag(flag: string, type: 'user' | 'channel'): void;
}

function alphabetizeFlags(flags: string[]) {
  return flags.sort((a, b) => a.localeCompare(b));
}

export function FeatureFlagDrawer({ flagConfig, flagSchema, onAddFlag }: Props) {
  const { closeDrawer } = useDrawer();

  const [type, setType] = useState('user');

  const flagSelectRef = useRef<HTMLSelectElement>(null);

  const flagKeys = flagSchema.map((flag) => flag.key);

  const freeUserFlags = alphabetizeFlags(
    flagKeys.filter((flag) => !Object.keys(flagConfig.userFlags.flags).includes(flag)),
  );

  const freeChannelFlags = alphabetizeFlags(
    flagKeys.filter((flag) => !Object.keys(flagConfig.channelFlags.flags).includes(flag)),
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!flagSelectRef.current?.value || (type !== 'user' && type !== 'channel')) {
      return;
    }

    onAddFlag(flagSelectRef.current.value, type);
    closeDrawer();
  };

  const disableSubmit =
    (type === 'user' && !freeUserFlags.length) ||
    (type === 'channel' && !freeChannelFlags.length);

  return (
    <form
      className={styles.wrapper}
      onSubmit={onSubmit}
    >
      <Select
        label="Feature flag type"
        options={['user', 'channel']}
        preventNoValueOption
        required
        onChange={setType}
      />

      {type === 'user' && (
        <Select
          label="Feature flag"
          options={freeUserFlags}
          ref={flagSelectRef}
          preventNoValueOption
          required
        />
      )}

      {type === 'channel' && (
        <Select
          label="Feature flag"
          options={freeChannelFlags}
          ref={flagSelectRef}
          preventNoValueOption
        />
      )}

      <div>
        <Button
          disabled={disableSubmit}
          text="Add feature flag"
          type="submit"
        />
      </div>

      <p className={styles.helpText}>
        If your flag is missing from the list, add it{' '}
        <a href="https://github.com/noice-com/platform/blob/main/data/feature-flags/config.yml">
          to the schema
        </a>{' '}
        in a pull request, and it will be here after the build.
      </p>
    </form>
  );
}

FeatureFlagDrawer.fragments = {
  entry: gql`
    fragment FeatureFlagDrawerSchemaFlag on FlagFeatureFlagSchemaFlagsEntry {
      key
    }
  `,
};
