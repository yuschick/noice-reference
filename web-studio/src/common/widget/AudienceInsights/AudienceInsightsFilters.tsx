import { Checkbox, useAnalytics } from '@noice-com/common-ui';
import {
  AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup,
  AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterState,
} from '@noice-com/schemas/analytics/analytics.pb';

import { WidgetFilters } from '../WidgetFilters';

import styles from './AudienceInsights.module.css';
import { InsightsGroup, InsightsGroups } from './types';

interface Props {
  streamId: string;
  visibleGroups: InsightsGroup[];
  setVisibleGroups: (groups: InsightsGroup[]) => void;
}

const groupToAnalyticsMap = {
  [InsightsGroups.VisitorsFollowers]:
    AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup.AUDIENCE_INSIGHTS_FILTER_GROUP_VISITORS_FOLLOWERS,
  [InsightsGroups.NonSubsSubs]:
    AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup.AUDIENCE_INSIGHTS_FILTER_GROUP_NON_SUBS_SUBSRIBERS,
  [InsightsGroups.WatchersPlayers]:
    AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup.AUDIENCE_INSIGHTS_FILTER_GROUP_WATCHERS_PLAYERS,
  [InsightsGroups.LurkersChatters]:
    AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterGroup.AUDIENCE_INSIGHTS_FILTER_GROUP_LURKERS_CHATTERS,
};

export function AudienceInsightsFilters({
  setVisibleGroups,
  streamId,
  visibleGroups,
}: Props) {
  const { trackEvent } = useAnalytics();

  const handleToggleGroup = (group: InsightsGroup) => {
    const analyticsGroup = groupToAnalyticsMap[group];

    const updatedGroups = visibleGroups.includes(group)
      ? visibleGroups.filter((g) => g !== group)
      : [...visibleGroups, group];

    trackEvent({
      clientStudioWidgetAudienceInsightsFilter: {
        group: analyticsGroup,
        streamId,
        option: visibleGroups.includes(group)
          ? AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterState.AUDIENCE_INSIGHTS_FILTER_STATE_OFF
          : AnalyticsEventStudioAudienceInsightsFiltersAudienceInsightsFilterState.AUDIENCE_INSIGHTS_FILTER_STATE_ON,
      },
    });

    setVisibleGroups(updatedGroups);
  };

  return (
    <WidgetFilters>
      <div className={styles.menuWrapper}>
        <div className={styles.settingsTitle}>Audience Insights Filters</div>

        <div className={styles.groupWrapper}>
          <div className={styles.settingsSecondaryValue}>Groups</div>

          <section className={styles.group}>
            <Checkbox
              checked={visibleGroups.includes(InsightsGroups.VisitorsFollowers)}
              label="Visitors & Followers"
              name="groups"
              value={InsightsGroups.VisitorsFollowers}
              onChange={() => handleToggleGroup(InsightsGroups.VisitorsFollowers)}
            />
            <Checkbox
              checked={visibleGroups.includes(InsightsGroups.NonSubsSubs)}
              label="Non-Subs & Subscribers"
              name="groups"
              value={InsightsGroups.NonSubsSubs}
              onChange={() => handleToggleGroup(InsightsGroups.NonSubsSubs)}
            />
            <Checkbox
              checked={visibleGroups.includes(InsightsGroups.WatchersPlayers)}
              label="Watchers & Players"
              name="groups"
              value={InsightsGroups.WatchersPlayers}
              onChange={() => handleToggleGroup(InsightsGroups.WatchersPlayers)}
            />
            <Checkbox
              checked={visibleGroups.includes(InsightsGroups.LurkersChatters)}
              label="Lurkers & Chatters"
              name="groups"
              value={InsightsGroups.LurkersChatters}
              onChange={() => handleToggleGroup(InsightsGroups.LurkersChatters)}
            />
          </section>
        </div>
      </div>
    </WidgetFilters>
  );
}
