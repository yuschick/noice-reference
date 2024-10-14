import classNames from 'classnames';

import styles from './BottomGlow.module.css';

import { RarityRarity } from '@gen';

interface Props {
  rarity: RarityRarity;
}

export function BottomGlow({ rarity }: Props) {
  return (
    <div
      className={classNames(styles.bottomGlow, {
        [styles.common]: rarity === RarityRarity.RarityCommon,
        [styles.uncommon]: rarity === RarityRarity.RarityUncommon,
        [styles.rare]: rarity === RarityRarity.RarityRare,
        [styles.epic]: rarity === RarityRarity.RarityEpic,
        [styles.legendary]: rarity === RarityRarity.RarityLegendary,
      })}
    />
  );
}
