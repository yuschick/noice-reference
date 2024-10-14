export type InsightItem = {
  label: string;
  value: number;
};

export enum InsightsGroups {
  VisitorsFollowers = 'VisitorsFollowers',
  NonSubsSubs = 'NonSubsSubs',
  WatchersPlayers = 'WatchersPlayers',
  LurkersChatters = 'LurkersChatters',
}
export type InsightsGroup = keyof typeof InsightsGroups;

export type CountDisplayType = 'absolute' | 'percentage';
