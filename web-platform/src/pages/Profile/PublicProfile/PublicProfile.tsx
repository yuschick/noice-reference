import { gql } from '@apollo/client';
import { useAuthenticatedUser } from '@noice-com/common-ui';

import { ProfilePageHeader } from '../ProfilePageHeader';
import { ProfilePageLayout } from '../ProfilePageLayout';

import { ProfileCards } from './ProfileCards/ProfileCards';
import { ProfileFriends } from './ProfileFriends/ProfileFriends';
import { ProfileGamesList } from './ProfileGamesList/ProfileGamesList';
import { ProfileStats } from './ProfileStats/ProfileStats';

import { PublicProfilePageQuery, usePublicProfilePageQuery } from '@gen';
import { NotFound } from '@pages/NotFound';

gql`
  query PublicProfilePage($userId: ID!) {
    profile(userId: $userId) {
      userId
      ...ProfilePageHeaderProfile
      ...ProfilePageLayoutProfile
      ...ProfileStats

      playedGames {
        userId
        id
        game {
          id
          ...ProfileGamesListItem
        }
      }
    }

    listGameCards(userId: $userId) {
      cards {
        id
        ...ProfileCardsCard
      }
    }

    friends(userId: $userId) {
      users {
        userId
        profile {
          userId
          ...ProfileFriendsProfile
        }
      }
    }
  }
`;

const getBestCards = (data?: PublicProfilePageQuery) => {
  const cards = data?.listGameCards?.cards.slice();

  cards
    ?.sort((a, z) => z.pointsMax - a.pointsMax)
    .sort((a, z) => z.leveling.currentLevel - a.leveling.currentLevel);

  return cards?.slice(0, 5) ?? [];
};

interface Props {
  profileUserId: string;
}

export function PublicProfile({ profileUserId }: Props) {
  const { data, loading } = usePublicProfilePageQuery({
    variables: { userId: profileUserId },
    // players would always like to see up-to-date data when they go to Profile page
    fetchPolicy: 'network-only',
  });
  const { userId } = useAuthenticatedUser();

  const profile = data?.profile;
  const games = profile?.playedGames.map(({ game }) => game) ?? [];
  const cards = getBestCards(data);
  const friends = data?.friends?.users.map((user) => user.profile) ?? [];
  const isOwnProfile = profileUserId === userId;

  if (loading) {
    return (
      <ProfilePageLayout>
        <ProfilePageHeader.Loading />

        <ProfileFriends.Loading />

        <ProfileStats.Loading />

        <ProfileGamesList.Loading />

        <ProfileCards.Loading />
      </ProfilePageLayout>
    );
  }

  if (!profile) {
    return <NotFound />;
  }

  return (
    <ProfilePageLayout profile={profile}>
      <ProfilePageHeader profile={profile} />

      <ProfileFriends
        friends={friends}
        isOwnProfile={isOwnProfile}
      />

      <ProfileStats profile={profile} />

      <ProfileGamesList
        games={games}
        isOwnProfile={isOwnProfile}
      />

      <ProfileCards
        cards={cards}
        isOwnProfile={isOwnProfile}
      />
    </ProfilePageLayout>
  );
}
