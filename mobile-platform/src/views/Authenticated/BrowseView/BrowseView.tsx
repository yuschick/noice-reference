import { gql } from '@apollo/client';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { BrowseFilter } from './BrowseFilter';

import { ChannelList } from '@components/ChannelList/ChannelList';
import { Gutter } from '@components/Gutter';
import { Header, useHeaderValues } from '@components/List/Header';
import { LargeHeaderGutter } from '@components/PageHeaders/LargeHeader';
import { PageLayout } from '@components/PageLayout';
import { useGamesFilterQuery } from '@gen/graphql';
import { AuthenticatedScreenProps } from '@navigators/routes';

gql`
  query GamesFilter {
    listGames {
      games {
        ...GamesFilterGame
      }
    }
  }
  fragment GamesFilterGame on GameGame {
    id
    name
  }
`;

export const BrowseView = ({
  navigation,
  route: { params },
}: AuthenticatedScreenProps<'browse'>) => {
  const initialGameId = params?.gameId;
  const { data } = useGamesFilterQuery();
  const [gameId, setGameId] = useState<string | undefined>(initialGameId);
  const { scrollY, scrollHandler } = useHeaderValues();

  const listHeader = useMemo(() => {
    return (
      <>
        <LargeHeaderGutter />
        <BrowseFilter
          gameId={gameId}
          games={data?.listGames?.games}
          setGameId={setGameId}
        />
        <Gutter height={24} />
      </>
    );
  }, [data, gameId]);

  return (
    <PageLayout.Simple>
      <ChannelList
        ListFooterComponent={<Gutter height={80} />}
        ListHeaderComponent={listHeader}
        contentContainerStyle={s.container}
        gameId={gameId}
        scrollY={scrollY}
        style={s.innerContainer}
        onScroll={scrollHandler}
      />
      <Header
        goBack={navigation.goBack}
        scrollY={scrollY}
        title="Browse"
      />
    </PageLayout.Simple>
  );
};

const s = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
});
