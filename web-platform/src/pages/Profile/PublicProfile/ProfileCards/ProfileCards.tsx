import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { GameCard } from '@noice-com/card-game';
import { Icon } from '@noice-com/common-ui';
import classNames from 'classnames';
import { useState } from 'react';

import styles from './ProfileCards.module.css';

import { ProfileCardsCardFragment } from '@gen';

interface Props {
  cards: ProfileCardsCardFragment[];
  isOwnProfile: boolean;
}

export function ProfileCards({ cards, isOwnProfile }: Props) {
  const [expandedCard, setExpandedCard] = useState(-1);

  return (
    <div className={styles.profileSectionWrapper}>
      <h3 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Card}
        />
        <span>Card Showcase</span>
      </h3>

      {cards.length ? (
        <ul className={styles.list}>
          {cards.map((card, index) => (
            <li
              className={classNames(styles.listItem, {
                [styles.expanded]: index === expandedCard,
              })}
              key={card.id}
              onMouseEnter={() => setExpandedCard(index)}
              onMouseLeave={() => setExpandedCard(-1)}
            >
              <div
                className={classNames(styles.cardWrapper, {
                  [styles.expanded]: index === expandedCard,
                })}
              >
                <GameCard card={card} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <span>
            {isOwnProfile
              ? 'Join a game to earn your first cards.'
              : 'This player has not earned any cards yet.'}
          </span>
        </div>
      )}
    </div>
  );
}

ProfileCards.Loading = () => {
  return (
    <div>
      <h2 className={styles.titleWrapper}>
        <Icon
          className={styles.icon}
          icon={CoreAssets.Icons.Card}
        />
        <span>Card Showcase</span>
      </h2>

      <ul className={styles.list}>
        {Array(5)
          .fill({ size: 'small' })
          .map((_, index) => (
            <li
              className={styles.listItem}
              key={`showcase-card-${index}`}
            >
              <div className={styles.cardWrapper}>
                <GameCard.Loading />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

ProfileCards.fragments = {
  entry: gql`
    fragment ProfileCardsCard on GameLogicCard {
      ...GameCard
    }
  `,
};
