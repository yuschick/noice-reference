import { Image } from '@noice-com/common-ui';
import classNames from 'classnames';

import styles from './Sprite.module.css';

import SpriteCommonFx from '@assets/images/timed-ads-reward-box-common-fx.webp';
import SpriteCommon from '@assets/images/timed-ads-reward-box-common.webp';
import SpriteEpicFx from '@assets/images/timed-ads-reward-box-epic-fx.webp';
import SpriteEpic from '@assets/images/timed-ads-reward-box-epic.webp';
import SpriteLegendaryFx from '@assets/images/timed-ads-reward-box-legendary-fx.webp';
import SpriteLegendary from '@assets/images/timed-ads-reward-box-legendary.webp';
import SpriteFxRare from '@assets/images/timed-ads-reward-box-rare-fx.webp';
import SpriteRare from '@assets/images/timed-ads-reward-box-rare.webp';
import SpriteUncommonFx from '@assets/images/timed-ads-reward-box-uncommon-fx.webp';
import SpriteUncommon from '@assets/images/timed-ads-reward-box-uncommon.webp';
import { RarityRarity } from '@gen';

interface Props {
  rarity: RarityRarity;
  name: string;
  type?: 'box' | 'fx';
  wrapperClass?: string;
  imageClass?: string;
  onAnimationEnd?(): void;
}

function getSrcForRarity(rarity: RarityRarity, type: 'box' | 'fx') {
  switch (rarity) {
    case RarityRarity.RarityCommon:
      return type === 'box' ? SpriteCommon : SpriteCommonFx;
    case RarityRarity.RarityUncommon:
      return type === 'box' ? SpriteUncommon : SpriteUncommonFx;
    case RarityRarity.RarityRare:
      return type === 'box' ? SpriteRare : SpriteFxRare;
    case RarityRarity.RarityEpic:
      return type === 'box' ? SpriteEpic : SpriteEpicFx;
    case RarityRarity.RarityLegendary:
      return type === 'box' ? SpriteLegendary : SpriteLegendaryFx;
    default:
      return null;
  }
}

export function Sprite({
  rarity,
  type = 'box',
  name,
  wrapperClass,
  imageClass,
  onAnimationEnd,
}: Props) {
  const src = getSrcForRarity(rarity, type);

  if (!src) {
    return null;
  }

  return (
    <div
      className={classNames(styles.wrapper, wrapperClass)}
      onAnimationEnd={onAnimationEnd}
    >
      <Image
        alt={name}
        className={classNames(
          { [styles.spriteBox]: type === 'box', [styles.spriteFx]: type === 'fx' },
          imageClass,
        )}
        draggable={false}
        loadingType="none"
        src={src}
      />
    </div>
  );
}
