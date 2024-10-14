import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import { Image, useAuthentication, useBooleanFeatureFlag } from '@noice-com/common-ui';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { emitEmbeddedPageLoaded, isReactNativeWebView } from '../../../embeds/bridge';
import { getUnopenedSellableItemImage } from '../utils';

import { CardBundleOpenAnimation } from './CardBundleOpenAnimation/CardBundleOpenAnimation';
import { CardBundlePurchaseButtons } from './CardBundlePurchaseButtons/CardBundlePurchaseButtons';
import { CardBundleStoreItemContent } from './CardBundleStoreItemContent/CardBundleStoreItemContent';
import { CardBundleStoreItemSuccessContent } from './CardBundleStoreItemSuccessContent/CardBundleStoreItemSuccessContent';
import { CardBundleSuccessButtons } from './CardBundleSuccessButtons/CardBundleSuccessButtons';
import { CardBundleTitle } from './CardBundleTitle/CardBundleTitle';
import { usePurchaseStoreItem } from './hooks/usePurchaseStoreItem.hook';
import { useRevealStoreItemOnMounthook } from './hooks/useRevealStoreItemOnMounthook';
import { useStoreItemNavigation } from './hooks/useStoreItemNavigation.hook';
import styles from './StoreItemPage.module.css';

import { getGameIdFromGameCreatorsParam } from '@common/game';
import {
  StoreItemContentCardItemRefFragment,
  StoreItemItemRefFragment,
  StoreItemPageChannelFragment,
  StoreSuccessCardStreamerLogicCardFragment,
  StoreV2ItemType,
  useStoreItemPageQuery,
} from '@gen';

gql`
  query StoreItemPage($id: ID!, $gameId: ID!) {
    sellableItem(id: $id) {
      id
      name
      type
      igcPrices {
        ...CardBundlePurchaseButtonCurrencyPrice
      }
      content {
        value {
          __typename
          ... on StoreV2ItemRef {
            id
            ...StoreItemItemRef
            ...StoreItemContentCardItemRef
          }
        }
      }
      sku
      ...StoreItemRevealedItems
      ...PurchaseStoreItemSellableItem
    }

    game(id: $gameId) {
      id
      ...CardBundleTitleGame
    }
  }

  fragment StoreItemItemRef on StoreV2ItemRef {
    id
    ...CardBundlePurchaseSuccessItemRef
  }
`;

interface Props {
  storeItemId: string;
  channel?: StoreItemPageChannelFragment;
}

export function StoreItemPage({ storeItemId, channel }: Props) {
  const { userId } = useAuthentication();
  const params = useParams();

  const [storeReplaceOwnedCreatorCards] = useBooleanFeatureFlag(
    'storeReplaceOwnedCreatorCards',
  );

  const [skipSuccessAnimations, setSkipSuccessAnimations] = useState(false);
  const [isSuccessAnimationFinished, setIsSuccessAnimationFinished] = useState(false);
  const [isSuccessRevealFinished, setIsSuccessRevealFinished] = useState(false);

  const cardContainerRef = useRef<HTMLDivElement>(null);

  const gameId = getGameIdFromGameCreatorsParam(params.gameCreators);

  const isEmbedded = isReactNativeWebView();

  const { closeStoreItemPage, closeOnError } = useStoreItemNavigation({
    sellableItemId: storeItemId,
    gameId: gameId ?? null,
    channel,
  });

  const storeItemQueryArgs = variablesOrSkip({ id: storeItemId, gameId });
  const { data, loading } = useStoreItemPageQuery({
    ...storeItemQueryArgs,
    skip: !userId || storeItemQueryArgs.skip,
    onError() {
      closeOnError();
    },
    onCompleted() {
      emitEmbeddedPageLoaded();
    },
    fetchPolicy: 'cache-first',
  });

  const { showSuccessState, disablePurchaseButton, showPurchaseError, onPurchaseClick } =
    usePurchaseStoreItem(data?.sellableItem ?? null);

  useRevealStoreItemOnMounthook({
    sellableItem: data?.sellableItem ?? null,
  });

  const [hideCardsWhileOpening, setHideCardsWhileOpening] = useState(false);
  const [showPurchasedCards, setShowPurchasedCards] = useState(false);
  const [showOpeningEvent, setShowOpeningEvent] = useState(false);

  const openingAnimationDelay = 250;
  const openingAnimationDuration = 3300 + openingAnimationDelay;

  //Control different states when bundle opening animation is going on
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    //If skip button is pressed while bundle opening animation is still in progrss
    if (skipSuccessAnimations) {
      // Show cards with quicky fade-in css animation which were temporary hidden
      // until opening animation event was in progress
      setShowPurchasedCards(true);

      // Removes hidden class which is hiding the cards
      // while opening animation is in progress
      setHideCardsWhileOpening(false);
    }

    //If purchase button is pressed and bundle animation starts
    if (showSuccessState) {
      setHideCardsWhileOpening(true);
      timeoutId = setTimeout(() => {
        //This timeout delays showing pack opening animation so that current preview layout can be quicky fade-out with animation
        setShowOpeningEvent(true);
      }, openingAnimationDelay);
      timeoutId = setTimeout(() => {
        //After pack opening animation ends (duration is defined with variable), this sets couple of states.
        setShowPurchasedCards(true); //Show opened cards with fade-in animation
        setHideCardsWhileOpening(false); //Removes hidden class which is hiding the cards while opening animation is in progress
        setIsSuccessAnimationFinished(true); //
      }, openingAnimationDuration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [openingAnimationDuration, showSuccessState, skipSuccessAnimations]);

  useEffect(() => {
    if (!loading && !data?.sellableItem) {
      closeOnError();
    }
  }, [closeOnError, data?.sellableItem, loading]);

  if (!data?.sellableItem) {
    return null;
  }

  const { name, type, igcPrices, content, sku } = data.sellableItem;

  const itemRefs = content
    .map(({ value }) => (value?.__typename === 'StoreV2ItemRef' ? value : null))
    .filter((value) => !!value) as StoreItemItemRefFragment[];

  // Replace owned creator cards with standard cards
  // Count 0 implicitly means that the card is already owned
  const ownedStreamerCard = itemRefs.find(
    (item) =>
      item.count === 0 && item.item.details?.__typename === 'GameLogicStreamerCard',
  )?.item.details as StoreSuccessCardStreamerLogicCardFragment | undefined;

  const itemRefsWithCreatorCardsCombinedWithStandardCards =
    storeReplaceOwnedCreatorCards && ownedStreamerCard
      ? itemRefs
          .filter((item) => item.item.details?.__typename === 'GameLogicCard')
          .map((item) => {
            if (item.item.details?.__typename !== 'GameLogicCard') {
              return item;
            }
            const card = item.item.details;
            if (card.familyId === ownedStreamerCard?.familyId) {
              return {
                ...item,
                item: {
                  ...item.item,
                  details: { ...ownedStreamerCard, baseCard: card },
                },
              };
            }
            return item;
          })
      : itemRefs;

  const cardPack = getUnopenedSellableItemImage(type);

  return (
    <div
      className={classNames({
        [styles.wrapper]: !isEmbedded,
      })}
      style={
        {
          '--_store-item-page-bg': `url(${CoreAssets.Images.StreamSemitransparentBg})`,
        } as CSSProperties
      }
    >
      <Helmet>
        <title>{name} / Store</title>
      </Helmet>

      <div className={styles.container}>
        <article
          className={classNames(styles.contentWrapper, {
            [styles.purchased]: showSuccessState,
            [styles.showCards]: showPurchasedCards,
            [styles.hidden]: hideCardsWhileOpening && showOpeningEvent,
          })}
        >
          <div className={styles.content}>
            <CardBundleTitle
              game={data.game ?? null}
              showSuccessState={showSuccessState}
              storeItemName={name}
            />

            <div className={styles.buttons}>
              {showSuccessState ? (
                <CardBundleSuccessButtons
                  isAnimationFinished={isSuccessAnimationFinished}
                  isRevealFinished={isSuccessRevealFinished}
                  onClose={closeStoreItemPage}
                  onSkip={() => setSkipSuccessAnimations(true)}
                />
              ) : (
                <CardBundlePurchaseButtons
                  closeOnError={closeOnError}
                  disablePurchaseButton={disablePurchaseButton}
                  igcPrices={igcPrices ?? []}
                  isPremiumBundle={type === StoreV2ItemType.ItemTypePremiumCardBundle}
                  showPurchaseError={showPurchaseError}
                  sku={sku}
                  onPurchaseClick={onPurchaseClick}
                />
              )}
            </div>

            {showSuccessState && showOpeningEvent ? (
              <div
                className={classNames(styles.cardWrapper, styles.revealCardWrapper)}
                ref={cardContainerRef}
              >
                <CardBundleStoreItemSuccessContent
                  itemRefs={itemRefsWithCreatorCardsCombinedWithStandardCards}
                  skipAnimations={skipSuccessAnimations}
                  onAnimationFinished={() => setIsSuccessRevealFinished(true)}
                />
              </div>
            ) : (
              <div
                className={styles.cardWrapper}
                ref={cardContainerRef}
              >
                <div className={styles.cardPackWrapper}>
                  <Image
                    alt=""
                    className={styles.cardPackImage}
                    src={cardPack as string}
                  />
                </div>
                <div className={styles.cardsPreview}>
                  <CardBundleStoreItemContent
                    cards={
                      itemRefsWithCreatorCardsCombinedWithStandardCards as StoreItemContentCardItemRefFragment[]
                    }
                  />
                </div>
              </div>
            )}
          </div>
          {showSuccessState && showOpeningEvent && !skipSuccessAnimations && (
            <CardBundleOpenAnimation
              cardAmount={itemRefsWithCreatorCardsCombinedWithStandardCards.length}
              cardContainerRef={cardContainerRef}
              sellableItemType={type}
            />
          )}
        </article>
      </div>
    </div>
  );
}

StoreItemPage.fragments = {
  entry: gql`
    fragment StoreItemPageChannel on ChannelChannel {
      ...StoreItemNavigationChannel
    }
  `,
};
