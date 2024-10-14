import { gql } from '@apollo/client';
import { VisuallyHidden } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { BiCopy, BiErrorCircle, BiPlus, BiTrash } from 'react-icons/bi';
import { useLocation } from 'react-router';
import { Operation } from 'rfc6902';

import { FeatureFlagGroup } from '../FeatureFlagGroup/FeatureFlagGroup';
import { useFeatureFlagUpdate } from '../FeatureFlagList/context/FeatureFlagUpdateProvider';
import { filter } from '../patch';
import { FlagCategory, FlagData } from '../types';

import { FeatureFlagGroupUpdateProvider } from './context/FeatureFlagGroupProvider';
import styles from './FeatureFlag.module.css';

import { Button, Toggle } from '@common/button';
import { FeatureFlagSchemaFlagFragment } from '@gen';

interface Props {
  flag: FlagData;
  updates: Operation[];
  className?: string;
  flagSchema: Nullable<FeatureFlagSchemaFlagFragment>;
  flagCategory: FlagCategory;
  onRemoveFlag(): void;
}

export function FeatureFlag({
  flag,
  updates,
  className,
  flagSchema,
  flagCategory,
  onRemoveFlag,
}: Props) {
  const { onFlagEnableToggle, onFlagGroupAdd, onFlagGroupRemove } =
    useFeatureFlagUpdate();
  const { hash } = useLocation();
  const [expanded, setExpanded] = useState(false);

  const { name, enabled, groups } = flag;

  const removedGroups = Object.values(filter(updates, '/groups')).filter(
    ({ op, path }) => op === 'remove' && path.match(/^\/[\d\w-]+$/),
  );

  const onNameCopyClick = () => {
    navigator.clipboard.writeText(name);
  };

  const onLinkCopyClick = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}#${name}`,
    );
  };

  const description = flagSchema?.value.description;

  useEffect(() => {
    if (hash === `#${name}`) {
      setExpanded(true);

      document.getElementById(name)?.scrollIntoView();
    }
  }, [hash, name]);

  return (
    <section
      className={classNames(className, {
        [styles.hasUpdates]: updates.length,
        [styles.expanded]: expanded,
      })}
      id={name}
    >
      <div className={styles.titleRow}>
        <Toggle
          className={styles.toggle}
          disabled={!flagSchema}
          hasChanges={!!filter(updates, '/enabled').length}
          label="Enabled"
          value={enabled}
          hideLabel
          onChange={onFlagEnableToggle}
        />

        <h2 className={styles.title}>
          <button
            className={styles.button}
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {!flagSchema && (
              <BiErrorCircle
                color="var(--neutral-300)"
                size={20}
              />
            )}

            <span>
              {name}
              {!!description && (
                <span className={styles.description}> - {description}</span>
              )}
            </span>

            <VisuallyHidden>({enabled ? 'enabled' : 'disabled'})</VisuallyHidden>
          </button>
        </h2>
      </div>

      {expanded && (
        <div className={styles.content}>
          {!flagSchema && (
            <div className={classNames(styles.content, styles.warningContent)}>
              <div>
                This feature flag is not in{' '}
                <a href="https://github.com/noice-com/platform/blob/main/data/feature-flags/config.yml">
                  feature flag schema
                </a>{' '}
                and cannot be edited.
              </div>
            </div>
          )}

          {Object.entries(groups).map(([id, group]) => (
            <FeatureFlagGroupUpdateProvider
              groupId={id}
              key={id}
            >
              <FeatureFlagGroup
                flagCategory={flagCategory}
                flagValueSchema={flagSchema?.value ?? null}
                group={group}
                isDisabled={!flagSchema}
                isFlagEnabled={enabled}
                updates={filter(updates, `/groups/${id}`)}
                onFlagGroupRemove={() => onFlagGroupRemove(id)}
              />
            </FeatureFlagGroupUpdateProvider>
          ))}

          <div className={styles.bottom}>
            <div className={styles.addGroupWrapper}>
              <Button
                buttonType="ghost"
                disabled={!flagSchema}
                icon={BiPlus}
                size="small"
                text="Add group"
                onClick={onFlagGroupAdd}
              />

              {!!removedGroups.length && (
                <span className={styles.removedWrapper}>
                  {removedGroups.length} group{removedGroups.length === 1 ? '' : 's'}{' '}
                  removed
                </span>
              )}
            </div>

            <div className={styles.copyLinks}>
              <Button
                buttonType="link"
                icon={BiCopy}
                size="small"
                text="Copy feature flag link"
                onClick={onLinkCopyClick}
              />

              <Button
                buttonType="link"
                icon={BiCopy}
                size="small"
                text="Copy feature flag name"
                onClick={onNameCopyClick}
              />

              <Button
                buttonType="ghost"
                icon={BiTrash}
                size="small"
                text="Remove flag"
                onClick={onRemoveFlag}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

FeatureFlag.fragments = {
  entry: gql`
    fragment FeatureFlagSchemaFlag on FlagFeatureFlagSchemaFlagsEntry {
      value {
        description
        type
        enum
        pattern
        minimum
        maximum
        multipleOf
      }
    }
  `,
};
