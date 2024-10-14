import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { NoiceLogo, Icon } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './GameCardTypeBadge.module.css';

import {
  GameCardTypeBadgeCardFragment,
  GameCardTypeBadgeStreamerCardFragment,
} from '@game-gen';

interface Props {
  className?: string;
  card: GameCardTypeBadgeCardFragment;
  streamerCard: Nullable<GameCardTypeBadgeStreamerCardFragment>;
}

export function GameCardTypeBadge({ className, card, streamerCard }: Props) {
  const { isAllOrNothing, isMatchCard } = card;
  const { channel } = streamerCard ?? {};

  const channelLogo = channel?.logo;

  return (
    <div className={classNames(styles.gameCardTypeBadgeWrapper, className)}>
      {channelLogo ? (
        <div
          className={styles.gameCardTypeBadgeStreamerCard}
          style={
            {
              '--game-card-type-badge-streamer-card-image': `url(${channelLogo})`,
            } as CSSProperties
          }
        />
      ) : isMatchCard ? (
        <div className={styles.cardTypeIconWrapper}>
          <Icon
            className={styles.gameCardTypeBadgeIcon}
            icon={CoreAssets.Icons.Trophy}
          />
        </div>
      ) : isAllOrNothing ? (
        <div className={styles.cardTypeIconWrapper}>
          <Icon
            className={styles.gameCardTypeBadgeIcon}
            icon={CoreAssets.Icons.StackedArrows}
          />
        </div>
      ) : (
        <NoiceLogo
          className={styles.gameCardTypeBadgeLogo}
          theme="light-flat"
          variant="mark"
        />
      )}
    </div>
  );
}

GameCardTypeBadge.fragments = {
  streamerCard: gql`
    fragment GameCardTypeBadgeStreamerCard on GameLogicStreamerCard {
      id
      channel {
        id
        logo
      }
    }
  `,
  card: gql`
    fragment GameCardTypeBadgeCard on GameLogicCard {
      isAllOrNothing
      isMatchCard
    }
  `,
};
