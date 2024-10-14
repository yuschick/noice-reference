import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { MatchEndedMsg } from '@noice-com/schemas/game-logic/game_logic.pb';

import { getBestPlayCardIdsFromMatchEnd, getPlayerIdsFromMatchEnd } from '../../utils';

import styles from './BestPlays.module.css';

import { GameCard } from '@game-card';
import {
  useMatchResultsDialogBestPlayGameCardsQuery,
  useMatchResultsDialogBestPlayProfilesQuery,
} from '@game-gen';

gql`
  query MatchResultsDialogBestPlayGameCards($cardIds: [String!]) {
    gameCards(cardIds: $cardIds) {
      cards {
        ...GameCard
      }
    }
  }

  query MatchResultsDialogBestPlayProfiles($userIds: [String!]) {
    profileBatch(userIds: $userIds) {
      profiles {
        userId
        ...ProfileImageProfile
      }
    }
  }

  ${GameCard.fragments.card}
  ${ProfileImage.fragments.entry}
`;

interface Props {
  matchEndMessage: MatchEndedMsg;
}

export function BestPlays({ matchEndMessage }: Props) {
  const bestPlayCardIds = getBestPlayCardIdsFromMatchEnd(matchEndMessage);

  const { data: cardsData } = useMatchResultsDialogBestPlayGameCardsQuery({
    variables: { cardIds: bestPlayCardIds },
    skip: !bestPlayCardIds.length,
  });

  const userIds = getPlayerIdsFromMatchEnd(matchEndMessage);

  const { data: profilesData } = useMatchResultsDialogBestPlayProfilesQuery({
    variables: { userIds },
    skip: !userIds.length,
  });

  const players = matchEndMessage.players ?? [];

  return (
    <div className={styles.matchEndResultsDialogBestPlaysContainer}>
      <span className={styles.bestPlaysText}>{`Best play${
        players.length > 1 ? 's' : ''
      }`}</span>
      <div className={styles.cardsAndPlayersContainer}>
        {players.map((player, index) => {
          const card = cardsData?.gameCards?.cards.find(
            (card) => card.id === player.bestPlay?.cardId,
          );
          const profile = profilesData?.profileBatch?.profiles.find(
            (profile) => profile.userId === player.userId,
          );

          if (!profile) {
            return null;
          }

          return (
            <div
              className={styles.cardAndPlayerContainer}
              key={`${player.userId}_${index}`}
            >
              {card ? (
                <GameCard card={card} />
              ) : (
                <div className={styles.emptyCard}>
                  <span className={styles.empyCardText}>no best play</span>
                </div>
              )}
              <div className={styles.profileImageContainer}>
                <ProfileImage
                  profile={profile}
                  size="md"
                />
                <span className={styles.bestPlayPlayerNameText}>{profile.userTag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
