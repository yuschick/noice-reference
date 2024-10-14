import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Gutter } from '../Gutter';
import { VStack } from '../Stack/VStack';
import { Typography } from '../Typography';

import { StreamCategoryButton } from './StreamCategoryButton';

import { LoadingView } from '@components/LoadingView';
import { borderRadius, colors } from '@constants/styles';
import { useStreamCategoriesQuery } from '@gen/graphql';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';

gql`
  query StreamCategories {
    listGames {
      games {
        id
        name
      }
    }
  }
`;

type StreamCategory = {
  id: string;
  name: string;
};

const categoryColors = [
  colors.chatYellow,
  colors.chatYellowGreen,
  colors.chatGreen,
  colors.chatGreenBlue,
  colors.chatBlue,
  colors.chatBlueViolet,
  colors.chatViolet,
  colors.chatPink,
];

export const StreamCategoriesRow = () => {
  const { data, loading } = useStreamCategoriesQuery();
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();

  const streamCategories = data?.listGames?.games ?? [];

  const onPress = useCallback(
    (id?: string) => {
      navigation.navigate('browse', { gameId: id });
    },
    [navigation],
  );

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);
  const renderItem = useCallback(
    ({ item, index }: { item: StreamCategory; index: number }) => (
      <>
        {index === 0 && <Gutter width={8} />}
        <Animated.View entering={FadeIn.delay(100 * index)}>
          <StreamCategoryButton
            colorHighlight={categoryColors[index % categoryColors.length]}
            label={item.name}
            subtitle="Creators"
            onPress={() => onPress(item.id)}
          />
        </Animated.View>
      </>
    ),
    [onPress],
  );

  const separatorComponent = () => <Gutter width={8} />;

  return (
    <VStack>
      <Animated.View entering={FadeIn}>
        <Typography
          fontSize="md"
          fontWeight="bold"
          uppercase
        >
          Categories
        </Typography>
      </Animated.View>
      <Gutter height={16} />
      {loading ? (
        <Animated.View exiting={FadeOut}>
          <LoadingView style={s.loading} />
        </Animated.View>
      ) : (
        <FlatList
          ItemSeparatorComponent={separatorComponent}
          ListHeaderComponent={
            <Animated.View entering={FadeIn}>
              <StreamCategoryButton
                label="Browse All"
                centerText
                onPress={onPress}
              />
            </Animated.View>
          }
          data={streamCategories}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          style={s.list}
          horizontal
        />
      )}
    </VStack>
  );
};

const s = StyleSheet.create({
  list: {
    overflow: 'visible',
  },
  loading: { width: '100%', height: 50, borderRadius: borderRadius.radiusXs },
});
