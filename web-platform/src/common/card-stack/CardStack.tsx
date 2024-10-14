import { gql } from '@apollo/client';
import { GameCard, GameCardProps } from '@noice-com/card-game';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { CSSProperties } from 'react';

import styles from './CardStack.module.css';

import CardBackShadowImage from '@assets/images/card-shadow.webp';
import { CardLevelUpVfx } from '@common/sellable-item/StoreItemPage/StoreItemSuccessCardItem/CardLevelUpVfx/CardLevelUpVfx';
import { CardStackCardFragment } from '@gen';

gql`
  fragment CardStackCard on GameLogicCard {
    id
    ...GameCard
    activeStreamerCards {
      ...GameStreamerCard
    }
  }
`;

const MAX_SHOWN_STREAMER_CARDS = 2;

interface Props {
  card: CardStackCardFragment;
  showStreamerCardOnTop?: boolean;
  showLevelUpVfx?: boolean;
  isLocked?: boolean;
  forceOnHoverToLeft?: boolean;
  streamerVideoAction?: GameCardProps['streamerVideoAction'];
  onClick?: (cardId: string, channelId: Nullable<string>) => void;
}

export function CardStack({
  card,
  showStreamerCardOnTop,
  showLevelUpVfx,
  isLocked,
  forceOnHoverToLeft,
  streamerVideoAction = 'expand',
  onClick,
}: Props) {
  const streamerCards =
    card.activeStreamerCards.length <= MAX_SHOWN_STREAMER_CARDS
      ? card.activeStreamerCards
      : card.activeStreamerCards.slice(0, MAX_SHOWN_STREAMER_CARDS);

  const frontCard =
    showStreamerCardOnTop && card.activeStreamerCards.length > 0
      ? {
          ...card,
          activeStreamerCard: card.activeStreamerCards[0],
        }
      : card;

  const onFrontCardClick = () => {
    if (!onClick) {
      return;
    }
    onClick(
      card.id,
      showStreamerCardOnTop ? card.activeStreamerCards[0]?.channel.id : null,
    );
  };

  const onBackCardClick = (cardId: string, channelId: string) => {
    if (!onClick) {
      return;
    }
    onClick(cardId, showStreamerCardOnTop ? null : channelId);
  };

  return (
    <div className={styles.cardStack}>
      {/* BackCards */}
      {streamerCards.map((streamerCard, index) => {
        const singleAngle = 4 / streamerCards.length;
        const angle = singleAngle * (streamerCards.length - index);
        const singleMove = 4 / streamerCards.length;
        const move = singleMove * (streamerCards.length - index);

        return (
          <div
            className={styles.cardGridBackCardWrapper}
            key={`${streamerCard.id}_${index}`}
            style={
              {
                transform: `translateY(-3%) translateX(-${move}%) rotateZ(-${angle}deg)`,
              } as CSSProperties
            }
          >
            <GameCard
              as={onClick ? 'button' : undefined}
              card={{
                ...card,
                activeStreamerCard: showStreamerCardOnTop ? null : streamerCard,
              }}
              streamerVideoAction={streamerVideoAction}
              onClick={() => onBackCardClick(card.id, streamerCard.channel.id)}
            />
          </div>
        );
      })}

      {/* FrontCard */}
      <div
        className={classNames(styles.cardGridFrontCardWrapper, {
          [styles.hasBackCards]: !!streamerCards.length,
          [styles.locked]: isLocked,
          [styles.forceToLeft]: forceOnHoverToLeft,
        })}
        style={
          {
            '--card-backshadow-image-url': `url(${CardBackShadowImage})`,
          } as CSSProperties
        }
      >
        {showStreamerCardOnTop && showLevelUpVfx && (
          <CardLevelUpVfx className={styles.cardLevelUpVfxWrapper} />
        )}
        <GameCard
          as={onClick ? 'button' : undefined}
          card={frontCard}
          streamerVideoAction={streamerVideoAction}
          onClick={onFrontCardClick}
        />
      </div>
    </div>
  );
}
