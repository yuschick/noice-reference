import classNames from 'classnames';

import styles from './FrontGlow.module.css';

import { RarityRarity } from '@gen';

export interface Props {
  rarity: RarityRarity;
}

export function FrontGlow({ rarity }: Props) {
  return (
    <div
      className={classNames(styles.frontGlow, {
        [styles.common]: rarity === RarityRarity.RarityCommon,
        [styles.uncommon]: rarity === RarityRarity.RarityUncommon,
        [styles.rare]: rarity === RarityRarity.RarityRare,
        [styles.epic]: rarity === RarityRarity.RarityEpic,
        [styles.legendary]: rarity === RarityRarity.RarityLegendary,
      })}
    />
  );
}
