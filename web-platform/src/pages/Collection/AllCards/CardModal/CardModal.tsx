import { Nullable } from '@noice-com/utils';

import { CardDetailCardLevel } from '../../CollectionItemModal/CardDetailCardLevel/CardDetailCardLevel';
import { CardDetailSeason } from '../../CollectionItemModal/CardDetailSeason/CardDetailSeason';
import { CardDetailTextIcon } from '../../CollectionItemModal/CardDetailTextIcon/CardDetailTextIcon';
import { CollectionItemModal } from '../../CollectionItemModal/CollectionItemModal';

import { CardChannelSelector } from './CardChannelSelector/CardChannelSelector';

import { UseBaseCardsGameCardFragment } from '@gen';

interface Props {
  card: UseBaseCardsGameCardFragment;
  isCardOwned: boolean;
  channelId: Nullable<string>;
  onSelectChannel(channelId: Nullable<string>): void;
  onCloseModal?(): void;
}

export function CardModal({
  card,
  isCardOwned,
  channelId,
  onSelectChannel,
  onCloseModal,
}: Props) {
  const cardChannels = card.activeStreamerCards.map(
    (streamerCard) => streamerCard.channel,
  );

  const streamerCard =
    card.activeStreamerCards.find(
      (streamerCard) => streamerCard.channel.id === channelId,
    ) ?? null;

  return (
    <CollectionItemModal
      baseCard={card}
      isCardOwned={isCardOwned || !!channelId}
      slots={{
        topOfDialog: (
          <>
            {!!cardChannels.length && (
              <CardChannelSelector
                channelId={channelId}
                channels={cardChannels}
                onSelectChannel={onSelectChannel}
              />
            )}
          </>
        ),
        cardInfos: (
          <>
            <CardDetailCardLevel cardLeveling={card} />

            <CardDetailSeason
              badgeUrl={card.season.badgeUrl}
              gameName={card.season.game.name}
              seasonName={card.season.name}
            />

            <CardDetailTextIcon
              description="Min points"
              iconText="MIN"
              value={card.pointsMin.toString()}
            />

            <CardDetailTextIcon
              description="Max points"
              iconText="MAX"
              value={card.pointsMax.toString()}
            />
          </>
        ),
      }}
      streamerCard={streamerCard ? { ...streamerCard, baseCard: card } : null}
      onCloseModal={onCloseModal}
    />
  );
}
