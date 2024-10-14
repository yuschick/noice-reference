import { gql } from '@apollo/client';
import { useClient } from '@noice-com/common-react-core';
import { Button, ButtonLink, ChannelLogo, useLoadingPromise } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { useCallback, useState } from 'react';

import { isReactNativeWebView } from '../../../../embeds/bridge';
import { CardDetail } from '../../CollectionItemModal/CardDetail/CardDetail';
import { CardDetailCardLevel } from '../../CollectionItemModal/CardDetailCardLevel/CardDetailCardLevel';
import { CardDetailSeason } from '../../CollectionItemModal/CardDetailSeason/CardDetailSeason';
import { CardDetailTextIcon } from '../../CollectionItemModal/CardDetailTextIcon/CardDetailTextIcon';
import { CollectionItemModal } from '../../CollectionItemModal/CollectionItemModal';

import { CardInPlay } from './CardInPlay/CardInPlay';

import { getChannelStoreLink } from '@common/route';
import {
  CreatorCardModalCreatorCardFragment,
  ItemItemType,
  useCreatorCardModalItemQuery,
} from '@gen';
import { canPurchaseSaleConfig } from '@pages/Collection/utils';

gql`
  fragment CreatorCardModalCreatorCard on GameLogicStreamerCard {
    ...CollectionItemModalStreamerCard
    saleConfig {
      cardId
      channelId
      enabled
      period {
        from
        until
      }
    }

    ... on GameLogicStreamerCard {
      baseCard(season_id: $seasonId) {
        ...CardDetailLevelCardLeveling
      }
      channel {
        id
        name
        ...ChannelLogoChannel
      }
    }
  }

  query CreatorCardModalItem(
    $filters: [ItemListItemsRequestFilterInput!]
    $seasonId: String
  ) {
    items(filters: $filters) {
      items {
        id
        details {
          ...CreatorCardModalCreatorCard
        }
      }
    }
  }
`;

interface Props {
  itemId: string;
  seasonId: Nullable<string>;
  channelId: Nullable<string>;
  gameId: Nullable<string>;
  isCardOwned: boolean;
  refetchCreatorCards(): Promise<void>;
  onCloseModal?(): void;
}

export function CreatorCardModal({
  itemId,
  seasonId,
  channelId,
  gameId,
  isCardOwned,
  refetchCreatorCards,
  onCloseModal,
}: Props) {
  const client = useClient();
  const isEmbedded = isReactNativeWebView();

  const [card, setCard] = useState<Nullable<CreatorCardModalCreatorCardFragment>>(null);

  useCreatorCardModalItemQuery({
    variables: {
      filters: [{ channelId }, { itemType: ItemItemType.TypeStreamerCard }, { gameId }],
      seasonId,
    },
    skip: !channelId || !gameId || !seasonId,
    onCompleted(itemsData) {
      const item = itemsData.items?.items.find(
        (item) =>
          item.details?.__typename === 'GameLogicStreamerCard' &&
          item.details.id === itemId,
      );

      if (item?.details?.__typename !== 'GameLogicStreamerCard') {
        return;
      }

      setCard(item.details);
    },
  });

  const selectCardFunc = useCallback(async () => {
    if (!card?.id) {
      return;
    }

    await client.GameCardService.setStreamerCardSelection(card?.id);
    await refetchCreatorCards();
  }, [client, card, refetchCreatorCards]);

  const [selectCard, loadingSelectCard] = useLoadingPromise(selectCardFunc);

  if (!card) {
    return null;
  }

  const isInPlay = !!card.baseCard.activeStreamerCards.find(
    (activeCard) => activeCard.id === card.id,
  );

  const canPurchaseCard = canPurchaseSaleConfig(card.saleConfig) && !isEmbedded;

  const footerComponent = isInPlay ? (
    <CardInPlay channelName={card.channel.name} />
  ) : isCardOwned ? (
    <Button
      isLoading={loadingSelectCard}
      onClick={selectCard}
    >
      Play with this card
    </Button>
  ) : canPurchaseCard ? (
    <ButtonLink
      to={getChannelStoreLink({
        channel: card.channel,
        category: `${gameId}-creators`,
      })}
      variant="cta"
    >
      Purchase from store
    </ButtonLink>
  ) : null;

  return (
    <CollectionItemModal
      baseCard={card.baseCard}
      isCardOwned={isCardOwned}
      slots={{
        cardInfos: (
          <>
            <CardDetail
              description="CREATOR CARD"
              icon={
                <ChannelLogo
                  channel={card.channel}
                  size="md"
                />
              }
              value={card.channel.name}
            />

            <CardDetailCardLevel cardLeveling={card.baseCard} />

            <CardDetailSeason
              badgeUrl={card.baseCard.season.badgeUrl}
              gameName={card.baseCard.season.game.name}
              seasonName={card.baseCard.season.name}
            />

            <CardDetailTextIcon
              description="Min points"
              iconText="MIN"
              value={card.baseCard.pointsMin.toString()}
            />

            <CardDetailTextIcon
              description="Max points"
              iconText="MAX"
              value={card.baseCard.pointsMax.toString()}
            />
          </>
        ),
        footer: footerComponent,
      }}
      streamerCard={card}
      onCloseModal={onCloseModal}
    />
  );
}
