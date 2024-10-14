import { gql } from '@apollo/client';
import {
  LoadingSkeleton,
  Tabs,
  useAuthenticatedUser,
  useTabs,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';

import { getCollectionUrl } from '../utils';

import { useCollectionGameSelectorProfileQuery } from '@gen';

gql`
  query CollectionGameSelectorProfile($userId: ID) {
    profile(userId: $userId) {
      userId
      playedGames {
        userId
        id
        game {
          id
          name
        }
      }
    }
  }
`;

interface Props {
  gameId: Nullable<string>;
}

export function GameSelector({ gameId }: Props) {
  const store = useTabs({ variant: 'page' });
  const { userId } = useAuthenticatedUser();

  const { data: profileData, loading: loadingProfileData } =
    useCollectionGameSelectorProfileQuery({
      variables: { userId },
      skip: !gameId,
      fetchPolicy: 'cache-and-network',
      onCompleted(data) {
        const index =
          data.profile?.playedGames.findIndex((game) => game.game.id === gameId) ?? 0;
        store.actions.setSelectedTabIndex(index);
      },
    });

  if (loadingProfileData) {
    return (
      <LoadingSkeleton
        height={49}
        width={200}
      />
    );
  }

  return (
    <Tabs
      store={store}
      title="Collection games"
    >
      <Tabs.List>
        {profileData?.profile?.playedGames.map((game) => {
          const url = getCollectionUrl({
            gameId: game.game.id,
          });

          if (!url) {
            return null;
          }

          return (
            <Tabs.TabLink
              aria-selected={gameId === game.game.id ? 'true' : 'false'}
              key={`${game.game.id}-creators`}
              to={url}
            >
              {game.game.name} creators
            </Tabs.TabLink>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
}
