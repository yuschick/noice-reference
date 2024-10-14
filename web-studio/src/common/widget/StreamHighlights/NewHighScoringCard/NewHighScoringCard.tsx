import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { rarityBackgroundName } from '@noice-com/card-game';
import { Icon, Image } from '@noice-com/common-ui';
import { MiniProfilePortal } from '@noice-com/social';
import classNames from 'classnames';
import { CSSProperties, useRef, useState } from 'react';

import { EventListItem } from '../EventListItem/EventListItem';
import { StreamHighlightEventType } from '../types';

import { HighScoringCardWithVFX } from './HighScoringCardWithVFX';
import styles from './NewHighScoringCard.module.css';

import { useChannelContext } from '@common/channel';
import { showToastOnMiniProfileModerationAction } from '@common/profile';
import { HighScoringCardEventFragment } from '@gen';

export type Props = HighScoringCardEventFragment & { timestamp: Date };

export function NewHighScoringCard({ card, groupName, user }: Props) {
  const { channelId } = useChannelContext();
  const [showUserCard, setShowUserCard] = useState(false);
  const userCardButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section
      className={classNames(styles.expandedEventContainer, {
        [styles.streamerCard]: card.card.activeStreamerCard,
      })}
      style={
        {
          '--event-color': `var(--_rarity-${rarityBackgroundName[card.card.rarity]})`,
        } as CSSProperties
      }
    >
      <Icon
        className={styles.eventIcon}
        icon={CoreAssets.Icons.BxCardsFilled}
      />
      <div className={styles.eventDetailsWrapper}>
        <h3 className={styles.eventHeading}>
          {card.card.__typename === 'GameLogicCard'
            ? 'High Scoring Card'
            : 'High Scoring Streamer Card'}
        </h3>

        <button
          className={styles.eventUsername}
          ref={userCardButtonRef}
          type="button"
          onClick={() => setShowUserCard(true)}
        >
          {user.userTag}
        </button>

        <span className={styles.eventPoints}>{card.points}</span>
        <Image
          alt={`${user.userTag}'s avatar`}
          className={styles.eventUserAvatar}
          height="auto"
          src={user.avatars?.avatar2D}
          width={128}
        />
      </div>

      <HighScoringCardWithVFX
        card={card}
        className={styles.eventVfxCard}
        groupName={groupName}
        user={user}
      />

      <MiniProfilePortal
        anchor={userCardButtonRef}
        channelId={channelId}
        showMiniProfile={showUserCard}
        userId={user.userId}
        onClose={() => setShowUserCard(false)}
        onModerationAction={showToastOnMiniProfileModerationAction}
      />
    </section>
  );
}

NewHighScoringCard.ListView = ({ user, card, timestamp }: Props) => {
  return card.card.__typename === 'GameLogicCard' ? (
    <EventListItem
      event={{
        type: StreamHighlightEventType.HighScroringCard,
        details: `${card.points} points`,
      }}
      timestamp={timestamp}
      user={user}
    />
  ) : (
    <EventListItem
      event={{
        type: StreamHighlightEventType.HighScoringCreatorCard,
        details: `${card.points} points`,
      }}
      timestamp={timestamp}
      user={user}
    />
  );
};

NewHighScoringCard.fragments = {
  entry: gql`
    fragment HighScoringCardEvent on GameLogicHighScoringCardPromotedMsg {
      user {
        userId
        userTag
        avatars {
          avatar2D
        }
        ...UserHighlightProfile
        ...EventListItemProfile
      }
      groupName
      card {
        points
        card {
          id
          ...GameCard
        }
      }
    }
  `,
};
