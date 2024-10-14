import { gql } from '@apollo/client';
import { makeLoggers } from '@noice-com/utils';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { RankProgressionBar } from '@components/Games/RankProgression';
import { SeasonRankBadge } from '@components/Games/SeasonRankBadge';
import { Gutter } from '@components/Gutter';
import { HStack } from '@components/Stack/HStack';
import { VStack } from '@components/Stack/VStack';
import { Typography } from '@components/Typography';
import { ProfileGamesListFragment } from '@gen/graphql';

interface Props {
  playedGames: ProfileGamesListFragment['playedGames'];
}

const { logInfo } = makeLoggers('Profile games list');

export const ProfileGamesList = ({ playedGames }: Props) => {
  const onPress = () => {
    // @todo redirect when we have the correct views
    logInfo('Not implemented');
  };

  return (
    <>
      {playedGames.map(({ game }) => {
        // In max level case the nextLevelThreshold is 100 so don't show progress bar
        const maxLevelReached = game.activeSeason.progression.nextLevelThreshold > 0;

        return (
          <TouchableOpacity
            key={game.id}
            style={s.button}
            disabled
            onPress={onPress}
          >
            <HStack alignItems="center">
              <SeasonRankBadge rank={game.activeSeason.progression.level} />
              <Gutter width={16} />
              <VStack style={s.flex}>
                <Typography
                  fontSize="lg"
                  fontWeight="medium"
                >
                  {game.name} creators
                </Typography>
                <Gutter height={8} />
                {maxLevelReached && (
                  <RankProgressionBar
                    max={game.activeSeason.progression.nextLevelThreshold}
                    progress={game.activeSeason.progression.xpAmount}
                  />
                )}
              </VStack>
            </HStack>
          </TouchableOpacity>
        );
      })}
    </>
  );
};

ProfileGamesList.fragment = gql`
  fragment ProfileGamesList on ProfileProfile {
    playedGames {
      userId
      id
      game {
        id
        name
        activeSeason {
          id
          progression {
            seasonId
            xpAmount
            level
            nextLevelThreshold
          }
        }
      }
    }
  }
`;

const s = StyleSheet.create({
  flex: {
    flex: 1,
  },
  button: { padding: 16 },
});
