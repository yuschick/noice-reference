import { Leaderboard, Props as LeaderboardProps } from './Leaderboard';

import { useLeaderboardGroupsV2 } from '@game-common/leaderboard/hooks';

export type Props = Omit<
  LeaderboardProps,
  'topGroups' | 'totalGroupCount' | 'ownGroupWithNeighbours'
>;

export function LeaderboardWrapper(props: Props) {
  const { topGroups, totalGroupCount, ownGroupWithNeighbours } = useLeaderboardGroupsV2();

  return (
    <Leaderboard
      {...props}
      ownGroupWithNeighbours={ownGroupWithNeighbours}
      topGroups={topGroups}
      totalGroupCount={totalGroupCount}
    />
  );
}
