import { gql } from '@apollo/client';
import { CurrencyIcon, Image, WalletCurrencyId } from '@noice-com/common-ui';
import { CSSProperties } from 'react';

import styles from './ChannelStoreFrontCosmeticItem.module.css';
import { CosmeticsPurchaseItem } from './types';

import fallbackBackground from '@assets/images/noice-banner-placeholder.webp';
import { ChannelStoreFrontChannelFragment, StoreV2ItemRef, AvatarAvatarPart } from '@gen';

interface Props {
  channel: ChannelStoreFrontChannelFragment;
  item: CosmeticsPurchaseItem;
  handleCosmeticsItemClick: (item: CosmeticsPurchaseItem) => void;
}

export function ChannelStoreFrontCosmeticItem({
  channel,
  item,
  handleCosmeticsItemClick,
}: Props) {
  const price = item.igcPrices?.[0];
  const previewUrl =
    ((item.content[0].value as StoreV2ItemRef).item?.details as AvatarAvatarPart)
      ?.previewImgUrl ?? '';
  const itemBackground = channel.offlineBanner || fallbackBackground;

  return (
    <button
      aria-label={item.name}
      className={styles.cosmeticsItemWrapper}
      style={
        {
          '--_item-background': `url(${itemBackground})`,
        } as CSSProperties
      }
      type="button"
      onClick={() => handleCosmeticsItemClick(item)}
    >
      <Image
        alt={channel.name}
        className={styles.channelLogoInset}
        src={channel.logo}
      />

      <div className={styles.cosmeticsItemInnerWrapper}>
        <div className={styles.cosmeticsItemDetailsWrapper}>
          <span className={styles.cosmeticName}>
            {item.name.replace('Avatar Part', '')}
          </span>
          <p>
            Support <span className={styles.channelName}>{channel.name}</span> and show
            your best dance moves wearing their creator cosmetic.
          </p>
        </div>

        <Image
          alt={channel.name}
          className={styles.cosmeticPreviewImage}
          src={previewUrl}
        />

        <div className={styles.priceRow}>
          <div className={styles.price}>
            <CurrencyIcon type={price?.currencyId as WalletCurrencyId} />
            <span>{price?.amount}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

ChannelStoreFrontCosmeticItem.fragments = {
  entry: gql`
    fragment StoreChannelStoreAvatarPart on StoreV2StoreFrontCategory {
      itemType
      sellableItems {
        id
        content {
          value {
            ... on StoreV2ItemRef {
              item {
                details {
                  ... on AvatarAvatarPart {
                    previewImgUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
};
