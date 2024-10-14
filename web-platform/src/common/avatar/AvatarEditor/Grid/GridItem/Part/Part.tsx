import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { CoreAssets } from '@noice-com/assets-core';
import {
  CommonUtils,
  Icon,
  Image,
  VisuallyHidden,
  CurrencyIcon,
  ChannelLogo,
} from '@noice-com/common-ui';
import { AvatarPartCategory } from '@noice-com/schemas/avatar/avatar.pb';
import classNames from 'classnames';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import styles from './Part.module.css';

import { ExtendedAvatarPart } from '@common/avatar/types';
import { useAvatarPartChannelLogoChannelQuery } from '@gen';

interface Props {
  selected?: boolean;
  part: ExtendedAvatarPart;
}

gql`
  query AvatarPartChannelLogoChannel($channelId: ID!) {
    channel(id: $channelId) {
      ...ChannelLogoChannel
    }

    ${ChannelLogo.fragments.entry}
  }
`;

export function Part({ selected, part }: Props) {
  const hasPrice = !!part.sellableItem?.igcPrices?.length ?? false;

  const itemPrice = part.sellableItem?.igcPrices?.length
    ? part.sellableItem.igcPrices[0].amount
    : 0;

  const itemCurrency = part.sellableItem?.igcPrices?.length
    ? CommonUtils.getWalletCurrencyId(part.sellableItem.igcPrices[0].currencyId)
    : null;

  const { data: channelDetails, loading } = useAvatarPartChannelLogoChannelQuery({
    ...variablesOrSkip({ channelId: part.channelId }),
  });

  return (
    <div
      className={classNames(styles.partContainer, {
        [styles.selected]: selected,
      })}
    >
      {part.previewImgUrl ? (
        <div className={styles.imageContainer}>
          <Image
            alt={part.name}
            className={styles.partImage}
            loadingType="none"
            sizes={`
          (max-width: ${CommonUtils.getRem(1065)}) 17vw,
          (max-width: ${CommonUtils.getRem(1465)}) 10vw,
          7vw`}
            src={part.previewImgUrl}
          />
        </div>
      ) : (
        <>
          {part.category === AvatarPartCategory.CATEGORY_BODY && (
            <Icon
              className={styles.partIcon}
              icon={CoreAssets.Icons.BodyType}
            />
          )}
          {part.category === AvatarPartCategory.CATEGORY_HEAD && (
            <Icon
              className={styles.partIcon}
              icon={CoreAssets.Icons.FacePreset}
            />
          )}
        </>
      )}
      <span className={styles.partName}>{part.name}</span>
      <VisuallyHidden>{`Select ${part.name}`}</VisuallyHidden>
      {selected && !hasPrice && (
        <IoIosCheckmarkCircle
          className={classNames(styles.checkIcon, { [styles.selected]: selected })}
        />
      )}
      {hasPrice && itemCurrency && (
        <div className={styles.priceContainer}>
          <CurrencyIcon
            size="sm"
            type={itemCurrency}
          />
          <span className={styles.priceText}>{itemPrice}</span>
        </div>
      )}
      {!loading && channelDetails?.channel && (
        <div className={styles.channelLogoContainer}>
          <ChannelLogo
            channel={channelDetails.channel}
            size="xs"
          />
        </div>
      )}
    </div>
  );
}
