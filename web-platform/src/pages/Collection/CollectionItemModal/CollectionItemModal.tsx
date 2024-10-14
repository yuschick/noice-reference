import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { GameCard, parseDescription } from '@noice-com/card-game';
import { FullScreenModal, IconButton, useToggle } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { ReactNode, CSSProperties } from 'react';

import styles from './CollectionItemModal.module.css';

import BackgroundImage from '@assets/images/collection/noice-collection-bg-1500.webp';
import {
  CollectionItemModalBaseCardFragment,
  CollectionItemModalStreamerCardFragment,
} from '@gen';

gql`
  fragment CollectionItemModalBaseCard on GameLogicCard {
    id

    season {
      id
      name
      badgeUrl
      game {
        id
        name
      }
    }

    activeStreamerCards {
      id
    }

    ...GameCard
  }

  fragment CollectionItemModalStreamerCard on GameLogicStreamerCard {
    ...GameStreamerCard
    baseCard(season_id: $seasonId) {
      id
      ...CollectionItemModalBaseCard
    }
  }
`;

interface Slots {
  cardInfos?: ReactNode;
  footer?: ReactNode;
  topOfDialog?: ReactNode;
}

interface Props {
  isCardOwned: boolean;
  baseCard: CollectionItemModalBaseCardFragment;
  streamerCard: Nullable<CollectionItemModalStreamerCardFragment>;
  slots?: Slots;
  onCloseModal?(): void;
}

export function CollectionItemModal({
  baseCard,
  streamerCard,
  slots,
  isCardOwned,
  onCloseModal,
}: Props) {
  const [isOpen, , , onClose] = useToggle(true);

  const handleCloseButtonClick = () => {
    onClose();
    onCloseModal?.();
  };

  const description = parseDescription(baseCard);

  return (
    <FullScreenModal isOpen={isOpen}>
      <div
        className={styles.collectionModalWrapper}
        style={
          {
            '--modal-background': `url(${BackgroundImage})`,
          } as CSSProperties
        }
      >
        <IconButton
          icon={CoreAssets.Icons.Close}
          label="Close"
          onClick={handleCloseButtonClick}
        />

        <div className={styles.collectionModalContentWrapper}>
          {!!slots?.topOfDialog && <>{slots.topOfDialog}</>}

          <div className={styles.itemWrapper}>
            {baseCard && (
              <>
                <div
                  className={classNames(styles.cardWrapper, {
                    [styles.locked]: !isCardOwned,
                  })}
                >
                  <GameCard card={{ ...baseCard, activeStreamerCard: streamerCard }} />
                </div>

                <div className={styles.cardInfoWrapper}>
                  <div className={styles.headerWrapper}>
                    <h1 className={styles.cardTitle}>{baseCard.name}</h1>
                    <span className={styles.cardDescription}>{description}</span>
                  </div>
                  <div className={styles.cardDetailsWrapper}>
                    {!!slots?.cardInfos && <>{slots.cardInfos}</>}
                  </div>

                  {!!slots?.footer && <>{slots.footer}</>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
}
