import { gql } from '@apollo/client';
import { ProfileImage } from '@noice-com/common-ui';

import { Divider } from '../Divider/Divider';
import { FooterText } from '../FooterText/FooterText';
import { SegmentWrapper } from '../SegmentWrapper/SegmentWrapper';
import { Texts } from '../Texts/Texts';

import { SpotlightBestPlayerProfileFragment } from '@stream-gen';

interface Props {
  duration: number;
  points: number;
  groupName?: string;
  profile: SpotlightBestPlayerProfileFragment;
}

export function BestPlayer({ profile, points, groupName, duration }: Props) {
  return (
    <SegmentWrapper duration={duration}>
      <ProfileImage
        profile={profile}
        size="lg"
      />
      <Texts
        name={profile.userTag ?? 'unknown'}
        score={points}
        title="Best Player"
      />
      {!!groupName && (
        <>
          <Divider />
          <FooterText groupName={groupName} />
        </>
      )}
    </SegmentWrapper>
  );
}

BestPlayer.fragments = {
  entry: gql`
    fragment SpotlightBestPlayerProfile on ProfileProfile {
      userId
      userTag
      avatars {
        avatar2D
      }
      ...ProfileImageProfile
    }
  `,
};
