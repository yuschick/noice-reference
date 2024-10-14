import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';
import { ContentModeGroupSpotlightPlayer } from '@noice-com/schemas/rendering/transitions.pb';

import { Divider } from '../Divider/Divider';
import { SegmentWrapper } from '../SegmentWrapper/SegmentWrapper';
import { Texts } from '../Texts/Texts';

import styles from './BestGroup.module.css';

import { SpotlightBestGroupProfileFragment } from '@stream-gen';

interface Props {
  duration: number;

  players: ContentModeGroupSpotlightPlayer[];
  groupPoints: number;
  groupName: string;
  profiles: SpotlightBestGroupProfileFragment[];
}

export function BestGroup({
  players,
  groupPoints,
  groupName,
  profiles,
  duration,
}: Props) {
  return (
    <SegmentWrapper duration={duration}>
      <Texts
        name={groupName}
        nameClassName={styles.groupName}
        score={groupPoints}
        title="Best Team"
      />
      <Divider />
      <div className={styles.groupMembersContainer}>
        {profiles.map((profile, index) => {
          const points =
            players.find((player) => player.userId === profile.userId)?.points ?? 0;

          return (
            <div
              className={styles.playerContainer}
              key={`bestGroupPlayer_${index}`}
            >
              <div className={styles.avatarWrapper}>
                <ProfileImage profile={profile} />
              </div>
              <span className={styles.playerNameText}>{profile.userTag}</span>
              <span className={styles.playerScoreText}>{points}</span>
            </div>
          );
        })}
      </div>
    </SegmentWrapper>
  );
}

BestGroup.fragments = {
  entry: gql`
    fragment SpotlightBestGroupProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
