import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';

import { Divider } from '../Divider/Divider';
import { FooterText } from '../FooterText/FooterText';
import { SegmentWrapper } from '../SegmentWrapper/SegmentWrapper';
import { Texts } from '../Texts/Texts';

import styles from './BestPlay.module.css';

import {
  SpotlightBestPlayCardFragment,
  SpotlightBestPlayProfileFragment,
} from '@stream-gen';

interface Props {
  duration: number;
  card: SpotlightBestPlayCardFragment;
  cardPoints: number;
  profile: SpotlightBestPlayProfileFragment;
  groupName?: string;
}

export function BestPlay({ card, cardPoints, profile, groupName, duration }: Props) {
  return (
    <SegmentWrapper duration={duration}>
      <div className={styles.bestplayRow}>
        <div className={styles.smallCard}>
          <GameCard card={{ ...card, pointsMin: cardPoints }} />
        </div>
        <div className={styles.largeCard}>
          <GameCard card={{ ...card, pointsMin: cardPoints }} />
        </div>
        <Texts
          name={profile.userTag}
          score={cardPoints}
          title="Best Play"
          alignLeft
        />
      </div>

      {!!groupName && (
        <>
          <Divider />
          <FooterText groupName={groupName} />
        </>
      )}
    </SegmentWrapper>
  );
}

BestPlay.fragments = {
  entry: gql`
    fragment SpotlightBestPlayCard on GameLogicCard {
      ...GameCard
    }

    fragment SpotlightBestPlayProfile on ProfileProfile {
      userId
      userTag
    }
  `,
};
