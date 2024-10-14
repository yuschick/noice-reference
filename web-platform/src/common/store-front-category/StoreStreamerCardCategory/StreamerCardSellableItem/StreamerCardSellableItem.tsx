import { gql } from '@apollo/client';
import { GameCard, parseDescription } from '@noice-com/card-game';
import {
  Countdown,
  CurrencyIcon,
  WalletCurrencyId,
  useContainerSize,
} from '@noice-com/common-ui';
import classNames from 'classnames';
import { useRef } from 'react';

import { CreatorCardSellableItemBg } from './CreatorCardSellableItemBg/CreatorCardSellableItemBg';
import { PurchaseCardButton } from './PurchaseCardButton';
import styles from './StreamerCardSellableItem.module.css';

import { CardStack } from '@common/card-stack';
import { StoreStreamerCardSellableItemFragment } from '@gen';

interface Props {
  item: StoreStreamerCardSellableItemFragment;
}

export function StreamerCardSellableItem({ item }: Props) {
  const wrapperRef = useRef<HTMLButtonElement>(null);
  const { inlineSize } = useContainerSize(wrapperRef);

  const cardItem =
    item.content[0].value?.__typename === 'StoreV2ItemRef' ? item.content[0].value : null;

  if (!cardItem) {
    return null;
  }

  if (cardItem.item.details?.__typename !== 'GameLogicStreamerCard') {
    return null;
  }

  if (!item.igcPrices) {
    return null;
  }

  const card = cardItem.item.details;
  const activeSeasonName = card.baseCard.season.game.activeSeason.name;
  const gameName = card.baseCard.season.game.name;
  const cardName = card.baseCard.name;
  const price = item.igcPrices[0];
  const description = parseDescription(card.baseCard);

  return (
    <PurchaseCardButton
      card={card}
      className={classNames(styles.wrapper, {
        [styles.collected]: !!cardItem.inventoryState,
      })}
      gameName={gameName}
      item={item}
      price={price}
      ref={wrapperRef}
      seasonName={activeSeasonName}
    >
      <CreatorCardSellableItemBg />

      <div className={styles.highlightBanner}>
        <div className={styles.leftHighlights}>
          {item.discountPercent > 0 && (
            <div className={styles.sale}>
              Sale <span className={styles.bold}>-{item.discountPercent}%</span>
            </div>
          )}

          {!!item.availableUntil && (
            <div className={styles.availability}>
              Available for{' '}
              <Countdown
                className={styles.bold}
                label="Creator card availability"
                target={new Date(item.availableUntil)}
              />
            </div>
          )}
        </div>
        <div className={styles.rightHighlights}>
          {!!cardItem.inventoryState && (
            <div className={styles.inCollection}>In collection</div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          {cardItem.inventoryState ? (
            <CardStack
              card={{ ...card.baseCard, activeStreamerCards: [card] }}
              forceOnHoverToLeft={Boolean(inlineSize && inlineSize >= 400)}
              streamerVideoAction="none"
              showStreamerCardOnTop
            />
          ) : (
            <GameCard
              card={{ ...card.baseCard, activeStreamerCard: card }}
              key={card.id}
              streamerVideoAction="none"
            />
          )}
        </div>

        <div className={styles.cardInfo}>
          <div className={styles.description}>
            <div className={styles.title}>{cardName}</div>
            <div className={styles.cardDescription}>{description}</div>
          </div>

          {cardItem.inventoryState ? (
            <div className={styles.collectedCardInfo}>
              <span className={styles.collectedCardInfoTitle}>
                You already own this creator card
              </span>
            </div>
          ) : (
            <div className={styles.benefitHighlight}>+10% points over standard card</div>
          )}
        </div>

        <div className={styles.priceWrapper}>
          <CurrencyIcon
            className={styles.currencyIcon}
            type={price.currencyId as WalletCurrencyId}
          />

          {price.amount}
        </div>
      </div>
    </PurchaseCardButton>
  );
}

StreamerCardSellableItem.fragments = {
  entry: gql`
    fragment SellableCreatorCard on GameLogicStreamerCard {
      id
      channel {
        id
        name
      }
      baseCard {
        id
        season {
          id
          game {
            id
            name
            activeSeason {
              id
              name
            }
          }
        }
        leveling {
          nextLevelLimit
          progressToNextLevel
        }
        ...GameStreamerBaseCard
      }
      ...GameStreamerCard
    }

    fragment StoreStreamerCardSellableItem on StoreV2SellableItem {
      id
      discountPercent
      availableUntil
      content {
        value {
          ... on StoreV2ItemRef {
            id
            item {
              id
              details {
                ... on GameLogicStreamerCard {
                  id
                  ...SellableCreatorCard
                  ...StreamerCardPurchaseCardButtonStreamerCard
                }
              }
            }
            inventoryState {
              itemCount
            }
          }
        }
      }
      igcPrices {
        ...StreamerCardPurchaseCardButtonPrice
      }
      ...StreamerCardPurchaseCardButtonSellableItem
    }
  `,
};

StreamerCardSellableItem.Loading = () => {
  return <div className={classNames(styles.wrapper, styles.loadingCard)} />;
};
