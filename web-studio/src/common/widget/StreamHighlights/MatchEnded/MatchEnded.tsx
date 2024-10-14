import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { WithChildren } from '@noice-com/common-ui';

import { SpotlightHeader } from '../Header/SpotlightHeader';
import { SpotlightContainer } from '../SpotlightContainer/SpotlightContainer';

import styles from './MatchEnded.module.css';

import { MatchStatusEndEventFragment } from '@gen';

type Props = MatchStatusEndEventFragment;

interface MatchResultProps extends WithChildren {
  title: string;
  playerName: string;
  groupName?: string;
  score: number;
  className?: string;
}

function MatchResult({
  title,
  groupName,
  score,
  playerName,
  children,
  className,
}: MatchResultProps) {
  return (
    <div className={className}>
      <header className={styles.title}>{title}</header>
      <div className={styles.container}>
        <div className={styles.body}>
          <div>
            {!!groupName && <div className={styles.group}>{groupName}</div>}
            <div className={styles.name}>{playerName}</div>
            <div className={styles.points}>{score}</div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export function MatchEnded({ bestGroup, bestPlayer, bestCard }: Props) {
  return (
    <SpotlightContainer scrollable>
      <SpotlightHeader label="Match results" />
      <div className={styles.wrapper}>
        {bestGroup && (
          <MatchResult
            className={styles.bestGroup}
            playerName={bestGroup.group.name}
            score={bestGroup.group.points}
            title="Best team"
          />
        )}
        {bestPlayer && (
          <MatchResult
            className={styles.bestPlayer}
            groupName={bestPlayer.groupName}
            playerName={bestPlayer.user.userTag}
            score={bestPlayer.points}
            title="Best player"
          />
        )}
        {bestCard && (
          <MatchResult
            className={styles.bestCard}
            groupName={bestCard.groupName}
            playerName={bestCard.succeedingCard.user.userTag}
            score={bestCard.succeedingCard.points}
            title="Best play"
          >
            <div className={styles.card}>
              <GameCard
                card={{
                  ...bestCard.succeedingCard.card,
                  pointsMin: bestCard.succeedingCard.points,
                }}
              />
            </div>
          </MatchResult>
        )}
      </div>
    </SpotlightContainer>
  );
}

MatchEnded.fragments = {
  entry: gql`
    fragment MatchStatusEndEvent on GameLogicMatchEndedMsg {
      streamId
      bestCard {
        succeedingCard {
          user {
            userId
            userTag
            avatars {
              avatar2D
            }
          }
          points
          card {
            id
            ...GameCard
          }
        }
        groupName
      }
      bestGroup {
        players {
          id
          groupName
          user {
            userId
            userTag
            avatars {
              avatar2D
            }
          }
        }
        group {
          id
          name
          points
        }
      }
      bestPlayer {
        id
        points
        groupName
        user {
          userId
          userTag
          avatars {
            avatar2D
          }
        }
      }
    }
  `,
};
