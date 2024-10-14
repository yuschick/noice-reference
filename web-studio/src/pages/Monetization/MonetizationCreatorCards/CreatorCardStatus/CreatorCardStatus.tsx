import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import { Icon, Pill } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './CreatorCardStatus.module.css';

import { CreatorCardStatusCardFragment } from '@gen';

gql`
  fragment CreatorCardStatusCard on GameLogicStreamerCard {
    draft
    video
    image
    saleConfig {
      cardId
      enabled
      excludeFromBundles
    }
  }
`;

interface Props {
  card: CreatorCardStatusCardFragment;
  showAsHorizontal?: boolean;
}

export function CreatorCardStatus({ card, showAsHorizontal }: Props) {
  const { draft, video, image, saleConfig } = card;

  const wrapperClassName = classNames(styles.statusWrapper, {
    [styles.horizontal]: showAsHorizontal,
  });

  if (draft) {
    return (
      <div className={wrapperClassName}>
        <Pill
          color="blue-950"
          label="Draft"
        />

        {(!video || !image) && (
          <Pill
            color="blue-950"
            label="Missing content"
          />
        )}
      </div>
    );
  }

  if (!saleConfig?.enabled) {
    return (
      <Pill
        color="blue-950"
        label="Unpublished"
      />
    );
  }

  return (
    <div className={wrapperClassName}>
      <Pill
        color="gradient-green-teal"
        label="In store"
      />

      <div className={styles.cardSaleConfigDetail}>
        <Icon
          color="green-main"
          icon={CoreAssets.Icons.Check}
          size={24}
        />
        Individual cards
      </div>

      {!card.saleConfig?.excludeFromBundles && (
        <div className={styles.cardSaleConfigDetail}>
          <Icon
            color="green-main"
            icon={CoreAssets.Icons.Check}
            size={24}
          />
          Premium bundles
        </div>
      )}
    </div>
  );
}
