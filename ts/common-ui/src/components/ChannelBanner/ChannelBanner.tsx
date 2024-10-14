import { gql } from '@apollo/client';
import { CoreAssets } from '@noice-com/assets-core';
import classNames from 'classnames';

import { Image } from '../Image';

import styles from './ChannelBanner.module.css';

import { ChannelBannerChannelFragment } from '@common-gen';

export interface Props extends ChannelBannerChannelFragment {
  className?: string;
}

export function ChannelBanner({ className, offlineBanner }: Props) {
  return (
    <div
      className={classNames(styles.banner, className, {
        [styles.noBanner]: !offlineBanner,
      })}
      style={
        offlineBanner
          ? {
              backgroundImage: `url(${offlineBanner})`,
            }
          : undefined
      }
    >
      {!offlineBanner && (
        <Image
          src={offlineBanner ? offlineBanner : CoreAssets.Images.BannerPlaceholder}
        />
      )}
    </div>
  );
}

ChannelBanner.fragments = {
  entry: gql`
    fragment ChannelBannerChannel on ChannelChannel {
      offlineBanner
    }
  `,
};
