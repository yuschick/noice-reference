import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { useEffect } from 'react';

import { useWidgetMenu } from '../context';
import { WidgetId, LiveChannelWidgetProps } from '../types';

import styles from './AudienceInsights.module.css';
import { AudienceInsightsFilters } from './AudienceInsightsFilters';
import { AudienceInsightsSettings } from './AudienceInsightsSettings';
import { EmptyState } from './EmptyState';
import { InsightsItem } from './InsightsItem';
import { NoActiveFilters } from './NoActiveFilters';
import { InsightItem, InsightsGroup, InsightsGroups } from './types';

import { useListenStudioLocalStorageValue } from '@common/local-storage';
import { useAudienceInsightsDataQuery } from '@gen';

gql`
  query AudienceInsightsData($streamId: ID) {
    streamAudienceInsights(streamId: $streamId) {
      viewers
      followers
      subscribers
      chatters
      players
    }
  }
`;

const defaultVisibleGroups: InsightsGroup[] = [
  InsightsGroups.VisitorsFollowers,
  InsightsGroups.NonSubsSubs,
  InsightsGroups.WatchersPlayers,
  InsightsGroups.LurkersChatters,
];

export function AudienceInsights({ streamId }: LiveChannelWidgetProps) {
  const [visibleGroups = defaultVisibleGroups, setVisibleGroups] =
    useListenStudioLocalStorageValue('audienceInsights.filters');
  const { setFilters, setSettings } = useWidgetMenu();
  const { data, loading } = useAudienceInsightsDataQuery({
    ...variablesOrSkip({ streamId }),
    pollInterval: 1000 * 15,
  });

  const insights: Record<InsightsGroup, [InsightItem, InsightItem]> = {
    [InsightsGroups.VisitorsFollowers]: [
      {
        label: 'Visitors',
        value: Math.max(
          (data?.streamAudienceInsights?.viewers ?? 0) -
            (data?.streamAudienceInsights?.followers ?? 0),
          0,
        ),
      },
      { label: 'Followers', value: data?.streamAudienceInsights?.followers ?? 0 },
    ],
    [InsightsGroups.NonSubsSubs]: [
      {
        label: 'Non-Subs',
        value: Math.max(
          (data?.streamAudienceInsights?.viewers ?? 0) -
            (data?.streamAudienceInsights?.subscribers ?? 0),
          0,
        ),
      },
      { label: 'Subscribers', value: data?.streamAudienceInsights?.subscribers ?? 0 },
    ],
    [InsightsGroups.WatchersPlayers]: [
      {
        label: 'Watchers',
        value: Math.max(
          (data?.streamAudienceInsights?.viewers ?? 0) -
            (data?.streamAudienceInsights?.players ?? 0),
          0,
        ),
      },
      { label: 'Players', value: data?.streamAudienceInsights?.players ?? 0 },
    ],
    [InsightsGroups.LurkersChatters]: [
      {
        label: 'Lurkers',
        value: Math.max(
          (data?.streamAudienceInsights?.viewers ?? 0) -
            (data?.streamAudienceInsights?.chatters ?? 0),
          0,
        ),
      },
      { label: 'Chatters', value: data?.streamAudienceInsights?.chatters ?? 0 },
    ],
  };

  useEffect(() => {
    const filters = (
      <AudienceInsightsFilters
        key={`${WidgetId.AudienceInsights}-${streamId}-filters`}
        setVisibleGroups={setVisibleGroups}
        streamId={streamId}
        visibleGroups={visibleGroups}
      />
    );
    const settings = (
      <AudienceInsightsSettings
        key={`${WidgetId.AudienceInsights}-${streamId}-settings`}
      />
    );

    setFilters(filters);
    setSettings(settings);
  }, [setFilters, setSettings, setVisibleGroups, streamId, visibleGroups]);

  if (!data) {
    return <EmptyState />;
  }

  const visibleInsights = Object.keys(insights)
    .filter((group) => visibleGroups.includes(group as InsightsGroup))
    .map((group) => insights[group as InsightsGroup]);

  if (!visibleInsights.length) {
    return <NoActiveFilters />;
  }

  return (
    <div className={styles.audienceInsightsWrapper}>
      {!loading && data?.streamAudienceInsights && (
        <>
          {Object.values(visibleInsights).map((insight) => {
            return (
              <InsightsItem
                items={insight}
                key={insight[0].label}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
