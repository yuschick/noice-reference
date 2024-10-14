import { gql } from '@apollo/client';
import { GameCard } from '@noice-com/card-game';
import { Button, ButtonLink, ChannelLogo, Modal } from '@noice-com/common-ui';

import { CardVFX } from './CardVFX';
import styles from './StreamerCardPurchaseSuccessModal.module.css';

import { Routes } from '@common/route';
import { StreamerCardPurchaseSuccessModalStreamerCardFragment } from '@gen';

gql`
  fragment StreamerCardPurchaseSuccessModalStreamerCard on GameLogicStreamerCard {
    channel {
      id
      name
      ...ChannelLogoChannel
    }
    baseCard {
      ...GameStreamerBaseCard
    }
    ...GameStreamerCard
  }
`;

interface Props {
  card: StreamerCardPurchaseSuccessModalStreamerCardFragment;
  gameName: string;
  seasonName: string;
  onDismiss(): void;
}

export function StreamerCardPurchaseSuccessModal({
  card,
  gameName,
  seasonName,
  onDismiss,
}: Props) {
  const { channel } = card;

  return (
    <Modal
      ariaLabel="Items Acquired"
      isOpen
    >
      <div className={styles.modalContent}>
        <header>
          <h1 className={styles.title}>
            <span className={styles.textHighlight}>Item</span>{' '}
            <span className={styles.rightSideText}>Acquired</span>
          </h1>
        </header>

        <div className={styles.body}>
          <div className={styles.channelInfo}>
            {channel && <ChannelLogo channel={channel} />}

            <div className={styles.channelDetails}>
              <div className={styles.channelName}>{channel.name}</div>
              <div>Creator Card</div>
            </div>
          </div>

          <div className={styles.gameSeasonInfo}>
            <span className={styles.gameSeasonName}>{seasonName}</span> for{' '}
            <span className={styles.gameSeasonName}>{gameName} Streamers</span>
          </div>

          <div className={styles.cardSection}>
            <CardVFX className={styles.card}>
              <GameCard card={{ ...card.baseCard, activeStreamerCard: card }} />
            </CardVFX>
          </div>
        </div>

        <footer className={styles.footer}>
          <ButtonLink
            className={styles.linkButton}
            level="secondary"
            to={Routes.Collection}
          >
            View in collection
          </ButtonLink>

          <div className={styles.okButton}>
            <Button onClick={onDismiss}>Close</Button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}
