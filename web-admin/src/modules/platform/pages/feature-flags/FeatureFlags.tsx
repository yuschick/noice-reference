import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { BiListPlus } from 'react-icons/bi';
import { Navigate, Route, Routes } from 'react-router';

import { DiffModal } from './DiffModal/DiffModal';
import { FeatureFlagDrawer } from './FeatureFlagDrawer/FeatureFlagDrawer';
import { FeatureFlagList } from './FeatureFlagList/FeatureFlagList';
import styles from './FeatureFlags.module.css';
import { useFeatureFlagConfig } from './hooks/useFeatureFlagConfig.hook';
import { filter } from './patch';
import { getNewOrder } from './utils';

import { Button, TabModel, Tabs } from '@common/button';
import { ModulePage } from '@common/page-components';
import { useFeatureFlagSchemaQuery } from '@gen';

const tabs: TabModel[] = [
  {
    title: 'User flags',
    to: 'users',
    type: 'warning',
  },
  {
    title: 'Channel flags',
    to: 'channels',
    type: 'warning',
  },
];

gql`
  query FeatureFlagSchema {
    featureFlagSchema {
      flags {
        ...FeatureFlagListSchemaFlag
        ...FeatureFlagDrawerSchemaFlag
      }
    }
  }
`;

export function FeatureFlags() {
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [tabsWithChanges, setTabsWithChanges] = useState<TabModel[]>(tabs);

  const { data, loading } = useFeatureFlagSchemaQuery();

  const {
    flagConfig,
    onUpdateUserFlags,
    onUpdateChannelFlags,
    onResetChanges,
    onSaveChanges,
  } = useFeatureFlagConfig();

  useEffect(() => {
    setTabsWithChanges((prev) =>
      prev.map((tab) => {
        if (tab.to === 'users') {
          const userChanges = filter(flagConfig?.updates ?? [], '/userFlags').length;

          return {
            ...tab,
            totalAmount: userChanges ? userChanges : undefined,
          };
        }

        if (tab.to === 'channels') {
          const channelChanges = filter(
            flagConfig?.updates ?? [],
            '/channelFlags',
          ).length;

          return {
            ...tab,
            totalAmount: channelChanges ? channelChanges : undefined,
          };
        }

        return tab;
      }),
    );
  }, [flagConfig?.updates]);

  if (loading) {
    return (
      <ModulePage>
        <span className={styles.revision}>Revision</span>
        <Tabs tabs={tabsWithChanges} />

        <div className={styles.loadingWrapper}>
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div
                className={styles.loadingRow}
                key={index}
              />
            ))}
        </div>
      </ModulePage>
    );
  }

  if (!flagConfig) {
    return (
      <ModulePage>
        <span className={styles.revision}>Revision</span>
        <Tabs tabs={tabsWithChanges} />
        No results
      </ModulePage>
    );
  }

  const config = flagConfig.currentConfig;
  const updates = flagConfig.updates;
  const userFlagUpdates = filter(updates, '/userFlags');
  const channelFlagUpdates = filter(updates, '/channelFlags');

  const onAddFlag = (flag: string, type: 'user' | 'channel') => {
    if (type === 'user') {
      onUpdateUserFlags({
        ...config.userFlags,
        flags: {
          ...config.userFlags.flags,
          [flag]: {
            name: flag,
            description: '',
            enabled: false,
            groups: {
              default: {
                id: 'default',
                enabled: false,
                default: true,
                values: {},
                conditions: {},
                order: 0,
              },
            },
            order: getNewOrder(config.userFlags.flags),
          },
        },
      });

      return;
    }

    onUpdateChannelFlags({
      ...config.channelFlags,
      flags: {
        ...config.channelFlags.flags,
        [flag]: {
          name: flag,
          description: '',
          enabled: false,
          groups: {
            default: {
              id: 'default',
              enabled: false,
              default: true,
              values: {},
              conditions: {},
              order: 0,
            },
          },
          order: getNewOrder(config.channelFlags.flags),
        },
      },
    });
  };

  const removedUserFlags = filter(userFlagUpdates, '/flags')
    .filter(({ op, path }) => op === 'remove' && path.match(/^\/[\d\w-]+$/))
    .map(({ path }) => `${path.replace('/', '')} (user flag)`);

  const removedChannelFlags = filter(channelFlagUpdates, '/flags')
    .filter(({ op, path }) => op === 'remove' && path.match(/^\/[\d\w-]+$/))
    .map(({ path }) => `${path.replace('/', '')} (channel flag)`);

  const removedFlags = [...removedUserFlags, ...removedChannelFlags];

  return (
    <ModulePage
      drawer={{
        title: 'Add feature flag',
        content: (
          <FeatureFlagDrawer
            flagConfig={config}
            flagSchema={data?.featureFlagSchema?.flags ?? []}
            onAddFlag={onAddFlag}
          />
        ),
      }}
      drawerAction={{ icon: BiListPlus, text: 'Add feature flag' }}
    >
      <span className={styles.revision}>Revision {config.revision}</span>

      <Tabs tabs={tabsWithChanges} />

      <Routes>
        <Route
          element={
            <FeatureFlagList
              flagCategory="user"
              flagsData={config.userFlags}
              flagsSchema={data?.featureFlagSchema?.flags ?? []}
              updates={userFlagUpdates}
              onUpdate={onUpdateUserFlags}
            />
          }
          path="users"
        />
        <Route
          element={
            <FeatureFlagList
              flagCategory="channel"
              flagsData={config.channelFlags}
              flagsSchema={data?.featureFlagSchema?.flags ?? []}
              updates={channelFlagUpdates}
              onUpdate={onUpdateChannelFlags}
            />
          }
          path="channels"
        />
        <Route
          element={
            <Navigate
              to="users"
              replace
            />
          }
          path=""
        />
        <Route
          element={
            <Navigate
              to="users"
              replace
            />
          }
          path="*"
        />
      </Routes>

      {!!updates.length && (
        <>
          <div className={styles.actionWrapperPlace} />
          <div className={styles.actionWrapper}>
            <Button
              text="Show changes and save"
              onClick={() => setShowDiffModal(true)}
            />

            <Button
              buttonType="ghost"
              text="Discard changes"
              onClick={onResetChanges}
            />

            {!!removedFlags.length && (
              <span className={styles.removedWrapper}>
                Removed flag{removedFlags.length === 1 ? '' : 's'}:{' '}
                {removedFlags.join(', ')}
              </span>
            )}
          </div>
        </>
      )}

      <DiffModal
        flagConfig={flagConfig}
        open={showDiffModal}
        onClose={() => setShowDiffModal(false)}
        onSaveChanges={onSaveChanges}
      />
    </ModulePage>
  );
}
